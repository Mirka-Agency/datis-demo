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

  /* -------- Mobile menu (custom slide ΓÇö no Bootstrap height animation) -------- */
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

  // Prefill consultation/quote subject from ?subject=quote|consultation
  (function prefillRequestSubject() {
    const subjectEl = document.getElementById('requestFormSubject');
    if (!subjectEl) return;
    const params = new URLSearchParams(window.location.search);
    const subject = params.get('subject');
    if (subject === 'quote' || subject === 'consultation') {
      subjectEl.value = subject;
    }
  })();

  // Prefill partnership type from ?type=distributor|sales-rep|b2b|other
  (function prefillPartnershipType() {
    const typeEl = document.getElementById('partnershipFormType');
    if (!typeEl) return;
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const allowed = ['distributor', 'sales-rep', 'b2b', 'other'];
    if (type && allowed.indexOf(type) !== -1) {
      typeEl.value = type;
    }
  })();

  /* -------- Gallery lightbox (GLightbox, local) -------- */
  (function initGalleryLightbox() {
    if (typeof GLightbox !== 'function') return;
    if (!document.querySelector('.glightbox')) return;

    GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      openEffect: 'fade',
      closeEffect: 'fade',
      cssEfects: {
        fade: { in: 'fadeIn', out: 'fadeOut' },
      },
    });
  })();

  /* -------- Rounded filter selects (custom submenu) -------- */
  (function initFilterSelects() {
    const selects = document.querySelectorAll(
      [
        '#productsFilters .form-select',
        '#categoryFilters .form-select',
        '#provinceSelect',
        '.filter-bar .form-select',
        '.iran-map-controls .form-select',
        '.consult-form .form-select',
      ].join(', ')
    );
    if (!selects.length) return;

    let openWrap = null;

    function closeOpen() {
      if (!openWrap) return;
      openWrap.classList.remove('is-open');
      const trigger = openWrap.querySelector('.filter-select-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      openWrap = null;
    }

    document.addEventListener('click', function (event) {
      if (openWrap && !openWrap.contains(event.target)) closeOpen();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeOpen();
    });

    document.querySelectorAll('.modal').forEach(function (modal) {
      modal.addEventListener('hide.bs.modal', closeOpen);
    });

    const valueDesc = Object.getOwnPropertyDescriptor(
      HTMLSelectElement.prototype,
      'value'
    );

    selects.forEach(function (select) {
      if (select.closest('.filter-select')) return;

      const wrap = document.createElement('div');
      wrap.className = 'filter-select';
      if (select.classList.contains('mb-3')) {
        wrap.classList.add('mb-3');
        select.classList.remove('mb-3');
      }

      select.parentNode.insertBefore(wrap, select);
      wrap.appendChild(select);
      select.classList.add('filter-select-native');
      select.setAttribute('tabindex', '-1');

      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'filter-select-trigger';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      if (select.id) {
        trigger.setAttribute('aria-controls', select.id + 'Menu');
        trigger.id = select.id + 'Trigger';
      }

      const menu = document.createElement('ul');
      menu.className = 'filter-select-menu';
      menu.setAttribute('role', 'listbox');
      if (select.id) menu.id = select.id + 'Menu';

      function syncFromSelect() {
        const opt = select.options[select.selectedIndex];
        trigger.textContent = opt ? opt.textContent : '';
        Array.prototype.forEach.call(
          menu.querySelectorAll('.filter-select-option'),
          function (item) {
            const selected = item.getAttribute('data-value') === select.value;
            item.classList.toggle('is-selected', selected);
            item.setAttribute('aria-selected', selected ? 'true' : 'false');
          }
        );
      }

      function rebuildOptions() {
        menu.innerHTML = '';
        Array.prototype.forEach.call(select.options, function (opt) {
          const item = document.createElement('li');
          item.className = 'filter-select-option';
          item.setAttribute('role', 'option');
          item.setAttribute('data-value', opt.value);
          item.textContent = opt.textContent;
          if (opt.disabled) {
            item.classList.add('is-disabled');
            item.setAttribute('aria-disabled', 'true');
          }
          item.addEventListener('click', function () {
            if (opt.disabled) return;
            select.value = opt.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            syncFromSelect();
            closeOpen();
            trigger.focus();
          });
          menu.appendChild(item);
        });
        syncFromSelect();
      }

      trigger.addEventListener('click', function () {
        const willOpen = !wrap.classList.contains('is-open');
        closeOpen();
        if (!willOpen) return;
        wrap.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        openWrap = wrap;
      });

      select.addEventListener('focus', function () {
        trigger.focus();
      });

      select.addEventListener('change', syncFromSelect);

      if (valueDesc && valueDesc.get && valueDesc.set) {
        Object.defineProperty(select, 'value', {
          get: function () {
            return valueDesc.get.call(this);
          },
          set: function (next) {
            valueDesc.set.call(this, next);
            syncFromSelect();
          },
          configurable: true,
        });
      }

      wrap.appendChild(trigger);
      wrap.appendChild(menu);
      rebuildOptions();
    });
  })();

  /* -------- Products catalog filters + pagination -------- */
  (function initProductsCatalog() {
    const grid = document.getElementById('productsGrid');
    const paginationEl = document.getElementById('productsPagination');
    if (!grid || !paginationEl) return;

    const searchEl = document.getElementById('productsSearch');
    const familyEl = document.getElementById('productsFamily');
    const methodEl = document.getElementById('productsMethod');
    const cropEl = document.getElementById('productsCrop');
    const sortEl = document.getElementById('productsSort');
    const clearBtn = document.getElementById('productsClearFilters');
    const countEl = document.getElementById('productsResultCount');
    const emptyEl = document.getElementById('productsEmpty');
    const tagInputs = Array.prototype.slice.call(
      document.querySelectorAll('#productsFilters input[type="checkbox"]')
    );
    const exploreChips = Array.prototype.slice.call(
      document.querySelectorAll('[data-products-filter]')
    );

    const PAGE_SIZE = 6;
    let currentPage = 1;
    const items = Array.prototype.slice.call(grid.querySelectorAll('.product-col'));

    function tokenList(value) {
      return String(value || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    }

    function selectedTags() {
      return tagInputs.filter(function (input) {
        return input.checked;
      }).map(function (input) {
        return input.value;
      });
    }

    function syncExploreChips() {
      exploreChips.forEach(function (chip) {
        const key = chip.getAttribute('data-products-filter');
        const value = chip.getAttribute('data-value');
        let active = false;
        if (key === 'family' && familyEl) active = familyEl.value === value;
        if (key === 'method' && methodEl) active = methodEl.value === value;
        if (key === 'crop' && cropEl) active = cropEl.value === value;
        chip.classList.toggle('is-active', active);
      });
    }

    function getFilteredSorted() {
      const q = (searchEl && searchEl.value ? searchEl.value : '').trim().toLowerCase();
      const family = familyEl ? familyEl.value : '';
      const method = methodEl ? methodEl.value : '';
      const crop = cropEl ? cropEl.value : '';
      const tags = selectedTags();
      const sort = sortEl ? sortEl.value : 'featured';

      let list = items.filter(function (item) {
        const name = (item.getAttribute('data-name') || '').toLowerCase();
        const itemFamily = item.getAttribute('data-family') || '';
        const itemMethods = tokenList(item.getAttribute('data-method'));
        const itemCrops = tokenList(item.getAttribute('data-crop'));
        const itemTags = tokenList(item.getAttribute('data-tags'));

        if (q && name.indexOf(q) === -1) return false;
        if (family && itemFamily !== family) return false;
        if (method && itemMethods.indexOf(method) === -1) return false;
        if (crop && itemCrops.indexOf(crop) === -1) return false;
        if (tags.length) {
          const ok = tags.every(function (tag) {
            return itemTags.indexOf(tag) !== -1;
          });
          if (!ok) return false;
        }
        return true;
      });

      if (sort === 'name-asc' || sort === 'name-desc') {
        list = list.slice().sort(function (a, b) {
          const an = a.getAttribute('data-name') || '';
          const bn = b.getAttribute('data-name') || '';
          return sort === 'name-asc' ? an.localeCompare(bn, 'fa') : bn.localeCompare(an, 'fa');
        });
      }

      return list;
    }

    function renderPagination(totalPages) {
      paginationEl.innerHTML = '';
      if (totalPages <= 1) return;

      function addBtn(label, page, opts) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'page-btn';
        btn.textContent = typeof label === 'number' ? toPersianDigits(label) : label;
        if (opts && opts.active) btn.classList.add('is-active');
        if (opts && opts.disabled) btn.disabled = true;
        if (!(opts && opts.disabled) && page) {
          btn.addEventListener('click', function () {
            currentPage = page;
            render();
            const catalog = document.getElementById('productsCatalog');
            if (catalog) catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
        paginationEl.appendChild(btn);
      }

      addBtn('قبلی', currentPage - 1, { disabled: currentPage <= 1 });
      for (let i = 1; i <= totalPages; i += 1) {
        addBtn(i, i, { active: i === currentPage });
      }
      addBtn('بعدی', currentPage + 1, { disabled: currentPage >= totalPages });
    }

    function render() {
      const filtered = getFilteredSorted();
      const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;

      items.forEach(function (item) {
        item.hidden = true;
      });

      const start = (currentPage - 1) * PAGE_SIZE;
      filtered.forEach(function (item, index) {
        grid.appendChild(item);
        item.hidden = !(index >= start && index < start + PAGE_SIZE);
      });

      const pageItems = filtered.slice(start, start + PAGE_SIZE);

      if (emptyEl) emptyEl.hidden = filtered.length !== 0;

      if (countEl) {
        if (!filtered.length) {
          countEl.textContent = 'نتیجه‌ای یافت نشد';
        } else {
          const from = start + 1;
          const to = start + pageItems.length;
          countEl.textContent =
            'نمایش ' +
            toPersianDigits(from) +
            ' تا ' +
            toPersianDigits(to) +
            ' از ' +
            toPersianDigits(filtered.length) +
            ' محصول';
        }
      }

      renderPagination(filtered.length ? totalPages : 0);
      syncExploreChips();
    }

    function onFilterChange() {
      currentPage = 1;
      render();
    }

    if (searchEl) searchEl.addEventListener('input', onFilterChange);
    if (familyEl) familyEl.addEventListener('change', onFilterChange);
    if (methodEl) methodEl.addEventListener('change', onFilterChange);
    if (cropEl) cropEl.addEventListener('change', onFilterChange);
    if (sortEl) sortEl.addEventListener('change', onFilterChange);
    tagInputs.forEach(function (input) {
      input.addEventListener('change', onFilterChange);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (searchEl) searchEl.value = '';
        if (familyEl) familyEl.value = '';
        if (methodEl) methodEl.value = '';
        if (cropEl) cropEl.value = '';
        if (sortEl) sortEl.value = 'featured';
        tagInputs.forEach(function (input) {
          input.checked = false;
        });
        onFilterChange();
      });
    }

    exploreChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const key = chip.getAttribute('data-products-filter');
        const value = chip.getAttribute('data-value');
        if (key === 'family' && familyEl) {
          familyEl.value = familyEl.value === value ? '' : value;
        }
        if (key === 'method' && methodEl) {
          methodEl.value = methodEl.value === value ? '' : value;
        }
        if (key === 'crop' && cropEl) {
          cropEl.value = cropEl.value === value ? '' : value;
        }
        onFilterChange();
        const catalog = document.getElementById('productsCatalog');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    render();
  })();

  /* -------- Product category: simple filter + pagination -------- */
  (function initCategoryCatalog() {
    const grid = document.getElementById('categoryGrid');
    const paginationEl = document.getElementById('categoryPagination');
    if (!grid || !paginationEl) return;

    const searchEl = document.getElementById('categorySearch');
    const methodEl = document.getElementById('categoryMethod');
    const tagEl = document.getElementById('categoryTag');
    const clearBtn = document.getElementById('categoryClearFilters');
    const countEl = document.getElementById('categoryResultCount');
    const emptyEl = document.getElementById('categoryEmpty');
    const PAGE_SIZE = 4;
    let currentPage = 1;
    const items = Array.prototype.slice.call(grid.querySelectorAll('.product-col'));

    function tokenList(value) {
      return String(value || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    }

    function getFiltered() {
      const q = (searchEl && searchEl.value ? searchEl.value : '').trim().toLowerCase();
      const method = methodEl ? methodEl.value : '';
      const tag = tagEl ? tagEl.value : '';

      return items.filter(function (item) {
        const name = (item.getAttribute('data-name') || '').toLowerCase();
        const methods = tokenList(item.getAttribute('data-method'));
        const tags = tokenList(item.getAttribute('data-tags'));
        if (q && name.indexOf(q) === -1) return false;
        if (method && methods.indexOf(method) === -1) return false;
        if (tag && tags.indexOf(tag) === -1) return false;
        return true;
      });
    }

    function renderPagination(totalPages) {
      paginationEl.innerHTML = '';
      if (totalPages <= 1) return;

      function addBtn(label, page, opts) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'page-btn';
        btn.textContent = typeof label === 'number' ? toPersianDigits(label) : label;
        if (opts && opts.active) btn.classList.add('is-active');
        if (opts && opts.disabled) btn.disabled = true;
        if (!(opts && opts.disabled) && page) {
          btn.addEventListener('click', function () {
            currentPage = page;
            render();
            const section = document.getElementById('categoryProducts');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
        paginationEl.appendChild(btn);
      }

      addBtn('قبلی', currentPage - 1, { disabled: currentPage <= 1 });
      for (let i = 1; i <= totalPages; i += 1) {
        addBtn(i, i, { active: i === currentPage });
      }
      addBtn('بعدی', currentPage + 1, { disabled: currentPage >= totalPages });
    }

    function render() {
      const filtered = getFiltered();
      const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;
      const start = (currentPage - 1) * PAGE_SIZE;

      items.forEach(function (item) {
        item.hidden = true;
      });
      filtered.forEach(function (item, index) {
        grid.appendChild(item);
        item.hidden = !(index >= start && index < start + PAGE_SIZE);
      });

      const pageItems = filtered.slice(start, start + PAGE_SIZE);
      if (emptyEl) emptyEl.hidden = filtered.length !== 0;
      if (countEl) {
        if (!filtered.length) {
          countEl.textContent = 'نتیجه‌ای یافت نشد';
        } else {
          countEl.textContent =
            'نمایش ' +
            toPersianDigits(start + 1) +
            ' تا ' +
            toPersianDigits(start + pageItems.length) +
            ' از ' +
            toPersianDigits(filtered.length) +
            ' محصول';
        }
      }
      renderPagination(filtered.length ? totalPages : 0);
    }

    function onChange() {
      currentPage = 1;
      render();
    }

    if (searchEl) searchEl.addEventListener('input', onChange);
    if (methodEl) methodEl.addEventListener('change', onChange);
    if (tagEl) tagEl.addEventListener('change', onChange);
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (searchEl) searchEl.value = '';
        if (methodEl) methodEl.value = '';
        if (tagEl) tagEl.value = '';
        onChange();
      });
    }

    render();
  })();

  /* -------- Product details: packs, copy link, sticky CTA -------- */
  (function initProductDetails() {
    const panel = document.querySelector('.product-detail-panel');
    if (!panel) return;

    const packChips = document.querySelectorAll('.product-pack-chip');
    const quotePack = document.getElementById('qPack');
    const copyBtn = document.getElementById('productCopyLink');
    const toast = document.getElementById('productCopyToast');
    const sticky = document.getElementById('productStickyBar');
    const showcase = document.getElementById('productShowcase');

    packChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        packChips.forEach(function (c) {
          c.classList.remove('is-active');
        });
        chip.classList.add('is-active');
        if (quotePack) {
          quotePack.value = chip.getAttribute('data-pack') || '';
        }
      });
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        const url = window.location.href;
        function showOk() {
          if (!toast) return;
          toast.hidden = false;
          setTimeout(function () {
            toast.hidden = true;
          }, 2000);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(showOk).catch(function () {
            window.prompt('لینک محصول:', url);
          });
        } else {
          window.prompt('لینک محصول:', url);
        }
      });
    }

    if (sticky && showcase) {
      function onScroll() {
        const rect = showcase.getBoundingClientRect();
        const show = rect.bottom < 80;
        sticky.hidden = !show;
        document.body.classList.toggle('has-product-sticky', show);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    const quoteModal = document.getElementById('quoteModal');
    if (quoteModal && quotePack) {
      quoteModal.addEventListener('show.bs.modal', function () {
        const active = document.querySelector('.product-pack-chip.is-active');
        if (active) quotePack.value = active.getAttribute('data-pack') || quotePack.value;
      });
    }
  })();

  /* -------- Blog share: copy link -------- */
  (function initBlogShare() {
    const btn = document.querySelector('[data-share="copy"]');
    if (!btn) return;
    const feedback = document.getElementById('blogShareFeedback');
    btn.addEventListener('click', function () {
      const url = window.location.href;
      function showOk() {
        if (!feedback) return;
        feedback.hidden = false;
        setTimeout(function () {
          feedback.hidden = true;
        }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(showOk).catch(function () {
          window.prompt('لینک مطلب:', url);
        });
      } else {
        window.prompt('لینک مطلب:', url);
      }
    });
  })();

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

  /* -------- Distributors Iran map filter -------- */
  (function initDistributorsFinder() {
    const root = document.getElementById('distributorsFinder');
    if (!root) return;

    const select = document.getElementById('provinceSelect');
    const clearBtn = document.getElementById('clearProvinceFilter');
    const list = document.getElementById('distributorsList');
    const emptyEl = document.getElementById('distributorsEmpty');
    const titleEl = document.getElementById('distributorsListTitle');
    const countEl = document.getElementById('distributorsListCount');
    const mapHost = document.getElementById('iranMapHost');
    if (!select || !list || !mapHost) return;

    const items = Array.prototype.slice.call(
      list.querySelectorAll('.distributor-item[data-province]')
    );
    const provincesWithDealers = {};
    items.forEach(function (item) {
      provincesWithDealers[item.getAttribute('data-province')] = true;
    });

    let provincePaths = [];

    function setProvince(province) {
      const value = province || '';
      select.value = value;
      if (clearBtn) clearBtn.hidden = !value;

      let visible = 0;
      items.forEach(function (item) {
        const match = !value || item.getAttribute('data-province') === value;
        item.hidden = !match;
        if (match) visible += 1;
      });

      if (emptyEl) emptyEl.hidden = visible !== 0;

      if (titleEl) {
        titleEl.textContent = value
          ? 'توزیع‌کنندگان ' + value
          : 'همه توزیع‌کنندگان';
      }
      if (countEl) {
        countEl.textContent =
          toPersianDigits(visible) +
          ' مورد' +
          (value ? ' در استان انتخاب‌شده' : '');
      }

      provincePaths.forEach(function (path) {
        const name = path.getAttribute('data-province');
        const selected = Boolean(value) && name === value;
        path.classList.toggle('is-selected', selected);
        path.classList.toggle('is-dimmed', Boolean(value) && !selected);
        path.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    }

    function bindMapPaths(svg) {
      const ns = 'http://www.w3.org/2000/svg';
      const provinceEls = Array.prototype.slice.call(
        svg.querySelectorAll('[data-province]')
      );

      // Decorative layers (water, labels) must never steal clicks.
      const decorGroup = document.createElementNS(ns, 'g');
      decorGroup.setAttribute('class', 'iran-map-decor');
      decorGroup.setAttribute('pointer-events', 'none');

      // Province hit layer: paint large shapes first, small ones last (on top).
      const provinceGroup = document.createElementNS(ns, 'g');
      provinceGroup.setAttribute('class', 'iran-provinces-hit');

      const decorNodes = Array.prototype.slice.call(svg.children).filter(function (node) {
        return (
          node.nodeType === 1 &&
          !node.hasAttribute('data-province') &&
          !node.querySelector('[data-province]')
        );
      });

      provinceEls.sort(function (a, b) {
        try {
          const ba = a.getBBox();
          const bb = b.getBBox();
          return bb.width * bb.height - ba.width * ba.height;
        } catch (err) {
          return 0;
        }
      });

      provinceEls.forEach(function (el) {
        provinceGroup.appendChild(el);
      });
      decorNodes.forEach(function (el) {
        decorGroup.appendChild(el);
      });

      svg.appendChild(provinceGroup);
      svg.appendChild(decorGroup);

      provincePaths = provinceEls;
      provincePaths.forEach(function (path) {
        const name = path.getAttribute('data-province');
        if (!path.classList.contains('iran-province')) {
          path.classList.add('iran-province');
        }
        path.style.pointerEvents = 'auto';
        path.setAttribute('role', 'button');
        path.setAttribute('tabindex', '0');
        path.setAttribute('aria-label', 'استان ' + name);
        path.setAttribute('aria-pressed', 'false');
        if (provincesWithDealers[name]) {
          path.classList.add('has-distributors');
        }

        path.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          setProvince(select.value === name ? '' : name);
        });
        path.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setProvince(select.value === name ? '' : name);
          }
        });
      });
      setProvince(select.value);
    }

    select.addEventListener('change', function () {
      setProvince(select.value);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        setProvince('');
      });
    }

    fetch('assets/img/iran-map.svg')
      .then(function (response) {
        if (!response.ok) throw new Error('map load failed');
        return response.text();
      })
      .then(function (svgText) {
        mapHost.innerHTML = svgText;
        const svg = mapHost.querySelector('svg');
        if (svg) {
          svg.classList.add('iran-map-svg');
          svg.removeAttribute('width');
          svg.removeAttribute('height');
          bindMapPaths(svg);
        } else {
          setProvince('');
        }
      })
      .catch(function () {
        mapHost.innerHTML =
          '<p class="text-muted small mb-0">نقشه در دسترس نیست؛ از فهرست استان استفاده کنید.</p>';
        setProvince('');
      });
  })();

  /* -------- Homepage product-brands slider -------- */
  (function initBrandsSlider() {
    const slider = document.getElementById('brandsSlider');
    if (!slider) return;

    const viewport = slider.querySelector('.brands-viewport');
    const track = slider.querySelector('.brands-track');
    const prevBtn = document.querySelector('[data-brands-prev]');
    const nextBtn = document.querySelector('[data-brands-next]');
    if (!viewport || !track) return;

    const cards = Array.prototype.slice.call(track.children);
    if (!cards.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION = 550;
    let index = 0;
    let locked = false;
    let timer = null;
    let hovering = false;
    let pointerStartX = 0;
    let swiped = false;

    function gapPx() {
      const styles = window.getComputedStyle(track);
      return parseFloat(styles.columnGap || styles.gap) || 0;
    }

    function visibleCount() {
      const width = viewport.clientWidth;
      if (width >= 1080) return 4;
      if (width >= 700) return 3;
      if (width >= 480) return 2;
      return 1;
    }

    function stepSize() {
      const first = cards[0];
      if (!first) return 0;
      return first.getBoundingClientRect().width + gapPx();
    }

    function maxOffset() {
      return Math.max(0, track.scrollWidth - viewport.clientWidth);
    }

    function maxIndex() {
      const step = stepSize();
      const max = maxOffset();
      if (step <= 0 || max <= 0) return 0;
      return Math.max(0, Math.round(max / step));
    }

    function offsetForIndex(i) {
      const max = maxOffset();
      const x = i * stepSize();
      if (x < 0) return 0;
      if (x > max) return max;
      return x;
    }

    function layout() {
      const count = Math.min(visibleCount(), cards.length);
      const gap = gapPx();
      const width = viewport.clientWidth;
      if (width <= 0) return;
      const cardW = (width - gap * (count - 1)) / count;
      track.style.setProperty('--brand-visible', String(count));
      track.style.setProperty('--brand-card-w', cardW + 'px');
      void track.offsetWidth;
      if (index > maxIndex()) index = maxIndex();
    }

    function updateButtons() {
      const atStart = index <= 0;
      const atEnd = index >= maxIndex();
      if (prevBtn) {
        prevBtn.disabled = atStart;
        prevBtn.setAttribute('aria-disabled', atStart ? 'true' : 'false');
      }
      if (nextBtn) {
        nextBtn.disabled = atEnd;
        nextBtn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
      }
    }

    function apply(animate) {
      track.style.transition = animate && !reduceMotion ? 'transform 0.55s ease' : 'none';
      track.style.transform = 'translateX(' + -offsetForIndex(index) + 'px)';
      updateButtons();
    }

    function go(dir) {
      const next = index + dir;
      if (next < 0 || next > maxIndex() || locked) return false;
      locked = true;
      index = next;
      apply(true);
      window.setTimeout(function () {
        locked = false;
      }, DURATION + 20);
      if (index >= maxIndex()) stopAutoplay();
      return true;
    }

    function startAutoplay() {
      stopAutoplay();
      if (reduceMotion || hovering || document.hidden) return;
      if (index >= maxIndex()) return;
      timer = window.setInterval(function () {
        if (!go(1)) stopAutoplay();
      }, 3200);
    }

    function stopAutoplay() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        go(1);
        startAutoplay();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        go(-1);
        startAutoplay();
      });
    }

    slider.addEventListener('mouseenter', function () {
      hovering = true;
      stopAutoplay();
    });
    slider.addEventListener('mouseleave', function () {
      hovering = false;
      startAutoplay();
    });
    slider.addEventListener('focusin', function () {
      hovering = true;
      stopAutoplay();
    });
    slider.addEventListener('focusout', function () {
      hovering = false;
      startAutoplay();
    });

    viewport.addEventListener('pointerdown', function (event) {
      pointerStartX = event.clientX;
      swiped = false;
    });
    viewport.addEventListener('pointerup', function (event) {
      const dx = event.clientX - pointerStartX;
      if (Math.abs(dx) < 40) return;
      swiped = true;
      go(dx < 0 ? 1 : -1);
      startAutoplay();
    });
    track.addEventListener('click', function (event) {
      if (!swiped) return;
      event.preventDefault();
      swiped = false;
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    window.addEventListener(
      'resize',
      function () {
        layout();
        apply(false);
      },
      { passive: true }
    );

    layout();
    apply(false);
    startAutoplay();
  })();
})();
