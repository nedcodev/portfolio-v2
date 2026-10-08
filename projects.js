/*===== PROJECTS: HOVER LIST =====*/
// Desktop: the hovered row's GIF follows the cursor.
// Phones: the row crossing the middle of the screen becomes active,
// and its GIF swaps into a floating card pinned to the bottom.

const list = document.getElementById("hl-list");
const rows = [...document.querySelectorAll(".hl-row")];
const preview = document.getElementById("hl-preview");
const previewImg = preview.querySelector("img");
const touchMode = matchMedia("(hover: none), (max-width: 768px)");

// Preload GIFs so the preview swaps instantly
rows.forEach(row => { new Image().src = row.dataset.img; });

/*===== DESKTOP: cursor-following preview =====*/
let x = 0, y = 0, cx = 0, cy = 0;

rows.forEach(row => {
  row.addEventListener("mouseenter", () => {
    if (touchMode.matches) return;
    previewImg.src = row.dataset.img;
    preview.classList.add("is-on");
  });
  row.addEventListener("mouseleave", () => {
    if (!touchMode.matches) preview.classList.remove("is-on");
  });
});

window.addEventListener("mousemove", e => {
  // Flip to the left of the cursor near the right edge
  x = e.clientX + (e.clientX > innerWidth - 420 ? -200 : 200);
  y = e.clientY;
});

(function follow() {
  if (!touchMode.matches) {
    cx += (x - cx) * .15; // eased trailing motion
    cy += (y - cy) * .15;
    preview.style.left = cx + "px";
    preview.style.top = cy + "px";
  }
  requestAnimationFrame(follow);
})();

/*===== PHONE: scroll-driven active row =====*/
let active = null;

function setActive(row) {
  if (row === active) return;
  rows.forEach(r => r.classList.toggle("is-active", r === row));
  list.classList.toggle("has-active", !!row);
  preview.classList.toggle("is-on", !!row);
  if (row) {
    if (active) { // replay the little flip when switching between projects
      preview.classList.remove("is-swapping");
      void preview.offsetWidth;
      preview.classList.add("is-swapping");
    }
    previewImg.src = row.dataset.img;
    // Tiny tick on Android (browsers only allow it after the first tap)
    if (navigator.vibrate && navigator.userActivation?.hasBeenActive) navigator.vibrate(8);
  }
  active = row;
}

const band = new IntersectionObserver(entries => {
  if (!touchMode.matches) return;
  const hit = entries.filter(e => e.isIntersecting).pop();
  if (hit) {
    setActive(hit.target);
  } else {
    // Only clear when the middle of the screen has left the list entirely
    const mid = innerHeight * .43;
    if (mid < rows[0].getBoundingClientRect().top || mid > rows.at(-1).getBoundingClientRect().bottom) setActive(null);
  }
}, { rootMargin: "-38% 0px -52% 0px" });

rows.forEach(r => band.observe(r));

touchMode.addEventListener("change", () => {
  setActive(null);
  preview.classList.remove("is-on");
});
