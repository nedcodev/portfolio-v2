/*===== PROJECTS: HOVER LIST =====*/
// Desktop: the hovered row's GIF follows the cursor.
// Phones: after a short scroll, rows become active one by one as you scroll,
// and the active row's GIF swaps into a floating card.

const list = document.getElementById("hl-list");
const rows = [...document.querySelectorAll(".hl-row")];
const preview = document.getElementById("hl-preview");
const previewImg = preview.querySelector("img");
const touchMode = matchMedia("(hover: none), (max-width: 768px)");
const title = document.querySelector("#projects .section-title");

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

// Nothing lights up until the visitor scrolls a little. After that, the rest of
// the scroll distance is split evenly between the rows, so each one gets a turn
// in order and the last row is active at the very bottom of the page.
const START_AFTER = 80; // px of scrolling before anything lights up

function update() {
  if (!touchMode.matches) return;
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  if (scrollY < START_AFTER || maxScroll <= START_AFTER) return setActive(null);

  const progress = (scrollY - START_AFTER) / (maxScroll - START_AFTER);
  setActive(rows[Math.min(Math.floor(progress * rows.length), rows.length - 1)]);

  // Card sits at the bottom while the page title is on screen, then moves to the top.
  // It also moves up early if the active row would end up behind it.
  const titleGone = title.getBoundingClientRect().bottom < 0;
  const rowBehindCard = active.getBoundingClientRect().bottom > innerHeight - preview.offsetHeight - 40;
  preview.classList.toggle("at-top", titleGone || rowBehindCard);
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { ticking = false; update(); });
}, { passive: true });
window.addEventListener("resize", update);
update();

touchMode.addEventListener("change", () => {
  setActive(null);
  preview.classList.remove("is-on", "at-top");
  update();
});
