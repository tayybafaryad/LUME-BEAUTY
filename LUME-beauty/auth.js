/* =========================================================
   LUMÉ — Auth Page Logic
   ========================================================= */

function switchAuthTab(tab) {
  document.querySelectorAll(".auth-tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
  document.querySelectorAll(".auth-panel").forEach((p) => p.classList.toggle("active", p.id === tab));
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add("show");
}
function hideError(id) {
  document.getElementById(id).classList.remove("show");
}

function initAuth() {
  if (Auth.isLoggedIn()) {
    document.getElementById("authGate").style.display = "none";
    document.getElementById("accountPanel").style.display = "block";
    const u = Auth.currentUser();
    document.getElementById("accName").textContent = u.name;
    document.getElementById("accEmail").textContent = u.email;
    document.getElementById("logoutBtn").addEventListener("click", () => {
      Auth.logout();
      window.location.reload();
    });
    return;
  }

  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchAuthTab(tab.dataset.tab));
  });

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    hideError("loginError");
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value;
    const res = Auth.login(email, pass);
    if (!res.ok) return showError("loginError", res.error);
    Toast.show("Welcome back ✓");
    window.location.href = "index.html";
  });

  document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    hideError("registerError");
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirm").value;
    if (pass.length < 6) return showError("registerError", "Password must be at least 6 characters.");
    if (pass !== confirm) return showError("registerError", "Passwords do not match.");
    const res = Auth.register(name, email, pass);
    if (!res.ok) return showError("registerError", res.error);
    Toast.show("Account created — welcome to LUMÉ ✓");
    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", initAuth);
