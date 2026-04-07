const items = document.querySelectorAll(".item");

items.forEach(item => {
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  // MOUSE DRAG
  item.addEventListener("mousedown", e => {
    isDragging = true;
    offsetX = e.clientX - item.offsetLeft;
    offsetY = e.clientY - item.offsetTop;
    item.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    item.style.left = e.clientX - offsetX + "px";
    item.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", e => {
    if (!isDragging) return;
    isDragging = false;
    item.style.cursor = "grab";
  });

  // TOUCH DRAG (mobile)
  item.addEventListener("touchstart", e => {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - item.offsetLeft;
    offsetY = touch.clientY - item.offsetTop;
  }, { passive: false });

  item.addEventListener("touchmove", e => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    item.style.left = touch.clientX - offsetX + "px";
    item.style.top = touch.clientY - offsetY + "px";
  }, { passive: false });

  item.addEventListener("touchend", e => {
    if (!isDragging) return;
    isDragging = false;
  });
});