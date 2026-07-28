import { getManifest } from "../data.js";
import { fileCardHtml } from "../components.js";
import { openAnonymousModal } from "../modal.js";

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
    <a href="#/categories">
    <img src="arrowcircle.png" alt="Indietro">
    </a>
    <img src="${category.image}" style="border-color:${category.color};" alt="${category.nom}" class="category-image" />
    <ul class="file-list" style="border-color: ${category.color};">
      ${files.map(fileCardHtml).join("") || "<p>Aucun fichier dans cette catégorie.</p>"}
    </ul>

    <a href="#" class="anonymous-trigger">
        <span class="evidenza">Click to Send</span> an Anonymous Message
    </a>
  `;

  content.querySelector(".anonymous-trigger")?.addEventListener("click", openAnonymousModal);
}
