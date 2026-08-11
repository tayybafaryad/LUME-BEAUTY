/* =========================================================
   LUMÉ — Shopping Cart Page Logic
   ========================================================= */

const PROMO_CODES = { GLOW20: 0.2, LUME10: 0.1 };
let appliedPromo = 0;

function renderCartPage() {
  const lines = Cart.lines();
  const host = document.getElementById("cartLines");
  const emptyState = document.getElementById("cartEmpty");
  const summary = document.getElementById("cartSummaryWrap");

  if (!lines.length) {
    host.innerHTML = "";
    emptyState.style.display = "block";
    summary.style.display = "none";
    return;
  }
  emptyState.style.display = "none";
  summary.style.display = "block";

  host.innerHTML = lines.map((l) => {
    const cat = CATEGORIES.find((c) => c.id === l.product.category);
    return `
    <div class="cart-line" data-id="${l.id}">
      <div class="cart-thumb" style="background: linear-gradient(155deg, ${l.product.palette[0]}, ${l.product.palette[1]});">
        ${iconFor(cat?.icon)}
      </div>
      <div>
        <span class="cat-label">${cat?.name || ""}</span>
        <h4>${l.product.name}</h4>
        <div class="qty-control" style="margin-top:8px;">
          <button data-minus="${l.id}" aria-label="Decrease">−</button>
          <input data-qtyinput="${l.id}" type="number" min="1" value="${l.qty}" />
          <button data-plus="${l.id}" aria-label="Increase">+</button>
        </div>
        <a href="#" class="remove-link" data-remove="${l.id}">Remove</a>
      </div>
      <span class="price">${formatPrice(l.product.price * l.qty)}</span>
    </div>`;
  }).join("");

  host.querySelectorAll("[data-minus]").forEach((b) => b.addEventListener("click", () => {
    const line = Cart.lines().find((l) => l.id === b.dataset.minus);
    Cart.setQty(b.dataset.minus, line.qty - 1);
    renderCartPage();
  }));
  host.querySelectorAll("[data-plus]").forEach((b) => b.addEventListener("click", () => {
    const line = Cart.lines().find((l) => l.id === b.dataset.plus);
    Cart.setQty(b.dataset.plus, line.qty + 1);
    renderCartPage();
  }));
  host.querySelectorAll("[data-qtyinput]").forEach((inp) => inp.addEventListener("change", () => {
    Cart.setQty(inp.dataset.qtyinput, Number(inp.value) || 1);
    renderCartPage();
  }));
  host.querySelectorAll("[data-remove]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    Cart.remove(a.dataset.remove);
    renderCartPage();
  }));

  renderSummary();
}

function renderSummary() {
  const subtotal = Cart.subtotal();
  const discount = subtotal * appliedPromo;
  const shipping = subtotal - discount >= 50 || subtotal === 0 ? 0 : 5.95;
  const total = subtotal - discount + shipping;

  document.getElementById("sumSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("sumDiscountRow").style.display = discount > 0 ? "flex" : "none";
  document.getElementById("sumDiscount").textContent = "− " + formatPrice(discount);
  document.getElementById("sumShipping").textContent = shipping === 0 ? "Free" : formatPrice(shipping);
  document.getElementById("sumTotal").textContent = formatPrice(total);
}

function initCart() {
  renderCartPage();

  document.getElementById("promoForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = document.getElementById("promoInput").value.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      appliedPromo = PROMO_CODES[code];
      Toast.show(`Promo applied — ${PROMO_CODES[code] * 100}% off ✓`);
    } else {
      appliedPromo = 0;
      Toast.show("That code isn't valid");
    }
    renderSummary();
  });
}

document.addEventListener("DOMContentLoaded", initCart);
