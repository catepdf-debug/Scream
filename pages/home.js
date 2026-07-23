import { getManifest } from "../data.js";

export async function renderHome(content) {
  content.innerHTML = `<p class="loading">Chargement...</p>`;

  const { categories } = await getManifest();

  content.innerHTML = `
  <div class="wrapper-swipe-up">
   <div class="container">
    <div class="polpo-logo">
      <img src="Scream.png" alt="Logo Scream" />
        <h1>For A Safer Space For Camp Leaders</h1>
    </div>
    <section class="app-search-bar" aria-label="Recherche">
        <form id="global-search-form" class="search-form">
          <input type="search" id="global-search-input" placeholder="Rechercher un document..." autocomplete="off" />
         
        </form>
      </section>
    <div class="alliance-logo">
      <h2> Community of interest <br>
       SCREAM on behalf of </h2>
      <img src="Alliance-Logo-214x300.png">
    </div>

    <div class="swipe-up-container">
    <div class="arrows">
      <div class="arrow-icon">
        <img src="./assets/arrow-up.svg" alt="Arrow Up Icon" />
        </div>
      </div>
      <div>
        <button class="swipe-up">Swipe Up To Explore All Categories </button>
      </div>
    </div>
    </div>
    <section class="categories-section">
      <h2>Catégories</h2>
      <ul class="category-list">
        ${categories.map((cat) => `
          <li><a href="#/categorie/${cat.id}" class="category-link">${cat.nom}</a></li>
        `).join("")}
      </ul>
    </section>
    </div>
  `;

  const wrapper = content.querySelector(".wrapper-swipe-up");
  const swipeUpBtn = content.querySelector(".swipe-up");
  swipeUpBtn.addEventListener("click", () => {
    wrapper.classList.add("open");
  });
}
