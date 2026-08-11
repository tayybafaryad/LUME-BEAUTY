/* =========================================================
   LUMÉ — Product Details Page Logic
   ========================================================= */

let currentQty = 1;

function initProduct() {
  const id = new URLSearchParams(window.location.search).get("id");
  const product = findProduct(id) || PRODUCTS[0];
  const cat = CATEGORIES.find((c) => c.id === product.category);

  document.title = `${product.name} — LUMÉ`;
  document.getElementById("crumbName").textContent = product.name;
  document.getElementById("crumbCat").textContent = cat?.name || "";
  document.getElementById("crumbCat").href = `shop.html?cat=${product.category}`;

  document.getElementById("pdVisual").style.background = `linear-gradient(155deg, ${product.palette[0]}, ${product.palette[1]})`;
  document.getElementById("pdVisual").innerHTML = `<span class="pv-icon">${iconFor(cat?.icon)}</span>`;
  document.getElementById("pdThumbs").innerHTML = [0, 1, 2].map((i) => `
    <div class="pd-thumb ${i === 0 ? "active" : ""}" style="background: linear-gradient(155deg, ${product.palette[i % 2]}, ${product.palette[(i + 1) % 2]});">
      ${iconFor(cat?.icon)}
    </div>
  `).join("");
  document.querySelectorAll(".pd-thumb").forEach((t) => t.addEventListener("click", () => {
    document.querySelectorAll(".pd-thumb").forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    document.getElementById("pdVisual").style.background = t.style.background;
  }));

  document.getElementById("pdCat").textContent = cat?.name || "";
  document.getElementById("pdName").textContent = product.name;
  document.getElementById("pdStars").innerHTML = starIcons(product.rating);
  document.getElementById("pdRatingText").textContent = `${product.rating} · ${product.reviews} reviews`;
  document.getElementById("pdPrice").textContent = formatPrice(product.price) + (product.priceUnit || "");
  if (product.oldPrice) {
    document.getElementById("pdOldPrice").textContent = formatPrice(product.oldPrice);
    document.getElementById("pdOldPrice").style.display = "inline";
  }
  document.getElementById("pdDesc").textContent = product.description;
  document.getElementById("pdSkinTypes").innerHTML = product.skinType.map((s) => `<span class="skin-pill">${s}</span>`).join("");
  document.getElementById("pdIngredients").innerHTML = product.ingredients.map((i) => `<li>${i}</li>`).join("");
  document.getElementById("pdHowTo").textContent = product.howToUse || "Follow the ritual card included with your order.";

  const wishBtn = document.getElementById("pdWishBtn");
  wishBtn.innerHTML = iconFor("heart");
  wishBtn.classList.toggle("active", Wishlist.has(product.id));
  wishBtn.addEventListener("click", () => {
    const active = Wishlist.toggle(product.id);
    wishBtn.classList.toggle("active", active);
  });

  document.getElementById("qtyMinus").addEventListener("click", () => setQty(currentQty - 1));
  document.getElementById("qtyPlus").addEventListener("click", () => setQty(currentQty + 1));
  document.getElementById("qtyInput").addEventListener("change", (e) => setQty(Number(e.target.value) || 1));

  document.getElementById("pdAddIcon").innerHTML = iconFor("bag");
  document.getElementById("pdAddBtn").addEventListener("click", () => {
    Cart.add(product.id, currentQty);
  });

  // Tabs
  document.querySelectorAll(".tab-head").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-head").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // Related products
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const relatedHost = document.getElementById("relatedGrid");
  if (related.length) {
    relatedHost.innerHTML = related.map(productCardHTML).join("");
    bindProductCardEvents(relatedHost);
  } else {
    document.getElementById("relatedSection").style.display = "none";
  }
}

function setQty(n) {
  currentQty = Math.max(1, n);
  document.getElementById("qtyInput").value = currentQty;
}

document.addEventListener("DOMContentLoaded", initProduct);
