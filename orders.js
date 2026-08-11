/* =========================================================
   LUMÉ — My Orders Page Logic
   ========================================================= */

const STATUS_CYCLE = ["Processing", "Shipped", "Delivered"];

function statusClass(status) {
  return { Processing: "status-processing", Shipped: "status-shipped", Delivered: "status-delivered" }[status] || "status-processing";
}

function renderOrders() {
  const orders = Orders.all();
  const host = document.getElementById("ordersList");
  const empty = document.getElementById("ordersEmpty");
  const justPlaced = new URLSearchParams(window.location.search).get("justPlaced");

  if (!orders.length) {
    host.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  host.innerHTML = orders.map((o) => `
    <div class="order-card">
      <div class="order-top">
        <div>
          <h4>Order #${o.id} ${justPlaced === o.id ? '<span class="status-pill status-delivered" style="margin-left:8px;">Placed ✓</span>' : ""}</h4>
          <span>${new Date(o.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} · ${o.payment}</span>
        </div>
        <span class="status-pill ${statusClass(o.status)}">${o.status}</span>
      </div>
      <div class="order-items">
        ${o.items.map((it) => {
          const p = findProduct(it.id);
          const cat = p ? CATEGORIES.find((c) => c.id === p.category) : null;
          return `
          <div class="order-item-mini">
            <div class="cart-thumb" style="background: linear-gradient(155deg, ${p ? p.palette[0] : "#eee"}, ${p ? p.palette[1] : "#fafafa"});">
              ${iconFor(cat?.icon)}
            </div>
            <span>${it.name} × ${it.qty}</span>
          </div>`;
        }).join("")}
      </div>
      <div class="mini-line"><span>Shipping to</span><span>${o.shipping.city}, ${o.shipping.country}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(o.totals.total)}</span></div>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", renderOrders);
