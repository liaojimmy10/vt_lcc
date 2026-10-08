/* =========================================================
   劇本 —— 每一天的價格和新聞，想改梗就動這裡
   close: 當天收盤價
   open:  開盤價（不寫就等於前一天收盤）
   news:  當天新聞（空字串 = 沒新聞，會從 QUIET 挑一句）
   第 0 筆是掛牌日，之後每一筆是一個交易日
   台股漲跌幅上限 10%，漲跌超過 9.5% 會自動顯示漲停／跌停
   ========================================================= */
const DAYS = [
  { open:97, close:100, news:"VT1020 村檉今天掛牌上市，請面試官多多指教 ٩(｡•ω•｡)و" },
  { close:103, news:"創辦了 Threads 跟 X，開始跟觀眾打招呼" },
  { close:113, news:"首次開台順利，聊天室比想像中熱鬧！" },
  { close:110, news:"" },
  { close:100, news:"開台開到一半網路斷線 3 分鐘，畫面停在超憨的表情 (っ °Д °;)っ" },
  { close:108, news:"斷線那張截圖被做成貼圖，大家好像很喜歡 xD" },
  { close:112, news:"" },
  { close:123, news:"連動順利，有很多有趣剪輯 ( ੭ ˙ᗜ˙ )੭" },
  { close:120, news:"" },
  { close:109, news:"忘記開麥克風，自己講了 10 分鐘都沒人聽到 (☍﹏⁰)" },
  { close:117, news:"被發到 Threads，流量意外的好 (｡◕‿◕｡)" },
  { close:125, news:"" },
  { close:114, news:"唱歌被聽眾抓包偷偷降了 5 個 key" },
  { close:124, news:"降 key 版本反而被說很好聽，像深夜電台" },
  { close:135, news:"打開信箱發現收到面試通知，盯著螢幕傻笑了 5 分鐘 ( ੭ ˙ᗜ˙ )੭" },
  { close:148, news:"最後一天了，謝謝面試官陪我看完這 15 天 ٩(｡•ω•｡)و" },
];

/* 沒新聞的日子，收盤價每次開盤隨機上下差幾元
   0 = 完全照劇本；有新聞的日子永遠照劇本，不會變 */
const QUIET_JITTER = 2;

/* 沒新聞的日子隨機挑一句 */
const QUIET = [
  "今日盤勢平淡，村檉在練歌",
  "成交量普通，村檉在外面抓寶可夢",
  "沒什麼消息，村檉在睡覺",
  "盤勢整理中，村檉在想下次開台企畫",
  "今天很安靜，村檉在滑 Threads 跟 X",
];

/* 按觀望時的碎碎念 */
const HOLD_LINES = [
  "面試官選擇觀望，很有耐心！",
  "面試官想再看看，不急不急",
  "面試官很冷靜，一看就是老手",
  "面試官按兵不動，在等更好的時機",
  "先觀察一下，面試官很謹慎 ( ੭ ˙ᗜ˙ )੭",
  "面試官盯著盤面，若有所思⋯",
];

/* 起始資金 */
const START_CASH = 100000;

/* 結算台詞 —— 依照結果挑一段
   {my} = 面試官報酬，{hold} = 抱到最後的報酬
   想換行的地方打 \n */
const ENDINGS = {
  never: {
    title:"竟然可以忍住不買！！",
    text:"錢一塊都沒少，但也錯過了 {hold} 的行情 (´；ω；`)\n面試官是很謹慎的那種人！那從現在開始觀察我也可以 xD",
  },
  beat: {
    title:"比長期持有還會賺？！",
    text:"面試官根本少年股神６６６\n那肯定要選我的對吧！",
  },
  same: {
    title:"第一天就看出這支會漲！",
    text:"一路抱到最後完全沒在怕，面試官的眼光也太準了吧 xD\n那選到我應該也很合理 ٩(｡•ω•｡)و",
  },
  less: {
    title:"有賺錢就是贏！",
    text:"每次出手都有想法，面試官根本是操盤手吧 xD\n這種判斷力拿來挑藝人，應該也會挑到我對吧 ٩(｡•ω•｡)و",
  },
  loss: {
    title:"竟然賠錢了 (´；ω；`)",
    text:"一定是這支股票太難懂，不是面試官的問題！\n要不要乾脆簽下來近距離觀察看看 xD",
  },
};


