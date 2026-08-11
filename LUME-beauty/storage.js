/* =========================================================
   LUMÉ — Storage & Utility Layer
   Small, reusable helpers around localStorage.
   ========================================================= */

const STORE_KEYS = {
  cart: "lume_cart",
  wishlist: "lume_wishlist",
  users: "lume_users",
  session: "lume_session",
  orders: "lume_orders",
};

/* ---------- generic helpers ---------- */
function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}
function formatPrice(n) {
  return "$" + n.toFixed(2);
}

/* ---------- CART ---------- */
const Cart = {
  get() { return readStore(STORE_KEYS.cart, []); },
  save(items) { writeStore(STORE_KEYS.cart, items); document.dispatchEvent(new Event("lume:update")); },
  add(id, qty = 1) {
    const items = this.get();
    const line = items.find((i) => i.id === id);
    if (line) line.qty += qty; else items.push({ id, qty });
    this.save(items);
    Toast.show("Added to bag ✓");
  },
  remove(id) {
    this.save(this.get().filter((i) => i.id !== id));
    Toast.show("Removed from bag");
  },
  setQty(id, qty) {
    const items = this.get();
    const line = items.find((i) => i.id === id);
    if (!line) return;
    line.qty = Math.max(1, qty);
    this.save(items);
  },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  lines() {
    return this.get()
      .map((i) => ({ ...i, product: findProduct(i.id) }))
      .filter((l) => l.product);
  },
  subtotal() {
    return this.lines().reduce((s, l) => s + l.product.price * l.qty, 0);
  },
};

/* ---------- WISHLIST ---------- */
const Wishlist = {
  get() { return readStore(STORE_KEYS.wishlist, []); },
  save(ids) { writeStore(STORE_KEYS.wishlist, ids); document.dispatchEvent(new Event("lume:update")); },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const ids = this.get();
    if (ids.includes(id)) {
      this.save(ids.filter((x) => x !== id));
      Toast.show("Removed from wishlist");
      return false;
    } else {
      ids.push(id);
      this.save(ids);
      Toast.show("Saved to wishlist ♥");
      return true;
    }
  },
  count() { return this.get().length; },
  products() { return this.get().map(findProduct).filter(Boolean); },
};

/* ---------- AUTH ---------- */
const Auth = {
  users() { return readStore(STORE_KEYS.users, []); },
  saveUsers(u) { writeStore(STORE_KEYS.users, u); },
  currentUser() { return readStore(STORE_KEYS.session, null); },
  isLoggedIn() { return !!this.currentUser(); },
  register(name, email, password) {
    const users = this.users();
    if (users.find((u) => u.email === email)) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const user = { name, email, password, joined: new Date().toISOString() };
    users.push(user);
    this.saveUsers(users);
    writeStore(STORE_KEYS.session, { name, email });
    return { ok: true };
  },
  login(email, password) {
    const user = this.users().find((u) => u.email === email && u.password === password);
    if (!user) return { ok: false, error: "Incorrect email or password." };
    writeStore(STORE_KEYS.session, { name: user.name, email: user.email });
    return { ok: true };
  },
  logout() {
    localStorage.removeItem(STORE_KEYS.session);
    document.dispatchEvent(new Event("lume:update"));
  },
};

/* ---------- ORDERS ---------- */
const Orders = {
  all() { return readStore(STORE_KEYS.orders, []); },
  save(orders) { writeStore(STORE_KEYS.orders, orders); },
  place(order) {
    const orders = this.all();
    order.id = "LM" + Date.now().toString().slice(-8);
    order.date = new Date().toISOString();
    order.status = "Processing";
    orders.unshift(order);
    this.save(orders);
    return order;
  },
};

/* ---------- TOAST ---------- */
const Toast = {
  show(message) {
    let host = document.getElementById("toast-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "toast-host";
      document.body.appendChild(host);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    host.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, 2200);
  },
};

/* ---------- ICONS ---------- */
const Icons = {
  bottle: `<svg viewBox="0 0 48 48" fill="none"><path d="M19 6h10v6l3 4v26a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V16l3-4V6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M18 22h12" stroke="currentColor" stroke-width="2"/></svg>`,
  dropper: `<svg viewBox="0 0 48 48" fill="none"><path d="M24 6v8M17 14h14l-2 20a5 5 0 0 1-10 0l-2-20Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="24" cy="38" r="4" stroke="currentColor" stroke-width="2"/></svg>`,
  jar: `<svg viewBox="0 0 48 48" fill="none"><rect x="12" y="16" width="24" height="24" rx="4" stroke="currentColor" stroke-width="2"/><path d="M15 16c0-4 2-8 9-8s9 4 9 8" stroke="currentColor" stroke-width="2"/></svg>`,
  mask: `<svg viewBox="0 0 48 48" fill="none"><path d="M24 6c10 0 16 8 16 18s-6 18-16 18S8 34 8 24 14 6 24 6Z" stroke="currentColor" stroke-width="2"/><path d="M17 22c1.5-2 3-2 4 0M27 22c1.5-2 3-2 4 0M18 32c3 3 9 3 12 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  tube: `<svg viewBox="0 0 48 48" fill="none"><path d="M17 8h14l1 6H16l1-6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 14h16l-2 26a2 2 0 0 1-2 2H20a2 2 0 0 1-2-2l-2-26Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  gift: `<svg viewBox="0 0 48 48" fill="none"><rect x="8" y="18" width="32" height="22" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 26h32M24 18v22" stroke="currentColor" stroke-width="2"/><path d="M24 18c-8 0-8-10 0-10 4 0 4 5 0 10ZM24 18c8 0 8-10 0-10-4 0-4 5 0 10Z" stroke="currentColor" stroke-width="2"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 20.5s-7.5-4.6-10-9.3C0.3 7.6 2.6 4 6.3 4c2.2 0 3.9 1.1 5.7 3.3C13.8 5.1 15.5 4 17.7 4c3.7 0 6 3.6 4.3 7.2-2.5 4.7-10 9.3-10 9.3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.8"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="m20 20-4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 20c1.6-4 4.4-6 7.5-6s5.9 2 7.5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5 14.9 9l7 .6-5.3 4.6 1.6 6.8L12 17.6 5.8 21l1.6-6.8L2.1 9.6l7-.6L12 2.5Z"/></svg>`,
};
function iconFor(name) { return Icons[name] || Icons.bottle; }
