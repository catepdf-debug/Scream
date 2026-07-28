// Reusable anonymous-message modal, driven by the markup living in index.html
// (outside #content, so it stays mounted across every SPA route change).
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("chiudi");
const understoodBtn = document.getElementById("capito");
const openLink = document.getElementById("scritta");

export function openAnonymousModal(e) {
  e?.preventDefault();
  overlay.style.display = "flex";
}

function closeAnonymousModal() {
  overlay.style.display = "none";
}

openLink?.addEventListener("click", openAnonymousModal);
closeBtn?.addEventListener("click", closeAnonymousModal);
understoodBtn?.addEventListener("click", closeAnonymousModal);

// Click outside the popup card also closes it.
overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) closeAnonymousModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAnonymousModal();
});
