import { renderCategories } from "./categories.js";

export async function renderHome(content) {
  content.innerHTML = `
  <div class="wrapper-swipe-up">
   <div class="container">
    <div class="polpo-logo">
      <img src="Scream.png" alt="Logo Scream" />
        <h1>For A Safer Space For Camp Leaders</h1>
    </div>
    <div id="home-search-slot" class="home-search-slot"></div>
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
   <section class="categories-section"></section>
  </div>
  `;

  const wrapper = content.querySelector(".wrapper-swipe-up");
  const container = content.querySelector(".container");
  const categoriesSection = content.querySelector(".categories-section");
  const swipeUpBtn = content.querySelector(".swipe-up");

  swipeUpBtn.addEventListener("click", async () => {
    if (wrapper.classList.contains("open")) return;
    swipeUpBtn.disabled = true;

    // Reveal the real categories page underneath before sliding, so the
    // swipe-up animation exposes loaded content instead of a loading flash.
    await renderCategories(categoriesSection);
    wrapper.classList.add("open");

    container.addEventListener(
      "transitionend",
      () => {
        location.hash = "#/categories";
      },
      { once: true }
    );
  });
}