/* =========================================================
   以下是運作邏輯，平常不用動
   ========================================================= */
const sheet     = document.getElementById("sheet");
const chart     = document.getElementById("chart");
const priceEl   = document.getElementById("price");
const chgEl     = document.getElementById("chg");
const limitEl   = document.getElementById("limit");
const dayLabel  = document.getElementById("dayLabel");
const newsBox   = document.getElementById("news");
const newsText  = document.getElementById("newsText");
const cashEl    = document.getElementById("cash");
const sharesEl  = document.getElementById("shares");
const totalEl   = document.getElementById("total");
const retEl     = document.getElementById("ret");
const buyBtn    = document.getElementById("buyBtn");
const holdBtn   = document.getElementById("holdBtn");
const sellBtn   = document.getElementById("sellBtn");
const note      = document.getElementById("note");
const after     = document.getElementById("after");
const retryBtn  = document.getElementById("retryBtn");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const LAST = DAYS.length - 1;

let BARS = [];
let day, cash, shares, trades, busy, everBought;

const fmt = n => Math.round(n).toLocaleString("zh-TW");
const pct = n => (n > 0 ? "+" : "") + n.toFixed(2) + "%";
const tone = n => n > 0.005 ? "is-up" : n < -0.005 ? "is-down" : "is-flat";
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const change = (from, to) => (to - from) / from * 100;

/* 每次開盤重新算一次開高低收：
   有新聞的日子照劇本，沒新聞的日子隨機差 QUIET_JITTER 元以內，
   而且會確保當天和隔天的漲跌都不超過 10%，不會破壞劇情 */
function buildBars(){
  const closes = DAYS.map(d => d.close);

  for (let i = 1; i <= LAST; i++){
    if (DAYS[i].news) continue;
    const ok = [];
    for (let k = -QUIET_JITTER; k <= QUIET_JITTER; k++){
      const c = DAYS[i].close + k;
      const today = change(closes[i - 1], c);
      const next  = i < LAST ? change(c, closes[i + 1]) : 0;
      if (Math.abs(today) < 10 && Math.abs(next) < 10) ok.push(c);
    }
    if (ok.length) closes[i] = pick(ok);
  }

  BARS = DAYS.map((d, i) => {
    const c = closes[i];
    const o = d.open ?? (i === 0 ? c : closes[i - 1]);
    const body = Math.abs(c - o);
    const prev = i === 0 ? o : closes[i - 1];
    return {
      o, c,
      h: d.high ?? Math.max(o, c) + 1 + body * 0.25,
      l: d.low  ?? Math.min(o, c) - 1 - body * 0.25,
      chg: change(prev, c),
      news: d.news,
    };
  });
}


/* ---------- 畫 K 線 ---------- */
const PAD = { l:10, r:50, t:16, b:30 };
let W = 640, H = 300, FS = 12;

