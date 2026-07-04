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

  /* -------- Smooth scroll + close mobile menu -------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
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

  /* -------- Consultation form -------- */
  const consultForm = document.getElementById('consultForm');
  const consultSuccess = document.getElementById('consultSuccess');
  if (consultForm) {
    consultForm.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!consultForm.checkValidity()) {
        consultForm.classList.add('was-validated');
        return;
      }

      const submitBtn = consultForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm ms-2"></span>در حال ارسال…';

      setTimeout(function () {
        consultForm.reset();
        consultForm.classList.remove('was-validated');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (consultSuccess) {
          consultSuccess.classList.remove('d-none');
          setTimeout(function () {
            consultSuccess.classList.add('d-none');
          }, 6000);
        }
      }, 1400);
    });
  }
})();
