// ============================================================
//  乐游文华 · 交互逻辑
//  从 data.js 读取数据渲染页面，无需改动本文件
// ============================================================

// 统一的枫叶图标路径（五裂红枫）
const LEAF_PATH =
  "M12 1.5 C10.3 4 8.2 4.6 5.8 4.6 C6.9 6.6 6.4 8.6 5 9.6 " +
  "C7.6 9.6 9 11 9 13.6 C6.7 12.6 4.7 13 4 15.6 C6.9 16.6 9 17.7 10 20.2 " +
  "C11 17.6 11 14.2 12 12.4 C13 14.2 13 17.6 14 20.2 " +
  "C15 17.7 17.1 16.6 20 15.6 C19.3 13 17.3 12.6 15 13.6 " +
  "C15 11 16.4 9.6 19 9.6 C17.6 8.6 17.1 6.6 18.2 4.6 " +
  "C15.8 4.6 13.7 4 12 1.5 Z";

// 生成一枚枫叶 SVG（cls 可选类名，size 可选像素尺寸）
function leafSVG(cls, size) {
  const st = size ? ` style="width:${size}px;height:${size}px"` : "";
  return (
    `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"${st}>` +
    `<path d="${LEAF_PATH}"/></svg>`
  );
}

// 把静态 HTML 里的 .leaf-icon 占位替换成枫叶 SVG
function injectLeafIcons() {
  document.querySelectorAll(".leaf-icon").forEach((el) => {
    el.innerHTML =
      `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width:100%;height:100%;display:block">` +
      `<path d="${LEAF_PATH}"/></svg>`;
  });
}

// 生成背景飘落枫叶
function spawnLeaves() {
  const field = document.getElementById("leafField");
  if (!field) return;
  const colors = ["var(--red)", "var(--orange)", "var(--orange-light)"];
  const count = window.innerWidth < 560 ? 8 : 14;
  for (let i = 0; i < count; i++) {
    const l = document.createElement("span");
    l.className = "leaf";
    l.style.left = Math.random() * 100 + "%";
    l.style.color = colors[i % colors.length];
    const size = 14 + Math.random() * 22;
    l.style.width = size + "px";
    l.style.height = size + "px";
    l.style.animationDuration = 9 + Math.random() * 12 + "s";
    l.style.animationDelay = -Math.random() * 20 + "s";
    l.innerHTML =
      `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width:100%;height:100%;display:block">` +
      `<path d="${LEAF_PATH}"/></svg>`;
    field.appendChild(l);
  }
}

// 页脚通用信息
function initCommon() {
  const fd = document.getElementById("footDate");
  if (fd) fd.textContent = `${SITE.dateFull} · ${SITE.location}`;
}

// ---------- 首页 ----------
function renderHome() {
  document.title = `${SITE.title} · 校园任务巡游`;
  document.getElementById("heroBadge").innerHTML =
    `${leafSVG("", 15)} ${SITE.date} · ${SITE.location}`;
  document.getElementById("heroTitle").textContent = SITE.title;
  document.getElementById("heroSlogan").textContent = SITE.slogan;
  document.getElementById("heroIntro").textContent = SITE.intro;
  document.getElementById("infoStrip").innerHTML = `
    <div class="info-chip"><span class="ico">📅</span><span>${SITE.dateFull}</span></div>
    <div class="info-chip"><span class="ico">📍</span><span>${SITE.location}</span></div>
    <div class="info-chip"><span class="ico">🎯</span><span>${ACTIVITIES.length} 个任务点</span></div>`;
}