function drawChart(){
  // 手機比較窄：換一個比較矮胖的畫布，字才不會小到看不見
  const narrow = chart.getBoundingClientRect().width < 500;
  W = narrow ? 380 : 640;
  H = narrow ? 260 : 300;
  FS = narrow ? 11 : 12;
  chart.setAttribute("viewBox", `0 0 ${W} ${H}`);

  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  // 價格範圍用整份劇本算，所以後面的天數不會讓圖突然縮放
  // 上下多留一點空間給「買」「賣」記號
  const lo = Math.floor((Math.min(...BARS.map(b => b.l)) - 8) / 10) * 10;
  const hi = Math.ceil ((Math.max(...BARS.map(b => b.h)) + 8) / 10) * 10;
  const y = v => PAD.t + (hi - v) / (hi - lo) * plotH;

  const slot = plotW / DAYS.length;
  const cw = Math.max(6, slot * 0.56);
  const x = i => PAD.l + slot * i + slot / 2;

  let s = "";

  // 格線 + 右邊價格
  const step = (hi - lo) > 60 ? 20 : 10;
  for (let v = lo; v <= hi; v += step){
    s += `<line x1="${PAD.l}" x2="${W - PAD.r}" y1="${y(v)}" y2="${y(v)}" stroke="var(--grid)" stroke-width="1"/>`;
    s += `<text x="${W - PAD.r + 8}" y="${y(v) + 4}" font-size="${FS}" fill="var(--muted)">${v}</text>`;
  }

  // 下面的天數
  for (let i = 0; i <= LAST; i += 5){
    s += `<text x="${x(i)}" y="${H - 8}" font-size="${FS}" fill="var(--muted)" text-anchor="middle">${i === 0 ? "掛牌" : "D" + i}</text>`;
  }

  // K 棒
  for (let i = 0; i <= day; i++){
    const b = BARS[i];
    const color = b.c >= b.o ? "var(--up)" : "var(--down)";
    const top = y(Math.max(b.o, b.c));
    const bh  = Math.max(1.5, Math.abs(y(b.o) - y(b.c)));
    const cls = (i === day && !reduceMotion) ? ' class="candle-new"' : "";
    s += `<g${cls}>`;
    s += `<line x1="${x(i)}" x2="${x(i)}" y1="${y(b.h)}" y2="${y(b.l)}" stroke="${color}" stroke-width="1.6"/>`;
    s += `<rect x="${x(i) - cw / 2}" y="${top}" width="${cw}" height="${bh}" rx="1.5" fill="${color}"/>`;
    s += `</g>`;
  }

  // 買賣記號：買在 K 棒下面，賣在 K 棒上面
  for (const t of trades){
    const b = BARS[t.day];
    if (t.type === "buy"){
      const yy = y(b.l) + 8;
      s += `<path d="M${x(t.day)} ${yy} l6 9 h-12 z" fill="var(--up)"/>`;
      s += `<text x="${x(t.day)}" y="${yy + 22}" font-size="11" font-weight="900" fill="var(--up)" text-anchor="middle">買</text>`;
    } else {
      const yy = y(b.h) - 8;
      s += `<path d="M${x(t.day)} ${yy} l6 -9 h-12 z" fill="var(--down)"/>`;
      s += `<text x="${x(t.day)}" y="${yy - 13}" font-size="11" font-weight="900" fill="var(--down)" text-anchor="middle">賣</text>`;
    }
  }

  // 現價虛線 + 右邊的價格標籤
  const now = BARS[day];
  const nc = now.chg >= 0 ? "var(--up)" : "var(--down)";
  s += `<line x1="${PAD.l}" x2="${W - PAD.r}" y1="${y(now.c)}" y2="${y(now.c)}" stroke="${nc}" stroke-width="1" stroke-dasharray="4 4" opacity=".7"/>`;
  s += `<rect x="${W - PAD.r + 2}" y="${y(now.c) - 10}" width="${PAD.r - 4}" height="20" rx="3" fill="${nc}"/>`;
  s += `<text x="${W - PAD.r / 2}" y="${y(now.c) + 4.5}" font-size="${FS}" font-weight="900" fill="#fff" text-anchor="middle">${now.c}</text>`;

  chart.innerHTML = s;
}


/* ---------- 更新畫面上的數字 ---------- */
function render(){
  const b = BARS[day];

  priceEl.textContent = b.c;
  priceEl.className = "quote-price " + tone(b.chg);
  chgEl.textContent = day === 0 ? "掛牌首日" : pct(b.chg);
  chgEl.className = "quote-chg " + tone(b.chg);

  if (day > 0 && Math.abs(b.chg) >= 9.5){
    limitEl.hidden = false;
    limitEl.textContent = b.chg > 0 ? "漲停" : "跌停";
    limitEl.className = "quote-limit " + tone(b.chg);
  } else {
    limitEl.hidden = true;
  }

  dayLabel.textContent = day === 0 ? `掛牌日 ／ 共 ${LAST} 個交易日` : `第 ${day} ／ ${LAST} 天`;

  newsText.textContent = b.news || pick(QUIET);
  newsBox.classList.remove("is-fresh");
  void newsBox.offsetWidth;            // 讓閃一下的動畫可以重播
  if (b.news) newsBox.classList.add("is-fresh");

  const total = cash + shares * b.c;
  const ret = (total / START_CASH - 1) * 100;
  cashEl.textContent   = fmt(cash);
  sharesEl.textContent = shares + " 股";
  totalEl.textContent  = fmt(total);
  retEl.textContent    = pct(ret);
  retEl.className      = tone(ret);

  buyBtn.disabled  = busy || cash < b.c;
  sellBtn.disabled = busy || shares === 0;
  holdBtn.disabled = busy;

  drawChart();
}


