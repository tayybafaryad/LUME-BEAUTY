/* =========================================================
   LUMÉ — Shared product-card rendering
   Used by home.js, shop.js, wishlist.js, product.js
   ========================================================= */

function productCardHTML(p) {
  const tag = p.tags[0];
  const wished = Wishlist.has(p.id);
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-visual" style="background: linear-gradient(155deg, ${p.palette[0]}, ${p.palette[1]});">
        ${tag ? `<span class="product-tag ${tag}">${tag === "new" ? "New" : "Bestseller"}</span>` : ""}
        <button class="wish-toggle ${wished ? "active" : ""}" data-wish="${p.id}" aria-label="Toggle wishlist">${iconFor("heart")}</button>
        <span class="pv-icon">${iconFor(CATEGORIES.find(c => c.id === p.category)?.icon)}</span>
      </div>
      <div class="product-body">
        <span class="product-cat">${CATEGORIES.find(c => c.id === p.category)?.name || ""}</span>
        <h3 class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="rating-row">
          <span class="stars">${starIcons(p.rating)}</span> ${p.rating} (${p.reviews})
        </div>
        <div class="price-row">
          <span class="price">${formatPrice(p.price)}${p.priceUnit || ""}</span>
          ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ""}
        </div>
        <div class="add-row">
          <button class="add-btn" data-add="${p.id}">${iconFor("bag")} Add to Bag</button>
        </div>
      </div>
    </div>
  `;
}

function starIcons(rating) {
  const full = Math.round(rating);
  return Array.from({ length: 5 }, (_, i) => `<span style="opacity:${i < full ? 1 : .3}">${iconFor("star")}</span>`).join("");
}

function bindProductCardEvents(root = document) {
  root.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      Cart.add(btn.dataset.add, 1);
    });
  });
  root.querySelectorAll("[data-wish]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const active = Wishlist.toggle(btn.dataset.wish);
      btn.classList.toggle("active", active);
      if (typeof renderWishlistPage === "function" && document.body.dataset.page === "wishlist") {
        renderWishlistPage();
      }
    });
  });
}
