/* =========================================================
   影片清單 —— 之後要加影片，只要在這裡多加一筆就好
   ---------------------------------------------------------
   type: "yt"    → id 填 YouTube 影片 ID
                   例：https://youtu.be/Y9oftrjERn0 → id: "Y9oftrjERn0"

   type: "drive" → id 填 Google Drive 檔案 ID
                   例：https://drive.google.com/file/d/1ABCxyz/view → id: "1ABCxyz"
                   （記得把權限開成「知道連結的任何人」）

   type: "pdf"   → src 填 PDF 在資料夾裡的路徑
                   跟 index.html 同一層就直接寫檔名

   cover: 自己指定縮圖（選填）。沒填的話 YouTube 會自動抓官方縮圖，
          其他來源則顯示 0.png
   tag:   分類名稱，上面的分類按鈕會自動長出來
   ========================================================= */
const VIDEOS = [
  { type:"yt", id:"9EDGN0qlvYQ", tag:"自我介紹",
    title:"自我介紹",
    desc:"綽號、個性、學經歷、遊戲小插曲" },

  { type:"yt", id:"Y9oftrjERn0", tag:"遊戲",
    title:"Valorant 搞笑日常",
    desc:"外掛爭議、左右不分、隊友崩潰" },

  { type:"yt", id:"9WHVnn0Bvj8", tag:"雜談",
    title:"模擬雜談：澳洲留學那兩年",
    desc:"申請退學、被搭訕（結果是⋯）" },

  { type:"yt", id:"LWTBrw22Ig4", tag:"唱歌",
    title:"當你（清唱版）",
    desc:"無伴奏版 (全是感情 1.0)" },

  { type:"yt", id:"IYTQ_HgJFok", tag:"唱歌",
    title:"怎麼了（伴奏版）",
    desc:"有伴奏版 (全是感情 2.0)" },

  { type:"yt", id:"bernGE0eLxo", tag:"其他",
    title:"講笑話",
    desc:"哈哈哈，笑一個嘛~" },

  { type:"pdf", src:"Chuncheng_Liao_Resume.pdf", cover:"cv.jpg", tag:"其他",
    title:"個人履歷",
    desc:"學經歷與工作經驗，點開可直接翻閱。" },
];


/* =========================================================
   抽卡的卡池 —— 想加想改就動這裡
   ---------------------------------------------------------
   r: 稀有度，由低到高："R" / "SR" / "SSR" / "UR" / "LR"，顏色會跟著變

   d 裡面可以放連結，兩種寫法：

   1) 指到自己網站上的影片（會直接打開站內的播放視窗，最推薦）
      [顯示的文字](影片標題)
      括號裡要跟上面 VIDEOS 的 title 一模一樣，例：
      "真的很推 [Valorant 搞笑日常](Valorant 搞笑日常) 這部 xDD"

   2) 外部網址（開新分頁）
      [顯示的文字](https://youtu.be/xxxx)
      直接貼一串 https:// 開頭的網址也會自動變成連結
   ========================================================= */