/* ---------- 下單 ---------- */
function trade(type){
  if (busy || day >= LAST) return;
  const p = BARS[day].c;

  if (type === "buy"){
    const n = Math.floor(cash / p);
    if (n === 0) return;
    cash -= n * p;
    shares += n;
    everBought = true;
    trades.push({ day, type });
    note.textContent = `以 ${p} 元買進 ${n} 股`;
  } else if (type === "sell"){
    if (shares === 0) return;
    const n = shares;
    cash += n * p;
    shares = 0;
    trades.push({ day, type });
    note.textContent = `以 ${p} 元賣出 ${n} 股`;
  } else {
    note.textContent = pick(HOLD_LINES);
  }

  nextDay();
}

/* 進到下一天 */
function nextDay(){
  busy = true;
  render();                          // 先把按鈕鎖起來、畫上買賣記號
  setTimeout(() => {
    day++;
    busy = false;
    render();
    if (day >= LAST) finish();
  }, reduceMotion ? 0 : 280);
}


/* ---------- 結算 ---------- */
function finish(){
  busy = true;
  buyBtn.disabled = sellBtn.disabled = holdBtn.disabled = true;

  const last = BARS[LAST].c;
  const myTotal = cash + shares * last;
  const myRet = (myTotal / START_CASH - 1) * 100;

  const holdShares = Math.floor(START_CASH / BARS[0].c);
  const holdTotal = START_CASH - holdShares * BARS[0].c + holdShares * last;
  const holdRet = (holdTotal / START_CASH - 1) * 100;

  let key;
  if (!everBought)                    key = "never";
  else if (myRet < 0)                 key = "loss";
  else if (myRet > holdRet + 0.5)     key = "beat";
  else if (myRet >= holdRet - 0.5)    key = "same";
  else                                key = "less";

  const fill = str => str.replace("{my}", pct(myRet)).replace("{hold}", pct(holdRet));

  document.getElementById("resultTitle").textContent = fill(ENDINGS[key].title);
  document.getElementById("resultText").textContent  = fill(ENDINGS[key].text);

  const myEl = document.getElementById("myRet");
  myEl.textContent = pct(myRet);
  myEl.className = tone(myRet);
  const holdEl = document.getElementById("holdRet");
  holdEl.textContent = pct(holdRet);
  holdEl.className = tone(holdRet);

  note.textContent = "今日收盤，交易結束";

  setTimeout(() => {
    sheet.classList.add("is-stamped");
    setTimeout(() => {
      after.hidden = false;
      after.scrollIntoView({ behavior:"smooth", block:"center" });
    }, 750);
  }, reduceMotion ? 0 : 500);
}


/* ---------- 開盤／重來 ---------- */
function reset(){
  buildBars();                         // 每次開盤，沒新聞的日子重新抽一次價格
  day = 0; cash = START_CASH; shares = 0; trades = []; busy = false; everBought = false;
  sheet.classList.remove("is-stamped");
  after.hidden = true;
  note.textContent = "買進會用掉全部現金，賣出會全部出清";
  render();
}

buyBtn.addEventListener("click",  () => trade("buy"));
sellBtn.addEventListener("click", () => trade("sell"));
holdBtn.addEventListener("click", () => trade("hold"));
retryBtn.addEventListener("click", () => {
  reset();
  window.scrollTo({ top:0, behavior:"smooth" });
});

// 視窗縮放時重畫（手機轉橫向之類的）
window.addEventListener("resize", drawChart);

reset();