(() => {
  'use strict';

  const html = document.documentElement;
  const body = document.body;
  const languageButton = document.getElementById('languageToggle');
  const languageChoices = document.querySelectorAll('[data-lang-choice]');
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');
  const dialog = document.getElementById('landmarkDialog');
  const dialogImage = document.getElementById('dialogImage');
  const dialogNumber = document.getElementById('dialogNumber');
  const dialogTitle = document.getElementById('dialogTitle');
  const dialogDescription = document.getElementById('dialogDescription');
  const dialogDone = document.getElementById('dialogDone');
  const dialogClose = dialog.querySelector('.dialog-close');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentLanguage = 'ar';
  let lastOpenedCard = null;

  const setLanguage = (language) => {
    currentLanguage = language === 'en' ? 'en' : 'ar';
    html.lang = currentLanguage;
    html.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    body.classList.toggle('lang-en', currentLanguage === 'en');
    document.querySelectorAll('[data-ar][data-en]').forEach((element) => {
      element.textContent = element.dataset[currentLanguage];
    });
    document.querySelectorAll('[data-ar-label][data-en-label]').forEach((element) => {
      element.setAttribute('aria-label', element.dataset[`${currentLanguage}Label`]);
    });
    languageChoices.forEach((choice) => {
      const active = choice.dataset.langChoice === currentLanguage;
      choice.classList.toggle('active', active);
      if (active) choice.setAttribute('aria-current', 'true');
      else choice.removeAttribute('aria-current');
    });
    languageButton.setAttribute('aria-label', currentLanguage === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    menuToggle.setAttribute('aria-label', currentLanguage === 'ar' ? 'فتح القائمة' : 'Open menu');
    dialogClose.setAttribute('aria-label', currentLanguage === 'ar' ? 'إغلاق' : 'Close');
    backToTop.setAttribute('aria-label', currentLanguage === 'ar' ? 'العودة للأعلى' : 'Back to top');
    document.title = currentLanguage === 'ar' ? 'AMARNA — اكتشف شوارع التاريخ' : 'AMARNA — Discover the Streets of History';

    if (dialog.open && lastOpenedCard) updateDialogFromCard(lastOpenedCard);
  };

  languageButton.addEventListener('click', () => setLanguage(currentLanguage === 'ar' ? 'en' : 'ar'));

  const closeMenu = () => {
    primaryNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  };

  menuToggle.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    primaryNav.classList.toggle('is-open', willOpen);
    body.classList.toggle('menu-open', willOpen);
  });
  primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  function updateDialogFromCard(card) {
    dialogImage.src = card.dataset.image;
    dialogImage.alt = currentLanguage === 'ar' ? card.dataset.titleAr : card.dataset.titleEn;
    dialogNumber.textContent = card.dataset.number || '01';
    dialogTitle.textContent = currentLanguage === 'ar' ? card.dataset.titleAr : card.dataset.titleEn;
    dialogDescription.textContent = currentLanguage === 'ar' ? card.dataset.descAr : card.dataset.descEn;
    dialogDone.textContent = currentLanguage === 'ar' ? 'العودة للاستكشاف ↙' : 'Back to exploring ↙';
  }

  document.querySelectorAll('[data-open-landmark]').forEach((card) => {
    card.addEventListener('click', () => {
      lastOpenedCard = card;
      updateDialogFromCard(card);
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      body.classList.add('dialog-open');
    });
  });

  function closeDialog() {
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    body.classList.remove('dialog-open');
    if (lastOpenedCard) lastOpenedCard.focus({ preventScroll: true });
  }
  dialogDone.addEventListener('click', closeDialog);
  dialogClose.addEventListener('click', closeDialog);
  dialog.addEventListener('close', () => {
    body.classList.remove('dialog-open', 'dialog-pointer-inside');
    dialogCursorRing?.classList.remove('is-active');
    if (lastOpenedCard) lastOpenedCard.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
    backToTop.classList.toggle('is-visible', window.scrollY > 620);
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI);
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
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const dialogCursorDot = document.getElementById('dialogCursorDot');
  const dialogCursorRing = document.getElementById('dialogCursorRing');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reducedMotion) {
    body.classList.add('custom-cursor');
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    const positionCursor = () => {
      cursorDot.style.left = `${pointerX}px`;
      cursorDot.style.top = `${pointerY}px`;

      // Native <dialog> is painted in the browser's top layer. Position a second
      // cursor inside it, using dialog-relative coordinates, while it is open.
      if (dialog.open || dialog.hasAttribute('open')) {
        const rect = dialog.getBoundingClientRect();
        const inside = pointerX >= rect.left && pointerX <= rect.right && pointerY >= rect.top && pointerY <= rect.bottom;
        body.classList.toggle('dialog-pointer-inside', inside);
        dialogCursorDot.style.left = `${pointerX - rect.left}px`;
        dialogCursorDot.style.top = `${pointerY - rect.top}px`;
        dialogCursorRing.style.left = `${ringX - rect.left}px`;
        dialogCursorRing.style.top = `${ringY - rect.top}px`;
      } else {
        body.classList.remove('dialog-pointer-inside');
      }
    };

    window.addEventListener('mousemove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      positionCursor();
    }, { passive: true });
    const moveRing = () => {
      ringX += (pointerX - ringX) * 0.19;
      ringY += (pointerY - ringY) * 0.19;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      positionCursor();
      requestAnimationFrame(moveRing);
    };
    requestAnimationFrame(moveRing);
    document.querySelectorAll('a, button, [data-open-landmark]').forEach((element) => {
      element.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      element.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
    dialog.querySelectorAll('a, button').forEach((element) => {
      element.addEventListener('mouseenter', () => dialogCursorRing.classList.add('is-active'));
      element.addEventListener('mouseleave', () => dialogCursorRing.classList.remove('is-active'));
    });
    window.addEventListener('blur', () => body.classList.remove('custom-cursor'));
    window.addEventListener('focus', () => body.classList.add('custom-cursor'));
  }

  document.getElementById('year').textContent = String(new Date().getFullYear());
  // The starting locale is Arabic. A URL hash remains useful when shared with the team.
  setLanguage('ar');
})();
