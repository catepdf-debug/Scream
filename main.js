import { renderHome } from "./pages/home.js";
import { renderCategories } from "./pages/categories.js";
import { renderCategory } from "./pages/category.js";
import { renderSearch } from "./pages/search.js";

const content = document.getElementById("content");

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

  if (!path) return renderHome(content);
  if (path === "categories") return renderCategories(content);
  if (path === "categorie" && id) return renderCategory(content, id);
  if (path === "recherche") return renderSearch(content, params.get("q") || "");

  content.innerHTML = `<p class="not-found">Page introuvable. <a href="#/">Retour à l'accueil</a></p>`;
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
