/* ==========================================================================
   PREMPRAKASH SHARMA — PORTFOLIO SCRIPT
   Vanilla JS only. Organised by feature, each wrapped in its own init fn.
   ========================================================================== */

// Update this when you deploy the backend (see django-backend/README.md).
const API_BASE_URL = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCustomCursor();
  initNavbar();
  initScrollProgress();
  initTypingEffect();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initMagnetic();
  initTiltCards();
  initBackToTop();
  initProjectModals();
  initContactForm();
  initFooterYear();
});

/* ---------- Loader ---------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 500);
  });
  // Fallback in case 'load' already fired or takes too long
  setTimeout(() => loader.classList.add('is-hidden'), 2500);
}

/* ---------- Custom cursor ---------- */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const spotlight = document.getElementById('spotlight');
  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX; targetY = e.clientY;
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top = e.clientY + 'px';
    spotlight.classList.add('is-visible');
  });

  window.addEventListener('mouseleave', () => spotlight.classList.remove('is-visible'));

  function animateRing() {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverables = document.querySelectorAll('a, button, .tilt-card, input, textarea');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
  });
}

/* ---------- Navbar: scroll state, active link, mobile toggle ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('main section[id], .hero[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.innerHTML = isOpen
      ? '<svg width="22" height="22"><use href="#icon-close"></use></svg>'
      : '<svg width="22" height="22"><use href="#icon-menu"></use></svg>';
  });

  links.forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.innerHTML = '<svg width="22" height="22"><use href="#icon-menu"></use></svg>';
  }));

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach((s) => spy.observe(s));
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = scrolled + '%';
  }, { passive: true });
}

/* ---------- Typing effect for hero role ---------- */
function initTypingEffect() {
  const el = document.getElementById('typedRole');
  if (!el) return;
  const roles = ['Python Full-Stack Developer', 'Django Developer', 'Machine Learning Engineer', 'AI Engineer'];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 80);
  }
  tick();
}

/* ---------- Scroll reveal via IntersectionObserver ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-up, .reveal-scale');
  // stagger items that share a parent by assigning --d in DOM order per container
  const counters = new Map();
  items.forEach((el) => {
    const parent = el.parentElement;
    const n = counters.get(parent) || 0;
    el.style.setProperty('--d', Math.min(n, 6));
    counters.set(parent, n + 1);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach((el) => io.observe(el));
}

/* ---------- Animated counters ---------- */
function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const isDecimal = el.hasAttribute('data-decimal');
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = isDecimal ? value.toFixed(1) : Math.round(value).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach((el) => io.observe(el));
}

/* ---------- Skill bar fill ---------- */
function initSkillBars() {
  const rows = document.querySelectorAll('.skill-bar-row');
  if (!rows.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const row = entry.target;
      const fill = row.querySelector('.skill-bar-fill');
      const value = row.dataset.value || 0;
      requestAnimationFrame(() => { fill.style.width = value + '%'; });
      io.unobserve(row);
    });
  }, { threshold: 0.4 });

  rows.forEach((row) => io.observe(row));
}

/* ---------- Magnetic buttons ---------- */
function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;
  const items = document.querySelectorAll('.magnetic');
  items.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ---------- 3D tilt on project cards ---------- */
