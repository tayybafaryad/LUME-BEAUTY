/* =========================================================
   LUMÉ — Shared Layout (header + footer)
   Injected into every page via #site-header / #site-footer
   ========================================================= */

function renderHeader() {
  const host = document.getElementById("site-header");
  if (!host) return;
  const page = document.body.dataset.page || "";
  const nav = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "shop.html", label: "Shop", key: "shop" },
    { href: "contact.html", label: "About & Contact", key: "contact" },
  ];

  host.innerHTML = `
    <div class="announce">Free shipping on orders over $50 — welcome to the ritual ✨</div>
    <div class="nav-wrap">
      <div class="nav container">
        <button class="nav-burger" id="navBurger" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
        <a href="index.html" class="brand">
          <span class="brand-mark">${iconFor("dropper")}</span>
          <span class="brand-name">LUMÉ</span>
        </a>
        <nav class="nav-links" id="navLinks">
          ${nav.map(n => `<a href="${n.href}" class="${page === n.key ? "active" : ""}">${n.label}</a>`).join("")}
        </nav>
        <form class="nav-search" id="navSearchForm" role="search">
          <span class="icon">${iconFor("search")}</span>
          <input id="navSearchInput" type="search" placeholder="Search for serums, masks…" aria-label="Search products" />
        </form>
        <div class="nav-actions">
          <a href="orders.html" class="icon-btn only-desktop" title="My account / orders">${iconFor("user")}</a>
          <a href="wishlist.html" class="icon-btn" title="Wishlist">
            ${iconFor("heart")}<span class="badge" id="wishBadge">0</span>
          </a>
          <a href="cart.html" class="icon-btn" title="Shopping bag">
            ${iconFor("bag")}<span class="badge" id="cartBadge">0</span>
          </a>
        </div>
      </div>
      <nav class="nav-links-mobile" id="navLinksMobile">
        ${nav.map(n => `<a href="${n.href}" class="${page === n.key ? "active" : ""}">${n.label}</a>`).join("")}
        <a href="login.html">Login / Register</a>
        <a href="orders.html">My Orders</a>
      </nav>
    </div>
  `;

  const burger = document.getElementById("navBurger");
  const mobileNav = document.getElementById("navLinksMobile");
  burger.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
    burger.classList.toggle("open");
  });

  const searchForm = document.getElementById("navSearchForm");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("navSearchInput").value.trim();
    window.location.href = "shop.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });

  updateBadges();
}

function updateBadges() {
  const cartBadge = document.getElementById("cartBadge");
  const wishBadge = document.getElementById("wishBadge");
  if (cartBadge) cartBadge.textContent = Cart.count();
  if (wishBadge) wishBadge.textContent = Wishlist.count();
}

function renderFooter() {
  const host = document.getElementById("site-footer");
  if (!host) return;
  host.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="brand">
            <span class="brand-mark">${iconFor("dropper")}</span>
            <span class="brand-name">LUMÉ</span>
          </a>
          <p>Small-batch, botanical skincare formulated for a soft, luminous everyday glow.</p>
          <div class="social-row">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Pinterest">PT</a>
            <a href="#" aria-label="TikTok">TT</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <a href="shop.html?cat=cleanser">Cleansers</a>
          <a href="shop.html?cat=serum">Serums</a>
          <a href="shop.html?cat=moisturizer">Moisturizers</a>
          <a href="shop.html?cat=set">Gift Sets</a>
        </div>
        <div class="footer-col">
          <h4>Account</h4>
          <a href="login.html">Login / Register</a>
          <a href="orders.html">My Orders</a>
          <a href="wishlist.html">Wishlist</a>
          <a href="cart.html">Shopping Bag</a>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <a href="contact.html">Contact Us</a>
          <a href="contact.html#faq">FAQs</a>
          <a href="contact.html">Shipping &amp; Returns</a>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>© ${new Date().getFullYear()} LUMÉ Skincare. A GitHub portfolio project — not a real store.</p>
      </div>
    </footer>
  `;
}

document.addEventListener("lume:update", updateBadges);
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
