/* 方塊實驗室：互動實驗 */
(function () {
  'use strict';
  var KL = window.KL;
  KL.labs = KL.labs || {};
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // ================= 實驗一：風向觀測站 =================
  KL.labs.wind = {
    sid: 'sci3', icon: '🧭', short: '風向觀測站', title: '風向觀測站：這是什麼風？',
    mount: function (el, api) {
      var DIRS = [{ n: '北', a: 0 }, { n: '東', a: 90 }, { n: '南', a: 180 }, { n: '西', a: 270 }];
      var rounds = shuffle(DIRS).concat(shuffle(DIRS)).slice(0, 4);
      var r = 0, step = 'name', vane = 90, score = 0, timers = [];
      api.setCleanup(function () { timers.forEach(clearInterval); });
      function scene(d) {
        // 風從 d.a 方向吹來；粒子由來的方向往反方向移動
        var rad = (d.a - 90) * Math.PI / 180; // 0度=上方(北)
        var fx = 160 + Math.cos(rad) * 112, fy = 160 + Math.sin(rad) * 112;
        var parts = '';
        for (var i = 0; i < 9; i++) {
          var off = (i - 4) * 22; var px = -Math.sin(rad) * off, py = Math.cos(rad) * off;
          parts += '<line class="wp" x1="' + (fx + px) + '" y1="' + (fy + py) + '" x2="' + (fx + px - Math.cos(rad) * 18) + '" y2="' + (fy + py - Math.sin(rad) * 18) + '" style="animation-delay:' + (i * 0.17) + 's;--dx:' + (-Math.cos(rad) * 250) + 'px;--dy:' + (-Math.sin(rad) * 250) + 'px"/>';
        }
        var flag = d.a + 180; // 旗子往下風處飄
        return '<svg viewBox="0 0 320 320" class="windsvg">' +
          '<rect x="0" y="0" width="320" height="320" fill="#7ec850"/>' +
          '<g class="grid">' + Array.apply(null, Array(10)).map(function (_, i) { return '<line x1="' + (i * 32) + '" y1="0" x2="' + (i * 32) + '" y2="320"/><line x1="0" y1="' + (i * 32) + '" x2="320" y2="' + (i * 32) + '"/>'; }).join('') + '</g>' +
          '<text x="160" y="22" class="cmp">北</text><text x="160" y="312" class="cmp">南</text><text x="304" y="166" class="cmp">東</text><text x="16" y="166" class="cmp">西</text>' +
          '<g class="parts">' + parts + '</g>' +
          '<text x="' + fx + '" y="' + (fy + 10) + '" class="fan">🌀</text>' +
          '<g transform="translate(110 200)"><rect x="-3" y="-60" width="6" height="64" fill="#5d4037"/><g transform="translate(0 -56) rotate(' + (flag - 90) + ')"><path d="M0 0 L0 -6 L34 -2 L0 6 Z" fill="#e53935" class="flagp"/></g></g>' +
          '<g transform="translate(220 200)"><rect x="-3" y="-30" width="6" height="40" fill="#5d4037"/><g id="vane" transform="translate(0 -32) rotate(' + vane + ')"><line x1="0" y1="22" x2="0" y2="-22" stroke="#263238" stroke-width="5"/><path d="M0 -34 L-10 -18 L10 -18 Z" fill="#ffca28" stroke="#263238" stroke-width="2"/><path d="M0 18 L-12 30 L12 30 Z" fill="#90a4ae" stroke="#263238" stroke-width="2"/></g><text x="0" y="28" class="lbl2">風向標</text></g>' +
          '<text x="110" y="222" class="lbl2">旗子</text></svg>';
      }
      function draw(msg) {
        var d = rounds[r];
        var body = '';
        if (step === 'name') {
          body = '<p class="lq">🌀 電風扇正在吹風。看看<b>旗子</b>往哪裡飄，這是什麼風？</p><div class="lopts">' + DIRS.map(function (x) { return '<button class="btn" data-w="' + x.n + '">' + x.n + '風</button>'; }).join('') + '</div>';
        } else if (step === 'vane') {
          body = '<p class="lq">🧭 轉動<b>風向標</b>，讓黃色箭頭指向風吹「來」的方向。</p><div class="lopts"><button class="btn" id="vl">⟲ 向左轉</button><button class="btn" id="vr">⟳ 向右轉</button><button class="btn go" id="vok">確定</button></div>';
        }
        el.innerHTML = '<div class="labbox"><div class="lstep">第 ' + (r + 1) + ' / ' + rounds.length + ' 回合　得分 ' + score + '</div>' + scene(d) + (msg ? '<div class="lmsg">' + msg + '</div>' : '') + body + '</div>' +
          '<div class="card note small">📌 地圖上方是北、下方是南、右邊是東、左邊是西。<br>📌 風向＝風「吹來」的方向。北風從北方吹來，會把旗子吹向南方。</div>';
        if (step === 'name') {
          Array.prototype.forEach.call(el.querySelectorAll('[data-w]'), function (b) {
            b.onclick = function () {
              if (b.dataset.w === d.n) { score += 5; api.sfx('ok'); api.award(5, 1); step = 'vane'; draw('✅ 答對了！這是<b>' + d.n + '風</b>：風從' + d.n + '方吹過來，旗子被吹向' + ({ 北: '南', 南: '北', 東: '西', 西: '東' })[d.n] + '方。'); }
              else { api.sfx('bad'); draw('❌ 再看一次！旗子是被風「推」過去的，風是從旗子飄去的<b>反方向</b>吹來的。'); }
            };
          });
        } else {
          el.querySelector('#vl').onclick = function () { vane = (vane + 270) % 360; api.sfx('pick'); el.querySelector('#vane').setAttribute('transform', 'translate(0 -32) rotate(' + vane + ')'); };
          el.querySelector('#vr').onclick = function () { vane = (vane + 90) % 360; api.sfx('pick'); el.querySelector('#vane').setAttribute('transform', 'translate(0 -32) rotate(' + vane + ')'); };
          el.querySelector('#vok').onclick = function () {
            if (vane === d.a) {
              score += 5; api.sfx('ok'); api.award(5, 1);
              r++; step = 'name';
              if (r >= rounds.length) return api.done();
              vane = shuffle([0, 90, 180, 270].filter(function (a) { return a !== rounds[r].a; }))[0];
              draw('✅ 正確！風向標的箭頭指向風吹來的方向（' + d.n + '方）。下一回合！');
            } else { api.sfx('bad'); draw('❌ 還不對喔。風是從<b>電風扇那一邊</b>吹來的，箭頭要轉過去指著它。'); step = 'vane'; }
          };
        }
      }
      vane = shuffle([0, 90, 180, 270].filter(function (a) { return a !== rounds[0].a; }))[0]; draw();
    }
  };

  // ================= 實驗二：針筒壓縮實驗 =================
  KL.labs.syringe = {
    sid: 'sci3', icon: '💉', short: '針筒壓縮實驗', title: '針筒壓縮實驗：空氣和水，哪個壓得動？',
    mount: function (el, api) {
      var step = 'predict', pred = null, tried = { air: 0, water: 0 };
      function syr(kind, push) {
        // push: 0~100 推的力氣；空氣最多壓縮到 55%，水幾乎不動
        var move = kind === 'air' ? Math.min(push * 0.55, 55) : Math.min(push * 0.03, 3);
        var len = 200 - move * 2; // 內部長度
        var dots = '';
        if (kind === 'air') { for (var i = 0; i < 26; i++) { var x = 50 + ((i * 37) % 100) / 100 * (len - 12), y = 22 + ((i * 53) % 100) / 100 * 36; dots += '<circle cx="' + (x + 6) + '" cy="' + y + '" r="4" fill="#90caf9"/>'; } }
        return '<svg viewBox="0 0 330 80" class="syr"><rect x="40" y="14" width="210" height="52" rx="6" fill="#eceff1" stroke="#455a64" stroke-width="3"/>' +
          (kind === 'water' ? '<rect x="43" y="17" width="' + (len) + '" height="46" fill="#4fc3f7"/>' : dots) +
          '<rect x="16" y="32" width="26" height="16" fill="#455a64"/><circle cx="14" cy="40" r="10" fill="#ffcc80" stroke="#e65100" stroke-width="2"/>' +
          '<rect x="' + (43 + len) + '" y="16" width="10" height="48" fill="#37474f"/><rect x="' + (53 + len) + '" y="35" width="50" height="10" fill="#607d8b"/><rect x="' + (103 + len) + '" y="20" width="10" height="40" fill="#37474f"/>' +
          '<text x="14" y="76" font-size="11" text-anchor="middle" fill="#333">手指堵住</text></svg>';
      }
      function draw(msg) {
        var h = '<div class="labbox">';
        if (step === 'predict') {
          h += '<p class="lq">🤔 <b>先預測：</b>用手指堵住針筒口，用一樣的力氣推推桿。裝<b>空氣</b>的針筒和裝<b>水</b>的針筒，哪一個比較推得動？</p><div class="lopts"><button class="btn" data-p="air">空氣比較推得動</button><button class="btn" data-p="water">水比較推得動</button><button class="btn" data-p="same">一樣推得動</button></div>';
        } else if (step === 'do') {
          h += '<p class="lq">💪 拉動下面的滑桿「用力推」，再按「放手」，觀察推桿會怎麼樣。兩支針筒都要試試看（推到最用力）！</p>' +
            '<div class="syrrow"><b>空氣針筒</b>' + syr('air', 0) + '<input type="range" min="0" max="100" value="0" id="pa"><button class="btn sm" id="ra">放手</button></div>' +
            '<div class="syrrow"><b>水針筒</b>' + syr('water', 0) + '<input type="range" min="0" max="100" value="0" id="pw"><button class="btn sm" id="rw">放手</button></div>' +
            '<button class="btn go" id="toConc"' + (tried.air >= 90 && tried.water >= 90 ? '' : ' disabled') + '>我觀察好了 ▶</button>';
        } else {
          h += '<p class="lq">📝 <b>下結論：</b>從實驗中你發現了什麼？</p><div class="lopts col"><button class="btn" data-c="0">空氣和水都不能被壓縮</button><button class="btn" data-c="1">空氣可以被壓縮，水不容易被壓縮</button><button class="btn" data-c="2">水可以被壓縮，空氣不行</button></div>';
        }
        h += (msg ? '<div class="lmsg">' + msg + '</div>' : '') + '</div><div class="card note small">📌 真正做實驗時，針筒口要用手指緊緊堵住，也可以請大人幫忙。</div>';
        el.innerHTML = h;
        if (step === 'predict') Array.prototype.forEach.call(el.querySelectorAll('[data-p]'), function (b) { b.onclick = function () { pred = b.dataset.p; api.sfx('pick'); step = 'do'; draw('記住你的預測，現在動手試試看！'); }; });
        if (step === 'do') {
          var rows = el.querySelectorAll('.syrrow');
          function upd(kind, idx, v) { rows[idx].querySelector('svg').outerHTML = syr(kind, v); tried[kind] = Math.max(tried[kind], v); if (tried.air >= 90 && tried.water >= 90) el.querySelector('#toConc').disabled = false; }
          el.querySelector('#pa').oninput = function () { upd('air', 0, +this.value); };
          el.querySelector('#pw').oninput = function () { upd('water', 1, +this.value); };
          el.querySelector('#ra').onclick = function () { el.querySelector('#pa').value = 0; upd('air', 0, 0); api.toast('放手後，推桿被空氣推回來了！'); };
          el.querySelector('#rw').onclick = function () { el.querySelector('#pw').value = 0; upd('water', 1, 0); api.toast('水的推桿幾乎沒有動過。'); };
          el.querySelector('#toConc').onclick = function () { step = 'conc'; draw(pred === 'air' ? '🎯 你的預測是對的！' : '🧐 結果和你的預測不一樣，科學家也常常這樣，看結果來修正想法就好！'); };
        }
        if (step === 'conc') Array.prototype.forEach.call(el.querySelectorAll('[data-c]'), function (b) {
          b.onclick = function () {
            if (b.dataset.c === '1') { api.award(10, 3); api.done(); }
            else { api.sfx('bad'); draw('❌ 再想想：哪一支針筒推得進去、放手還會彈回來？'); }
          };
        });
      }
      draw();
    }
  };

  // ================= 實驗三：溶解實驗室 =================
  KL.labs.dissolve = {
    sid: 'sci3', icon: '🧂', short: '溶解實驗室', title: '溶解實驗室：水裡可以溶多少？',
    mount: function (el, api) {
      // 模擬數據：一平匙食鹽約 6 公克、糖約 4 公克；室溫下 50 毫升水約可溶食鹽 18 公克、糖 100 公克
      var CAP = { salt: 3, sugar: 24, flour: 0 };
      var NAME = { salt: '食鹽', sugar: '糖', flour: '麵粉' };
      var st = { sub: 'salt', water: 50, stir: true, added: 0, dissolved: 0, busy: false };
      var records = []; var missions = { m1: false, m2: false, m3: false, m4: false, m5: false };
      var stirSeen = { on: false, off: false };
      var timers = []; api.setCleanup(function () { timers.forEach(clearTimeout); });
      function cap() { return CAP[st.sub] * (st.water / 50); }
      function beaker() {
        var lvl = st.water === 50 ? 120 : 70; // 水面 y
        var pile = Math.max(0, st.added - st.dissolved);
        var cloudy = st.sub === 'flour' && st.added > 0;
        var pileH = Math.min(40, (st.sub === 'flour' ? st.added * 6 : pile * 5));
        return '<svg viewBox="0 0 220 220" class="beaker"><rect x="0" y="0" width="220" height="220" fill="#3e2723"/>' +
          '<path d="M50 30 L50 200 Q50 210 60 210 L160 210 Q170 210 170 200 L170 30" fill="rgba(255,255,255,.15)" stroke="#e0f7fa" stroke-width="4"/>' +
          '<rect x="53" y="' + lvl + '" width="114" height="' + (207 - lvl) + '" fill="' + (cloudy ? '#d7ccc8' : '#4fc3f7') + '" opacity="' + (cloudy ? .9 : .7) + '"/>' +
          (pileH ? '<path d="M56 207 Q110 ' + (207 - pileH * 1.6) + ' 164 207 Z" fill="' + (st.sub === 'flour' ? '#efebe9' : '#ffffff') + '" stroke="#bdbdbd"/>' : '') +
          (st.stir ? '<g class="stirrer"><rect x="104" y="20" width="8" height="180" rx="3" fill="#ffe082"/></g>' : '') +
          '<text x="175" y="' + (lvl + 5) + '" font-size="12" fill="#fff">' + st.water + 'mL</text></svg>';
      }
      function addSpoon(n) {
        if (st.busy) return; st.busy = true; api.sfx('pick');
        var k = 0;
        (function one() {
          if (k >= n) { st.busy = false; check(); draw(); return; }
          k++; st.added++;
          var delay = st.stir ? 250 : 700;
          timers.push(setTimeout(function () { if (st.dissolved < cap()) st.dissolved++; draw(); one(); }, delay));
        })();
        if (st.stir) stirSeen.on = true; else stirSeen.off = true;
      }
      function check() {
        var c = cap();
        if (st.sub !== 'flour' && st.added > c && !records.some(function (r) { return r.sub === st.sub && r.water === st.water; })) {
          records.push({ sub: st.sub, water: st.water, max: c });
          api.toast('📋 已記錄：' + st.water + '毫升水最多溶解 ' + c + ' 匙' + NAME[st.sub]);
        }
        if (st.sub === 'flour' && st.added >= 2 && !records.some(function (r) { return r.sub === 'flour'; })) records.push({ sub: 'flour', water: st.water, max: 0 });
      }
      function ask(id, q, opts, ans, okMsg) {
        api.modal('<h2>🧪 任務問答</h2><p>' + q + '</p>', opts.map(function (o, i) {
          return { t: o, cls: 'pri', fn: function () {
            if (i === ans) { missions[id] = true; api.sfx('ok'); api.award(8, 2); api.toast('✅ ' + okMsg); draw(); if (Object.keys(missions).every(function (k) { return missions[k]; })) setTimeout(api.done, 600); }
            else { api.sfx('bad'); api.toast('再看看實驗紀錄表想一想！'); }
          } };
        }));
      }
      function has(sub, w) { return records.some(function (r) { return r.sub === sub && r.water === w; }); }
      function draw() {
        var full = st.sub !== 'flour' && st.added > cap();
        var status = st.added === 0 ? '還沒有加入任何東西。' :
          st.sub === 'flour' ? '水變得混濁了，杯底有麵粉沉下來 → 麵粉<b>不會溶解</b>。' :
          full ? '杯底出現溶不掉的' + NAME[st.sub] + '了！這杯水最多只能溶解 <b>' + cap() + '</b> 匙。' :
          '已加入 ' + st.added + ' 匙，全部溶解了（看不見顆粒）。';
        var M = [
          { id: 'm1', t: '50毫升水，最多能溶解幾匙食鹽？', ready: has('salt', 50) },
          { id: 'm2', t: '換成100毫升水，再試一次食鹽', ready: has('salt', 50) && has('salt', 100) },
          { id: 'm3', t: '用50毫升水試試「糖」，和食鹽比一比', ready: has('salt', 50) && has('sugar', 50) },
          { id: 'm4', t: '試試看「麵粉」會不會溶解', ready: records.some(function (r) { return r.sub === 'flour'; }) },
          { id: 'm5', t: '「攪拌」和「不攪拌」各試一次，比較溶解速度', ready: stirSeen.on && stirSeen.off }
        ];
        el.innerHTML = '<div class="labbox dis"><div class="dleft">' + beaker() + '<div class="dstat">' + status + '</div></div><div class="dright">' +
          '<div class="ctl"><b>物質</b>' + ['salt', 'sugar', 'flour'].map(function (k) { return '<button class="btn sm' + (st.sub === k ? ' on' : '') + '" data-sub="' + k + '">' + NAME[k] + '</button>'; }).join('') + '</div>' +
          '<div class="ctl"><b>水量</b>' + [50, 100].map(function (w) { return '<button class="btn sm' + (st.water === w ? ' on' : '') + '" data-wt="' + w + '">' + w + '毫升</button>'; }).join('') + '</div>' +
          '<div class="ctl"><b>攪拌</b><button class="btn sm' + (st.stir ? ' on' : '') + '" data-st="1">攪拌</button><button class="btn sm' + (!st.stir ? ' on' : '') + '" data-st="0">不攪拌</button></div>' +
          '<div class="ctl"><button class="btn go" id="add1">➕ 加一平匙</button><button class="btn" id="add5">➕ 加5匙</button><button class="btn ghost" id="reset">🔄 倒掉重來</button></div>' +
          '<p class="small">⚠️ 換物質或水量時，會自動換一杯新的水（公平實驗：一次只改變一個條件）。</p>' +
          '<h4>📋 實驗紀錄表</h4><div class="tbl"><table><tr><th>物質</th><th>水量</th><th>最多溶解</th></tr>' + (records.map(function (r) { return '<tr><td>' + NAME[r.sub] + '</td><td>' + r.water + '毫升</td><td>' + (r.sub === 'flour' ? '不溶解' : r.max + ' 匙') + '</td></tr>'; }).join('') || '<tr><td colspan="3">還沒有紀錄</td></tr>') + '</table></div>' +
          '<h4>🎯 任務</h4><ul class="mis">' + M.map(function (m) { return '<li class="' + (missions[m.id] ? 'done' : '') + '">' + (missions[m.id] ? '✅' : '⬜') + ' ' + m.t + (!missions[m.id] && m.ready ? ' <button class="btn sm pri" data-ask="' + m.id + '">回答</button>' : '') + '</li>'; }).join('') + '</ul></div></div>' +
          '<div class="card note small">📌 這是<b>模擬實驗</b>：數字是依室溫、平匙估算的大約值，真實實驗會因湯匙大小、水溫而不同。重點是看出「規律」！</div>';
        function newCup() { st.added = 0; st.dissolved = 0; }
        Array.prototype.forEach.call(el.querySelectorAll('[data-sub]'), function (b) { b.onclick = function () { if (st.busy) return; st.sub = b.dataset.sub; newCup(); draw(); }; });
        Array.prototype.forEach.call(el.querySelectorAll('[data-wt]'), function (b) { b.onclick = function () { if (st.busy) return; st.water = +b.dataset.wt; newCup(); draw(); }; });
        Array.prototype.forEach.call(el.querySelectorAll('[data-st]'), function (b) { b.onclick = function () { if (st.busy) return; st.stir = b.dataset.st === '1'; draw(); }; });
        el.querySelector('#add1').onclick = function () { addSpoon(1); };
        el.querySelector('#add5').onclick = function () { addSpoon(5); };
        el.querySelector('#reset').onclick = function () { if (st.busy) return; newCup(); draw(); };
        Array.prototype.forEach.call(el.querySelectorAll('[data-ask]'), function (b) {
          b.onclick = function () {
            var id = b.dataset.ask;
            if (id === 'm1') ask('m1', '50毫升的水，最多能溶解幾匙食鹽？', ['2匙', '3匙', '5匙', '無限多'], 1, '一定量的水，能溶解的食鹽是有限的！');
            if (id === 'm2') ask('m2', '水從50毫升變成100毫升，能溶解的食鹽怎麼樣？', ['變多', '變少', '一樣'], 0, '水越多，能溶解的食鹽越多！');
            if (id === 'm3') ask('m3', '一樣是50毫升的水，糖和食鹽哪一個溶解得比較多？', ['食鹽', '糖', '一樣多'], 1, '不同物質的溶解量不一樣！');
            if (id === 'm4') ask('m4', '麵粉放進水裡會怎麼樣？', ['完全溶解、變透明', '不會溶解，水變混濁，最後沉到杯底'], 1, '麵粉不會溶解在水中。');
            if (id === 'm5') ask('m5', '攪拌的時候，食鹽溶解得比較快還是比較慢？', ['比較快', '比較慢', '一樣'], 0, '攪拌可以讓溶解變快！');
          };
        });
      }
      draw();
    }
  };
})();
