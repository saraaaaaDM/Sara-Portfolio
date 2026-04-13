const ZONE_W = 1200;
const ZONE_H = 600;

function getZoneScale() {
  if (window.innerWidth < 768) {
    return (window.innerWidth) / ZONE_W;
  } else {
    const scaleX = (window.innerWidth - 80) / ZONE_W;
    const scaleY = (window.innerHeight - 80) / ZONE_H;
    return Math.min(scaleX, scaleY, 1);
  }
}

function applyScale() {
  const zone = document.querySelector(".center-zone");
  const scale = getZoneScale();
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    zone.style.top = "0";
    zone.style.left = "0";
    zone.style.transform = `scale(${scale})`;
    zone.style.transformOrigin = "top left";
    document.querySelector(".home-section").style.height = (ZONE_H * scale * 2.5) + "px";
  } else {
    zone.style.top = "50%";
    zone.style.left = "50%";
    zone.style.transform = `translate(-50%, -50%) scale(${scale})`;
    zone.style.transformOrigin = "center center";
    document.querySelector(".home-section").style.height = "100vh";
  }
}

applyScale();
window.addEventListener("resize", applyScale);

// ─── DRAG ───────────────────────────────────────────────

const items = document.querySelectorAll(".item");

items.forEach(item => {
  let isDragging = false;
  let startX = 0, startY = 0, mouseStartX = 0, mouseStartY = 0;

  function startDrag(clientX, clientY) {
    isDragging = true;
    startX = parseInt(item.style.left) || item.offsetLeft;
    startY = parseInt(item.style.top)  || item.offsetTop;
    mouseStartX = clientX;
    mouseStartY = clientY;
    item.style.cursor = "grabbing";
    item.style.zIndex = "100";
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging) return;
    const scale = getZoneScale();
    item.style.left = (startX + (clientX - mouseStartX) / scale) + "px";
    item.style.top  = (startY + (clientY - mouseStartY) / scale) + "px";
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    item.style.cursor = "grab";
    item.style.zIndex = "";
  }

  item.addEventListener("mousedown", e => startDrag(e.clientX, e.clientY));
  document.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
  document.addEventListener("mouseup", () => endDrag());

  item.addEventListener("touchstart", e => {
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  item.addEventListener("touchmove", e => {
    e.preventDefault();
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  item.addEventListener("touchend", () => endDrag());
});