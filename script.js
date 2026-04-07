// SCALE RESPONSIVE
function scalePage() {
  const baseWidth = 3440;
  const baseHeight = 1440;

  const scaleX = window.innerWidth / baseWidth;
  const scaleY = window.innerHeight / baseHeight;

  const scale = Math.min(scaleX, scaleY);

  document.body.style.transform = `scale(${scale})`;

  document.body.style.width = baseWidth + "px";
  document.body.style.height = baseHeight + "px";
}

window.addEventListener("resize", scalePage);
window.addEventListener("load", scalePage);

// DRAGGABLE ITEMS
const items = document.querySelectorAll(".item");

items.forEach(item => {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // MOUSE
  item.addEventListener("mousedown", e => {
    isDragging = true;
    offsetX = e.clientX - item.offsetLeft;
    offsetY = e.clientY - item.offsetTop;
  });

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    item.style.left = (e.clientX - offsetX) + "px";
    item.style.top = (e.clientY - offsetY) + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // TOUCH
  item.addEventListener("touchstart", e => {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - item.offsetLeft;
    offsetY = touch.clientY - item.offsetTop;
  });

  document.addEventListener("touchmove", e => {
    if (!isDragging) return;
    const touch = e.touches[0];
    item.style.left = (touch.clientX - offsetX) + "px";
    item.style.top = (touch.clientY - offsetY) + "px";
  });

  document.addEventListener("touchend", () => {
    isDragging = false;
  });
});