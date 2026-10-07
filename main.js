document.addEventListener("DOMContentLoaded", () => {

  const nav = document.querySelector(".site-nav");
  const menuButton = document.querySelector(".menu-button");

  if (!nav || !menuButton) return;

  menuButton.addEventListener("click", () => {

    const isOpen = nav.classList.toggle("is-open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );

  });

  document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

      nav.classList.remove("is-open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.setAttribute(
        "aria-label",
        "Open menu"
      );

    });

  });

});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}
