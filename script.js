// Portfolio interactions: mobile navigation, project slideshow, and certificate preview.
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Project carousel
  const track = document.getElementById("projectsTrack");
  const slides = track
    ? Array.from(track.querySelectorAll(".project-slide"))
    : [];
  const prev = document.getElementById("projectPrev");
  const next = document.getElementById("projectNext");
  const current = document.getElementById("projectCurrent");
  const total = document.getElementById("projectTotal");
  const dotsWrap = document.getElementById("projectDots");
  let active = 0;
  if (track && slides.length) {
    if (total) total.textContent = String(slides.length).padStart(2, "0");
    const dots = slides.map((slide, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "project-dot";
      dot.setAttribute("aria-label", `Show project ${index + 1}`);
      dot.addEventListener("click", () => show(index));
      if (dotsWrap) dotsWrap.appendChild(dot);
      return dot;
    });
    function show(index) {
      active = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${active * 100}%)`;
      track.style.transition = "transform .35s ease";
      if (current) current.textContent = String(active + 1).padStart(2, "0");
      dots.forEach((dot, i) =>
        dot.setAttribute("aria-current", String(i === active))
      );
      slides.forEach((slide, i) =>
        slide.setAttribute("aria-hidden", String(i !== active))
      );
    }
    prev?.addEventListener("click", () => show(active - 1));
    next?.addEventListener("click", () => show(active + 1));
    show(0);
    let touchStart = null;
    track.addEventListener(
      "touchstart",
      (e) => {
        touchStart = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    track.addEventListener(
      "touchend",
      (e) => {
        if (touchStart === null) return;
        const delta = e.changedTouches[0].clientX - touchStart;
        if (Math.abs(delta) > 45) show(active + (delta < 0 ? 1 : -1));
        touchStart = null;
      },
      { passive: true }
    );
  }

  // Certificate lightbox
  const lightbox = document.getElementById("certificateLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.getElementById("lightboxClose");
  const certificateCards = document.querySelectorAll("[data-certificate]");
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-active");
  }
  certificateCards.forEach((card) =>
    card.addEventListener("click", () => {
      const image = card.querySelector("img");
      if (!lightbox || !lightboxImage || !image) return;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-active");
    })
  );
  closeButton?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
});
