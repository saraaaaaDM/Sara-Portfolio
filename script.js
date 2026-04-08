const ZONE_W = 1200; // width CSS déclarée de .center-zone
const ZONE_H = 600;  // height CSS déclarée de .center-zone
const PADDING = 40;   // marge min autour de la zone (px viewport)

function getZoneScale() {
  const scaleX = (window.innerWidth  - PADDING * 2) / ZONE_W;
  const scaleY = (window.innerHeight - PADDING * 2) / ZONE_H;
  return Math.min(scaleX, scaleY, 1); // jamais > 1 (pas de zoom sur grand écran)
}

function applyScale() {
  const scale = getZoneScale();
  document.querySelector(".center-zone").style.transform =
    `translate(-50%, -50%) scale(${scale})`;
}

// Appliquer au chargement et à chaque resize
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
    item.style.zIndex = "10";
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging) return;
    const scale = getZoneScale(); // correction vitesse drag / scale visuel
    item.style.left = (startX + (clientX - mouseStartX) / scale) + "px";
    item.style.top  = (startY + (clientY - mouseStartY) / scale) + "px";
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    item.style.cursor = "grab";
    item.style.zIndex = "";
  }

  item.addEventListener("mousedown", e  => startDrag(e.clientX, e.clientY));
  document.addEventListener("mousemove", e  => moveDrag(e.clientX, e.clientY));
  document.addEventListener("mouseup",   ()  => endDrag());

  item.addEventListener("touchstart", e => {
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
  item.addEventListener("touchmove", e => {
    e.preventDefault();
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
  item.addEventListener("touchend",  () => endDrag());
});