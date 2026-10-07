const projects = [
  { title: "Grand Opening", image: "assets/images/graphic/01-grand-opening.jpg.jpg" },
  { title: "A Portal Between Worlds", image: "assets/images/graphic/02-portal-between.jpg.jpg" },
  { title: "New Beginnings", image: "assets/images/graphic/03-new-beginnings.jpg.jpg" },
  { title: "Today’s Special", image: "assets/images/graphic/04-todays-special.jpg.jpg" },
  { title: "Summer Freshness", image: "assets/images/graphic/05-summer-freshness.jpg.jpg" },
  { title: "The Journey Within", image: "assets/images/graphic/06-journey-within.jpg.jpg" },
  { title: "The Rise of AI", image: "assets/images/graphic/07-rise-of-ai.jpg.jpg" },
  { title: "Namma Kovai", image: "assets/images/graphic/08-namma-kovai.jpg.jpg" },
  { title: "Eagle Zone", image: "assets/images/graphic/09-eagle-zone.jpg.png" }
];

const carousel = document.querySelector(".carousel");
const mainImage = document.querySelector("#carouselImage");
const previousImage = document.querySelector(".carousel-prev-image");
const nextImage = document.querySelector(".carousel-next-image");
const previousButton = document.querySelector(".carousel-prev");
const nextButton = document.querySelector(".carousel-next");
const pagination = document.querySelector(".pagination-dots");
const thumbnails = document.querySelector(".carousel-thumbnails");

if (carousel && mainImage && previousImage && nextImage) {
  let activeIndex = 6;
  let dragStart = null;

  function getProject(index) {
    return projects[(index + projects.length) % projects.length];
  }

  function selectRelative(amount) {
    activeIndex = (activeIndex + amount + projects.length) % projects.length;
    render();
  }

  function selectProject(index) {
    activeIndex = index;
    render();
  }

  function render() {
    const active = getProject(activeIndex);
    const previous = getProject(activeIndex - 1);
    const next = getProject(activeIndex + 1);

    mainImage.src = active.image;
    mainImage.alt = active.title;

    previousImage.src = previous.image;
    previousImage.alt = previous.title;

    nextImage.src = next.image;
    nextImage.alt = next.title;

    const caption = document.querySelector(".carousel-caption");
    const count = document.querySelector(".carousel-count");

    if (caption) caption.textContent = active.title;
    if (count) {
      count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
    }

    document.querySelectorAll(".pagination-dot").forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });

    document.querySelectorAll(".carousel-thumb").forEach((thumb, index) => {
      const isActive = index === activeIndex;
      thumb.classList.toggle("is-active", isActive);
      thumb.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  projects.forEach((project, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "pagination-dot";
    dot.setAttribute("aria-label", `View ${project.title}`);
    dot.addEventListener("click", () => selectProject(index));
    pagination.appendChild(dot);

    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "carousel-thumb";
    thumb.setAttribute("aria-label", `View ${project.title}`);
    thumb.innerHTML = `
      <span class="carousel-thumb-image">
        <img src="${project.image}" alt="" loading="lazy">
      </span>
      <span class="carousel-thumb-label">
        <span class="carousel-thumb-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="carousel-thumb-title">${project.title}</span>
      </span>
    `;
    thumb.addEventListener("click", () => selectProject(index));
    thumbnails.appendChild(thumb);
  });

  previousButton.addEventListener("click", () => selectRelative(-1));
  nextButton.addEventListener("click", () => selectRelative(1));

  // Keyboard navigation should work anywhere on the page, not only after
  // clicking/focusing the carousel. Use capture mode so the browser/page
  // receives the arrow keys before normal scrolling handles them.
  function handleKeyboard(event) {
    const target = event.target;
    const isTypingField =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target?.isContentEditable;

    if (isTypingField) return;

    if (event.key === "ArrowLeft" || event.code === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      selectRelative(-1);
    } else if (event.key === "ArrowRight" || event.code === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      selectRelative(1);
    }
  }

  document.addEventListener("keydown", handleKeyboard, { capture: true });

  carousel.addEventListener("pointerdown", (event) => {
    dragStart = event.clientX;
    carousel.setPointerCapture?.(event.pointerId);
  });

  carousel.addEventListener("pointerup", (event) => {
    if (dragStart === null) return;

    const distance = event.clientX - dragStart;
    if (Math.abs(distance) > 45) {
      selectRelative(distance > 0 ? -1 : 1);
    }

    dragStart = null;
  });

  carousel.addEventListener("pointercancel", () => {
    dragStart = null;
  });

  render();
}
