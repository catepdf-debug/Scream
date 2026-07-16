import { getManifest } from "../data.js";

export async function renderHome(content) {
  content.innerHTML = `<p class="loading">Chargement...</p>`;

  const { categories } = await getManifest();

  content.innerHTML = `
    <section class="search-section">
      <form id="search-form" class="search-form">
        <input type="search" id="search-input" placeholder="Rechercher un document..." autocomplete="off" />
        <button type="submit">Rechercher</button>
      </form>
    </section>

    <section class="categories-section">
      <h2>Catégories</h2>
      <ul class="category-list">
        ${categories.map((cat) => `
          <li><a href="#/categorie/${cat.id}" class="category-link">${cat.nom}</a></li>
        `).join("")}
      </ul>
    </section>
  `;

  document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("search-input").value.trim();
    location.hash = `#/recherche?q=${encodeURIComponent(q)}`;
  });
}
