import { getManifest } from "../data.js";

export async function renderHome(content) {
  content.innerHTML = `<p class="loading">Chargement...</p>`;

  const { categories } = await getManifest();

  content.innerHTML = `
    <section class="categories-section">
      <h2>Catégories</h2>
      <ul class="category-list">
        ${categories.map((cat) => `
          <li><a href="#/categorie/${cat.id}" class="category-link">${cat.nom}</a></li>
        `).join("")}
      </ul>
    </section>
  `;
}
