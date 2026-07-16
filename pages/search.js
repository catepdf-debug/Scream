import { getManifest } from "../data.js";
import { fileCardHtml, escapeHtml } from "../components.js";

export async function renderSearch(content, initialQuery = "") {
  content.innerHTML = `<p class="loading">Chargement...</p>`;
  const { categories, fichiers } = await getManifest();

  content.innerHTML = `
    <form id="search-form" class="search-form">
      <input type="search" id="search-input" placeholder="Rechercher..." autocomplete="off" value="${escapeHtml(initialQuery)}" />
      <button type="submit">Rechercher</button>
    </form>
    <div id="search-results"></div>
  `;

  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");

  const categoryFuse = new Fuse(categories, { keys: ["nom"], threshold: 0.3 });
  const fileFuse = new Fuse(fichiers, {
    keys: ["nom", "motsCles", "description"],
    threshold: 0.35,
  });

  function runSearch(query) {
    if (!query) {
      results.innerHTML = "<p>Tape un mot-clé pour rechercher.</p>";
      return;
    }

    const matchedCategories = categoryFuse.search(query).map((r) => r.item);
    const matchedFiles = fileFuse.search(query).map((r) => r.item);

    results.innerHTML = `
      ${matchedCategories.length ? `
        <section>
          <h3>Catégories</h3>
          <ul class="category-list">
            ${matchedCategories.map((c) => `<li><a href="#/categorie/${c.id}" class="category-link">${c.nom}</a></li>`).join("")}
          </ul>
        </section>
      ` : ""}

      ${matchedFiles.length ? `
        <section>
          <h3>Fichiers (${matchedFiles.length})</h3>
          <ul class="file-list">
            ${matchedFiles.map(fileCardHtml).join("")}
          </ul>
        </section>
      ` : ""}

      ${!matchedCategories.length && !matchedFiles.length ? "<p>Aucun résultat.</p>" : ""}
    `;
  }

  input.addEventListener("input", () => {
    const q = input.value.trim();
    history.replaceState(null, "", `#/recherche?q=${encodeURIComponent(q)}`);
    runSearch(q);
  });

  document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    runSearch(input.value.trim());
  });

  runSearch(initialQuery);
}
