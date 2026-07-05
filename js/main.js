/**
 * داتیس — Main JavaScript
 */

(function () {
  'use strict';

  /* -------- Helpers -------- */
  const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  function toPersianDigits(value) {
    return String(value).replace(/\d/g, function (d) {
      return PERSIAN_DIGITS[d];
    });
  }

  /* -------- Navbar + back to top on scroll -------- */
  const navbar = document.getElementById('mainNav');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  function handleScroll() {
    const scrollY = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 500);
    updateActiveNavLink();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* -------- Mobile menu (custom slide — no Bootstrap height animation) -------- */
  const navCollapse = document.getElementById('navbarNav');
  const navToggler = document.querySelector('.navbar-toggler');
  const mobileNavMq = window.matchMedia('(max-width: 991.98px)');
  let savedScrollY = 0;
  let mobileNavClosing = false;

  function isMobileNav() {
    return mobileNavMq.matches;
  }

  function lockPageScroll() {
    savedScrollY = window.scrollY;
    document.body.style.top = '-' + savedScrollY + 'px';
    document.documentElement.classList.add('mobile-nav-open');
    document.body.classList.add('mobile-nav-open');
  }

  function unlockPageScroll() {
    document.documentElement.classList.remove('mobile-nav-open');
    document.body.classList.remove('mobile-nav-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
  }

  function finishMobileNavClose() {
    if (!navCollapse) return;
    mobileNavClosing = false;
    navCollapse.classList.remove('show', 'is-visible');
    unlockPageScroll();
  }

  function setMobileNavOpen(open, instant) {
    if (!navCollapse || !navbar || !navToggler || !isMobileNav()) return;

    if (open) {
      if (mobileNavClosing) return;
      navCollapse.classList.add('show');
      navbar.classList.add('menu-open');
      navToggler.setAttribute('aria-expanded', 'true');
      lockPageScroll();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          navCollapse.classList.add('is-visible');
        });
      });
      return;
    }

    if (!navCollapse.classList.contains('is-visible') && !instant) return;

    navCollapse.classList.remove('is-visible');
    navbar.classList.remove('menu-open');
    navToggler.setAttribute('aria-expanded', 'false');

    if (instant) {
      navCollapse.classList.remove('is-visible');
      navbar.classList.remove('menu-open');
      navToggler.setAttribute('aria-expanded', 'false');
      finishMobileNavClose();
      return;
    }

    mobileNavClosing = true;
    var closed = false;
    function onPanelTransitionEnd(e) {
      if (closed || e.target !== navCollapse) return;
      if (e.propertyName !== 'transform' && e.propertyName !== 'opacity') return;
      closed = true;
      navCollapse.removeEventListener('transitionend', onPanelTransitionEnd);
      finishMobileNavClose();
    }

    navCollapse.addEventListener('transitionend', onPanelTransitionEnd);
    window.setTimeout(function () {
      if (!closed) {
        closed = true;
        navCollapse.removeEventListener('transitionend', onPanelTransitionEnd);
        finishMobileNavClose();
      }
    }, 550);
  }

  if (navCollapse && navbar && navToggler) {
    navToggler.addEventListener('click', function (e) {
      if (!isMobileNav()) return;
      e.preventDefault();
      setMobileNavOpen(!navCollapse.classList.contains('is-visible'));
    });

    navbar.addEventListener('click', function (e) {
      if (!navCollapse.classList.contains('is-visible')) return;
      if (e.target.closest('.mobile-nav-panel')) return;
      if (e.target.closest('.navbar-toggler')) return;
      setMobileNavOpen(false);
    });

    mobileNavMq.addEventListener('change', function () {
      if (mobileNavMq.matches) return;
      mobileNavClosing = false;
      navCollapse.classList.remove('show', 'is-visible');
      navbar.classList.remove('menu-open');
      navToggler.setAttribute('aria-expanded', 'false');
      unlockPageScroll();
    });
  }

  /* -------- Smooth scroll + close mobile menu -------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      if (navCollapse && navCollapse.classList.contains('is-visible')) {
        setMobileNavOpen(false);
      }
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* -------- Back to top -------- */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -------- Learn: play featured video on click -------- */
  document.querySelectorAll('.learn-video').forEach(function (wrapper) {
    const video = wrapper.querySelector('video');
    const playBtn = wrapper.querySelector('.learn-play');
    if (!video || !playBtn) return;

    playBtn.addEventListener('click', function () {
      if (video.paused) {
        video.play().catch(function () {});
        playBtn.style.opacity = '0';
        playBtn.style.pointerEvents = 'none';
      } else {
        video.pause();
      }
    });

    video.addEventListener('pause', function () {
      playBtn.style.opacity = '1';
      playBtn.style.pointerEvents = 'auto';
    });
  });

  /* -------- Animated counters (Persian digits) -------- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = toPersianDigits(current.toLocaleString('en-US')) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = toPersianDigits(target.toLocaleString('en-US')) + suffix;
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('.stat-num');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  /* -------- Reveal on scroll -------- */
  const revealEls = document.querySelectorAll(
    '.product-card, .learn-feature, .learn-item, .event-card, .chip, .stat'
  );
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(function (el) {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  /* -------- Newsletter form -------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      if (!emailInput.checkValidity()) {
        newsletterMsg.textContent = 'لطفاً یک ایمیل معتبر وارد کنید.';
        newsletterMsg.style.color = '#ffb3b3';
        return;
      }
      newsletterMsg.textContent = 'با موفقیت عضو خبرنامه شدید.';
      newsletterMsg.style.color = '#9ede6f';
      newsletterForm.reset();
    });
  }

  /* -------- Consultation forms -------- */
  function initConsultForm(form) {
    const successId = form.getAttribute('data-success-target');
    const successEl = successId ? document.getElementById(successId) : null;
    const modalEl = form.closest('.modal');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm ms-2"></span>در حال ارسال…';

      setTimeout(function () {
        form.reset();
        form.classList.remove('was-validated');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (successEl) {
          successEl.classList.remove('d-none');
          setTimeout(function () {
            successEl.classList.add('d-none');
            if (modalEl) {
              const bsModal = bootstrap.Modal.getInstance(modalEl);
              if (bsModal) bsModal.hide();
            }
          }, 3500);
        }
      }, 1400);
    });
  }

  document.querySelectorAll('.consult-form').forEach(initConsultForm);

  document.querySelectorAll('[data-bs-target="#consultModal"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (navCollapse && navCollapse.classList.contains('is-visible')) {
        setMobileNavOpen(false);
      }
    });
  });

  const consultModal = document.getElementById('consultModal');
  if (consultModal) {
    consultModal.addEventListener('hidden.bs.modal', function () {
      const form = document.getElementById('consultModalForm');
      const success = document.getElementById('consultModalSuccess');
      if (form) {
        form.reset();
        form.classList.remove('was-validated');
      }
      if (success) success.classList.add('d-none');
    });
  }
})();
