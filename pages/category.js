import { getManifest } from "../data.js";
import { fileCardHtml } from "../components.js";

export async function renderCategory(content, categoryId) {
  content.innerHTML = `<p class="loading">Chargement...</p>`;
  const { categories, fichiers } = await getManifest();

  const category = categories.find((c) => c.id === categoryId);
  const files = fichiers.filter((f) => f.categorie === categoryId);

  if (!category) {
    content.innerHTML = `<p class="not-found">Catégorie introuvable. <a href="#/">Retour à l'accueil</a></p>`;
    return;
  }

  content.innerHTML = `
    <a href="#/categories" class="back-link">&larr; Toutes les catégories</a>
    <h2>${category.nom}</h2>
    <img src="${category.image}" alt="${category.nom}" class="category-image" />
    <h3>Fichiers</h3>
    <ul class="file-list">
      ${files.map(fileCardHtml).join("") || "<p>Aucun fichier dans cette catégorie.</p>"}
    </ul>
  `;
}
