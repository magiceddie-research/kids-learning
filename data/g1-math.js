// 一年級上學期 數學（翰林版單元順序）期中考後範圍；題目為原創練習題
(function () {
  function clock(h, m) {
    var ha = ((h % 12) + m / 60) * 30, ma = m * 6, nums = '';
    for (var i = 1; i <= 12; i++) { var a = (i * 30 - 90) * Math.PI / 180; nums += '<text x="' + (60 + Math.cos(a) * 42).toFixed(1) + '" y="' + (64 + Math.sin(a) * 42).toFixed(1) + '" font-size="11" text-anchor="middle" font-family="sans-serif" fill="#1f2340">' + i + '</text>'; }
    return '<svg viewBox="0 0 120 120" class="clock"><circle cx="60" cy="60" r="55" fill="#fff" stroke="#1f2340" stroke-width="5"/>' + nums +
      '<line x1="60" y1="60" x2="60" y2="32" stroke="#e53935" stroke-width="6" stroke-linecap="round" transform="rotate(' + ha + ' 60 60)"/>' +
      '<line x1="60" y1="60" x2="60" y2="16" stroke="#1565c0" stroke-width="4" stroke-linecap="round" transform="rotate(' + ma + ' 60 60)"/><circle cx="60" cy="60" r="5" fill="#1f2340"/></svg>';
  }
  KL.subjects.math1 = {
    id: 'math1', grade: 1, name: '數學', world: '方塊跑酷島', icon: '🟦', theme: 'obby', version: '一上（翰林版單元）',
    intro: '答對一題就跳上一座平台！黃色的平台是陷阱，要看清楚喔。',
    examNote: '📝 一年級的期末模擬考，等收到學校考卷後再加入。',
    units: [
      {
        id: 'm1u6', name: '六、10以內的加法', tag: '新進度', reward: { icon: '🟥', name: '紅色跳跳方塊' },
        preview: [
          { t: '合起來，用加法', b: '<p class="emo">🍎🍎🍎　＋　🍎🍎</p><p>3個蘋果和2個蘋果<b>合起來</b>，</p><p class="emo">3＋2＝5</p>' },
          { t: '加0，還是自己', b: '<p class="emo">🐟🐟🐟🐟　＋　（沒有）</p><p class="emo">4＋0＝4</p><p>加上0，數量不會變。</p>' },
          { t: '湊成10', b: '<p>這些好朋友合起來都是10：</p><p class="emo">1和9　2和8　3和7<br>4和6　5和5</p>' }
        ],
        questions: [
          { type: 'choice', warm: true, q: '🍎🍎🍎 和 🍎🍎 合起來，一共有幾個蘋果？', opts: ['4個', '5個', '6個', '7個'], ans: 1, exp: '3＋2＝5。' },
          { type: 'fill', warm: true, q: '3＋4＝？', ans: ['7'], exp: '3再數4個：4、5、6、7。' },
          { type: 'fill', q: '6＋0＝？', ans: ['6'], exp: '加上0，還是6。' },
          { type: 'fill', q: '0＋0＝？', ans: ['0'], exp: '什麼都沒有，加起來還是0。' },
          { type: 'choice', q: '哪一個算式的答案是8？', opts: ['4＋3', '5＋3', '6＋3', '2＋5'], ans: 1, exp: '5＋3＝8。' },
          { type: 'fill', q: '7＋（　）＝10，括號要填多少？', ans: ['3'], exp: '7和3是好朋友，合起來是10。' },
          { type: 'choice', warm: true, q: '樹上有4隻小鳥，又飛來3隻。現在樹上有幾隻小鳥？', opts: ['1隻', '7隻', '4隻', '3隻'], ans: 1, keys: ['又飛來'], exp: '又飛來，就是變多了：4＋3＝7。' },
          { type: 'choice', q: '哥哥有5顆糖，弟弟有2顆糖，妹妹有3塊餅乾。哥哥和弟弟一共有幾顆糖？', opts: ['7顆', '10顆', '8顆', '5顆'], ans: 0, keys: ['哥哥和弟弟'], trap: 'extra', exp: '只要算哥哥和弟弟的糖：5＋2＝7。', trapNote: '妹妹的餅乾不用算！' },
          { type: 'tf', q: '2＋5和5＋2的答案一樣。', ans: true, exp: '前後交換，答案都是7。' },
          { type: 'fill', q: '5＋5＝？', ans: ['10'], exp: '5和5合起來是10。' },
          { type: 'choice', q: '哪兩個數合起來是10？', opts: ['3和6', '4和6', '5和4', '2和7'], ans: 1, exp: '4＋6＝10。' },
          { type: 'order', q: '把算式的答案「由小到大」排好。', items: ['1＋1', '2＋3', '4＋4'], keys: ['由小到大'], trap: 'order', exp: '1＋1＝2，2＋3＝5，4＋4＝8。' },
          { type: 'fill', q: '盒子裡有6顆球，再放進幾顆，就會有9顆球？', ans: ['3'], trap: 'reverse', exp: '6再數到9：7、8、9，多了3顆。' }
        ]
      },
      {
        id: 'm1u7', name: '七、10以內的減法', tag: '新進度', reward: { icon: '🟨', name: '黃色彈簧方塊' },
        preview: [
          { t: '拿走、吃掉、飛走，用減法', b: '<p class="emo">🍪🍪🍪🍪🍪</p><p>吃掉2塊，還剩幾塊？</p><p class="emo">5－2＝3</p>' },
          { t: '減0和減光光', b: '<p class="emo">7－0＝7</p><p>沒有拿走，還是一樣多。</p><p class="emo">6－6＝0</p><p>全部拿走，就是0。</p>' },
          { t: '加法和減法是好朋友', b: '<p class="emo">4＋5＝9</p><p>所以</p><p class="emo">9－5＝4</p>' }
        ],
        questions: [
          { type: 'fill', warm: true, q: '8－3＝？', ans: ['5'], exp: '8往回數3個：7、6、5。' },
          { type: 'choice', warm: true, q: '🍪🍪🍪🍪🍪 吃掉2塊，還剩幾塊？', opts: ['3塊', '7塊', '2塊', '5塊'], ans: 0, exp: '5－2＝3。' },
          { type: 'fill', q: '6－6＝？', ans: ['0'], exp: '全部拿走，剩下0。' },
          { type: 'fill', q: '7－0＝？', ans: ['7'], exp: '沒有拿走，還是7。' },
          { type: 'choice', warm: true, q: '池塘裡有9隻青蛙，跳走了4隻，還剩幾隻？', opts: ['13隻', '5隻', '4隻', '9隻'], ans: 1, keys: ['跳走了', '還剩'], exp: '跳走了，就變少：9－4＝5。' },
          { type: 'choice', q: '姊姊有7本書，妹妹有4本書。姊姊比妹妹多幾本？', opts: ['3本', '11本', '4本', '7本'], ans: 0, keys: ['多幾本'], trap: 'compare', exp: '比一比相差多少，用減法：7－4＝3。' },
          { type: 'tf', q: '10－1＝9。', ans: true, exp: '10少1是9。' },
          { type: 'choice', q: '停車場有8台車，開走了3台。「開走」的有幾台？', opts: ['5台', '3台', '8台', '11台'], ans: 1, keys: ['「開走」的'], trap: 'ask', exp: '題目問的是開走的，就是3台，不用算！', trapNote: '看清楚問什麼：問的是「開走的」，不是「剩下的」。' },
          { type: 'fill', q: '5＋4＝9，所以9－4＝？', ans: ['5'], exp: '加法和減法是好朋友。' },
          { type: 'choice', q: '哪一個算式的答案最大？', opts: ['9－1', '7－5', '6－3', '10－9'], ans: 0, exp: '答案分別是8、2、3、1，最大的是8。' },
          { type: 'fill', q: '（　）－2＝6，括號要填多少？', ans: ['8'], trap: 'reverse', exp: '拿走2個還剩6個，原來有6＋2＝8個。' },
          { type: 'choice', q: '下面哪一個答案「不是」5？', opts: ['9－4', '8－3', '7－3', '5－0'], ans: 2, keys: ['不是'], trap: 'negate', exp: '7－3＝4，不是5。' }
        ]
      },
      {
        id: 'm1u8', name: '八、30以內的數', tag: '新進度', reward: { icon: '🟩', name: '綠色數字方塊' },
        preview: [
          { t: '10個一，就是1個十', b: '<p class="emo">🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦</p><p>10個一，合起來是<b>1個十</b>。</p><p>1個十和3個一，就是<b>13</b>。</p>' },
          { t: '數到30', b: '<p class="emo">……18、19、20、21……29、30</p><p>2個十是20，3個十是30。</p>' },
          { t: '比大小：先看十位', b: '<p>23和19，哪個大？</p><p>先看<b>十</b>：2個十比1個十多，所以<b>23比較大</b>。</p>' }
        ],
        questions: [
          { type: 'choice', warm: true, q: '1個十和3個一，合起來是多少？', opts: ['13', '31', '4', '103'], ans: 0, trap: 'intuition', exp: '1個十是10，再加3是13。' },
          { type: 'fill', q: '2個十是多少？', ans: ['20'], exp: '10、20。' },
          { type: 'fill', warm: true, q: '18的下一個數是多少？', ans: ['19'], exp: '18、19。' },
          { type: 'fill', q: '排在25前面的一個數是多少？', ans: ['24'], exp: '24、25。' },
          { type: 'choice', q: '哪一個數最大？', opts: ['19', '23', '21', '9'], ans: 1, exp: '23有2個十，比較大；23又比21大。' },
          { type: 'choice', q: '哪一個數最小？', opts: ['12', '21', '20', '30'], ans: 0, exp: '12只有1個十，最小。' },
          { type: 'order', q: '把數「由大到小」排好。', items: ['28', '17', '9'], keys: ['由大到小'], trap: 'order', exp: '28最大，9最小。' },
          { type: 'fill', q: '2個十和5個一，合起來是多少？', ans: ['25'], exp: '20和5合起來是25。' },
          { type: 'fill', q: '30是幾個十？', ans: ['3'], exp: '10、20、30，是3個十。' },
          { type: 'choice', q: '小明排在第7個，小華排在小明「後面」第2個。小華排在第幾個？', opts: ['第5個', '第9個', '第2個', '第7個'], ans: 1, keys: ['後面'], trap: 'order', exp: '往後數2個：8、9，是第9個。' },
          { type: 'tf', q: '13和31一樣大。', ans: false, trap: 'intuition', exp: '13是1個十3個一，31是3個十1個一，31比較大。' },
          { type: 'fill', q: '找規律：10、12、14、16、（　）', ans: ['18'], exp: '每次多2。' }
        ]
      },
      {
        id: 'm1u9', name: '九、時間', tag: '新進度', reward: { icon: '⏰', name: '時鐘方塊' },
        preview: [
          { t: '看時鐘：幾點鐘', b: clock(3, 0) + '<p><b>短針</b>（紅色）指著3，<b>長針</b>（藍色）指著12，就是<b>3點</b>。</p>' },
          { t: '看時鐘：幾點半', b: clock(7, 30) + '<p>長針指著<b>6</b>，短針在7和8的中間，就是<b>7點半</b>。</p>' },
          { t: '事情的先後', b: '<p>起床 → 刷牙洗臉 → 吃早餐 → 上學</p><p>想一想：先做什麼？再做什麼？</p>' }
        ],
        questions: [
          { type: 'choice', warm: true, q: '時鐘上是幾點？', svg: clock(3, 0), opts: ['3點', '12點', '9點', '6點'], ans: 0, exp: '短針指3，長針指12，是3點。' },
          { type: 'choice', warm: true, q: '時鐘上是幾點？', svg: clock(7, 30), opts: ['7點半', '6點半', '7點', '8點半'], ans: 0, exp: '長針指6是半點；短針在7和8中間，是7點半。' },
          { type: 'choice', q: '時鐘上是幾點？', svg: clock(5, 30), opts: ['5點半', '6點半', '6點', '5點'], ans: 0, trap: 'intuition', exp: '短針已經走過5、還沒到6，是5點半。', trapNote: '短針靠近6，但還沒到6，所以不是6點半！' },
          { type: 'choice', q: '整點的時候，長針指著哪一個數？', opts: ['12', '6', '3', '9'], ans: 0, exp: '整點時，長針指著12。' },
          { type: 'choice', q: '幾點半的時候，長針指著哪一個數？', opts: ['12', '6', '3', '1'], ans: 1, exp: '半點時，長針指著6。' },
          { type: 'order', q: '早上的事情，請照先後排好。', items: ['起床', '刷牙洗臉', '吃早餐', '出門上學'], trap: 'order', exp: '先起床，再刷牙洗臉、吃早餐，最後上學。' },
          { type: 'choice', q: '下面哪一件事，通常在「晚上」做？', opts: ['吃早餐', '升旗', '睡覺', '上學'], ans: 2, keys: ['晚上'], exp: '晚上要睡覺。' },
          { type: 'choice', q: '小美8點到學校，小強7點半到學校。誰比較早到？', opts: ['小美', '小強', '一樣早'], ans: 1, trap: 'intuition', exp: '7點半比8點早。', trapNote: '8比7大，但「8點」比「7點半」晚喔！' },
          { type: 'choice', q: '現在是2點，再過1小時是幾點？', opts: ['1點', '3點', '2點半', '12點'], ans: 1, exp: '2點過1小時是3點。' },
          { type: 'choice', q: '時鐘上是幾點？', svg: clock(12, 0), opts: ['12點', '6點', '1點', '11點'], ans: 0, exp: '長針和短針都指著12，是12點。' },
          { type: 'choice', q: '9點半的時候，短針在哪裡？', opts: ['剛好指著9', '在9和10的中間', '剛好指著10', '在8和9的中間'], ans: 1, trap: 'intuition', exp: '9點半時，短針走到9和10的中間。' },
          { type: 'tf', q: '幾點半的時候，長針會指著6。', ans: true, exp: '對，半點長針指6。' }
        ]
      }
    ],
    exams: []
  };
})();
