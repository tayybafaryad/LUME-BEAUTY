/* =========================================================
   LUMÉ — Home Page Logic
   ========================================================= */

function initHome() {
  const featuredHost = document.getElementById("featuredGrid");
  const arrivalsHost = document.getElementById("arrivalsGrid");
  const bestHost = document.getElementById("bestGrid");
  const catHost = document.getElementById("categoryGrid");
  const reviewHost = document.getElementById("reviewGrid");

  if (catHost) {
    catHost.innerHTML = CATEGORIES.map((c) => `
      <a href="shop.html?cat=${c.id}" class="cat-card">
        <span class="cat-ic">${iconFor(c.icon)}</span>
        <strong>${c.name}</strong>
        <span>${c.blurb}</span>
      </a>
    `).join("");
  }

  if (featuredHost) {
    const featured = PRODUCTS.slice(0, 8);
    featuredHost.innerHTML = featured.map(productCardHTML).join("");
  }
  if (arrivalsHost) {
    const arrivals = PRODUCTS.filter((p) => p.tags.includes("new")).slice(0, 4);
    arrivalsHost.innerHTML = arrivals.map(productCardHTML).join("");
  }
  if (bestHost) {
    const best = PRODUCTS.filter((p) => p.tags.includes("bestseller")).slice(0, 4);
    bestHost.innerHTML = best.map(productCardHTML).join("");
  }
  if (reviewHost) {
    reviewHost.innerHTML = REVIEWS.slice(0, 6).map((r) => `
      <div class="review-card">
        <span class="stars">${starIcons(r.rating)}</span>
        <p>“${r.text}”</p>
        <div class="review-who">
          <span class="review-avatar">${r.name.split(" ").map(w => w[0]).join("")}</span>
          <div>
            <strong>${r.name}</strong>
            <span>Verified — ${r.product}</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  bindProductCardEvents();

  // Countdown timer for the offer strip
  const timerEl = document.getElementById("offerTimer");
  if (timerEl) {
    const end = Date.now() + (2 * 24 * 60 * 60 * 1000) + (6 * 60 * 60 * 1000);
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      timerEl.innerHTML = `
        <div><strong>${String(d).padStart(2, "0")}</strong><span>Days</span></div>
        <div><strong>${String(h).padStart(2, "0")}</strong><span>Hrs</span></div>
        <div><strong>${String(m).padStart(2, "0")}</strong><span>Min</span></div>
        <div><strong>${String(s).padStart(2, "0")}</strong><span>Sec</span></div>
      `;
    };
    tick();
    setInterval(tick, 1000);
  }

  // Newsletter form
  const nlForm = document.getElementById("newsletterForm");
  if (nlForm) {
    nlForm.addEventListener("submit", (e) => {
      e.preventDefault();
      Toast.show("You're on the list ✓ Welcome to LUMÉ");
      nlForm.reset();
    });
  }
}

document.addEventListener("DOMContentLoaded", initHome);
