import { renderCategories } from "./categories.js";

export async function renderHome(content) {
  content.innerHTML = `
  <div class="wrapper-swipe-up">
   <div class="container">
    <div class="polpo-logo">
      <img src="./assets/Scream.png" alt="Logo Scream" />
        <h1>For a Safer Space for Camp Leaders</h1>
    </div>
    <div id="home-search-slot" class="home-search-slot"></div>
    <div>
        <button class="swipe-up">SCREAM Around Categories </button>
      </div>
    <div class="alliance-logo">
      <h2> Community of Interest <br>
       SCREAM on Behalf of: </h2>
       <a href="https://www.alliance-network.eu/">
       <img src="./assets/Alliance-Logo-214x300.png">
       <a>

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
