// 一年級上學期 國語（康軒版）期中考後範圍：首冊注音之後的一上第一冊
// 依一上學習重點（注音拼讀、常用字、句子）自編，非課本原文
// plain:true 的題目用一般字型顯示（避免注音字型直接顯示答案）
(function () {
  KL.subjects.chinese1 = {
    id: 'chinese1', grade: 1, name: '國語', world: '精靈森林', icon: '🌳', theme: 'forest', version: '一上（康軒版學習重點）',
    intro: '每個單元的小考拿到80分以上，就能收服一隻森林精靈！按 🔊 可以聽題目。',
    examNote: '📝 一年級的期末模擬考，等收到學校考卷後再加入。',
    units: [
      {
        id: 'c1u1', name: '注音練功房', note: '拼音、聲調、認讀', tag: '複習加強', reward: { icon: '🐣', name: '注音小雞' },
        preview: [
          { t: '聲調有四個好朋友', b: '<p class="plainf">一聲：不用標　ㄇㄚ</p><p class="plainf">二聲：ˊ　ㄇㄚˊ</p><p class="plainf">三聲：ˇ　ㄇㄚˇ</p><p class="plainf">四聲：ˋ　ㄇㄚˋ</p><p class="plainf">輕聲：˙　˙ㄇㄚ</p>' },
          { t: '兩個符號拼起來', b: '<p class="emo plainf">ㄇ ＋ ㄚ ＝ ㄇㄚ</p><p class="emo plainf">ㄉ ＋ ㄚ ＝ ㄉㄚ</p>' },
          { t: '三個符號拼起來', b: '<p class="emo plainf">ㄏ ＋ ㄨ ＋ ㄚ ＝ ㄏㄨㄚ</p><p class="emo plainf">ㄒ ＋ ㄧ ＋ ㄠ ＝ ㄒㄧㄠ</p>' }
        ],
        questions: [
          { type: 'choice', warm: true, plain: true, q: '「ㄇ」和「ㄚ」拼起來是什麼？', opts: ['ㄇㄚ', 'ㄚㄇ', 'ㄇㄛ', 'ㄋㄚ'], ans: 0, exp: 'ㄇ在前面，ㄚ在後面：ㄇㄚ。' },
          { type: 'choice', warm: true, plain: true, q: '「ㄏ、ㄨ、ㄚ」拼起來是什麼？', opts: ['ㄏㄨㄚ', 'ㄏㄚ', 'ㄨㄏㄚ', 'ㄏㄚㄨ'], ans: 0, exp: '照順序拼：ㄏㄨㄚ。' },
          { type: 'choice', plain: true, q: '下面哪一個是「三聲」？', opts: ['ㄇㄚˇ', 'ㄇㄚˊ', 'ㄇㄚˋ', 'ㄇㄚ'], ans: 0, exp: '三聲的符號是ˇ。' },
          { type: 'choice', plain: true, q: '一聲要怎麼標？', opts: ['不用標', '標ˊ', '標ˇ', '標˙'], ans: 0, exp: '一聲不用標聲調符號。' },
          { type: 'choice', warm: true, plain: true, q: '「花」的注音是哪一個？', opts: ['ㄏㄨㄚ', 'ㄏㄚ', 'ㄈㄚ', 'ㄏㄨㄛ'], ans: 0, trap: 'similar', exp: '花：ㄏㄨㄚ。' },
          { type: 'choice', plain: true, q: '「手」的注音是哪一個？', opts: ['ㄕㄡˇ', 'ㄙㄡˇ', 'ㄕㄡ', 'ㄕㄛˇ'], ans: 0, trap: 'similar', exp: '手：ㄕㄡˇ，是捲舌的ㄕ，三聲。', trapNote: 'ㄕ和ㄙ聽起來很像，要小心！' },
          { type: 'choice', plain: true, q: '「大」的注音是哪一個？', opts: ['ㄉㄚˋ', 'ㄉㄚ', 'ㄊㄚˋ', 'ㄉㄚˇ'], ans: 0, exp: '大：ㄉㄚˋ，四聲。' },
          { type: 'choice', plain: true, q: '「山」的注音是哪一個？', opts: ['ㄕㄢ', 'ㄙㄢ', 'ㄕㄤ', 'ㄕㄢˇ'], ans: 0, trap: 'similar', exp: '山：ㄕㄢ，一聲不用標。' },
          { type: 'choice', plain: true, q: '「月」的注音是哪一個？', opts: ['ㄩㄝˋ', 'ㄧㄝˋ', 'ㄩㄝ', 'ㄩㄢˋ'], ans: 0, exp: '月：ㄩㄝˋ。' },
          { type: 'choice', plain: true, q: '「小」的注音是哪一個？', opts: ['ㄒㄧㄠˇ', 'ㄒㄧㄠ', 'ㄒㄩㄠˇ', 'ㄙㄧㄠˇ'], ans: 0, exp: '小：ㄒㄧㄠˇ，三聲。' },
          { type: 'tf', plain: true, q: '「ㄇㄠ」是一聲，不用標聲調符號。', ans: true, exp: '一聲不用標。' },
          { type: 'choice', plain: true, q: '「ㄉㄚˋ」是哪一個字的音？', opts: ['大', '打', '他', '拉'], ans: 0, exp: '大：ㄉㄚˋ；打是ㄉㄚˇ。' }
        ]
      },
      {
        id: 'c1u2', name: '認字小達人', note: '相反詞、量詞、長得像的字', tag: '新進度', reward: { icon: '🐰', name: '識字小兔' },
        preview: [
          { t: '相反的字', b: '<p class="emo">大 ↔ 小　　上 ↔ 下</p><p class="emo">左 ↔ 右　　多 ↔ 少</p><p class="emo">長 ↔ 短　　黑 ↔ 白</p>' },
          { t: '一隻、一朵、一條', b: '<p class="emo">一隻小狗 🐶</p><p class="emo">一朵紅花 🌺</p><p class="emo">一條小路 🛤️</p><p class="emo">一本書 📕</p>' },
          { t: '長得很像的字', b: '<p class="emo">人　入　八</p><p class="emo">日　目　月</p><p>看清楚每一筆，不要認錯了！</p>' }
        ],
        questions: [
          { type: 'choice', warm: true, q: '「大」的相反是什麼？', opts: ['小', '多', '上', '長'], ans: 0, exp: '大和小相反。' },
          { type: 'choice', warm: true, q: '「上」的相反是什麼？', opts: ['下', '左', '右', '大'], ans: 0, exp: '上和下相反。' },
          { type: 'choice', q: '「長」的相反是什麼？', opts: ['短', '小', '少', '高'], ans: 0, exp: '長和短相反。' },
          { type: 'choice', q: '一（　）小狗', opts: ['隻', '朵', '條', '本'], ans: 0, exp: '一隻小狗。' },
          { type: 'choice', q: '一（　）紅花', opts: ['朵', '隻', '條', '本'], ans: 0, exp: '一朵紅花。' },
          { type: 'choice', q: '一（　）小路', opts: ['條', '朵', '隻', '本'], ans: 0, exp: '一條小路。' },
          { type: 'choice', q: '「我有兩隻手。」「兩」是多少？', opts: ['2', '1', '3', '10'], ans: 0, exp: '兩就是2。' },
          { type: 'choice', q: '哪一個是「月亮」的「月」？', opts: ['月', '日', '目', '用'], ans: 0, trap: 'similar', exp: '月亮的月。日、目長得很像，要看清楚。' },
          { type: 'choice', q: '哪一個是「人」？', opts: ['人', '入', '八', '大'], ans: 0, trap: 'similar', exp: '人：左邊長、右邊短。入是相反。' },
          { type: 'choice', q: '下面哪一個「不是」身體的一部分？', opts: ['手', '口', '山', '耳'], ans: 2, keys: ['不是'], trap: 'negate', exp: '山不是身體的一部分。' },
          { type: 'choice', q: '「白花」的「白」，說的是什麼？', opts: ['顏色', '數字', '動物', '方向'], ans: 0, exp: '白是一種顏色。' },
          { type: 'tf', q: '「多」的相反是「少」。', ans: true, exp: '多和少相反。' }
        ]
      },
      {
        id: 'c1u3', name: '句子小舞台', note: '排句子、句號問號、讀短文', tag: '新進度', reward: { icon: '🦋', name: '句子蝴蝶' },
        preview: [
          { t: '句子說完了，加句號', b: '<p class="emo">我會拍手。</p><p>一句話說完了，後面要加<b>句號「。」</b>。</p>' },
          { t: '問問題，用問號', b: '<p class="emo">這是誰的書包？</p><p>在<b>問問題</b>的句子，後面加<b>問號「？」</b>。</p>' },
          { t: '把字排成句子', b: '<p class="emo">天上　有　白白的　雲</p><p>排好就是：<b>天上有白白的雲。</b></p>' }
        ],
        questions: [
          { type: 'order', warm: true, q: '把字排成一句話。', items: ['天上', '有', '白白的', '雲'], exp: '天上有白白的雲。' },
          { type: 'order', q: '把字排成一句話。', items: ['小狗', '在', '草地上', '跑來跑去'], exp: '小狗在草地上跑來跑去。' },
          { type: 'choice', warm: true, q: '「你喜歡吃蘋果嗎（　）」括號裡要放什麼？', opts: ['？', '。', '、', '：'], ans: 0, exp: '這是在問問題，用問號。' },
          { type: 'choice', q: '「今天天氣很好（　）」括號裡要放什麼？', opts: ['。', '？', '、', '：'], ans: 0, exp: '一句話說完，用句號。' },
          { type: 'choice', q: '「這是誰的鉛筆？」這句話是在做什麼？', opts: ['問問題', '說謝謝', '說再見', '唱歌'], ans: 0, exp: '問號表示在問問題。' },
          { type: 'choice', q: '下面哪一句「不是」問問題的句子？', opts: ['你好嗎？', '這是誰的？', '我會拍手。', '你要去哪裡？'], ans: 2, keys: ['不是'], trap: 'negate', exp: '「我會拍手。」是說一件事，不是問問題。' },
          { type: 'choice', q: '「我每天（　）上學。」括號裡放哪一個最好？', opts: ['走路', '花朵', '紅色', '小狗'], ans: 0, exp: '我每天走路上學。' },
          { type: 'choice', q: '哪一句話最有禮貌？', opts: ['謝謝你借我鉛筆。', '給我鉛筆！', '鉛筆拿來。', '不要吵。'], ans: 0, trap: 'situation', exp: '說「謝謝」很有禮貌。' },
          { type: 'choice', q: '「小白兔跳跳跳。」是誰在跳？', opts: ['小白兔', '小狗', '我', '小鳥'], ans: 0, exp: '是小白兔在跳。' },
          { type: 'choice', passage: '小花貓，喵喵叫，跑到樹下睡大覺。', q: '小花貓跑到哪裡睡覺？', opts: ['樹下', '床上', '屋頂', '草地'], ans: 0, exp: '跑到樹下睡大覺。' },
          { type: 'multi', passage: '天黑了，月亮出來了，星星也出來了，大家都去睡覺了。', q: '天黑了以後，什麼出來了？（要全部選對）', opts: ['月亮', '星星', '太陽', '小鳥'], ans: [0, 1], trap: 'multi', exp: '月亮和星星都出來了。' },
          { type: 'tf', q: '一句話說完了，要加句號「。」。', ans: true, exp: '對！' }
        ]
      }
    ],
    exams: []
  };
})();
