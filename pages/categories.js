import { getManifest } from "../data.js";
import { openAnonymousModal } from "../modal.js";

export async function renderCategories(content) {
  content.innerHTML = `<p class="loading">Chargement...</p>`;
  const { categories, fichiers } = await getManifest();

  content.innerHTML = `
  <span class="back-link">
    <a href="#/">
        <img src="arrowcircle.png" alt="Indietro">
    </a>
</span>

    <ul class="category-list">
      ${categories.map((cat) => {
        const count = fichiers.filter((f) => f.categorie === cat.id).length;
        return `<li style="background-color:${cat.color};"><a href="#/categorie/${cat.id}" class="category-link"><img src="${cat.image}" alt="${cat.nom}" class="categories-image" />${cat.nom}</a></li>`;
      }).join("")}
    </ul>

    <a href="#" class="anonymous-trigger">
        <span class="evidenza">Click to Send</span> an Anonymous Message
    </a>
  `;

  content.querySelector(".anonymous-trigger")?.addEventListener("click", openAnonymousModal);
}

