/* =========================================================
   LUMÉ — Wishlist Page Logic
   ========================================================= */

function renderWishlistPage() {
  const items = Wishlist.products();
  const grid = document.getElementById("wishGrid");
  const empty = document.getElementById("wishEmpty");

  if (!items.length) {
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  grid.innerHTML = items.map(productCardHTML).join("");
  bindProductCardEvents(grid);
}

document.addEventListener("DOMContentLoaded", renderWishlistPage);
