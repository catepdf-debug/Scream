import { renderHome } from "./pages/home.js";
import { renderCategories } from "./pages/categories.js";
import { renderCategory } from "./pages/category.js";
import { renderSearch } from "./pages/search.js";

const content = document.getElementById("content");
const globalSearchForm = document.getElementById("global-search-form");
const globalSearchInput = document.getElementById("global-search-input");

function syncGlobalSearch(query = "") {
  if (globalSearchInput) {
    globalSearchInput.value = query;
  }
}

function goToSearch(query) {
  const normalized = query.trim();
  const target = normalized ? `#/recherche?q=${encodeURIComponent(normalized)}` : "#/recherche";
  location.hash = target;
}

if (globalSearchForm && globalSearchInput) {
  globalSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    goToSearch(globalSearchInput.value);
  });
  globalSearchForm.dataset.searchBound = "true";
}

function parseHash() {
  const raw = location.hash.slice(1) || "/";
  const [pathPart, queryPart] = raw.split("?");
  const segments = pathPart.split("/").filter(Boolean);
  const params = new URLSearchParams(queryPart || "");
  return { segments, params };
}

function router() {
  const { segments, params } = parseHash();
  const [path, id] = segments;
  const searchQuery = params.get("q") || "";

  if (searchQuery) {
    syncGlobalSearch(searchQuery);
  }

  if (!path) return renderHome(content);
  if (path === "categories") return renderCategories(content);
  if (path === "categorie" && id) return renderCategory(content, id);
  if (path === "recherche") return renderSearch(content, searchQuery);

  content.innerHTML = `<p class="not-found">Page introuvable. <a href="#/">Retour à l'accueil</a></p>`;
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
