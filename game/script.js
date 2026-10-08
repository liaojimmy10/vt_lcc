/* =========================================================
   逃跑台詞 —— 第幾次逃跑就顯示第幾筆，想改梗就動這裡
   label: 按鈕上的字
   note:  按鈕下面的碎碎念
   ========================================================= */
const ESCAPES = [
  { label:"不！竟然想按不錄取！", note:"咦，按鈕自己跑掉了" },
  { label:"這是真的嗎(☍﹏⁰)",       note:"它好像不太想被按" },
  { label:"再想想啦(っ °Д °;)っ",           note:"面試官手速很快喔 xD" },
  { label:"我會很努力很努力的！",         note:"按鈕開始哭了" },
];

/* 逃幾次之後放棄，變成「好啦錄取」
   ESCAPES.length + 1 = 四句都看完，下一次再碰才放棄 */
const GIVE_UP_AFTER = ESCAPES.length + 1;

/* 滑鼠離按鈕「邊緣」多近（px）才開始逃。數字越小越不敏感，0 = 要真的碰到 */
const DANGER_GAP = 8;

/* 逃跑移動要花幾秒。數字越大跑越慢 */
const MOVE_SECONDS = 0.6;

/* 按鈕離畫面邊緣至少留多少 px，避免字被切掉 */
const EDGE_PAD = 40;

/* 錄取每次變大多少，還有最大到幾倍 */
const GROW_STEP = 0.2;
const GROW_MAX  = 2.5;


/* =========================================================
   以下是運作邏輯，平常不用動
   ========================================================= */
const sheet    = document.getElementById("sheet");
const yesBtn   = document.getElementById("yesBtn");
const noBtn    = document.getElementById("noBtn");
const note     = document.getElementById("note");
const after    = document.getElementById("after");
const retryBtn = document.getElementById("retryBtn");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let escapes = 0;
let gaveUp  = false;
let done    = false;
let lastRun = 0;
let grow    = 1;

/* 把一個位置限制在畫面內（留 EDGE_PAD 的邊） */
function clampToView(x, y, w, h){
  const maxX = Math.max(EDGE_PAD, window.innerWidth  - w - EDGE_PAD);
  const maxY = Math.max(EDGE_PAD, window.innerHeight - h - EDGE_PAD);
  return {
    x: Math.min(Math.max(x, EDGE_PAD), maxX),
    y: Math.min(Math.max(y, EDGE_PAD), maxY),
  };
}

/* 讓不錄取跑到畫面上一個安全的新位置 */
function runAway(pointerX, pointerY){
  if (gaveUp || done) return;

  const now = performance.now();
  if (now - lastRun < MOVE_SECONDS * 1000) return;   // 還在跑的途中，不重複觸發
  lastRun = now;

  // 第一次逃跑：先釘在原地，再開始動
  if (!noBtn.classList.contains("is-running")){
    const start = noBtn.getBoundingClientRect();
    noBtn.style.left = start.left + "px";
    noBtn.style.top  = start.top  + "px";
    noBtn.classList.add("is-running");
    noBtn.style.transition = reduceMotion ? "none" :
      `left ${MOVE_SECONDS}s cubic-bezier(.25,.8,.3,1.1),` +
      `top ${MOVE_SECONDS}s cubic-bezier(.25,.8,.3,1.1)`;
    noBtn.getBoundingClientRect();   // 強制重排，下一步才會有滑動動畫
  }

  // 先換文字，再量新的大小（文字變長按鈕會變寬）
  escapes++;
  const line = ESCAPES[Math.min(escapes, ESCAPES.length) - 1];
  noBtn.textContent = line.label;
  note.textContent  = line.note + `（已逃跑 ${escapes} 次）`;

  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  const yes = yesBtn.getBoundingClientRect();

  // 最多試 40 次，找一個離滑鼠夠遠、又不會壓到錄取按鈕的位置
  let best = null, bestDist = -1;
  for (let i = 0; i < 40; i++){
    const p = clampToView(
      EDGE_PAD + Math.random() * (window.innerWidth  - w - EDGE_PAD * 2),
      EDGE_PAD + Math.random() * (window.innerHeight - h - EDGE_PAD * 2),
      w, h
    );

    const hitsYes = p.x < yes.right + 30 && p.x + w > yes.left - 30 &&
                    p.y < yes.bottom + 30 && p.y + h > yes.top - 30;
    if (hitsYes) continue;

    const d = Math.hypot(p.x + w / 2 - pointerX, p.y + h / 2 - pointerY);
    if (d > bestDist){ best = p; bestDist = d; }
    if (d > 300) break;
  }
  if (best){
    noBtn.style.left = best.x + "px";
    noBtn.style.top  = best.y + "px";
  }

  growYes();

  if (escapes >= GIVE_UP_AFTER) giveUp();
}

