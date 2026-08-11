/* =========================================================
   LUMÉ — Shop Page Logic
   ========================================================= */

const ShopState = {
  q: "",
  categories: [],
  skinTypes: [],
  maxPrice: 130,
  sort: "featured",
};

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function initShop() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) ShopState.q = params.get("q");
  if (params.get("cat")) ShopState.categories = [params.get("cat")];

  buildFilterUI();

  document.getElementById("sortSelect").addEventListener("change", (e) => {
    ShopState.sort = e.target.value;
    renderShop();
  });
  document.getElementById("priceRange").addEventListener("input", (e) => {
    ShopState.maxPrice = Number(e.target.value);
    document.getElementById("priceRangeLabel").textContent = "$0 – $" + ShopState.maxPrice;
    renderShop();
  });
  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    ShopState.q = ""; ShopState.categories = []; ShopState.skinTypes = []; ShopState.maxPrice = 130;
    document.querySelectorAll(".filter-option input").forEach((cb) => (cb.checked = false));
    document.getElementById("priceRange").value = 130;
    document.getElementById("priceRangeLabel").textContent = "$0 – $130";
    document.getElementById("shopSearchInput").value = "";
    history.replaceState(null, "", "shop.html");
    renderShop();
  });

  const shopSearch = document.getElementById("shopSearchInput");
  shopSearch.value = ShopState.q;
  shopSearch.addEventListener("input", (e) => {
    ShopState.q = e.target.value;
    renderShop();
  });

  renderShop();
}

function buildFilterUI() {
  const catHost = document.getElementById("catFilterGroup");
  catHost.innerHTML = CATEGORIES.map((c) => `
    <label class="filter-option">
      <input type="checkbox" value="${c.id}" ${ShopState.categories.includes(c.id) ? "checked" : ""} />
      ${c.name}
    </label>
  `).join("");
  catHost.querySelectorAll("input").forEach((cb) => {
    cb.addEventListener("change", () => {
      ShopState.categories = [...catHost.querySelectorAll("input:checked")].map((i) => i.value);
      renderShop();
    });
  });

  const allSkinTypes = [...new Set(PRODUCTS.flatMap((p) => p.skinType))].sort();
  const skinHost = document.getElementById("skinFilterGroup");
  skinHost.innerHTML = allSkinTypes.map((s) => `
    <label class="filter-option">
      <input type="checkbox" value="${s}" />
      ${s}
    </label>
  `).join("");
  skinHost.querySelectorAll("input").forEach((cb) => {
    cb.addEventListener("change", () => {
      ShopState.skinTypes = [...skinHost.querySelectorAll("input:checked")].map((i) => i.value);
      renderShop();
    });
  });
}

function getFiltered() {
  let list = PRODUCTS.filter((p) => {
    if (ShopState.q && !p.name.toLowerCase().includes(ShopState.q.toLowerCase()) && !p.category.includes(ShopState.q.toLowerCase())) return false;
    if (ShopState.categories.length && !ShopState.categories.includes(p.category)) return false;
    if (ShopState.skinTypes.length && !p.skinType.some((s) => ShopState.skinTypes.includes(s))) return false;
    if (p.price > ShopState.maxPrice) return false;
    return true;
  });

  switch (ShopState.sort) {
    case "price-asc": list.sort((a, b) => a.price - b.price); break;
    case "price-desc": list.sort((a, b) => b.price - a.price); break;
    case "rating": list.sort((a, b) => b.rating - a.rating); break;
    case "newest": list.sort((a, b) => (b.tags.includes("new") ? 1 : 0) - (a.tags.includes("new") ? 1 : 0)); break;
    default: break; // featured = source order
  }
  return list;
}

function renderShop() {
  const grid = document.getElementById("shopGrid");
  const list = getFiltered();
  document.getElementById("resultCount").textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;

  renderChips();

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="ic">${iconFor("search")}</div>
        <h3>No products match your filters</h3>
        <p>Try adjusting your search, category or price range.</p>
      </div>
    `;
    return;
  }
  grid.innerHTML = list.map(productCardHTML).join("");
  bindProductCardEvents(grid);
}

function renderChips() {
  const host = document.getElementById("chipsRow");
  const chips = [];
  if (ShopState.q) chips.push({ label: `“${ShopState.q}”`, clear: () => { ShopState.q = ""; document.getElementById("shopSearchInput").value = ""; } });
  ShopState.categories.forEach((c) => chips.push({
    label: CATEGORIES.find((x) => x.id === c)?.name || c,
    clear: () => {
      ShopState.categories = ShopState.categories.filter((x) => x !== c);
      const el = document.querySelector(`#catFilterGroup input[value="${c}"]`);
      if (el) el.checked = false;
    },
  }));
  ShopState.skinTypes.forEach((s) => chips.push({
    label: s,
    clear: () => {
      ShopState.skinTypes = ShopState.skinTypes.filter((x) => x !== s);
      const el = document.querySelector(`#skinFilterGroup input[value="${s}"]`);
      if (el) el.checked = false;
    },
  }));

  if (!chips.length) { host.innerHTML = ""; return; }
  host.innerHTML = chips.map((c, i) => `<span class="chip" data-chip="${i}">${c.label} <button aria-label="Remove filter">×</button></span>`).join("");
  host.querySelectorAll("[data-chip]").forEach((el, i) => {
    el.querySelector("button").addEventListener("click", () => {
      chips[i].clear();
      renderShop();
    });
  });
}

document.addEventListener("DOMContentLoaded", initShop);
