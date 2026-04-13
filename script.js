// ─────────────────────────────────────────────
// ZONE SCALE SYSTEM (HOME RESPONSIVE)
// ─────────────────────────────────────────────

const ZONE_W = 1200;
const ZONE_H = 600;

const zone = document.querySelector(".center-zone");
const homeSection = document.querySelector(".home-section");

function getZoneScale() {
  if (window.innerWidth < 768) {
    return window.innerWidth / ZONE_W;
  } else {
    const scaleX = (window.innerWidth - 80) / ZONE_W;
    const scaleY = (window.innerHeight - 80) / ZONE_H;
    return Math.min(scaleX, scaleY, 1);
  }
}

let currentScale = 1;
let mouseX = 0;
let mouseY = 0;

function applyScale() {
  currentScale = getZoneScale();

  const isMobile = window.innerWidth < 768;

  zone.dataset.scale = currentScale;

  if (isMobile) {
    zone.style.top = "0";
    zone.style.left = "0";
    zone.style.transform = `scale(${currentScale})`;
    zone.style.transformOrigin = "top left";

    homeSection.style.height = (ZONE_H * currentScale * 2.5) + "px";
  } else {
    zone.style.top = "50%";
    zone.style.left = "50%";
    zone.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
    zone.style.transformOrigin = "center center";

    homeSection.style.height = "100vh";
  }
}

applyScale();
window.addEventListener("resize", applyScale);


// ─────────────────────────────────────────────
// GLOBAL MOUSE TRACKING (PARALLAX)
// ─────────────────────────────────────────────

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5);
  mouseY = (e.clientY / window.innerHeight - 0.5);
});

function updateParallax() {
  const moveX = mouseX * 15;
  const moveY = mouseY * 15;

  const scale = currentScale;

  if (!zone) return;

  zone.style.transform =
    `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(${scale})`;

  requestAnimationFrame(updateParallax);
}

updateParallax();


// ─────────────────────────────────────────────
// DRAG SYSTEM (HOME OBJECTS)
// ─────────────────────────────────────────────

const items = document.querySelectorAll(".item");

items.forEach(item => {
  let isDragging = false;
  let startX = 0, startY = 0;
  let mouseStartX = 0, mouseStartY = 0;

  function startDrag(clientX, clientY) {
    isDragging = true;

    startX = parseFloat(item.style.left) || item.offsetLeft;
    startY = parseFloat(item.style.top) || item.offsetTop;

    mouseStartX = clientX;
    mouseStartY = clientY;

    item.style.cursor = "grabbing";
    item.style.zIndex = "100";

    item.classList.add("dragging");
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging) return;

    const scale = currentScale;

    item.style.left = (startX + (clientX - mouseStartX) / scale) + "px";
    item.style.top  = (startY + (clientY - mouseStartY) / scale) + "px";
  }

  function endDrag() {
    if (!isDragging) return;

    isDragging = false;
    item.style.cursor = "grab";
    item.style.zIndex = "";

    item.classList.remove("dragging");
  }

  // Mouse
  item.addEventListener("mousedown", e => startDrag(e.clientX, e.clientY));
  document.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
  document.addEventListener("mouseup", endDrag);

  // Touch
  item.addEventListener("touchstart", e => {
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  item.addEventListener("touchmove", e => {
    e.preventDefault();
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  item.addEventListener("touchend", endDrag);
});


// ─────────────────────────────────────────────
// CURSOR CUSTOM
// ─────────────────────────────────────────────

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  if (!cursor) return;

  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// hover grow cursor
document.querySelectorAll("a, .item, .project-card").forEach(el => {
  el.addEventListener("mouseenter", () => {
    if (cursor) cursor.style.transform = "scale(2)";
  });

  el.addEventListener("mouseleave", () => {
    if (cursor) cursor.style.transform = "scale(1)";
  });
});


// ─────────────────────────────────────────────
// SCROLL REVEAL (SECTIONS + CARDS)
// ─────────────────────────────────────────────

const reveals = document.querySelectorAll(".section, .project-card, .about-content");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, {
  threshold: 0.15
});

reveals.forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});