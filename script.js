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

// 點卡片開視窗
grid.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;

  const v = VIDEOS[card.dataset.i];
  playerTitle.textContent = v.title;

  // PDF 用直立比例，影片用 16:9
  const ratio = v.type === "pdf" ? "3/4" : "16/9";

  slot.innerHTML = `<iframe src="${embedUrl(v)}" title="${v.title}"
    style="aspect-ratio:${ratio}"
    allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;

  dlg.showModal();
});

// 關掉視窗時清空 iframe，影片才會真的停止
document.getElementById("closeBtn").addEventListener("click", () => dlg.close());
dlg.addEventListener("close", () => { slot.innerHTML = ""; });
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

// 第一次載入先顯示全部
render("全部");