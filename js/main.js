(() => {
  'use strict';
  const body = document.body;
  const html = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  const languageToggle = document.getElementById('languageToggle');
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentLanguage = 'ar';
  try {
    const savedLanguage = localStorage.getItem('amarna-language');
    if (savedLanguage === 'ar' || savedLanguage === 'en') currentLanguage = savedLanguage;
  } catch (_) { /* local storage may be unavailable when opened locally */ }

  function applyLanguage(language) {
    currentLanguage = language === 'en' ? 'en' : 'ar';
    html.lang = currentLanguage;
    html.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    body.setAttribute('dir', html.dir);
    document.title = currentLanguage === 'ar'
      ? 'AMARNA — اكتشف شوارع التاريخ'
      : 'AMARNA — Discover the Streets of History';
    document.querySelectorAll('[data-ar][data-en]').forEach((element) => {
      const nextText = element.getAttribute(`data-${currentLanguage}`);
      if (nextText !== null) element.textContent = nextText;
    });
    document.querySelectorAll('img[data-alt-ar][data-alt-en]').forEach((img) => {
      img.alt = img.getAttribute(`data-alt-${currentLanguage}`) || '';
    });
    const spans = languageToggle.querySelectorAll('span');
    spans.forEach((span) => span.classList.toggle('active', span.textContent.trim().toLowerCase() === currentLanguage));
    languageToggle.setAttribute('aria-label', currentLanguage === 'ar' ? 'Switch language to English' : 'غيّر اللغة إلى العربية');
    try { localStorage.setItem('amarna-language', currentLanguage); } catch (_) { /* non-blocking */ }
  }

  applyLanguage(currentLanguage);
  document.getElementById('year').textContent = String(new Date().getFullYear());

  languageToggle.addEventListener('click', () => applyLanguage(currentLanguage === 'ar' ? 'en' : 'ar'));

  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    primaryNav.classList.remove('is-open');
    body.classList.remove('menu-open');
  }
  menuToggle.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
    primaryNav.classList.toggle('is-open', willOpen);
    body.classList.toggle('menu-open', willOpen);
  });
  primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  let ticking = false;
  function updateScrollUI() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    header.classList.toggle('is-scrolled', window.scrollY > 30);
    backToTop.classList.toggle('visible', window.scrollY > 600);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // A lightweight custom cursor for fine pointers only; standard cursor is retained elsewhere.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reducedMotion && cursorDot && cursorRing) {
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let ringX = cursorX;
    let ringY = cursorY;
    body.classList.add('has-custom-cursor');
    window.addEventListener('mousemove', (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      cursorDot.style.left = `${cursorX}px`;
      cursorDot.style.top = `${cursorY}px`;
    }, { passive: true });
    const animateRing = () => {
      ringX += (cursorX - ringX) * 0.17;
      ringY += (cursorY - ringY) * 0.17;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      window.requestAnimationFrame(animateRing);
    };
    animateRing();
    document.querySelectorAll('a, button, .landmark-card, .team-card').forEach((element) => {
      element.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      element.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
    document.addEventListener('mouseleave', () => body.classList.remove('has-custom-cursor'));
    document.addEventListener('mouseenter', () => body.classList.add('has-custom-cursor'));
  }

  // If a remote image is unavailable, keep the designed surface and show a clear fallback.
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.classList.add('image-unavailable');
      img.setAttribute('alt', img.alt || 'Image unavailable');
    }, { once: true });
    img.addEventListener('load', () => img.classList.remove('image-unavailable'), { once: true });
  });
})();
