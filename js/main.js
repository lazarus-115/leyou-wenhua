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

// 生成背景飘落枫叶（使用真实枫叶图片）
function spawnLeaves() {
  const field = document.getElementById("leafField");
  if (!field) return;
  const count = window.innerWidth < 560 ? 8 : 16;
  for (let i = 0; i < count; i++) {
    const l = document.createElement("img");
    l.className = "leaf";
    l.src = "images/maple-leaf.png";
    l.alt = "";
    l.style.left = Math.random() * 100 + "%";
    const size = 26 + Math.random() * 44;
    l.style.width = size + "px";
    l.style.height = size + "px";
    l.style.animationDuration = 10 + Math.random() * 12 + "s";
    l.style.animationDelay = -Math.random() * 20 + "s";
    field.appendChild(l);
  }
}

// 页脚通用信息
function initCommon() {
  const fd = document.getElementById("footDate");
  if (fd) fd.textContent = `${SITE.dateFull} · ${SITE.location}`;
  // 页脚低调展示活动策划人
  document.querySelectorAll(".footer").forEach((ft) => {
    if (!ft.querySelector(".footer-crew")) {
      const p = document.createElement("p");
      p.className = "footer-crew";
      p.textContent = `活动策划：${CREW.join(" · ")}`;
      ft.appendChild(p);
    }
  });
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
    <div class="info-chip"><span class="ico">🎯</span><span>${ACTIVITIES.length} 个游戏 · ${ROUTES.length} 条路线</span></div>`;
}

// 首页：静态展示五条路线
function renderRouteList() {
  const list = document.getElementById("routeList");
  if (!list) return;
  list.innerHTML = ROUTES.map((r, i) => {
    const games = r.order.map((id) => ACTIVITIES.find((a) => a.id === id));
    const path = games.map((g) => `${g.location} · ${g.name}`).join("  →  ");
    return `
      <a class="route-card" href="guide.html?route=${i}">
        <div class="route-head">
          <span class="route-num">${i + 1}</span>
          <h3>${r.name}</h3>
        </div>
        <p class="route-path">${path}</p>
        <span class="route-go">进入路线 →</span>
      </a>`;
  }).join("");
}

// ---------- 总览页 ----------
// 找到包含某游戏的第一个路线下标（用于「去闯关」跳转）
function routeForGame(gameId) {
  const idx = ROUTES.findIndex((r) => r.order.includes(gameId));
  return idx >= 0 ? idx : 0;
}

function renderOverview() {
  document.title = `任务总览 · ${SITE.title}`;
  const sub = document.getElementById("ovSub");
  if (sub)
    sub.textContent = `${SITE.dateFull} · ${SITE.location} · 共 ${ACTIVITIES.length} 个游戏`;
  const list = document.getElementById("ovList");
  if (!list) return;
  list.innerHTML = ACTIVITIES.map(
    (a) => `
    <a class="ov-item" href="guide.html?route=${routeForGame(a.id)}&step=${a.id}">
      <div class="ov-num">${a.id}</div>
      <div class="ov-info">
        <h3>${a.name}</h3>
        <div class="ov-meta">
          <span class="loc">📍 ${a.location}</span>
          <span>${a.description}</span>
        </div>
      </div>
      <span class="ov-go">去闯关 →</span>
    </a>`
  ).join("");
}

// ---------- 路线（从 URL 参数读取，默认第 1 条） ----------
function getRouteIndex() {
  const v = parseInt(new URLSearchParams(location.search).get("route"), 10);
  return Number.isInteger(v) && v >= 0 && v < ROUTES.length ? v : 0;
}
function getRoute() {
  return ROUTES[getRouteIndex()];
}
// 把 ACTIVITIES 按当前路线 order 重排，得到闯关顺序
function getOrderedActivities() {
  return getRoute().order.map((id) => ACTIVITIES.find((a) => a.id === id));
}

// ---------- 向导页 ----------
let curStep = 0;
let ordered = [];

function initGuide() {
  document.title = `流程向导 · ${SITE.title}`;
  ordered = getOrderedActivities();
  const total = ordered.length;
  const tc = document.getElementById("totalCount");
  if (tc) tc.textContent = total;

  // 顶部显示当前路线
  const rb = document.getElementById("routeBadge");
  if (rb) rb.textContent = `当前路线 · ${getRoute().name}`;

  // 支持 ?step=游戏id 从总览页直接跳到该游戏（映射到当前路线里的位置）
  const q = new URLSearchParams(location.search).get("step");
  if (q) {
    const id = parseInt(q, 10);
    const idx = ordered.findIndex((a) => a.id === id);
    curStep = idx >= 0 ? idx : 0;
  } else {
    curStep = 0;
  }

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
  if (n < 0 || n >= ordered.length) return;
  curStep = n;
  renderTask();
  updateProgress();
  updateDots();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderDots() {
  const dots = document.getElementById("dots");
  if (!dots) return;
  dots.innerHTML = ordered.map(
    (a, i) => `<span class="dot" data-i="${i}" title="第 ${i + 1} 站 · ${a.name}"></span>`
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
    const last = curStep === ordered.length - 1;
    next.disabled = last;
    next.innerHTML = last ? "已完成 ✓" : "下一站 →";
  }
}

function updateProgress() {
  const fill = document.getElementById("progressFill");
  const idx = document.getElementById("curIdx");
  if (fill) fill.style.width = ((curStep + 1) / ordered.length) * 100 + "%";
  if (idx) idx.textContent = curStep + 1;
}

function renderTask() {
  const a = ordered[curStep];
  const media = a.image
    ? `<img src="${a.image}" alt="${a.name}">`
    : `<div class="media-ph">${leafSVG("", 64)}<p>图片占位 · 后续补充</p></div>`;
  const card = document.getElementById("taskCard");
  if (!card) return;
  card.innerHTML = `
    <div class="task-media">${media}</div>
    <div class="task-body">
      <span class="task-tag">${leafSVG("leaf-sm")} 第 ${curStep + 1} 站</span>
      <h2>${a.name}</h2>
      <div class="task-loc">📍 ${a.location}</div>
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

// ---------- 导航栏移动端汉堡菜单 ----------
function initNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("navToggle");
  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  });

  // 点击菜单里的链接后自动收起
  nav.querySelectorAll(".nav-links a").forEach((a) => {
    a.addEventListener("click", () => closeNav());
  });

  // 点击页面其它区域收起
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) closeNav();
  });

  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "打开菜单");
  }
}

// ---------- 启动 ----------
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  initCommon();
  initNav();
  if (page === "home") {
    renderHome();
    renderRouteList();
  }
  if (page === "guide") initGuide();
  if (page === "overview") renderOverview();
  injectLeafIcons();
  spawnLeaves();
});
