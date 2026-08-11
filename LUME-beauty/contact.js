/* =========================================================
   LUMÉ — Contact / About Page Logic
   ========================================================= */

function initContact() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.querySelector(".faq-q").addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      Toast.show("Message sent — we'll reply within 24 hours ✓");
      form.reset();
    });
  }

  document.querySelectorAll(".value-grid .cat-ic").forEach((el) => {
    el.innerHTML = iconFor(el.dataset.icon);
  });
}

document.addEventListener("DOMContentLoaded", initContact);
