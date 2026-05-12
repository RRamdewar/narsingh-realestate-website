/* Narsingh Team — RE/MAX Community Realty Website */

document.addEventListener('DOMContentLoaded', () => {

  // Init Feather icons
  if (typeof feather !== 'undefined') feather.replace();

  // ── Tab switching ──────────────────────────────────────────────
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function activateTab(tabId) {
    tabBtns.forEach(btn => {
      const active = btn.dataset.tab === tabId;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active);
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${tabId}`);
    });
    // Re-run feather on newly shown panel
    if (typeof feather !== 'undefined') feather.replace();
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  // Tab triggers in nav/hero/footer/cta buttons
  document.querySelectorAll('.tab-trigger').forEach(el => {
    el.addEventListener('click', e => {
      const tab = el.dataset.tab;
      if (!tab) return;
      e.preventDefault();
      activateTab(tab);
      const listingsSection = document.getElementById('listings');
      if (listingsSection) {
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-h')) || 72;
        const top = listingsSection.getBoundingClientRect().top + window.pageYOffset - offset - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Sticky header shadow ──────────────────────────────────────
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Mobile nav ────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mainNav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close nav on link click
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mainNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Close nav on outside click
  document.addEventListener('click', e => {
    if (!header.contains(e.target)) {
      hamburger.classList.remove('open');
      mainNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    }
  });

  // ── Active nav link on scroll ──────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link:not(.tab-trigger):not(.nav-cta)');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: `-${(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72) + 20}px 0px -60% 0px` });

  sections.forEach(s => sectionObserver.observe(s));

  // ── Awards expandable blocks ────────────────────────────────────
  document.querySelectorAll('.awards-header').forEach(header => {
    const listId = header.getAttribute('aria-controls');
    const list   = document.getElementById(listId);
    if (!list) return;

    const toggle = () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !expanded);
      list.hidden = expanded;
      if (typeof feather !== 'undefined') feather.replace();
    };

    header.addEventListener('click', toggle);
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  // ── MLS Search form ────────────────────────────────────────────
  const ddfForm    = document.getElementById('ddf-search-form');
  const ddfResults = document.getElementById('ddf-results');

  const MOCK_LISTINGS = [
    { price:'$1,149,000', address:'27 Thornberry Way', city:'Brampton, ON', beds:4, baths:3, sqft:'2,280', type:'Detached' },
    { price:'$799,900',   address:'104 Forestbrook Dr', city:'Mississauga, ON', beds:3, baths:2, sqft:'1,620', type:'Semi-Detached' },
    { price:'$1,589,000', address:'9 Ravenscroft Crt',  city:'Oakville, ON', beds:5, baths:4, sqft:'3,200', type:'Detached' },
    { price:'$649,000',   address:'302-880 Dundas St W', city:'Mississauga, ON', beds:2, baths:2, sqft:'950', type:'Condo' },
    { price:'$2,450,000', address:'14 White Pines Dr',  city:'Burlington, ON', beds:6, baths:5, sqft:'4,100', type:'Detached' },
    { price:'$539,900',   address:'1108-360 Square One Dr', city:'Mississauga, ON', beds:1, baths:1, sqft:'620', type:'Condo' },
  ];

  if (ddfForm) {
    ddfForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(ddfForm));
      renderDdfResults(data);
    });
  }

  const resetBtn = document.getElementById('reset-search');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      ddfForm.reset();
      ddfResults.innerHTML = `<div class="ddf-results-inner">
        <div class="ddf-placeholder">
          <i data-feather="search"></i>
          <h3>Ready to Search</h3>
          <p>Enter your search criteria above to browse available MLS® listings.</p>
          <a href="https://www.realtor.ca" target="_blank" rel="noopener" class="btn btn-primary">
            <i data-feather="external-link"></i> Browse All MLS® Listings on Realtor.ca
          </a>
        </div>
      </div>`;
      if (typeof feather !== 'undefined') feather.replace();
    });
  }

  function renderDdfResults(filters) {
    let results = [...MOCK_LISTINGS];

    if (filters.minPrice) {
      const min = parseInt(filters.minPrice);
      results = results.filter(l => parseInt(l.price.replace(/\D/g,'')) >= min);
    }
    if (filters.maxPrice) {
      const max = parseInt(filters.maxPrice);
      results = results.filter(l => parseInt(l.price.replace(/\D/g,'')) <= max);
    }
    if (filters.beds) {
      const minBeds = parseInt(filters.beds);
      results = results.filter(l => l.beds >= minBeds);
    }
    if (filters.propertyType) {
      results = results.filter(l =>
        l.type.toLowerCase().includes(filters.propertyType.replace('-', ' ').toLowerCase())
      );
    }
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      results = results.filter(l =>
        l.city.toLowerCase().includes(loc) || l.address.toLowerCase().includes(loc)
      );
    }

    if (results.length === 0) {
      ddfResults.innerHTML = `
        <div class="ddf-results-inner">
          <div class="ddf-placeholder">
            <i data-feather="search"></i>
            <h3>No Results Found</h3>
            <p>Try adjusting your filters or browse all listings on Realtor.ca.</p>
            <a href="https://www.realtor.ca" target="_blank" rel="noopener" class="btn btn-primary">
              <i data-feather="external-link"></i> Browse on Realtor.ca
            </a>
          </div>
        </div>`;
      if (typeof feather !== 'undefined') feather.replace();
      return;
    }

    const cards = results.map(l => `
      <div class="listing-card">
        <div class="listing-img-wrap">
          <div class="listing-img-placeholder">
            <i data-feather="home"></i>
            <span>MLS® Listing</span>
          </div>
        </div>
        <div class="listing-body">
          <div class="listing-price">${l.price}</div>
          <h3 class="listing-address">${l.address}</h3>
          <p class="listing-city">${l.city}</p>
          <div class="listing-details">
            <span><i data-feather="layers"></i> ${l.beds} Bed</span>
            <span><i data-feather="droplet"></i> ${l.baths} Bath</span>
            <span><i data-feather="maximize"></i> ${l.sqft} sqft</span>
            <span><i data-feather="home"></i> ${l.type}</span>
          </div>
          <div class="listing-actions">
            <a href="#contact" class="btn btn-sm btn-primary">Book Showing</a>
            <a href="https://www.realtor.ca" target="_blank" rel="noopener" class="btn btn-sm btn-ghost">
              <i data-feather="external-link"></i> View on MLS®
            </a>
          </div>
        </div>
      </div>`).join('');

    ddfResults.innerHTML = `
      <div style="width:100%;">
        <p style="font-size:.85rem;color:var(--slate-500);margin-bottom:20px;font-weight:600;">
          ${results.length} listing${results.length !== 1 ? 's' : ''} found · Sample data — view live results on Realtor.ca
        </p>
        <div class="listings-grid" style="margin-bottom:0;">${cards}</div>
      </div>`;
    if (typeof feather !== 'undefined') feather.replace();
  }

  // ── Valuation form ─────────────────────────────────────────────
  const valForm    = document.getElementById('valuation-form');
  const valSuccess = document.getElementById('valuation-success');

  if (valForm) {
    valForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm(valForm)) return;
      simulateSubmit(valForm, () => {
        valForm.classList.add('hidden');
        valSuccess.classList.remove('hidden');
        if (typeof feather !== 'undefined') feather.replace();
      });
    });
  }

  // ── Contact form ───────────────────────────────────────────────
  const contactForm    = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
      simulateSubmit(contactForm, () => {
        contactSuccess.classList.remove('hidden');
        contactForm.reset();
        if (typeof feather !== 'undefined') feather.replace();
      });
    });
  }

  // ── Form helpers ───────────────────────────────────────────────
  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const empty = !field.value.trim();
      field.style.borderColor = empty ? 'var(--red)' : '';
      if (empty) valid = false;
      field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
    });

    // Basic email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.style.borderColor = 'var(--red)';
      valid = false;
      emailField.addEventListener('input', () => { emailField.style.borderColor = ''; }, { once: true });
    }

    if (!valid) {
      const firstInvalid = form.querySelector('[style*="border-color: var(--red)"]');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid?.focus();
    }
    return valid;
  }

  function simulateSubmit(form, onSuccess) {
    const btn = form.querySelector('[type="submit"]');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" opacity=".25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg> Sending…';

    // Simulate network delay
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = original;
      onSuccess();
    }, 1400);
  }

  // Spinner CSS injection
  const spinStyle = document.createElement('style');
  spinStyle.textContent = `
    .spin { animation: spin .8s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(spinStyle);

  // ── Smooth anchor scroll (for non-tab nav links) ───────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.classList.contains('tab-trigger')) return;
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h')) || 72;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Animate elements into view ─────────────────────────────────
  const animStyle = document.createElement('style');
  animStyle.textContent = `
    .anim-fade { opacity: 0; transform: translateY(20px); transition: opacity .55s ease, transform .55s ease; }
    .anim-fade.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(animStyle);

  const animTargets = [
    '.why-card', '.sell-card', '.listing-card',
    '.agent-card', '.testimonial-card', '.contact-item'
  ].join(', ');

  document.querySelectorAll(animTargets).forEach(el => el.classList.add('anim-fade'));

  const animObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.anim-fade').forEach(el => animObserver.observe(el));

});
