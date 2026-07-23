import { getManifest } from "../data.js";

export async function renderCategories(content) {
  content.innerHTML = `<p class="loading">Chargement...</p>`;
  const { categories, fichiers } = await getManifest();

  content.innerHTML = `
    <span class="back-link"><a href="#/">&#8592; Retour à l'accueil</a></span>
    <h2>Toutes les catégories</h2>
    <ul class="category-list">
      ${categories.map((cat) => {
        const count = fichiers.filter((f) => f.categorie === cat.id).length;
        return `<li><a href="#/categorie/${cat.id}" class="category-link"><img src="${cat.image}" alt="${cat.nom}" class="categories-image" />${cat.nom}</a></li>`;
      }).join("")}
    </ul>
  `;
}