function initTiltCards() {
  if (window.matchMedia('(hover: none)').matches) return;
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${py * -8}deg) rotateY(${px * 10}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Project modals ---------- */
const PROJECT_DATA = {
  osteoporosis: {
    title: 'Osteoporosis Detection using Machine Learning',
    meta: 'Medical Imaging · Python, TensorFlow, MobileNetV2, Scikit-learn',
    overview: 'A classifier that flags osteoporosis from X-ray images, built end-to-end from a small public dataset through to a benchmarked, evaluated model.',
    points: [
      'Expanded a ~600-image public X-ray dataset to 4,000+ through preprocessing and data augmentation',
      'Built a feature-extraction pipeline using MobileNetV2 for transfer learning on medical images',
      'Benchmarked Logistic Regression, SVM, Decision Tree, Random Forest and AdaBoost classifiers',
      'Best result: ~89% accuracy with SVM, evaluated on Accuracy, Precision, Recall, F1-score and ROC-AUC'
    ],
    tags: ['Python', 'TensorFlow', 'MobileNetV2', 'Scikit-learn']
  },
  techstore: {
    title: 'TechStore Product Showcase',
    meta: 'Deployed on Vercel · HTML5, CSS3, JavaScript (ES6)',
    overview: 'A fully responsive e-commerce front end built from scratch — product browsing, search, filtering and sorting, all running client-side with no framework.',
    points: [
      'Dynamic shopping cart with real-time item management, quantity updates and automatic price calculation',
      'DOM manipulation and event-driven programming for every interaction',
      'Deployed live on Vercel, with source managed through Git and GitHub',
      'Mobile-friendly, responsive interface tested across multiple device sizes'
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript ES6', 'DOM API']
  },
  restaurant: {
    title: 'Restaurant Sales & Customer Analytics',
    meta: 'Data Analysis · Python, Pandas, NumPy, Matplotlib, Power BI',
    overview: 'Exploratory data analysis on a public restaurant sales dataset to turn raw transactions into decisions the business could act on.',
    points: [
      'Identified key sales trends, customer purchasing behaviour and ordering patterns',
      'Cleaned and preprocessed data using Pandas and NumPy ahead of analysis',
      'Built visualisations in Matplotlib to present actionable insights clearly'
    ],
    tags: ['Python', 'Pandas', 'NumPy', 'Matplotlib']
  },
  hospital: {
    title: 'Hospital Analytics Dashboard',
    meta: 'BI Dashboard · Power BI',
    overview: 'An interactive Power BI dashboard built to help hospital administrators read patient flow and operations at a glance.',
    points: [
      'Tracked KPIs such as bed utilisation and department efficiency',
      'Modelled hospital operations data for fast, interactive filtering',
      'Enabled data-driven decisions through clear, interactive visual reports'
    ],
    tags: ['Power BI', 'Data Modelling', 'DAX']
  },
  spider: {
    title: 'Low-cost ESP32 Quadruped Spider Robot',
    meta: 'Published Paper · MAT Journals, 2026',
    overview: 'A low-cost quadruped robot built around an ESP32, designed as an accessible platform for robotics education and terrain-mobility experiments.',
    points: [
      'Components: ESP32, PCA9685 16-channel PWM driver, 12× servo motors on a 3-in-1 robot kit chassis',
      'ESP32 computes leg-trajectory kinematics for a coordinated quadruped walking gait',
      'PCA9685 drives all 12 servos over I²C, freeing the ESP32 from direct PWM timing',
      'Findings published as "Design and Development of a Low-cost ESP32-based Quadruped Spider Robot," MAT Journals, 2026'
    ],
    tags: ['ESP32', 'PCA9685', 'Servo Control', 'Robotics']
  },
  phsensor: {
    title: 'ESP32 pH Monitoring Dashboard',
    meta: 'Personal Project · IoT',
    overview: 'A live water-quality monitor: an ESP32 reads an analog pH probe and serves a real-time dashboard straight from the device over Wi-Fi.',
    points: [
      'ESP32 samples an analog pH sensor and calibrates readings in firmware',
      'Serves a lightweight web dashboard, visualised live with Chart.js',
      'Useful for water-quality monitoring, aquaponics and hydroponics setups'
    ],
    tags: ['ESP32', 'IoT', 'Chart.js', 'Sensors']
  }
};

function initProjectModals() {
  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalClose');
  if (!overlay) return;

  // Whole cards open the modal on click...
  document.querySelectorAll('.project-card[data-project], .ece-project-card[data-project]').forEach((card) => {
    card.addEventListener('click', () => {
      const data = PROJECT_DATA[card.dataset.project];
      if (!data) return;
      renderModal(data);
      openModal();
    });
    // ...but a nested link/button inside the card should do its own thing, not bubble up
    card.querySelectorAll('a, button').forEach((inner) => {
      inner.addEventListener('click', (e) => e.stopPropagation());
    });
  });

  // "Details" buttons re-open their own click after stopping propagation above
  document.querySelectorAll('.project-open[data-project]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const data = PROJECT_DATA[btn.dataset.project];
      if (!data) return;
      renderModal(data);
      openModal();
    });
  });

  function renderModal(data) {
    body.innerHTML = `
      <h3 class="modal-body-title">${data.title}</h3>
      <span class="modal-body-meta">${data.meta}</span>
      <div class="modal-body-section">
        <h5>Overview</h5>
        <p>${data.overview}</p>
      </div>
      <div class="modal-body-section">
        <h5>Highlights</h5>
        <ul>${data.points.map((p) => `<li>${p}</li>`).join('')}</ul>
      </div>
      <div class="modal-tags">${data.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
    `;
  }

  function openModal() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

