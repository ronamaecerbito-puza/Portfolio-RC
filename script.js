// Portfolio interactions: mobile navigation, project and certificate slideshows, certificate preview.
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  function setupSlider({ trackId, slideSelector, prevId, nextId, currentId, totalId, dotsId, dotClass, ariaLabel, }) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const slides = Array.from(track.querySelectorAll(slideSelector));
    if (!slides.length) return;
    const prev = document.getElementById(prevId),
      next = document.getElementById(nextId);
    const current = document.getElementById(currentId),
      total = document.getElementById(totalId),
      dotsWrap = document.getElementById(dotsId);
    let active = 0;
    if (total) total.textContent = String(slides.length).padStart(2, "0");
    if (dotsWrap) dotsWrap.replaceChildren();
    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = dotClass;
      dot.setAttribute("aria-label", `${ariaLabel} ${i + 1}`);
      dot.addEventListener("click", () => show(i));
      dotsWrap?.appendChild(dot);
      return dot;
    });
    function show(i) {
      active = (i + slides.length) % slides.length;
      // Tracks are 100% of the viewport and each slide is exactly 100% wide.
      track.style.width = "100%";
      track.style.transform = `translateX(-${active * 100}%)`;
      if (current) current.textContent = String(active + 1).padStart(2, "0");
      dots.forEach((dot, index) =>
        dot.setAttribute("aria-current", String(index === active))
      );
      slides.forEach((slide, index) =>
        slide.setAttribute("aria-hidden", String(index !== active))
      );
    }
    prev?.addEventListener("click", () => show(active - 1));
    next?.addEventListener("click", () => show(active + 1));
    show(0);
    let startX = null;
    track.addEventListener(
      "touchstart",
      (e) => {
        startX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    track.addEventListener(
      "touchend",
      (e) => {
        if (startX === null) return;
        const delta = e.changedTouches[0].clientX - startX;
        if (Math.abs(delta) > 45) show(active + (delta < 0 ? 1 : -1));
        startX = null;
      },
      { passive: true }
    );
  }
  setupSlider({
    trackId: "projectsTrack",
    slideSelector: ".project-slide",
    prevId: "projectPrev",
    nextId: "projectNext",
    currentId: "projectCurrent",
    totalId: "projectTotal",
    dotsId: "projectDots",
    dotClass: "project-dot",
    ariaLabel: "Show project",
  });
  setupSlider({
    trackId: "certificateTrack",
    slideSelector: ".certificate-card",
    prevId: "certificatePrev",
    nextId: "certificateNext",
    currentId: "certificateCurrent",
    totalId: "certificateTotal",
    dotsId: "certificateDots",
    dotClass: "certificate-dot",
    ariaLabel: "Show certificate",
  });

  const lightbox = document.getElementById("certificateLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.getElementById("lightboxClose");
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-active");
  }
  document.querySelectorAll("[data-certificate]").forEach((card) =>
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