/* 錄取變大，並且「砰」一下讓人注意到 */
function growYes(){
  const prev = grow;
  grow = Math.min(GROW_MAX, grow + GROW_STEP);
  yesBtn.style.setProperty("--grow", grow);

  if (reduceMotion || grow === prev) return;
  yesBtn.animate([
    { transform:`scale(${prev})` },
    { transform:`scale(${grow * 1.18})`, offset:.55 },
    { transform:`scale(${grow})` },
  ], { duration:450, easing:"ease-out" });
}

/* 放棄抵抗 */
function giveUp(){
  gaveUp = true;
  noBtn.classList.add("gave-up");
  noBtn.textContent = "好啦！錄取";
  note.textContent  = "不錄取按鈕已放棄抵抗 xDD";

  // 換字後按鈕寬度變了，再確認一次沒超出畫面
  const r = noBtn.getBoundingClientRect();
  const p = clampToView(parseFloat(noBtn.style.left), parseFloat(noBtn.style.top),
                        r.width, r.height);
  noBtn.style.left = p.x + "px";
  noBtn.style.top  = p.y + "px";
}

/* 蓋章錄取 */
function accept(){
  if (done) return;
  done = true;

  note.textContent = "";
  noBtn.classList.remove("is-running");
  noBtn.hidden = true;
  sheet.classList.add("is-stamped");

  setTimeout(() => {
    after.hidden = false;
    after.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 750);
}

/* 重來一次（方便自己測試，也讓面試官再玩一次） */
function reset(){
  escapes = 0; gaveUp = false; done = false; grow = 1; lastRun = 0;
  sheet.classList.remove("is-stamped");
  after.hidden = true;

  noBtn.hidden = false;
  noBtn.classList.remove("is-running", "gave-up");
  noBtn.removeAttribute("style");
  noBtn.textContent = "不錄取";
  yesBtn.style.removeProperty("--grow");
  note.innerHTML = "&nbsp;";

  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* ---------- 事件 ---------- */

// 電腦：滑鼠碰到按鈕邊緣附近才逃
document.addEventListener("pointermove", e => {
  if (e.pointerType !== "mouse" || gaveUp || done) return;
  const r = noBtn.getBoundingClientRect();
  const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
  const dy = Math.max(r.top  - e.clientY, 0, e.clientY - r.bottom);
  if (Math.hypot(dx, dy) <= DANGER_GAP) runAway(e.clientX, e.clientY);
});

// 手機：手指一碰就逃
noBtn.addEventListener("pointerdown", e => {
  if (gaveUp) return;
  e.preventDefault();
  lastRun = 0;
  runAway(e.clientX, e.clientY);
});

// 萬一真的按到了（例如用鍵盤 Enter，或是在它跑的途中點到）
noBtn.addEventListener("click", () => {
  if (gaveUp){ accept(); return; }
  const r = noBtn.getBoundingClientRect();
  lastRun = 0;
  runAway(r.left + r.width / 2, r.top + r.height / 2);
  if (!gaveUp) note.textContent = "系統偵測到手滑，已幫您取消 xD";
});

yesBtn.addEventListener("click", accept);
retryBtn.addEventListener("click", reset);

// 視窗縮放時，把跑出畫面的按鈕拉回來
window.addEventListener("resize", () => {
  if (!noBtn.classList.contains("is-running")) return;
  const r = noBtn.getBoundingClientRect();
  const p = clampToView(r.left, r.top, r.width, r.height);
  noBtn.style.left = p.x + "px";
  noBtn.style.top  = p.y + "px";
});