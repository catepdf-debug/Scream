import { getManifest } from "../data.js";
import { fileCardHtml, escapeHtml } from "../components.js";

export async function renderSearch(content, initialQuery = "") {
  content.innerHTML = `<p class="loading">Chargement...</p>`;
  const { categories, fichiers } = await getManifest();

  content.innerHTML = `
    <section class="search-results-section">
      <div id="search-results"></div>
    </section>
  `;

  const input = document.getElementById("global-search-input");
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
      ${matchedFiles.length ? `
        <section>
          <ul class="file-list">
            ${matchedFiles.map((f) => fileCardHtml(f, categories)).join("")}
          </ul>
        </section>
      ` : ""}

      ${!matchedCategories.length && !matchedFiles.length ? "<p>Aucun résultat.</p>" : ""}
    `;
  }

  if (input && !input.dataset.searchBound) {
    input.addEventListener("input", () => {
      const q = input.value.trim();
      history.replaceState(null, "", q ? `#/recherche?q=${encodeURIComponent(q)}` : "#/recherche");
      runSearch(q);
    });
    input.dataset.searchBound = "true";
  }

  const form = document.getElementById("global-search-form");
  if (form && !form.dataset.searchRendererBound) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      runSearch(q);
      if (input) {
        input.value = "";
      }
      history.replaceState(null, "", q ? `#/recherche?q=${encodeURIComponent(q)}` : "#/recherche");
    });
    form.dataset.searchRendererBound = "true";
  }

  runSearch(initialQuery);
}