// ---------- 总览页 ----------
function renderOverview() {
  document.title = `任务总览 · ${SITE.title}`;
  const sub = document.getElementById("ovSub");
  if (sub)
    sub.textContent = `${SITE.dateFull} · ${SITE.location} · 共 ${ACTIVITIES.length} 站`;
  const list = document.getElementById("ovList");
  if (!list) return;
  list.innerHTML = ACTIVITIES.map(
    (a) => `
    <a class="ov-item" href="guide.html?step=${a.id}">
      <div class="ov-num">${a.id}</div>
      <div class="ov-info">
        <h3>${a.name}</h3>
        <div class="ov-meta">
          <span class="loc">📍 ${a.location}</span>
          <span>🕐 ${a.time}</span>
          <span>${a.description}</span>
        </div>
      </div>
      <span class="ov-go">去闯关 →</span>
    </a>`
  ).join("");
}

// ---------- 向导页 ----------
let curStep = 0;

function initGuide() {
  document.title = `流程向导 · ${SITE.title}`;
  const total = ACTIVITIES.length;
  const tc = document.getElementById("totalCount");
  if (tc) tc.textContent = total;

  // 支持 ?step=N 从总览页直接跳到第 N 站
  const q = new URLSearchParams(location.search).get("step");
  curStep = q ? Math.min(Math.max(parseInt(q, 10) - 1, 0), total - 1) : 0;

  renderDots();
  updateDots();
  renderTask();
  updateProgress();

  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  if (prev) prev.addEventListener("click", () => go(-1));
  if (next) next.addEventListener("click", () => go(1));
}

function go(delta) {
  const n = curStep + delta;
  if (n < 0 || n >= ACTIVITIES.length) return;
  curStep = n;
  renderTask();
  updateProgress();
  updateDots();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderDots() {
  const dots = document.getElementById("dots");
  if (!dots) return;
  dots.innerHTML = ACTIVITIES.map(
    (a, i) => `<span class="dot" data-i="${i}" title="第 ${a.id} 站 · ${a.name}"></span>`
  ).join("");
  dots.querySelectorAll(".dot").forEach((d) =>
    d.addEventListener("click", () => {
      curStep = +d.dataset.i;
      renderTask();
      updateProgress();
      updateDots();
    })
  );
}

function updateDots() {
  document.querySelectorAll("#dots .dot").forEach((d, i) => {
    d.classList.toggle("active", i === curStep);
    d.classList.toggle("done", i < curStep);
  });
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  if (prev) prev.disabled = curStep === 0;
  if (next) {
    const last = curStep === ACTIVITIES.length - 1;
    next.disabled = last;
    next.innerHTML = last ? "已完成 ✓" : "下一站 →";
  }
}

function updateProgress() {
  const fill = document.getElementById("progressFill");
  const idx = document.getElementById("curIdx");
  if (fill) fill.style.width = ((curStep + 1) / ACTIVITIES.length) * 100 + "%";
  if (idx) idx.textContent = curStep + 1;
}

function renderTask() {
  const a = ACTIVITIES[curStep];
  const media = a.image
    ? `<img src="${a.image}" alt="${a.name}">`
    : `<div class="media-ph">${leafSVG("", 64)}<p>图片占位 · 后续补充</p></div>`;
  const card = document.getElementById("taskCard");
  if (!card) return;
  card.innerHTML = `
    <div class="task-media">${media}</div>
    <div class="task-body">
      <span class="task-tag">${leafSVG("leaf-sm")} 第 ${a.id} 站</span>
      <h2>${a.name}</h2>
      <div class="task-loc">📍 ${a.location} · 🕐 ${a.time}</div>
      <p class="task-desc">${a.description}</p>
      <div class="task-block">
        <h4>📋 任务规则</h4>
        <p>${a.rules}</p>
      </div>
      <div class="task-block">
        <h4>✅ 通关条件</h4>
        <p>${a.passCondition}</p>
      </div>
    </div>`;
  // 重新触发卡片入场动画
  card.style.animation = "none";
  void card.offsetWidth;
  card.style.animation = "";
}

// ---------- 启动 ----------
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  initCommon();
  if (page === "home") renderHome();
  if (page === "guide") initGuide();
  if (page === "overview") renderOverview();
  injectLeafIcons();
  spawnLeaves();
});
