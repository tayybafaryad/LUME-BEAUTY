/* =========================================================
   LUMÉ — Checkout Page Logic
   ========================================================= */

function renderCheckoutSummary() {
  const lines = Cart.lines();
  const host = document.getElementById("checkoutItems");
  if (!lines.length) {
    window.location.href = "cart.html";
    return;
  }
  host.innerHTML = lines.map((l) => {
    const cat = CATEGORIES.find((c) => c.id === l.product.category);
    return `
      <div class="mini-cart-item">
        <div class="cart-thumb" style="background: linear-gradient(155deg, ${l.product.palette[0]}, ${l.product.palette[1]});">${iconFor(cat?.icon)}</div>
        <div style="flex:1;">
          <h5>${l.product.name}</h5>
          <span>Qty ${l.qty} · ${formatPrice(l.product.price)}</span>
        </div>
        <span class="price" style="font-size:.9rem;">${formatPrice(l.product.price * l.qty)}</span>
      </div>`;
  }).join("");

  const subtotal = Cart.subtotal();
  const shipping = subtotal >= 50 ? 0 : 5.95;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  document.getElementById("coSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("coShipping").textContent = shipping === 0 ? "Free" : formatPrice(shipping);
  document.getElementById("coTax").textContent = formatPrice(tax);
  document.getElementById("coTotal").textContent = formatPrice(total);

  return { subtotal, shipping, tax, total };
}

function initCheckout() {
  const user = Auth.currentUser();
  if (user) {
    document.getElementById("ckName").value = user.name || "";
    document.getElementById("ckEmail").value = user.email || "";
  }

  renderCheckoutSummary();

  document.querySelectorAll(".pay-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".pay-option").forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
      opt.querySelector("input").checked = true;
    });
  });
  document.querySelector(".pay-option")?.classList.add("selected");

  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const totals = renderCheckoutSummary();
    const form = e.target;
    const order = {
      customer: {
        name: form.ckName.value,
        email: form.ckEmail.value,
        phone: form.ckPhone.value,
      },
      shipping: {
        address: form.ckAddress.value,
        city: form.ckCity.value,
        zip: form.ckZip.value,
        country: form.ckCountry.value,
      },
      payment: document.querySelector('input[name="payMethod"]:checked')?.value || "Card",
      items: Cart.lines().map((l) => ({ id: l.id, name: l.product.name, qty: l.qty, price: l.product.price })),
      totals,
    };
    const placed = Orders.place(order);
    Cart.clear();
    window.location.href = `orders.html?justPlaced=${placed.id}`;
  });
}

document.addEventListener("DOMContentLoaded", initCheckout);
