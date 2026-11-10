// 一年級注音字型的「破音字」設定
// 字型：字嗨注音標楷（ButTaiwan/bpmfvs，SIL OFL 1.1），預設顯示第一個讀音；
// 下列詞語中的字改用第 n 個讀音（以異體字選擇子 U+E01E0+n 指定）。
// 格式：[詞語, 詞語中第幾個字(從0算), 讀音序號(0=第一個讀音)]
KL.IVS_RULES = [
  ['長輩', 0, 1], ['長得', 0, 1],                 // ㄓㄤˇ
  ['睡覺', 1, 1], ['大覺', 1, 1],                 // ㄐㄧㄠˋ
  ['得', 0, 1],                                   // ˙ㄉㄜ（覺得、找得到、長得）
  ['樂器', 0, 1], ['音樂', 1, 1],                 // ㄩㄝˋ
  ['部分', 1, 1],                                 // ㄈㄣˋ
  ['空地', 0, 1],                                 // ㄎㄨㄥˋ
  ['聲調', 1, 1],                                 // ㄉㄧㄠˋ
  ['再數', 1, 1], ['回數', 1, 1], ['後數', 1, 1], ['數到', 0, 1], ['數錢', 0, 1], // ㄕㄨˇ（動詞）
  ['句子', 1, 1], ['盒子', 1, 1], ['笛子', 1, 1], ['粽子', 1, 1], ['罐子', 1, 1], ['豆子', 1, 1], ['車子', 1, 1], // ˙ㄗ
  ['耳朵', 1, 1], ['嘴巴', 1, 1], ['東西', 1, 1], // 輕聲
  ['哥哥', 1, 1], ['妹妹', 1, 1], ['弟弟', 1, 1], ['姊姊', 1, 1], ['媽媽', 1, 1], ['爸爸', 1, 1], ['謝謝', 1, 1] // 疊字輕聲
];
KL.applyIVS = (function () {
  var rules = KL.IVS_RULES.slice().sort(function (a, b) { return b[0].length - a[0].length; });
  var isVS = function (cp) { return cp >= 0xE01E0 && cp <= 0xE01EF; };
  return function (text) {
    var chars = Array.from(String(text)), out = [], i = 0;
    while (i < chars.length) {
      var hit = null;
      for (var r = 0; r < rules.length; r++) {
        var w = Array.from(rules[r][0]), ok = true;
        for (var k = 0; k < w.length; k++) if (chars[i + k] !== w[k]) { ok = false; break; }
        if (ok) { hit = rules[r]; break; }
      }
      if (!hit) { out.push(chars[i]); i++; continue; }
      var wl = Array.from(hit[0]);
      for (var k2 = 0; k2 < wl.length; k2++) {
        out.push(chars[i + k2]);
        var nx = chars[i + k2 + 1];
        if (k2 === hit[1] && hit[2] > 0 && !(nx && isVS(nx.codePointAt(0)))) out.push(String.fromCodePoint(0xE01E0 + hit[2]));
      }
      i += wl.length;
    }
    return out.join('');
  };
})();
