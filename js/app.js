/* 學習基地 主程式 v1.0.0 */
(function () {
  'use strict';
  var KL = window.KL;
  var app = document.getElementById('app');
  var CIRC = '①②③④⑤⑥⑦⑧⑨⑩';
  var ZY = 'ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦ';

  // ---------- 小工具 ----------
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(s) {
    var t = esc(s);
    t = t.replace(/\[f:([0-9?]+)\/([0-9?]+)\]/g, function (m, a, b) { return '<span class="frac"><span class="fn">' + a + '</span><span class="fd">' + b + '</span></span>'; });
    t = t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    return t;
  }
  function plain(s) { return String(s || '').replace(/\[f:([0-9?]+)\/([0-9?]+)\]/g, function (m, a, b) { return b + '分之' + (a === '?' ? '幾' : a); }).replace(/[{}*]/g, ''); }
  function stripTags(h) { var d = document.createElement('div'); d.innerHTML = h; return d.textContent || ''; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dayStr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return dayStr(new Date()); }
  function norm(s) {
    return String(s == null ? '' : s).trim()
      .replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 65248); })
      .replace(/[\s　ˉ]/g, '');
  }

  // ---------- 存檔 ----------
  var KEY = 'kl_store_v1';
  var S = null;
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || typeof S !== 'object' || !S.profiles) S = { profiles: {}, current: null, settings: { sound: true } };
  if (!S.settings) S.settings = { sound: true };
  var warned = false;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch (e) { if (!warned) { warned = true; toast('⚠️ 這台裝置無法自動存檔，請記得用「存檔碼」備份'); } }
  }
  function P() { return S.profiles[S.current] || null; }
  function blankProfile(name, avatar, grade) {
    return { id: 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1000), name: name, avatar: avatar, grade: grade, created: today(),
      xp: 0, coins: 0, care: 0, answered: 0, correct: 0, subj: {}, units: {}, exams: {}, labs: {}, wrong: {}, traps: {}, trapsMiss: {},
      owned: [avatar], rewards: [], streak: 0, lastDay: null, log: [] };
  }
  function ensure(p) { var b = blankProfile(p.name, p.avatar, p.grade); for (var k in b) if (p[k] === undefined) p[k] = b[k]; return p; }
  Object.keys(S.profiles).forEach(function (id) { ensure(S.profiles[id]); });

  // ---------- 等級 ----------
  var TITLES = ['新手探險家', '見習勇者', '細心偵探', '解題高手', '陷阱剋星', '知識騎士', '智慧大師', '傳說學霸'];
  function level(xp) { return Math.floor(Math.sqrt(xp / 40)) + 1; }
  function lvlXp(l) { return 40 * (l - 1) * (l - 1); }
  function title(l) { return TITLES[Math.min(TITLES.length - 1, Math.floor((l - 1) / 3))]; }
  function award(xp, coins, care) {
    var p = P(); if (!p) return;
    var before = level(p.xp);
    p.xp += xp || 0; p.coins += coins || 0; p.care += care || 0;
    var after = level(p.xp);
    save();
    if (after > before) setTimeout(function () { sfx('lvl'); modal('<div class="big">🎉</div><h2>升級了！</h2><p class="lvup">Lv.' + after + '　' + title(after) + '</p>', [{ t: '太棒了！' }]); }, 500);
  }
  function touchDay() {
    var p = P(); var t = today(); if (p.lastDay === t) return;
    var y = new Date(); y.setDate(y.getDate() - 1);
    p.streak = (p.lastDay === dayStr(y)) ? p.streak + 1 : 1; p.lastDay = t; save();
  }
  function logIt(text) { var p = P(); var d = new Date(); p.log.unshift({ d: dayStr(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()), t: text }); p.log = p.log.slice(0, 80); }

  // ---------- 聲音、朗讀、提示 ----------
  var AC = null;
  function sfx(type) {
    if (!S.settings.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var seq = { ok: [[660, .08], [880, .14]], bad: [[220, .14], [170, .2]], click: [[520, .035]], lvl: [[523, .1], [659, .1], [784, .1], [1047, .28]], coin: [[988, .06], [1319, .12]], pick: [[700, .04]] }[type] || [[440, .1]];
      var t = AC.currentTime;
      seq.forEach(function (s) { var o = AC.createOscillator(), g = AC.createGain(); o.type = 'square'; o.frequency.value = s[0]; g.gain.setValueAtTime(.05, t); g.gain.exponentialRampToValueAtTime(.001, t + s[1]); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + s[1]); t += s[1]; });
    } catch (e) { }
  }
  function speak(text) {
    try { var u = new SpeechSynthesisUtterance(plain(text)); u.lang = 'zh-TW'; u.rate = 0.9; speechSynthesis.cancel(); speechSynthesis.speak(u); }
    catch (e) { toast('這台裝置不支援朗讀'); }
  }
  function toast(msg) { var el = document.getElementById('toast'); el.textContent = msg; el.className = 'show'; clearTimeout(el._t); el._t = setTimeout(function () { el.className = ''; }, 2400); }
  function modal(html, btns) {
    btns = btns || [{ t: '好' }];
    var w = document.createElement('div'); w.className = 'modal-wrap';
    w.innerHTML = '<div class="modal">' + html + '<div class="modal-btns">' + btns.map(function (b, i) { return '<button class="btn ' + (b.cls || 'pri') + '" data-mi="' + i + '">' + esc(b.t) + '</button>'; }).join('') + '</div></div>';
    document.body.appendChild(w);
    w.addEventListener('click', function (e) { var b = e.target.closest('[data-mi]'); if (!b) return; var fn = btns[+b.dataset.mi].fn; w.remove(); if (fn) fn(); });
  }

  // ---------- 題庫索引 ----------
  var Q = {};
  Object.keys(KL.subjects).forEach(function (sid) {
    var sub = KL.subjects[sid];
    (sub.units || []).forEach(function (u) {
      u.sid = sid;
      (u.questions || []).forEach(function (q, i) { q.id = q.id || (u.id + '-' + (i + 1)); q.sid = sid; q.uid = u.id; Q[q.id] = q; });
    });
    (sub.exams || []).forEach(function (ex) {
      ex.sid = sid; var n = 0;
      ex.sections.forEach(function (sec) {
        sec.items.forEach(function (q) { n++; q.id = q.id || (ex.id + '-' + n); q.sid = sid; q.uid = ex.id; q.sec = sec.title; if (sec.passage && !q.passage) q.passage = sec.passage; if (sec.table && !q.table) q.table = sec.table; Q[q.id] = q; });
      });
    });
  });
  function unitOf(sid, uid) { return (KL.subjects[sid].units || []).filter(function (u) { return u.id === uid; })[0]; }
  function examOf(sid, eid) { return (KL.subjects[sid].exams || []).filter(function (e) { return e.id === eid; })[0]; }
  function blanksOf(q) { return q.blanks || [{ ans: q.ans, unit: q.unit, pre: q.pre, kb: q.kb }]; }

  // ---------- 畫面共用 ----------
  function setTheme(t) { document.body.dataset.theme = t || 'base'; }
  function stars(n) { var s = ''; for (var i = 0; i < 3; i++) s += '<i class="' + (i < n ? 'on' : '') + '">★</i>'; return '<span class="stars">' + s + '</span>'; }
  function header() {
    var p = P(); var l = level(p.xp); var a = lvlXp(l), b = lvlXp(l + 1); var pct = Math.max(3, Math.round(100 * (p.xp - a) / (b - a)));
    return '<header class="hud"><button class="av" data-go="home" aria-label="回地圖">' + p.avatar + '</button>' +
      '<div class="who"><b>' + esc(p.name) + '</b><span class="lv">Lv.' + l + '　' + title(l) + '</span><div class="xpbar"><i style="width:' + pct + '%"></i></div></div>' +
      '<div class="stats"><span title="鑽石">💎 ' + p.coins + '</span><span title="細心值">🔍 ' + p.care + '</span><span title="連續學習天數">🔥 ' + p.streak + '</span></div>' +
      '<button class="icon" data-act="sound" aria-label="聲音">' + (S.settings.sound ? '🔊' : '🔇') + '</button></header>';
  }
  function tableHtml(t) {
    return '<div class="tbl"><table><tr>' + t.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr>' +
      t.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>';
  }

  // ---------- 路由 ----------
  var R = null;          // 進行中的關卡
  var labCleanup = null; // 實驗離開時清除計時器
  function go(h) { if (location.hash === '#' + h) render(); else location.hash = '#' + h; }
  window.addEventListener('hashchange', render);
  function render() {
    if (labCleanup) { try { labCleanup(); } catch (e) { } labCleanup = null; }
    window.scrollTo(0, 0);
    var h = decodeURIComponent(location.hash.slice(1));
    var parts = h.split('/');
    if (!P() && ['new', 'save'].indexOf(parts[0]) < 0) return viewTitle();
    if (parts[0] !== 'play' && R && !R.done) R = null;
    switch (parts[0]) {
      case '': case 'title': return viewTitle();
      case 'new': return viewNew();
      case 'home': return viewHome();
      case 's': return KL.subjects[parts[1]] ? viewSubject(parts[1]) : viewHome();
      case 'pv': return viewPreview(parts[1], parts[2]);
      case 'play': return viewPlay();
      case 'wrong': return viewWrong();
      case 'collect': return viewCollect();
      case 'shop': return viewShop();
      case 'save': return viewSave();
      case 'parent': return viewParent();
      case 'lab': return viewLab(parts[1]);
      default: return viewHome();
    }
  }

  // ---------- 開始畫面 ----------
  var FREE_AV = ['🦊', '🐱', '🐶', '🐼', '🐸', '🐧'];
  var SHOP = [{ a: '🦖', p: 80 }, { a: '🐙', p: 80 }, { a: '🤖', p: 120 }, { a: '🦄', p: 150 }, { a: '🐲', p: 150 }, { a: '🧙', p: 200 }, { a: '🥷', p: 200 }, { a: '🦸', p: 250 }, { a: '👾', p: 300 }, { a: '🚀', p: 400 }, { a: '🦁', p: 450 }, { a: '👑', p: 600 }];

  function viewTitle() {
    setTheme('base');
    var ps = Object.keys(S.profiles).map(function (k) { return S.profiles[k]; });
    app.innerHTML = '<div class="title-screen"><div class="logo"><div class="cubes"><span>🟥</span><span>🟨</span><span>🟩</span><span>🟦</span></div><h1>學習基地</h1><p>國小闖關大冒險</p></div>' +
      '<h2 class="pick-h">選擇你的角色</h2><div class="plist">' +
      ps.map(function (p) { return '<button class="pcard" data-pick="' + p.id + '"><span class="pav">' + p.avatar + '</span><b>' + esc(p.name) + '</b><small>' + p.grade + '年級・Lv.' + level(p.xp) + '</small></button>'; }).join('') +
      '<button class="pcard add" data-go="new"><span class="pav">➕</span><b>建立新角色</b></button></div>' +
      '<p class="hint">🔒 進度只存在這台裝置上。換裝置時，請用「存檔碼」把進度搬過去。</p>' +
      '<button class="btn ghost" data-go="save">📦 用存檔碼匯入進度</button></div>';
  }

  function viewNew() {
    setTheme('base');
    var sel = FREE_AV[0], grade = 3;
    app.innerHTML = '<div class="title-screen"><div class="card form"><button class="back" data-go="title">◀ 返回</button><h2>建立新角色</h2>' +
      '<label class="lbl">遊戲暱稱（最多8個字）</label><input id="nm" maxlength="8" placeholder="例如：閃電小龍" autocomplete="off">' +
      '<p class="warn">⚠️ 請取一個<b>遊戲暱稱</b>，不要用真實姓名喔！</p>' +
      '<label class="lbl">選一個頭像</label><div class="avpick">' + FREE_AV.map(function (a, i) { return '<button class="avb' + (i ? '' : ' on') + '" data-av="' + a + '">' + a + '</button>'; }).join('') + '</div>' +
      '<label class="lbl">年級</label><div class="gpick"><button class="gb on" data-g="3">三年級</button><button class="gb" data-g="1">一年級（建置中）</button></div>' +
      '<button class="btn go big" id="mk">🚀 開始冒險！</button></div></div>';
    $$('.avb').forEach(function (b) { b.onclick = function () { $$('.avb').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); sel = b.dataset.av; sfx('pick'); }; });
    $$('.gb').forEach(function (b) { b.onclick = function () { $$('.gb').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); grade = +b.dataset.g; sfx('pick'); }; });
    $('#mk').onclick = function () {
      var nm = $('#nm').value.trim();
      if (!nm) { toast('請先取一個暱稱'); $('#nm').focus(); return; }
      var p = blankProfile(nm, sel, grade); S.profiles[p.id] = p; S.current = p.id; save();
      sfx('lvl'); go('home');
    };
  }

  // ---------- 地圖 ----------
  function subjectProgress(s) {
    var p = P(); var done = 0, starsN = 0;
    s.units.forEach(function (u) { var st = p.units[u.id] || {}; if ((st.quizBest || 0) >= 60) done++; starsN += st.quizStars || 0; });
    return { done: done, total: s.units.length, stars: starsN };
  }
  function viewHome() {
    var p = P(); setTheme('base');
    var subs = (KL.order[p.grade] || []).map(function (id) { return KL.subjects[id]; }).filter(Boolean);
    var worlds = subs.map(function (s) {
      var g = subjectProgress(s);
      return '<button class="world w-' + s.theme + '" data-go="s/' + s.id + '"><span class="wic">' + s.icon + '</span><b>' + esc(s.world) + '</b><small>' + esc(s.name) + '</small>' +
        '<span class="wprog"><i style="width:' + Math.round(100 * g.done / g.total) + '%"></i></span><span class="wst">⭐ ' + g.stars + '／' + (g.total * 3) + '</span></button>';
    }).join('');
    var nWrong = Object.keys(p.wrong).length;
    app.innerHTML = header() + '<main class="home">' +
      '<h2 class="sect">🗺️ 選擇冒險世界</h2><div class="worlds">' + (worlds || '<div class="card note">一年級的關卡正在建造中，敬請期待！🚧</div>') + '</div>' +
      '<h2 class="sect">🧰 工具箱</h2><div class="tools">' +
      '<button class="tool" data-go="wrong"><span>📕</span><b>錯題本</b><small>' + nWrong + ' 題待複習</small></button>' +
      '<button class="tool" data-go="collect"><span>🏆</span><b>收藏・陷阱圖鑑</b><small>' + p.rewards.length + ' 個收藏</small></button>' +
      '<button class="tool" data-go="shop"><span>🛒</span><b>角色商店</b><small>用💎換新頭像</small></button>' +
      '<button class="tool" data-go="save"><span>📦</span><b>存檔碼</b><small>換裝置用</small></button>' +
      '<button class="tool" data-go="parent"><span>👨‍👩‍👦</span><b>家長專區</b><small>學習報告</small></button>' +
      '<button class="tool" data-go="title"><span>🔁</span><b>換角色</b><small>&nbsp;</small></button>' +
      '</div><p class="ver">學習基地 v1.0.0</p></main>';
  }

  // ---------- 科目頁 ----------
  function viewSubject(sid) {
    var s = KL.subjects[sid], p = P(); setTheme(s.theme);
    var units = s.units.map(function (u) {
      var st = p.units[u.id] || {}; var got = u.reward && p.rewards.indexOf(u.id) >= 0;
      var labs = (u.labs || []).map(function (l) { var L = KL.labs && KL.labs[l]; return L ? '<button class="btn lab" data-go="lab/' + l + '">🔬 ' + esc(L.short) + (p.labs[l] ? ' ✓' : '') + '</button>' : ''; }).join('');
      return '<div class="unit"><div class="uhead"><div><span class="tag">' + esc(u.tag || '') + '</span><h3>' + esc(u.name) + '</h3>' + (u.note ? '<small>' + esc(u.note) + '</small>' : '') + '</div>' +
        '<div class="ustars">' + stars(st.quizStars || 0) + (u.reward ? '<span class="rw' + (got ? ' got' : '') + '" title="' + esc(u.reward.name) + '">' + (got ? u.reward.icon : '❔') + '</span>' : '') + '</div></div>' +
        '<div class="ubtns">' + (u.preview ? '<button class="btn pv" data-pv="' + sid + '|' + u.id + '">📖 預習' + (st.previewDone ? ' ✓' : '') + '</button>' : '') +
        '<button class="btn rv" data-rv="' + sid + '|' + u.id + '">✏️ 複習' + (st.practiceBest != null ? '　' + st.practiceBest + '%' : '') + '</button>' +
        '<button class="btn qz" data-qz="' + sid + '|' + u.id + '">📝 小考' + (st.quizBest != null ? '　' + st.quizBest + '分' : '') + '</button>' + labs + '</div>' +
        (u.reward && !got ? '<p class="rwhint">🎁 小考80分以上可獲得：' + esc(u.reward.name) + '</p>' : '') + '</div>';
    }).join('');
    var exams = (s.exams && s.exams.length) ? '<div class="exams">' + s.exams.map(function (ex) {
      var best = p.exams[ex.id]; var n = 0; ex.sections.forEach(function (sc) { n += sc.items.length; });
      return '<div class="exam"><div><h3>📝 ' + esc(ex.name) + '</h3><small>' + n + ' 題・建議 ' + ex.time + ' 分鐘・滿分100分</small></div><div class="exr">' + (best != null ? '<span class="best">最佳 ' + best + ' 分</span>' : '') + '<button class="btn go" data-ex="' + sid + '|' + ex.id + '">開始考試</button></div></div>';
    }).join('') + '</div>' : '<div class="card note">' + esc(s.examNote || '即將推出') + '</div>';
    app.innerHTML = header() + '<main><div class="hero"><button class="back" data-go="home">◀ 地圖</button><div class="hero-ic">' + s.icon + '</div><h1>' + esc(s.world) + '</h1><p class="sub">' + esc(s.name) + '・' + esc(s.version) + '</p><p class="intro">' + esc(s.intro) + '</p></div>' +
      '<h2 class="sect">🧱 關卡</h2><div class="units">' + units + '</div><h2 class="sect">🏁 期末模擬考</h2>' + exams + '</main>';
  }

  // ---------- 預習 ----------
  function viewPreview(sid, uid) {
    var s = KL.subjects[sid], u = s && unitOf(sid, uid);
    if (!u || !u.preview) return go('home');
    setTheme(s.theme);
    var i = 0, cards = u.preview;
    function draw() {
      app.innerHTML = header() + '<main><div class="pv-wrap"><button class="back" data-go="s/' + sid + '">◀ 返回</button><h2 class="pv-unit">📖 ' + esc(u.name) + '・預習</h2>' +
        '<div class="pv-card"><div class="pv-n">' + (i + 1) + ' / ' + cards.length + '</div><h2>' + esc(cards[i].t) + '</h2><div class="pv-body">' + fmtHtml(cards[i].b) + '</div>' +
        '<button class="btn ghost sm" id="pvSay">🔊 唸給我聽</button></div>' +
        '<div class="pv-dots">' + cards.map(function (c, k) { return '<i class="' + (k === i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
        '<div class="pv-nav"><button class="btn" id="pvPrev"' + (i ? '' : ' disabled') + '>◀ 上一張</button>' +
        (i < cards.length - 1 ? '<button class="btn pri" id="pvNext">下一張 ▶</button>' : '<button class="btn go" id="pvGo">🚀 暖身挑戰（3題）</button>') + '</div></div></main>';
      $('#pvSay').onclick = function () { speak(cards[i].t + '。' + stripTags(fmtHtml(cards[i].b))); };
      $('#pvPrev').onclick = function () { if (i > 0) { i--; sfx('click'); draw(); } };
      if ($('#pvNext')) $('#pvNext').onclick = function () { i++; sfx('click'); draw(); };
      if ($('#pvGo')) $('#pvGo').onclick = function () {
        var p = P(); var st = p.units[uid] = p.units[uid] || {};
        if (!st.previewDone) { st.previewDone = true; award(20, 5, 0); toast('📖 完成預習！+20 XP 💎+5'); logIt('完成預習：' + s.name + ' ' + u.name); }
        var warm = u.questions.filter(function (q) { return q.warm; });
        var rest = u.questions.filter(function (q) { return !q.warm; });
        var qs = warm.concat(rest).slice(0, 3);
        startSession({ mode: 'practice', sid: sid, uid: uid, title: u.name + '・預習暖身', qs: qs });
      };
    }
    draw();
  }
  // 預習卡內容是作者撰寫的 HTML，只額外處理分數記號
  function fmtHtml(h) { return String(h).replace(/\[f:([0-9?]+)\/([0-9?]+)\]/g, function (m, a, b) { return '<span class="frac"><span class="fn">' + a + '</span><span class="fd">' + b + '</span></span>'; }); }

  // ---------- 關卡流程 ----------
  function startSession(c) {
    R = { mode: c.mode, sid: c.sid, uid: c.uid, exam: c.exam, title: c.title, qs: c.qs, i: 0, res: [], combo: 0, gain: { xp: 0, coins: 0, care: 0 }, t0: Date.now(), done: false, st: null };
    go('play');
  }
  function startPractice(sid, uid) { var u = unitOf(sid, uid); startSession({ mode: 'practice', sid: sid, uid: uid, title: u.name + '・複習', qs: shuffle(u.questions).slice(0, 10) }); }
  function startQuiz(sid, uid) { var u = unitOf(sid, uid); startSession({ mode: 'quiz', sid: sid, uid: uid, title: u.name + '・小考', qs: shuffle(u.questions).slice(0, 10) }); }
  function startExam(sid, eid) {
    var ex = examOf(sid, eid); var qs = [];
    ex.sections.forEach(function (sec) { sec.items.forEach(function (q) { qs.push(q); }); });
    var go2 = function () { startSession({ mode: 'exam', sid: sid, uid: eid, exam: ex, title: KL.subjects[sid].name + '・' + ex.name, qs: qs }); };
    modal('<div class="big">📝</div><h2>' + esc(ex.name) + '</h2><p>共 ' + qs.length + ' 題，建議 ' + ex.time + ' 分鐘完成。</p><p>考試中<b>不會馬上告訴你對錯</b>，交卷後才會公布分數和解析。</p><p>寫字題（自評題）寫完後，請對照範例誠實勾選。</p>',
      [{ t: '開始考試！', cls: 'go', fn: go2 }, { t: '再等一下', cls: 'ghost' }]);
  }
  function cur() { return R.qs[R.i]; }

  // 把題幹切成可以點選的小塊
  function tokenize(text, keys) {
    var ranges = [];
    (keys || []).forEach(function (k) { var at = text.indexOf(k); if (at >= 0) ranges.push([at, at + k.length]); });
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var segs = [], pos = 0;
    ranges.forEach(function (r) { if (r[0] < pos) return; if (r[0] > pos) segs.push({ t: text.slice(pos, r[0]) }); segs.push({ t: text.slice(r[0], r[1]), key: true }); pos = r[1]; });
    if (pos < text.length) segs.push({ t: text.slice(pos) });
    var out = [];
    var PUN = /^[，。、？！：；「」『』（）()\s,.!?…—]+$/;
    segs.forEach(function (sg) {
      if (sg.key) { out.push({ t: sg.t, key: true, tap: true }); return; }
      sg.t.split(/(\[f:[0-9?]+\/[0-9?]+\]|[，。、？！：；「」『』（）()\s,.!?…—]+)/).filter(Boolean).forEach(function (pt) {
        if (/^\[f:/.test(pt)) { out.push({ t: pt, tap: true }); return; }
        if (PUN.test(pt)) { out.push({ t: pt, tap: false }); return; }
        (pt.match(/[0-9]+|[^0-9]{1,3}/g) || []).forEach(function (x) { out.push({ t: x, tap: true }); });
      });
    });
    return out;
  }

  function progressHtml() {
    var s = KL.subjects[R.sid] || {}; var n = R.qs.length; var reveal = (R.mode === 'practice' || R.mode === 'wrong');
    if (s.theme === 'obby' && n <= 25) {
      return '<div class="obby">' + R.qs.map(function (q, i) {
        var c = '';
        if (i < R.res.length) c = reveal ? (R.res[i].g.ok ? 'ok' : 'bad') : 'done';
        else if (i === R.i) c = 'cur';
        return '<span class="blk ' + c + (q.trap && i >= R.i ? ' tr' : '') + '">' + (i === R.i ? P().avatar : '') + '</span>';
      }).join('') + '<span class="blk goal">🏁</span></div>';
    }
    var pct = Math.round(100 * R.i / n);
    return '<div class="pbarw"><div class="pbarf" style="width:' + pct + '%"></div><span>' + R.i + ' / ' + n + '</span></div>';
  }

  function viewPlay() {
    if (!R) return go('home');
    if (R.i >= R.qs.length) return finish();
    var q = cur(), s = KL.subjects[R.sid];
    setTheme(s ? s.theme : 'base');
    if (!R.st) R.st = { stage: (q.keys && q.keys.length && R.mode !== 'exam') ? 'keys' : 'answer', sel: {}, answered: false };
    var st = R.st, T = q.trap && KL.TRAPS[q.trap];
    var timer = R.mode === 'exam' ? '<span class="timer" id="timer"></span>' : (R.combo >= 2 ? '<span class="combo">🔥 連對 ' + R.combo + '</span>' : '');
    var stem = '';
    if (st.stage === 'keys') {
      st.toks = st.toks || tokenize(q.q, q.keys);
      stem = '<div class="keyhint">🔍 <b>陷阱偵探時間！</b>先點選題目裡的<b>關鍵字</b>（重要的條件或問法），再開始作答。</div><div class="stem toks">' +
        st.toks.map(function (t, i) { return t.tap ? '<span class="tok' + (st.sel[i] ? ' sel' : '') + '" data-tok="' + i + '">' + fmt(t.t) + '</span>' : '<span class="punc">' + esc(t.t) + '</span>'; }).join('') + '</div>' +
        '<button class="btn pri" id="keysDone">圈好了 ✔</button>';
    } else if (st.stage === 'keysResult') {
      stem = '<div class="stem toks">' + st.toks.map(function (t, i) {
        var c = t.key ? (st.sel[i] ? 'k-ok' : 'k-miss') : (st.sel[i] ? 'x' : '');
        return t.tap ? '<span class="tok ' + c + '">' + fmt(t.t) + '</span>' : '<span class="punc">' + esc(t.t) + '</span>';
      }).join('') + '</div><div class="keymsg ' + st.keyCls + '">' + st.keyMsg + '</div><button class="btn go" id="toAnswer">開始作答 ▶</button>';
    } else {
      var shown = st.toks ? st.toks.map(function (t) { return t.key ? '<mark>' + fmt(t.t) + '</mark>' : fmt(t.t); }).join('') : fmt(q.q);
      stem = '<div class="stem">' + shown + '</div>' + answerArea(q);
    }
    app.innerHTML = header() + '<main class="play"><div class="ptop"><button class="btn sm ghost" id="quit">✖ 離開</button><div class="ptitle">' + esc(R.title) + '</div>' + timer + '</div>' + progressHtml() +
      '<div class="qcard' + (q.trap && R.mode !== 'exam' ? ' trapq' : '') + '"><div class="qmeta">' + (q.sec ? '<span class="sec">' + esc(q.sec) + '</span>' : '') +
      '<span class="qno">第 ' + (R.i + 1) + ' 題</span>' + (q.pts ? '<span class="pts">' + q.pts + ' 分</span>' : '') +
      (q.trap && R.mode !== 'exam' ? '<span class="trapflag">⚠️ 陷阱題</span>' : '') + '<button class="say" id="say" aria-label="朗讀題目">🔊</button></div>' +
      (q.passage ? '<details class="passage" open><summary>📜 閱讀文章（點一下可收合）</summary><div>' + fmt(q.passage) + '</div></details>' : '') +
      (q.table ? tableHtml(q.table) : '') + stem + '<div id="fb"></div></div></main>';
    bindPlay(q);
  }

  function answerArea(q) {
    var st = R.st, h = '';
    switch (q.type) {
      case 'choice':
        h = '<div class="opts">' + q.opts.map(function (o, i) { return '<button class="opt" data-o="' + i + '"><span class="on">' + CIRC[i] + '</span><span class="ot">' + fmt(o) + '</span></button>'; }).join('') + '</div>';
        break;
      case 'multi':
        h = '<p class="mhint">☑️ 可以選很多個，<b>全部選對</b>才得分</p><div class="opts">' + q.opts.map(function (o, i) { return '<button class="opt multi" data-o="' + i + '"><span class="on">' + CIRC[i] + '</span><span class="ot">' + fmt(o) + '</span><span class="ck">✔</span></button>'; }).join('') + '</div>';
        break;
      case 'tf':
        h = '<div class="opts tf"><button class="opt" data-o="1"><span class="big">⭕</span>對</button><button class="opt" data-o="0"><span class="big">❌</span>錯</button></div>';
        break;
      case 'fill':
        var bl = blanksOf(q); var zy = bl.some(function (b) { return b.kb === 'zy'; });
        h = '<div class="fills">' + bl.map(function (b, i) {
          var numeric = b.kb !== 'zy' && b.ans.every(function (a) { return /^[0-9]+$/.test(a); });
          return '<label class="blank">' + (b.pre ? '<span>' + esc(b.pre) + '</span>' : '') + '<input class="fin' + (b.kb === 'zy' ? ' zyin' : '') + '" data-b="' + i + '" autocomplete="off" autocapitalize="off" spellcheck="false"' + (numeric ? ' inputmode="numeric"' : '') + (b.kb === 'zy' ? ' inputmode="none" placeholder="點下方注音"' : '') + '>' + (b.unit ? '<span>' + esc(b.unit) + '</span>' : '') + '</label>';
        }).join('') + '</div>' + (zy ? zyPad() : '');
        break;
      case 'order':
        if (!st.pool) { var idx = q.items.map(function (x, i) { return i; }); var sh = shuffle(idx); var tries = 0; while (sh.join() === idx.join() && tries++ < 10) sh = shuffle(idx); st.pool = sh; st.seq = []; }
        h = '<p class="mhint">👆 依照順序點選，排錯了可以按「重排」</p><div class="seq">' + (st.seq.length ? st.seq.map(function (i, k) { return '<span class="sq">' + (k + 1) + '. ' + fmt(q.items[i]) + '</span>'; }).join('<span class="arr">→</span>') : '<span class="ph">（從下面依序點選）</span>') + '</div>' +
          '<div class="pool">' + st.pool.map(function (i) { return st.seq.indexOf(i) >= 0 ? '' : '<button class="opt sm" data-ord="' + i + '">' + fmt(q.items[i]) + '</button>'; }).join('') + '</div>' +
          '<button class="btn ghost sm" id="ordReset">↺ 重排</button>';
        break;
      case 'cloze':
        var n = -1;
        h = '<div class="bank">' + q.bank.map(function (b, i) { return '<span>' + CIRC[i] + ' ' + esc(b) + '</span>'; }).join('') + '</div><div class="cloze">' +
          esc(q.text).replace(/\{(\d+)\}/g, function () { n++; return '<select class="csel" data-c="' + n + '"><option value="">（' + (n + 1) + '）</option>' + q.bank.map(function (b, i) { return '<option value="' + i + '">' + CIRC[i] + ' ' + esc(b) + '</option>'; }).join('') + '</select>'; }) + '</div>';
        break;
      case 'open':
        h = '<p class="mhint">✍️ 這是自評題：先自己寫（可以寫在紙上），寫好後看範例，誠實勾選做到的項目。</p><textarea id="openTa" rows="4" placeholder="把答案寫在這裡，或寫在紙上"></textarea>';
        break;
    }
    if (q.type === 'open') h += '<div class="actions"><button class="btn pri big" id="showModel">寫好了，看範例 👀</button></div>';
    else h += '<div class="actions"><button class="btn pri big" id="submit">' + (R.mode === 'exam' || R.mode === 'quiz' ? '下一題 ▶' : '確定送出 ✔') + '</button></div>';
    return h;
  }

  function zyPad() {
    return '<div class="zypad">' + ZY.split('').map(function (c) { return '<button type="button" data-zy="' + c + '">' + c + '</button>'; }).join('') +
      '<button type="button" class="tone" data-zy="ˊ">ˊ<small>二聲</small></button><button type="button" class="tone" data-zy="ˇ">ˇ<small>三聲</small></button><button type="button" class="tone" data-zy="ˋ">ˋ<small>四聲</small></button><button type="button" class="tone" data-zy="˙">˙<small>輕聲</small></button><button type="button" class="tone del" data-zy="⌫">⌫</button></div>';
  }

  function bindPlay(q) {
    var st = R.st;
    $('#quit').onclick = function () {
      modal('<h2>要離開嗎？</h2><p>' + (R.mode === 'exam' || R.mode === 'quiz' ? '這次的作答不會計分喔。' : '已經答過的題目會保留紀錄。') + '</p>', [{ t: '繼續作答', cls: 'pri' }, { t: '離開', cls: 'ghost', fn: function () { var sid = R.sid; R = null; go(sid ? 's/' + sid : 'home'); } }]);
    };
    $('#say').onclick = function () { speak((q.passage && st.stage !== 'keys' ? '' : '') + q.q + (q.opts ? '。選項：' + q.opts.map(function (o, i) { return (i + 1) + '，' + o; }).join('。') : '') + (q.type === 'cloze' ? '。' + q.text.replace(/\{\d+\}/g, '空格') : '')); };
    if (R.mode === 'exam') {
      var tm = $('#timer'); var lim = (R.exam.time || 40) * 60;
      var tick = function () { if (!tm.isConnected) return; var e = Math.floor((Date.now() - R.t0) / 1000); tm.textContent = '⏱ ' + Math.floor(e / 60) + ':' + pad(e % 60) + ' / ' + (lim / 60) + ':00'; tm.className = 'timer' + (e > lim ? ' over' : ''); setTimeout(tick, 1000); };
      tick();
    }
    if (st.stage === 'keys') {
      $$('[data-tok]').forEach(function (el) { el.onclick = function () { var i = +el.dataset.tok; st.sel[i] = !st.sel[i]; el.classList.toggle('sel', st.sel[i]); sfx('pick'); }; });
      $('#keysDone').onclick = function () {
        var keyIdx = [], wrong = 0, hit = 0;
        st.toks.forEach(function (t, i) { if (t.key) { keyIdx.push(i); if (st.sel[i]) hit++; } else if (st.sel[i]) wrong++; });
        var care = 0;
        if (hit === keyIdx.length && wrong <= 2) { care = 5; st.keyMsg = '🔍 完美！關鍵字都找到了！細心值 ＋5'; st.keyCls = 'good'; sfx('coin'); }
        else if (hit > 0) { care = 2; st.keyMsg = '👍 找到一部分！<b>綠色框</b>是你找到的關鍵字，<b>紅色虛線框</b>是漏掉的。細心值 ＋2'; st.keyCls = 'mid'; sfx('ok'); }
        else { st.keyMsg = '💡 關鍵字在<b>紅色虛線框</b>裡。作答前先看清楚這些字喔！'; st.keyCls = 'low'; sfx('bad'); }
        if (care) { R.gain.care += care; award(0, 0, care); }
        st.stage = 'keysResult'; viewPlay();
      };
      return;
    }
    if (st.stage === 'keysResult') { $('#toAnswer').onclick = function () { st.stage = 'answer'; viewPlay(); }; return; }
    // 作答
    st.ans = st.ans != null ? st.ans : (q.type === 'multi' ? [] : null);
    if (q.type === 'choice' || q.type === 'tf') {
      $$('.opt').forEach(function (b) { b.onclick = function () { if (st.answered) return; $$('.opt').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); st.ans = q.type === 'tf' ? b.dataset.o === '1' : +b.dataset.o; sfx('pick'); }; });
    }
    if (q.type === 'multi') {
      $$('.opt').forEach(function (b) { b.onclick = function () { if (st.answered) return; var i = +b.dataset.o; var k = st.ans.indexOf(i); if (k >= 0) st.ans.splice(k, 1); else st.ans.push(i); b.classList.toggle('on', k < 0); sfx('pick'); }; });
    }
    if (q.type === 'order') {
      $$('[data-ord]').forEach(function (b) { b.onclick = function () { if (st.answered) return; st.seq.push(+b.dataset.ord); sfx('pick'); viewPlay(); }; });
      $('#ordReset').onclick = function () { if (st.answered) return; st.seq = []; viewPlay(); };
    }
    if (q.type === 'fill') {
      var last = $('.fin');
      $$('.fin').forEach(function (inp) { inp.addEventListener('focus', function () { last = inp; }); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); var b = $('#submit'); if (b) b.click(); } }); });
      $$('[data-zy]').forEach(function (b) { b.onclick = function () { if (!last) return; var c = b.dataset.zy; last.value = c === '⌫' ? last.value.slice(0, -1) : last.value + c; sfx('pick'); }; });
      if (last && !('ontouchstart' in window)) last.focus();
    }
    if (q.type === 'open') {
      $('#showModel').onclick = function () {
        st.answered = true;
        var box = $('#fb');
        box.innerHTML = '<div class="model"><b>📗 範例答案</b><p>' + fmt(q.model) + '</p></div><div class="rubric"><b>✅ 勾選你做到的項目：</b>' + q.rubric.map(function (r, i) { return '<label><input type="checkbox" data-rb="' + i + '"> ' + esc(r) + '</label>'; }).join('') + '</div><div class="actions"><button class="btn pri big" id="submit">送出自評 ▶</button></div>';
        $('#showModel').remove();
        $('#submit').onclick = function () { var c = $$('[data-rb]').filter(function (x) { return x.checked; }).length; submit({ checks: c, text: ($('#openTa') || {}).value || '' }); };
        box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      return;
    }
    $('#submit').onclick = function () {
      var a = st.ans;
      if (q.type === 'fill') a = $$('.fin').map(function (x) { return x.value; });
      if (q.type === 'order') a = st.seq.slice();
      if (q.type === 'cloze') a = $$('.csel').map(function (x) { return x.value === '' ? null : +x.value; });
      var empty = a == null || (q.type === 'fill' && a.every(function (x) { return !norm(x); })) || (q.type === 'order' && a.length < q.items.length) || (q.type === 'multi' && !a.length) || (q.type === 'cloze' && a.every(function (x) { return x == null; }));
      if (empty && R.mode !== 'exam') { toast(q.type === 'order' ? '要把全部排完喔！' : '還沒有作答喔！'); return; }
      submit(a);
    };
  }

  function grade(q, a) {
    switch (q.type) {
      case 'choice': return { ok: a === q.ans, score: a === q.ans ? 1 : 0 };
      case 'tf': return { ok: a === q.ans, score: a === q.ans ? 1 : 0 };
      case 'multi': { var s = a || []; var ok = s.length === q.ans.length && q.ans.every(function (i) { return s.indexOf(i) >= 0; }); return { ok: ok, score: ok ? 1 : 0 }; }
      case 'fill': { var bl = blanksOf(q), c = 0; bl.forEach(function (b, i) { if (b.ans.map(norm).indexOf(norm((a || [])[i])) >= 0) c++; }); return { ok: c === bl.length, score: c / bl.length }; }
      case 'order': { var ok2 = a && a.length === q.items.length && a.every(function (x, i) { return x === i; }); return { ok: !!ok2, score: ok2 ? 1 : 0 }; }
      case 'cloze': { var c2 = 0; q.ans.forEach(function (an, i) { if ([].concat(an).indexOf((a || [])[i]) >= 0) c2++; }); return { ok: c2 === q.ans.length, score: c2 / q.ans.length }; }
      case 'open': { var sc = (a && a.checks || 0) / q.rubric.length; return { ok: sc >= 0.66, score: sc, self: true }; }
    }
    return { ok: false, score: 0 };
  }
  function answerText(q) {
    switch (q.type) {
      case 'choice': return CIRC[q.ans] + ' ' + q.opts[q.ans];
      case 'tf': return q.ans ? '⭕ 對' : '❌ 錯';
      case 'multi': return q.ans.map(function (i) { return CIRC[i] + ' ' + q.opts[i]; }).join('、');
      case 'fill': return blanksOf(q).map(function (b) { return (b.pre || '') + b.ans[0] + (b.unit || ''); }).join('　');
      case 'order': return q.items.join(' → ');
      case 'cloze': return q.ans.map(function (an, i) { return '（' + (i + 1) + '）' + q.bank[[].concat(an)[0]]; }).join('　');
      case 'open': return q.model;
    }
    return '';
  }
  function yourText(q, a) {
    if (a == null) return '（沒有作答）';
    switch (q.type) {
      case 'choice': return CIRC[a] + ' ' + q.opts[a];
      case 'tf': return a ? '⭕ 對' : '❌ 錯';
      case 'multi': return a.length ? a.slice().sort().map(function (i) { return CIRC[i] + ' ' + q.opts[i]; }).join('、') : '（沒有作答）';
      case 'fill': return blanksOf(q).map(function (b, i) { return (b.pre || '') + (a[i] || '＿') + (b.unit || ''); }).join('　');
      case 'order': return a.length ? a.map(function (i) { return q.items[i]; }).join(' → ') : '（沒有作答）';
      case 'cloze': return a.map(function (x, i) { return '（' + (i + 1) + '）' + (x == null ? '＿' : q.bank[x]); }).join('　');
      case 'open': return (a.text ? a.text + '　' : '') + '（自評：做到 ' + a.checks + '／' + q.rubric.length + ' 項）';
    }
    return '';
  }

  function record(q, g) {
    var p = P();
    p.answered++; if (g.ok) p.correct++;
    var ss = p.subj[q.sid] = p.subj[q.sid] || { answered: 0, correct: 0 }; ss.answered++; if (g.ok) ss.correct++;
    if (q.trap) { if (g.ok) p.traps[q.trap] = (p.traps[q.trap] || 0) + 1; else p.trapsMiss[q.trap] = (p.trapsMiss[q.trap] || 0) + 1; }
    if (q.type === 'open') return; // 自評題不放錯題本
    var w = p.wrong[q.id];
    if (g.ok) {
      if (w && R.mode === 'wrong') { w.s = (w.s || 0) + 1; if (w.s >= 2) { delete p.wrong[q.id]; award(0, 5, 0); toast('🎓 這題從錯題本畢業了！💎+5'); } }
    } else {
      p.wrong[q.id] = { n: (w ? w.n : 0) + 1, s: 0, t: today() };
    }
  }

  function submit(a) {
    var q = cur(), st = R.st; var g = grade(q, a);
    st.answered = true;
    R.res.push({ qid: q.id, a: a, g: g });
    record(q, g);
    if (R.mode === 'quiz' || R.mode === 'exam') { save(); next(); return; }
    // 練習模式：馬上回饋
    var T = q.trap && KL.TRAPS[q.trap];
    if (g.ok) { R.combo++; sfx('ok'); var xp = 10, coins = 2; if (R.combo % 3 === 0) { coins += 5; toast('🔥 連對 ' + R.combo + ' 題！額外 💎+5'); } R.gain.xp += xp; R.gain.coins += coins; award(xp, coins, 0); }
    else { R.combo = 0; sfx('bad'); if (g.score > 0) { R.gain.xp += 4; award(4, 0, 0); } }
    markOptions(q, a);
    var html = '<div class="fbx ' + (g.ok ? 'ok' : 'bad') + '"><div class="fbh">' + (g.ok ? '✅ 答對了！<span class="plus">+10 XP</span>' : (g.score > 0 ? '🟡 對了一部分' : '❌ 再想想看')) + '</div>' +
      (!g.ok && q.type !== 'open' ? '<div class="fba">正確答案：<b>' + fmt(answerText(q)) + '</b></div>' : '') +
      (q.exp ? '<div class="fbe">💡 ' + fmt(q.exp) + '</div>' : '') +
      (T ? '<div class="fbt"><b>' + T.icon + ' 陷阱：' + esc(T.name) + '</b><br>' + fmt(q.trapNote || T.tip) + '</div>' : '') +
      (!g.ok && q.type !== 'open' ? '<div class="fbw">📕 這題已經收進錯題本，之後再挑戰！</div>' : '') +
      '<div class="actions"><button class="btn go big" id="next">' + (R.i + 1 < R.qs.length ? '下一題 ▶' : '看結果 🏁') + '</button></div></div>';
    var box = $('#fb'); box.innerHTML = html;
    var sb = $('#submit'); if (sb) sb.remove();
    $('#next').onclick = next;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function markOptions(q, a) {
    if (q.type === 'choice') $$('.opt').forEach(function (b) { var i = +b.dataset.o; if (i === q.ans) b.classList.add('right'); else if (i === a) b.classList.add('wrongc'); });
    if (q.type === 'tf') $$('.opt').forEach(function (b) { var v = b.dataset.o === '1'; if (v === q.ans) b.classList.add('right'); else if (v === a) b.classList.add('wrongc'); });
    if (q.type === 'multi') $$('.opt').forEach(function (b) { var i = +b.dataset.o; var should = q.ans.indexOf(i) >= 0; var did = a.indexOf(i) >= 0; if (should) b.classList.add('right'); if (did && !should) b.classList.add('wrongc'); });
    if (q.type === 'fill') { var bl = blanksOf(q); $$('.fin').forEach(function (x, i) { x.disabled = true; x.classList.add(bl[i].ans.map(norm).indexOf(norm(x.value)) >= 0 ? 'right' : 'wrongc'); }); }
    if (q.type === 'cloze') $$('.csel').forEach(function (x, i) { x.disabled = true; x.classList.add([].concat(q.ans[i]).indexOf(x.value === '' ? null : +x.value) >= 0 ? 'right' : 'wrongc'); });
    $$('.opt').forEach(function (b) { b.disabled = true; });
  }
  function next() { R.i++; R.st = null; viewPlay(); }

  function finish() {
    if (!R.done) {
      R.done = true;
      var p = P(), n = R.qs.length, score;
      if (R.mode === 'exam') score = Math.round(R.res.reduce(function (s, r) { return s + (Q[r.qid].pts || 0) * r.g.score; }, 0));
      else score = Math.round(100 * R.res.reduce(function (s, r) { return s + r.g.score; }, 0) / n);
      var correct = R.res.filter(function (r) { return r.g.ok; }).length;
      var st3 = score >= 95 ? 3 : score >= 80 ? 2 : score >= 60 ? 1 : 0;
      var xp = 0, coins = 0, newRw = null;
      if (R.mode === 'quiz' || R.mode === 'exam') {
        xp = correct * 8 + (R.mode === 'exam' ? 40 : 15); coins = Math.round(score / (R.mode === 'exam' ? 3 : 5));
        award(xp, coins, 0);
      }
      if (R.uid && (R.mode === 'practice' || R.mode === 'quiz')) {
        var st = p.units[R.uid] = p.units[R.uid] || {};
        if (R.mode === 'practice') st.practiceBest = Math.max(st.practiceBest || 0, score);
        if (R.mode === 'quiz') {
          st.quizBest = Math.max(st.quizBest || 0, score); st.quizStars = Math.max(st.quizStars || 0, st3);
          var u = unitOf(R.sid, R.uid);
          if (u && u.reward && score >= 80 && p.rewards.indexOf(u.id) < 0) { p.rewards.push(u.id); newRw = u.reward; }
        }
      }
      if (R.mode === 'exam') p.exams[R.uid] = Math.max(p.exams[R.uid] || 0, score);
      touchDay();
      logIt(R.title + '：' + score + '分（答對' + correct + '/' + n + '）');
      save();
      R.result = { score: score, correct: correct, stars: st3, xp: R.mode === 'quiz' || R.mode === 'exam' ? xp : R.gain.xp, coins: R.mode === 'quiz' || R.mode === 'exam' ? coins : R.gain.coins, newRw: newRw };
      sfx(score >= 80 ? 'lvl' : 'ok');
    }
    viewResult();
  }

  function viewResult() {
    var r = R.result, n = R.qs.length, s = KL.subjects[R.sid];
    var showStars = R.mode === 'quiz' || R.mode === 'exam';
    var msg = r.score >= 95 ? '太厲害了！完美通關！' : r.score >= 80 ? '很棒！再細心一點就滿分了！' : r.score >= 60 ? '過關了！看看錯的題目，下次會更好。' : '別灰心！先看解析，再挑戰一次。';
    var wrongN = R.res.filter(function (x) { return !x.g.ok && Q[x.qid].type !== 'open'; }).length;
    app.innerHTML = header() + '<main class="result"><div class="rcard"><h2>' + esc(R.title) + '</h2><div class="score">' + r.score + '<small>' + (R.mode === 'practice' || R.mode === 'wrong' ? '％' : '分') + '</small></div>' +
      (showStars ? '<div class="rstars">' + stars(r.stars) + '</div>' : '') + '<p class="rmsg">' + msg + '</p>' +
      '<p>答對 <b>' + r.correct + '</b> / ' + n + ' 題' + (R.gain.care ? '　🔍細心 +' + R.gain.care : '') + '</p><div class="earn">+' + r.xp + ' XP　💎 +' + r.coins + '</div>' +
      (r.newRw ? '<div class="newrw">🎁 獲得新收藏：<span class="rwbig">' + r.newRw.icon + '</span> ' + esc(r.newRw.name) + '</div>' : '') +
      '<div class="rbtns"><button class="btn" data-go="' + (s ? 's/' + R.sid : 'home') + '">◀ 回去</button>' + (wrongN ? '<button class="btn" data-go="wrong">📕 錯題本（' + wrongN + '）</button>' : '') + '<button class="btn pri" id="again">🔁 再挑戰</button></div></div>' +
      '<h3 class="sect">📋 逐題檢討</h3><div class="review">' + R.res.map(function (x, i) {
        var q = Q[x.qid], T = q.trap && KL.TRAPS[q.trap];
        return '<details class="rv ' + (x.g.ok ? 'ok' : 'bad') + '"' + (x.g.ok ? '' : ' open') + '><summary><span class="mk">' + (x.g.ok ? '✅' : (x.g.score > 0 ? '🟡' : '❌')) + '</span> 第' + (i + 1) + '題　' + esc(plain(q.q).slice(0, 34)) + (plain(q.q).length > 34 ? '…' : '') + '</summary>' +
          '<div class="rvb"><p>📝 題目：' + fmt(q.q) + '</p>' + (q.type === 'cloze' ? '<p class="small">' + esc(q.text.replace(/\{\d+\}/g, '（　）')) + '</p>' : '') +
          '<p>🙋 你的答案：' + fmt(yourText(q, x.a)) + '</p><p>✅ 正確答案：' + fmt(answerText(q)) + '</p>' + (q.exp ? '<p>💡 ' + fmt(q.exp) + '</p>' : '') +
          (T ? '<p class="trp">' + T.icon + ' 陷阱：' + esc(T.name) + '——' + fmt(q.trapNote || T.tip) + '</p>' : '') + '</div></details>';
      }).join('') + '</div></main>';
    $('#again').onclick = function () {
      var m = R.mode, sid = R.sid, uid = R.uid;
      if (m === 'exam') return startExam(sid, uid);
      if (m === 'quiz') return startQuiz(sid, uid);
      if (m === 'wrong') return startWrong();
      return startPractice(sid, uid);
    };
  }

  // ---------- 錯題本 ----------
  function startWrong(sidFilter) {
    var p = P();
    var ids = Object.keys(p.wrong).filter(function (id) { return Q[id] && (!sidFilter || Q[id].sid === sidFilter); });
    if (!ids.length) { toast('沒有需要複習的錯題 🎉'); return; }
    ids.sort(function (a, b) { return (p.wrong[b].n - p.wrong[a].n); });
    var qs = shuffle(ids.slice(0, 15)).map(function (id) { return Q[id]; });
    var sids = qs.map(function (q) { return q.sid; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    startSession({ mode: 'wrong', sid: sids.length === 1 ? sids[0] : null, uid: null, title: '錯題重練', qs: qs });
  }
  function viewWrong() {
    var p = P(); setTheme('base');
    var ids = Object.keys(p.wrong).filter(function (id) { return Q[id]; });
    var bySub = {};
    ids.forEach(function (id) { var q = Q[id]; (bySub[q.sid] = bySub[q.sid] || []).push(id); });
    var html = Object.keys(bySub).map(function (sid) {
      var s = KL.subjects[sid];
      return '<div class="card"><div class="wh"><h3>' + s.icon + ' ' + esc(s.name) + '（' + bySub[sid].length + '題）</h3><button class="btn pri sm" data-wsub="' + sid + '">只練這科</button></div><ul class="wlist">' +
        bySub[sid].map(function (id) { var q = Q[id], w = p.wrong[id], T = q.trap && KL.TRAPS[q.trap]; return '<li><span>' + esc(plain(q.q).slice(0, 40)) + (plain(q.q).length > 40 ? '…' : '') + '</span><small>' + (T ? T.icon + T.name + '　' : '') + '錯' + w.n + '次・再答對' + (w.s || 0) + '/2</small></li>'; }).join('') + '</ul></div>';
    }).join('');
    app.innerHTML = header() + '<main><button class="back" data-go="home">◀ 地圖</button><h1 class="pg">📕 錯題本</h1>' +
      '<p class="hint">答錯的題目會自動收進來。在錯題本裡<b>連續答對2次</b>，題目就會「畢業」，還能拿到 💎！</p>' +
      (ids.length ? '<button class="btn go big" id="wAll">🔁 開始錯題重練（最多15題）</button>' + html : '<div class="card note">🎉 目前沒有錯題，太厲害了！</div>') + '</main>';
    if ($('#wAll')) $('#wAll').onclick = function () { startWrong(); };
    $$('[data-wsub]').forEach(function (b) { b.onclick = function () { startWrong(b.dataset.wsub); }; });
  }

  // ---------- 收藏與陷阱圖鑑 ----------
  function viewCollect() {
    var p = P(); setTheme('base');
    var rw = '';
    (KL.order[p.grade] || []).forEach(function (sid) {
      var s = KL.subjects[sid];
      s.units.forEach(function (u) { if (!u.reward) return; var got = p.rewards.indexOf(u.id) >= 0; rw += '<div class="ccard' + (got ? ' got' : '') + '"><span class="ci">' + (got ? u.reward.icon : '❔') + '</span><b>' + (got ? esc(u.reward.name) : '？？？') + '</b><small>' + esc(s.name) + '・' + esc(u.name) + '</small></div>'; });
    });
    var traps = Object.keys(KL.TRAPS).map(function (k) {
      var T = KL.TRAPS[k], ok = p.traps[k] || 0, miss = p.trapsMiss[k] || 0, un = ok >= 3;
      return '<div class="tcard' + (un ? ' got' : '') + '"><span class="ci">' + (un ? T.icon : '🔒') + '</span><b>' + esc(T.name) + '</b>' + (un ? '<p>' + esc(T.tip) + '</p>' : '<p class="small">再破解 ' + (3 - ok) + ' 題這種陷阱就能解鎖！</p>') + '<small>破解 ' + ok + '・掉進 ' + miss + '</small></div>';
    }).join('');
    var labs = Object.keys(KL.labs || {}).map(function (id) { var L = KL.labs[id]; return '<div class="ccard' + (p.labs[id] ? ' got' : '') + '"><span class="ci">' + (p.labs[id] ? L.icon : '❔') + '</span><b>' + esc(L.short) + '</b><small>實驗徽章</small></div>'; }).join('');
    app.innerHTML = header() + '<main><button class="back" data-go="home">◀ 地圖</button><h1 class="pg">🏆 收藏</h1>' +
      '<h2 class="sect">🎁 關卡收藏（小考80分以上獲得）</h2><div class="cgrid">' + rw + '</div>' +
      '<h2 class="sect">🧪 實驗徽章</h2><div class="cgrid">' + labs + '</div>' +
      '<h2 class="sect">🕵️ 陷阱圖鑑（同一種陷阱答對3題解鎖）</h2><div class="tgrid">' + traps + '</div></main>';
  }

  // ---------- 商店 ----------
  function viewShop() {
    var p = P(); setTheme('base');
    var all = FREE_AV.map(function (a) { return { a: a, p: 0 }; }).concat(SHOP);
    app.innerHTML = header() + '<main><button class="back" data-go="home">◀ 地圖</button><h1 class="pg">🛒 角色商店</h1><p class="hint">用闖關得到的 💎 換新頭像！你現在有 💎 ' + p.coins + '</p><div class="shop">' +
      all.map(function (it) {
        var own = p.owned.indexOf(it.a) >= 0 || it.p === 0, using = p.avatar === it.a;
        return '<div class="sitem' + (using ? ' using' : '') + '"><span class="sav">' + it.a + '</span>' + (using ? '<span class="tagu">使用中</span>' : own ? '<button class="btn sm" data-use="' + it.a + '">使用</button>' : '<button class="btn sm go" data-buy="' + it.a + '|' + it.p + '">💎 ' + it.p + '</button>') + '</div>';
      }).join('') + '</div></main>';
    $$('[data-use]').forEach(function (b) { b.onclick = function () { p.avatar = b.dataset.use; save(); sfx('pick'); viewShop(); }; });
    $$('[data-buy]').forEach(function (b) {
      b.onclick = function () {
        var x = b.dataset.buy.split('|'), price = +x[1];
        if (p.coins < price) { toast('💎 還不夠，再去闖關吧！'); sfx('bad'); return; }
        modal('<div class="big">' + x[0] + '</div><p>要用 💎 ' + price + ' 換這個頭像嗎？</p>', [{ t: '換！', cls: 'go', fn: function () { p.coins -= price; p.owned.push(x[0]); p.avatar = x[0]; save(); sfx('coin'); viewShop(); } }, { t: '再想想', cls: 'ghost' }]);
      };
    });
  }

  // ---------- 存檔碼 ----------
  function encodeProfile(p) { return 'KL1.' + btoa(unescape(encodeURIComponent(JSON.stringify(p)))); }
  function decodeProfile(code) { code = code.trim().replace(/\s+/g, ''); if (code.indexOf('KL1.') !== 0) throw new Error('bad'); return JSON.parse(decodeURIComponent(escape(atob(code.slice(4))))); }
  function viewSave() {
    var p = P(); setTheme('base');
    app.innerHTML = (p ? header() : '') + '<main><button class="back" data-go="' + (p ? 'home' : 'title') + '">◀ 返回</button><h1 class="pg">📦 存檔碼</h1>' +
      '<div class="card"><h3>這是什麼？</h3><p>進度存在這台裝置的瀏覽器裡。想在<b>另一台電腦或平板</b>繼續玩，就把這串存檔碼複製過去，在新裝置的「匯入」貼上就好。</p><p class="warn">⚠️ 清除瀏覽器資料會讓進度不見，建議偶爾複製一份存檔碼備份（例如貼在家長的記事本裡）。</p></div>' +
      (p ? '<div class="card"><h3>📤 匯出「' + esc(p.name) + '」的存檔碼</h3><textarea id="exp" rows="4" readonly>' + esc(encodeProfile(p)) + '</textarea><button class="btn pri" id="cp">📋 複製存檔碼</button></div>' : '') +
      '<div class="card"><h3>📥 匯入存檔碼</h3><textarea id="imp" rows="4" placeholder="把存檔碼貼在這裡"></textarea><button class="btn go" id="im">匯入</button></div></main>';
    if ($('#cp')) $('#cp').onclick = function () {
      var t = $('#exp'); t.select();
      var done = function () { toast('✅ 已複製！'); };
      if (navigator.clipboard) navigator.clipboard.writeText(t.value).then(done, function () { try { document.execCommand('copy'); done(); } catch (e) { toast('請手動選取並複製'); } });
      else { try { document.execCommand('copy'); done(); } catch (e) { toast('請手動選取並複製'); } }
    };
    $('#im').onclick = function () {
      var np;
      try { np = decodeProfile($('#imp').value); if (!np || !np.id || !np.name) throw new Error('x'); } catch (e) { toast('❌ 存檔碼不正確，請確認有完整複製'); return; }
      var doIt = function () { S.profiles[np.id] = ensure(np); S.current = np.id; save(); toast('✅ 匯入成功！歡迎回來，' + np.name); go('home'); };
      if (S.profiles[np.id]) modal('<p>這台裝置已經有「' + esc(np.name) + '」的存檔。要用匯入的存檔<b>覆蓋</b>嗎？</p><p class="small">目前：Lv.' + level(S.profiles[np.id].xp) + '　匯入：Lv.' + level(np.xp) + '</p>', [{ t: '覆蓋', cls: 'go', fn: doIt }, { t: '取消', cls: 'ghost' }]);
      else doIt();
    };
  }

  // ---------- 家長專區 ----------
  function viewParent() {
    var p = P(); setTheme('base');
    var a = 12 + Math.floor(Math.random() * 8), b = 3 + Math.floor(Math.random() * 7);
    app.innerHTML = header() + '<main><button class="back" data-go="home">◀ 地圖</button><h1 class="pg">👨‍👩‍👦 家長專區</h1><div class="card gate"><p>請家長回答：<b>' + a + ' × ' + b + ' ＝ ？</b></p><input id="gate" inputmode="numeric" autocomplete="off"><button class="btn pri" id="gok">進入</button></div></main>';
    var ok = function () { if (+$('#gate').value === a * b) parentPanel(); else toast('答案不對喔'); };
    $('#gok').onclick = ok; $('#gate').addEventListener('keydown', function (e) { if (e.key === 'Enter') ok(); });
  }
  function parentPanel() {
    var p = P();
    var subs = (KL.order[p.grade] || []).map(function (id) { return KL.subjects[id]; });
    var acc = subs.map(function (s) { var x = p.subj[s.id] || { answered: 0, correct: 0 }; var pct = x.answered ? Math.round(100 * x.correct / x.answered) : null; return '<tr><td>' + s.icon + ' ' + esc(s.name) + '</td><td>' + x.answered + '</td><td>' + (pct == null ? '—' : pct + '%') + '</td></tr>'; }).join('');
    var units = subs.map(function (s) { return s.units.map(function (u) { var st = p.units[u.id] || {}; return '<tr><td>' + esc(s.name) + '</td><td>' + esc(u.name) + '</td><td>' + (st.previewDone ? '✓' : '') + '</td><td>' + (st.practiceBest != null ? st.practiceBest + '%' : '') + '</td><td>' + (st.quizBest != null ? st.quizBest : '') + '</td></tr>'; }).join(''); }).join('');
    var exams = subs.map(function (s) { return (s.exams || []).map(function (e) { return '<tr><td>' + esc(s.name) + '</td><td>' + esc(e.name) + '</td><td>' + (p.exams[e.id] != null ? p.exams[e.id] : '未考') + '</td></tr>'; }).join(''); }).join('');
    var tr = Object.keys(KL.TRAPS).map(function (k) { return { k: k, m: p.trapsMiss[k] || 0, o: p.traps[k] || 0 }; }).filter(function (x) { return x.m + x.o > 0; }).sort(function (a, b) { return b.m - a.m; });
    var trHtml = tr.length ? tr.map(function (x) { var T = KL.TRAPS[x.k]; var rate = Math.round(100 * x.o / (x.o + x.m)); return '<tr><td>' + T.icon + ' ' + esc(T.name) + '</td><td>' + x.m + '</td><td>' + x.o + '</td><td>' + rate + '%</td></tr>'; }).join('') : '<tr><td colspan="4">還沒有資料</td></tr>';
    app.innerHTML = header() + '<main><button class="back" data-go="home">◀ 地圖</button><h1 class="pg">👨‍👩‍👦 ' + esc(p.name) + ' 的學習報告</h1>' +
      '<div class="card"><p>總作答 <b>' + p.answered + '</b> 題，答對率 <b>' + (p.answered ? Math.round(100 * p.correct / p.answered) : 0) + '%</b>；錯題本 <b>' + Object.keys(p.wrong).length + '</b> 題；細心值 <b>' + p.care + '</b>；連續學習 <b>' + p.streak + '</b> 天。</p></div>' +
      '<div class="card"><h3>🕵️ 最常掉進的陷阱</h3><p class="small">依「掉進次數」排序，可以看出孩子最需要提醒的地方。</p><div class="tbl"><table><tr><th>陷阱</th><th>掉進</th><th>破解</th><th>破解率</th></tr>' + trHtml + '</table></div></div>' +
      '<div class="card"><h3>📊 各科答對率</h3><div class="tbl"><table><tr><th>科目</th><th>作答數</th><th>答對率</th></tr>' + acc + '</table></div></div>' +
      '<div class="card"><h3>🧱 各單元進度</h3><div class="tbl"><table><tr><th>科目</th><th>單元</th><th>預習</th><th>複習最佳</th><th>小考最佳</th></tr>' + units + '</table></div></div>' +
      '<div class="card"><h3>📝 期末模擬考</h3><div class="tbl"><table><tr><th>科目</th><th>考卷</th><th>最佳分數</th></tr>' + exams + '</table></div></div>' +
      '<div class="card"><h3>🕒 最近紀錄</h3><ul class="log">' + (p.log.slice(0, 25).map(function (l) { return '<li><small>' + esc(l.d) + '</small> ' + esc(l.t) + '</li>'; }).join('') || '<li>還沒有紀錄</li>') + '</ul></div>' +
      '<div class="card"><h3>⚙️ 角色管理</h3><p class="small">刪除後無法復原，建議先到「存檔碼」備份。</p><button class="btn ghost" id="del">🗑️ 刪除這個角色</button></div></main>';
    $('#del').onclick = function () {
      modal('<h2>確定要刪除「' + esc(p.name) + '」嗎？</h2><p>所有進度都會消失，而且無法復原。</p>', [{ t: '取消', cls: 'pri' }, { t: '確定刪除', cls: 'ghost', fn: function () { delete S.profiles[p.id]; S.current = null; save(); go('title'); } }]);
    };
  }

  // ---------- 實驗 ----------
  function viewLab(id) {
    var L = KL.labs && KL.labs[id]; if (!L) return go('home');
    var s = KL.subjects[L.sid]; setTheme('craft');
    app.innerHTML = header() + '<main><div class="labwrap"><button class="back" data-go="s/' + L.sid + '">◀ 回實驗室</button><h1 class="pg">🔬 ' + esc(L.title) + '</h1><div id="lab"></div></div></main>';
    var api = {
      sfx: sfx, toast: toast, modal: modal, esc: esc, fmt: fmt,
      award: function (xp, c) { award(xp, c, 0); },
      setCleanup: function (fn) { labCleanup = fn; },
      done: function () {
        var p = P(); var first = !p.labs[id];
        if (first) { p.labs[id] = true; award(30, 15, 0); logIt('完成實驗：' + L.title); touchDay(); save(); }
        sfx('lvl');
        modal('<div class="big">' + L.icon + '</div><h2>實驗完成！</h2>' + (first ? '<p>獲得實驗徽章「' + esc(L.short) + '」<br>+30 XP　💎 +15</p>' : '<p>又完成一次，越來越像科學家了！</p>'), [{ t: '回實驗室', fn: function () { go('s/' + L.sid); } }, { t: '再玩一次', cls: 'ghost', fn: function () { render(); } }]);
      }
    };
    L.mount($('#lab'), api);
  }

  // ---------- 全域點擊 ----------
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go],[data-act],[data-pick],[data-pv],[data-rv],[data-qz],[data-ex]');
    if (!t) return;
    var d = t.dataset;
    if (d.go !== undefined) { sfx('click'); go(d.go); }
    else if (d.pick) { S.current = d.pick; save(); sfx('click'); go('home'); }
    else if (d.act === 'sound') { S.settings.sound = !S.settings.sound; save(); render(); }
    else if (d.pv) { var a = d.pv.split('|'); go('pv/' + a[0] + '/' + a[1]); }
    else if (d.rv) { var b = d.rv.split('|'); startPractice(b[0], b[1]); }
    else if (d.qz) {
      var c = d.qz.split('|');
      modal('<div class="big">📝</div><h2>小考開始</h2><p>共10題。小考時<b>不會馬上公布答案</b>，全部寫完才會知道分數。</p><p>80分以上可以得到關卡收藏！</p>', [{ t: '開始！', cls: 'go', fn: function () { startQuiz(c[0], c[1]); } }, { t: '再等一下', cls: 'ghost' }]);
    }
    else if (d.ex) { var x = d.ex.split('|'); startExam(x[0], x[1]); }
  });

  render();
})();
