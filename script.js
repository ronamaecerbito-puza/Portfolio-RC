const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? '✕' : '☰';
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    });
  });
}

// Certificate lightbox
document.addEventListener('DOMContentLoaded', function () {
  const lightbox = document.getElementById('certificateLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeButton = document.getElementById('lightboxClose');
  let lastTrigger = null;
  if (!lightbox || !lightboxImage || !closeButton) return;
  function openPreview(button) {
    lastTrigger = button;
    lightboxImage.src = button.dataset.certificate;
    const thumb = button.querySelector('img');
    lightboxImage.alt = thumb ? thumb.alt : 'Expanded certificate';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-active');
    closeButton.focus();
  }
  function closePreview() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-active');
    lightboxImage.src = '';
    if (lastTrigger) lastTrigger.focus();
  }
  document.querySelectorAll('.certificate-card').forEach(button => button.addEventListener('click', () => openPreview(button)));
  closeButton.addEventListener('click', closePreview);
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closePreview(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closePreview(); });
});

// Scroll progress, section reveals, and featured project pointer spotlight
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.createElement('div');
  progress.className = 'motion-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  const updateScrollUI = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI, { passive: true });
  if (reduceMotion) return;
  document.documentElement.classList.add('motion-ready');
  const revealTargets = document.querySelectorAll('.section .container > .eyebrow, .section .container > h2, .section-intro, .two-col > *, .skill-card, .project-card:not(.project-portal-showcase), .project-portal-showcase .project-content > *, .cases details, .interview-card, .resume-document, .resume-actions, .certificate-card');
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal-on-scroll');
    if (element.matches('.two-col > *:first-child')) element.classList.add('reveal-left');
    if (element.matches('.two-col > *:last-child')) element.classList.add('reveal-right');
    if (element.matches('.skill-card, .certificate-card, .cases details')) element.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach(element => observer.observe(element));
  } else revealTargets.forEach(element => element.classList.add('is-visible'));
  const featuredProject = document.querySelector('.project-portal-showcase');
  if (featuredProject && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    featuredProject.addEventListener('pointermove', event => {
      const rect = featuredProject.getBoundingClientRect();
      featuredProject.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      featuredProject.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    });
  }
});

// Typing name, project carousel, and ID lanyard animation
document.addEventListener('DOMContentLoaded', () => {
  const nameElement = document.getElementById('typedName');
  if (nameElement) {
    const fullName = nameElement.dataset.text || nameElement.textContent.trim();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
      let index = 0, deleting = false;
      const typeNext = () => {
        if (!deleting) {
          index++; nameElement.textContent = fullName.slice(0, index);
          if (index >= fullName.length) { deleting = true; window.setTimeout(typeNext, 1800); return; }
          window.setTimeout(typeNext, 75);
        } else {
          index--; nameElement.textContent = fullName.slice(0, index);
          if (index <= 0) { deleting = false; window.setTimeout(typeNext, 420); return; }
          window.setTimeout(typeNext, 35);
        }
      };
      nameElement.textContent = ''; window.setTimeout(typeNext, 550);
    } else nameElement.textContent = fullName;
  }
  const projectTrack = document.getElementById('projectsCarousel');
  if (projectTrack) {
    const cards = Array.from(projectTrack.querySelectorAll('.project-card'));
    const count = document.getElementById('projectSlideCount');
    const prev = document.getElementById('projectPrev');
    const next = document.getElementById('projectNext');
    const update = () => {
      const center = projectTrack.scrollLeft + projectTrack.clientWidth / 2;
      let active = 0, best = Infinity;
      cards.forEach((card, i) => { const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center); if (d < best) { best = d; active = i; } });
      cards.forEach((card, i) => card.classList.toggle('is-active', i === active));
      if (count) count.textContent = `Project ${active + 1} of ${cards.length}`;
      if (prev) prev.disabled = active === 0;
      if (next) next.disabled = active === cards.length - 1;
    };
    const go = step => {
      const center = projectTrack.scrollLeft + projectTrack.clientWidth / 2;
      let active = 0, best = Infinity;
      cards.forEach((card, i) => { const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center); if (d < best) { best = d; active = i; } });
      const target = cards[Math.max(0, Math.min(cards.length - 1, active + step))];
      if (target) projectTrack.scrollTo({ left: target.offsetLeft - (projectTrack.clientWidth - target.offsetWidth) / 2, behavior: 'smooth' });
    };
    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    projectTrack.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  const idHanger = document.getElementById('idHanger');
  if (idHanger) {
    idHanger.addEventListener('click', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      idHanger.classList.remove('is-swaying');
      idHanger.setAttribute('aria-pressed', 'true');
      void idHanger.offsetWidth;
      idHanger.classList.add('is-swaying');
    });
    idHanger.addEventListener('animationend', event => {
      if (event.animationName === 'id-sway') { idHanger.classList.remove('is-swaying'); idHanger.setAttribute('aria-pressed', 'false'); }
    });
  }
});

// Certificate carousel controls
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('certificateCarousel');
  if (!track) return;
  const cards = Array.from(track.querySelectorAll('.certificate-card'));
  const prev = document.getElementById('certificatePrev');
  const next = document.getElementById('certificateNext');
  const count = document.getElementById('certificateSlideCount');
  function activeIndex() {
    let best = 0, dist = Infinity;
    cards.forEach((card, i) => { const d = Math.abs(card.getBoundingClientRect().left - track.getBoundingClientRect().left); if (d < dist) { dist = d; best = i; } });
    return best;
  }
  function update(i = activeIndex()) {
    if (count) count.textContent = `Certificate ${i + 1} of ${cards.length}`;
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === cards.length - 1;
  }
  function go(i) {
    i = Math.max(0, Math.min(cards.length - 1, i));
    cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    update(i);
  }
  prev?.addEventListener('click', () => go(activeIndex() - 1));
  next?.addEventListener('click', () => go(activeIndex() + 1));
  track.addEventListener('scroll', () => requestAnimationFrame(() => update()), { passive: true });
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(activeIndex() + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(activeIndex() - 1); }
  });
  update();
});