const CARDS = [

  { r:"LR", t:"開心卡",
    d:"恭喜抽到開心卡！就只是想跟你說一句：祝你天天開心，好好享受當下的生活~ 今天辛苦了，剩下的時間就放鬆一下吧 xD 啊⋯但還是要把我的徵選檔案看完喔!! 我很期待可以收到您們的回覆~" },

  { r:"UR", t:"人生最想炫耀的事",
    d:"在澳洲唸書的時候被搭訕過，一開始還想說欸我是不是滿有魅力的，結果後來發現自己只是對方的備胎 Q_Q 但至少證明我曾經被搭訕過一次 xDD" },

  { r:"SSR", t:"名字由來",
    d:"「檉」打字要打 ㄔㄥ，但念的話要念 ㄕㄥˋ。算命師說因為我屬老虎，名字裡不能有太陽跟水，老虎要有很多木頭才好，所以直接加上雙木 Buff xDD" },

  { r:"SSR", t:"十幾年沒吃過牛肉",
    d:"很多位算命師說我吃牛會變不聰明，所以從小學到現在一口都沒碰過。但我感覺好像沒吃牛也沒有比較聰明 Q_Q" },

  { r:"SSR", t:"左右不分",
    d:"熱愛FPS遊戲，但有時候會左右不分，請見諒xDD" },

  { r:"SR", t:"遊戲協咖",
    d:"真的很大推 [Valorant 搞笑日常](Valorant 搞笑日常) 這一部影片，裡面有很多我在遊戲裡的真實反應。" },

  { r:"SR", t:"唱歌全是感情",
    d:"好想要當唱歌好聽的人!! 但我好像都只有滿滿的感情..." },

  { r:"SR", t:"退學",
    d:"澳洲碩士第一學期壓力大到去查退學規定，還記得開學前申請可以退九成學費、宿舍扣兩周押金（記憶超深 xDD）。那兩年的事我錄成了一支 [模擬雜談](模擬雜談：澳洲留學那兩年)，講得比這裡完整多了。" },

  { r:"R", t:"抽象派畫家",
    d:"從國高中就發現自己沒什麼繪畫天分，畫出來都非常抽象 Q_Q " },

  { r:"R", t:"系上冠軍",
    d:"傳說對決是大一跟朋友入坑的。高三的時候我還覺得玩傳說的都蠻屁孩，結果自己大一就變成那個屁孩，還一路打到系上比賽拿冠軍。" },

  { r:"R", t:"日常生活",
    d:"在 WorldQuant BRAIN 當獨立研究顧問，研究量化交易策略、寫 Python 做自動化。今年七月拿到 Grandmaster，全球前 2% (拍手!)。" },
];


/* =========================================================
   以下是頁面運作的邏輯，平常不用改
   ========================================================= */
const grid        = document.getElementById("grid");
const chips       = document.getElementById("chips");
const dlg         = document.getElementById("player");
const slot        = document.getElementById("slot");
const playerTitle = document.getElementById("playerTitle");


// 依照來源產生對應的嵌入網址
function embedUrl(v){
  if (v.type === "pdf")   return v.src;
  if (v.type === "drive") return `https://drive.google.com/file/d/${v.id}/preview`;
  return `https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`;
}

// 縮圖。有指定 cover 就用它，YouTube 自動抓官方縮圖，其他顯示 0.png
function thumb(v){
  if (v.cover) return `<img class="fit" src="${v.cover}" alt="" loading="lazy">`;
  if (v.type !== "yt") return `<div class="fallback"></div>`;
  return `<img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy"
           onerror="this.outerHTML='&lt;div class=&quot;fallback&quot;&gt;&lt;/div&gt;'">`;
}

// 依分類把卡片畫出來
function render(tag){
  const list = tag === "全部" ? VIDEOS : VIDEOS.filter(v => v.tag === tag);

  grid.innerHTML = list.map(v => `
    <button class="card" data-i="${VIDEOS.indexOf(v)}">
      <div class="thumb">
        ${thumb(v)}
        <span class="play" aria-hidden="true">
          <svg viewBox="0 0 12 14"><path d="M1 1l10 6-10 6z" fill="currentColor"/></svg>
        </span>
      </div>
      <div class="meta">
        <span class="tag">${v.tag}</span>
        <h3>${v.title}</h3>
        <p>${v.desc || ""}</p>
      </div>
    </button>`).join("");
}

// 從影片清單自動長出分類按鈕
const tags = ["全部", ...new Set(VIDEOS.map(v => v.tag))];
chips.innerHTML = tags.map((t,i) =>
  `<button class="chip" aria-pressed="${i === 0}">${t}</button>`).join("");

// 點分類按鈕
chips.addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  chips.querySelectorAll(".chip").forEach(c =>
    c.setAttribute("aria-pressed", c === btn));
  render(btn.textContent);
});

