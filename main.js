import { renderHome } from "./pages/home.js";
import { renderCategories } from "./pages/categories.js";
import { renderCategory } from "./pages/category.js";
import { renderSearch } from "./pages/search.js";
import { openAnonymousModal } from "./modal.js";

// iOS Safari never shrinks 100vh/100dvh when the on-screen keyboard opens
// (only Android/Chrome does via interactive-widget=resizes-content), so the
// only reliable signal is window.visualViewport, which does report the
// keyboard-shrunk height. Mirror it into a CSS var the body's height reads,
// so our fixed-height flex layout actually shrinks and the results list
// keeps fitting in the remaining space instead of needing a page scroll.
//
// Focusing the input also makes iOS pan the visual viewport up over the
// (unscrolled) layout viewport to keep the caret visible above the keyboard.
// Our body is `position: fixed`, which is anchored to the layout viewport,
// so that pan alone would shove our whole UI off the top of the screen.
// visualViewport.offsetTop reports exactly that pan amount, so mirroring it
// into the body's `top` keeps the fixed UI glued to the visual viewport.
function syncViewport() {
  const vv = window.visualViewport;
  const height = vv ? vv.height : window.innerHeight;
  const offsetTop = vv ? vv.offsetTop : 0;
  document.documentElement.style.setProperty("--app-height", `${height}px`);
  document.documentElement.style.setProperty("--app-offset-top", `${offsetTop}px`);
}
syncViewport();
window.visualViewport?.addEventListener("resize", syncViewport);
window.visualViewport?.addEventListener("scroll", syncViewport);
window.addEventListener("resize", syncViewport);

const content = document.getElementById("content");
const globalSearchForm = document.getElementById("global-search-form");
const globalSearchInput = document.getElementById("global-search-input");
const globalBackLink = document.getElementById("global-back-link");
const globalAnonymousTrigger = document.getElementById("global-anonymous-trigger");
const searchBar = document.querySelector(".app-search-bar");
const searchBarDefaultParent = searchBar.parentNode;
const searchBarDefaultNextSibling = searchBar.nextSibling;

// Moving a node to a new parent blurs it even if it's the very same element,
// so skip no-op moves and restore focus/caret position right after a real one.
function moveSearchBar(targetParent, targetNextSibling, inline) {
  const alreadyThere = searchBar.parentNode === targetParent && searchBar.nextSibling === targetNextSibling;
  searchBar.classList.toggle("app-search-bar--inline", inline);
  if (alreadyThere) return;

  const wasFocused = document.activeElement === globalSearchInput;
  const selectionStart = wasFocused ? globalSearchInput.selectionStart : null;
  const selectionEnd = wasFocused ? globalSearchInput.selectionEnd : null;

  targetParent.insertBefore(searchBar, targetNextSibling);

  if (wasFocused) {
    globalSearchInput.focus();
    globalSearchInput.setSelectionRange(selectionStart, selectionEnd);
  }
}

function ejectSearchBarFromContent() {
  if (content.contains(searchBar)) {
    moveSearchBar(searchBarDefaultParent, searchBarDefaultNextSibling, false);
  }
}

function placeSearchBar(path) {
  const homeSlot = !path && content.querySelector("#home-search-slot");
  if (homeSlot) {
    moveSearchBar(homeSlot, null, true);
  } else {
    moveSearchBar(searchBarDefaultParent, searchBarDefaultNextSibling, false);
  }
}

function syncGlobalSearch(query = "") {
  if (globalSearchInput) {
    globalSearchInput.value = query;
  }
}

function goToSearch(query) {
  const normalized = query.trim();
  const target = normalized ? `#/recherche?q=${encodeURIComponent(normalized)}` : "#/recherche";
  history.replaceState(null, "", target);
  router();
}

if (globalSearchForm && globalSearchInput) {
  globalSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    goToSearch(globalSearchInput.value);
  });
  globalSearchForm.dataset.searchBound = "true";

  globalSearchInput.addEventListener("input", () => {
    const normalized = globalSearchInput.value.trim();
    const target = normalized ? `#/recherche?q=${encodeURIComponent(normalized)}` : "#/recherche";

    if (location.hash !== target) {
      history.replaceState(null, "", target);
      router();
    }
  });
}

globalAnonymousTrigger?.addEventListener("click", openAnonymousModal);

const BACK_TARGETS = {
  categories: "#/",
  categorie: "#/categories",
  recherche: "#/",
};

function syncBackLink(path) {
  if (globalBackLink) {
    globalBackLink.href = BACK_TARGETS[path] || "#/";
  }
}

function parseHash() {
  const raw = location.hash.slice(1) || "/";
  const [pathPart, queryPart] = raw.split("?");
  const segments = pathPart.split("/").filter(Boolean);
  const params = new URLSearchParams(queryPart || "");
  return { segments, params };
}

async function router() {
  const { segments, params } = parseHash();
  const [path, id] = segments;
  const searchQuery = params.get("q") || "";

  syncGlobalSearch(searchQuery);
  syncBackLink(path);
  ejectSearchBarFromContent();

  if (!path) {
    await renderHome(content);
  } else if (path === "categories") {
    await renderCategories(content);
  } else if (path === "categorie" && id) {
    await renderCategory(content, id);
  } else if (path === "recherche") {
    await renderSearch(content, searchQuery);
  } else {
    content.innerHTML = `<p class="not-found">Page introuvable. <a href="#/">Retour à l'accueil</a></p>`;
  }

  placeSearchBar(path);
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