/* ---------- Contact form (posts to the Django backend) ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('cfSubmit');
  const submitLabel = submitBtn.querySelector('span');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.querySelector('#cf-name');
    const email = form.querySelector('#cf-email');
    const message = form.querySelector('#cf-message');
    const website = form.querySelector('#cf-website'); // honeypot, always blank for real users
    let valid = true;

    valid = validateField(name, name.value.trim().length > 1, 'Please enter your name') && valid;
    valid = validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), 'Enter a valid email') && valid;
    valid = validateField(message, message.value.trim().length > 8, 'Message is a little short') && valid;

    if (!valid) { success.classList.remove('is-visible'); return; }

    submitBtn.disabled = true;
    submitLabel.textContent = 'Sending…';

    const payload = {
      name: name.value.trim(),
      email: email.value.trim(),
      message: message.value.trim(),
      website: website.value, // backend silently drops the submission if this is filled in
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) throw new Error('Too many messages sent recently — please try again in a bit.');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const firstError = Object.values(data)[0];
        throw new Error(Array.isArray(firstError) ? firstError[0] : 'Something went wrong — please try again.');
      }

      success.classList.add('is-visible');
      success.innerHTML = '<svg width="20" height="20"><use href="#icon-check"></use></svg> Message sent — I\'ll reply by email soon.';
      form.reset();
    } catch (err) {
      // Backend unreachable or returned an error — fall back to opening the visitor's email app.
      success.classList.add('is-visible');
      success.style.background = 'rgba(248,113,113,0.14)';
      success.style.color = '#B91C1C';
      success.innerHTML = `<svg width="20" height="20"><use href="#icon-close"></use></svg> ${err.message || 'Could not reach the server.'} Opening your email app instead…`;
      const subject = encodeURIComponent(`Portfolio enquiry from ${name.value.trim()}`);
      const body = encodeURIComponent(`${message.value.trim()}\n\n— ${name.value.trim()} (${email.value.trim()})`);
      setTimeout(() => { window.location.href = `mailto:sharmaprem8294@gmail.com?subject=${subject}&body=${body}`; }, 1200);
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = 'Send Message';
    }
  });

  function validateField(input, isValid, errMsg) {
    const row = input.closest('.form-row');
    const errorEl = row.querySelector('.form-error');
    row.classList.toggle('has-error', !isValid);
    errorEl.textContent = isValid ? '' : errMsg;
    return isValid;
  }

  [form.querySelector('#cf-name'), form.querySelector('#cf-email'), form.querySelector('#cf-message')].forEach((input) => {
    input.addEventListener('input', () => {
      input.closest('.form-row').classList.remove('has-error');
      input.closest('.form-row').querySelector('.form-error').textContent = '';
    });
  });
}

/* ---------- Footer year ---------- */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
