import { renderHome } from "./pages/home.js";
import { renderCategories } from "./pages/categories.js";
import { renderCategory } from "./pages/category.js";
import { renderSearch } from "./pages/search.js";

const content = document.getElementById("content");
const globalSearchForm = document.getElementById("global-search-form");
const globalSearchInput = document.getElementById("global-search-input");
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