// 打開播放視窗（卡片和抽卡裡的連結都走這裡）
function openVideo(v){
  if (!v) return;
  playerTitle.textContent = v.title;

  // PDF 用直立比例，影片用 16:9
  const ratio = v.type === "pdf" ? "3/4" : "16/9";

  slot.innerHTML = `<iframe src="${embedUrl(v)}" title="${v.title}"
    style="aspect-ratio:${ratio}"
    allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;

  dlg.showModal();
}

// 點卡片開視窗
grid.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;
  openVideo(VIDEOS[card.dataset.i]);
});

// 關掉視窗時清空 iframe，影片才會真的停止
document.getElementById("closeBtn").addEventListener("click", () => dlg.close());
dlg.addEventListener("close", () => { slot.innerHTML = ""; });
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

// 第一次載入先顯示全部
render("全部");


/* =========================================================
   抽卡
   ---------------------------------------------------------
   用「抽卡袋」的方式：整副卡洗過之後一張一張抽，不會重複。
   抽完最後一張就停下來，先給一張完成卡，想再玩才重新洗牌。
   次數和進度都只存在記憶體裡，重新整理就會全部歸零，
   每個人打開網站都是從第 1 抽開始。
   ========================================================= */

// 抽完全部之後跳出來的那張。文字想改就改這裡
const FINISH_CARD = {
  t:"全部翻完了！",
  d:"恭喜⋯居然真的一張一張看到最後 xDD 願意在這裡多花這幾分鐘的人其實不多，謝謝你。上面的影片也都可以直接點開來看看，那些才是我真正想給你看的東西。想再抽一輪也可以，內容不會變，但我會很開心 Q_Q"
};

const gachaBtn    = document.getElementById("gachaBtn");
const gachaDlg    = document.getElementById("gachaDialog");
const gachaCard   = document.getElementById("gachaCard");
const gachaRarity = document.getElementById("gachaRarity");
const gachaTitle  = document.getElementById("gachaTitle");
const gachaText   = document.getElementById("gachaText");
const gachaMeta   = document.getElementById("gachaMeta");
const gachaCount  = document.getElementById("gachaCount");
const gachaAgain  = document.getElementById("gachaAgain");
const gachaFx     = document.getElementById("gachaFx");
const gachaProg   = document.getElementById("gachaProgress");

let bag   = [];        // 這一輪還沒抽到的卡（存索引）
let count = 0;         // 這次造訪抽了幾次
let round = 0;         // 這次造訪完成幾輪
let mode  = "draw";    // draw = 再抽一張 / finish = 看結果 / reset = 重新洗牌
const seen = new Set();               // 這一輪已經抽到的卡（存索引）
const TIERS = ["LR","UR","SSR","SR","R"];   // 由高排到低

updateTip();

function updateTip(){
  gachaCount.textContent = count ? `已抽 ${count} 次` : "";
}

// 把 d 裡面的 [文字](目標) 和裸網址變成可以點的連結
function escapeHtml(s){
  return s.replace(/[&<>"]/g, m =>
    ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[m]));
}

function richText(s){
  let html = escapeHtml(s);

  // [文字](目標)：目標對得到影片標題就開站內播放器，否則當成外部網址
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, target) => {
    const i = VIDEOS.findIndex(v => v.title === target.trim());
    if (i >= 0) return `<a href="#" class="card-link" data-video="${i}">${label}</a>`;
    return `<a href="${target}" class="card-link" target="_blank" rel="noopener">${label}</a>`;
  });

  // 直接貼上的網址
  html = html.replace(/(^|[\s（(])(https?:\/\/[^\s<）)]+)/g,
    (m, pre, url) => `${pre}<a href="${url}" class="card-link" target="_blank" rel="noopener">${url}</a>`);

  return html;
}

// 點卡片文字裡的影片連結 → 關掉抽卡視窗、打開播放器
gachaText.addEventListener("click", e => {
  const a = e.target.closest("a[data-video]");
  if (!a) return;
  e.preventDefault();
  gachaDlg.close();
  openVideo(VIDEOS[a.dataset.video]);
});

// 畫出各稀有度的收集進度，例如 LR 1/1、SSR 2/3
function renderProgress(active){
  gachaProg.innerHTML = TIERS
    .filter(r => CARDS.some(c => c.r === r))       // 卡池裡沒有的階級就不顯示
    .map(r => {
      const total = CARDS.filter(c => c.r === r).length;
      const got   = [...seen].filter(i => CARDS[i].r === r).length;
      const cls   = "pg"
                  + (got === total ? " full" : "")
                  + (r === active  ? " now"  : "");
      return `<span class="${cls}">${r} ${got}/${total}</span>`;
    }).join("");
}

// Fisher–Yates 洗牌
function shuffleBag(){
  bag = CARDS.map((_, i) => i);
  for (let i = bag.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
}

// 每次換內容都重跑一次進場動畫，連抽才有翻牌的感覺
function replay(){
  gachaCard.style.animation = "none";
  void gachaCard.offsetWidth;
  gachaCard.style.animation = "";
}

function open(){
  replay();
  if (!gachaDlg.open) gachaDlg.showModal();
}

function draw(){
  if (!bag.length){
    shuffleBag();
    seen.clear();        // 新的一輪，收集進度重新算
  }

  const idx = bag.pop();
  const c   = CARDS[idx];
  seen.add(idx);

  count++;
  updateTip();

  gachaRarity.textContent = c.r;
  gachaRarity.dataset.r   = c.r;
  gachaTitle.textContent  = c.t;
  gachaText.innerHTML     = richText(c.d);

  if (bag.length){
    gachaMeta.textContent  = `第 ${count} 抽・還剩 ${bag.length} 張沒看過`;
    gachaAgain.textContent = "再抽一張";
    mode = "draw";
  } else {
    // 剛剛抽掉的是最後一張
    gachaMeta.textContent  = `第 ${count} 抽・這是最後一張`;
    gachaAgain.textContent = "看看結果";
    mode = "finish";
  }

  renderProgress(c.r);
  open();
}


// 抽完全部時的小煙花。生一批碎片，讓它們往外炸開再落下
const FX_COLORS = ["#6a0dad","#b07ae8","#e0a419","#f6d365","#ff5f9e","#5ad6c0"];

function burst(n = 30){
  gachaFx.innerHTML = "";

  for (let i = 0; i < n; i++){
    const p     = document.createElement("i");
    const angle = Math.random() * Math.PI * 2;       // 往哪個方向飛
    const dist  = 90 + Math.random() * 130;          // 飛多遠

    p.style.setProperty("--x", `${Math.cos(angle) * dist}px`);
    // 往下多加一點，看起來像被重力拉下去
    p.style.setProperty("--y", `${Math.sin(angle) * dist * .7 + 90}px`);
    p.style.setProperty("--r", `${(Math.random() * 720 - 360).toFixed(0)}deg`);
    p.style.setProperty("--t", `${(1 + Math.random() * .6).toFixed(2)}s`);
    p.style.setProperty("--d", `${(Math.random() * .25).toFixed(2)}s`);
    p.style.background = FX_COLORS[i % FX_COLORS.length];
    if (i % 3 === 0) p.className = "round";

    gachaFx.appendChild(p);
  }

  // 放完就清掉，不留一堆空元素在畫面上
  setTimeout(() => { gachaFx.innerHTML = ""; }, 2000);
}

function finish(){
  round++;

  gachaRarity.textContent = "完成";
  gachaRarity.dataset.r   = "FIN";
  gachaTitle.textContent  = FINISH_CARD.t;
  gachaText.innerHTML     = richText(FINISH_CARD.d);
  gachaMeta.textContent   = `${CARDS.length} 張全收集・總共抽了 ${count} 次`
                            + (round > 1 ? `・第 ${round} 輪` : "");
  gachaAgain.textContent  = "重新洗牌";
  mode = "reset";

  renderProgress(null);
  open();
  burst();
}

// 主按鈕：依照目前狀態決定要抽卡、看結果，還是重開一輪
function next(){
  if (mode === "finish") finish();
  else draw();            // draw 和 reset 都是抽下一張（袋子空了會自動重洗）
}

gachaBtn.addEventListener("click", next);
gachaAgain.addEventListener("click", next);
document.getElementById("gachaClose").addEventListener("click", () => gachaDlg.close());
gachaDlg.addEventListener("click", e => { if (e.target === gachaDlg) gachaDlg.close(); });