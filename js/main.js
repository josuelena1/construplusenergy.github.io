/* ============================================================
   CONSTRU PLUS ENERGY — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Active Nav Link ──────────────────────────────────────────
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Sticky Header ────────────────────────────────────────────
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ── Mobile Menu ──────────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!header.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  // ── Scroll Reveal ────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  // ── Counter Animation ────────────────────────────────────────
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // ── Projects Filter ──────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            card.style.animation = 'none';
            requestAnimationFrame(() => {
              card.style.animation = 'fadeInUp 0.4s ease forwards';
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ── Contact Form (Formspree) ──────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn        = document.getElementById('submitBtn');
      const successMsg = document.getElementById('formSuccess');
      const errorMsg   = document.getElementById('formError');

      btn.disabled  = true;
      btn.innerHTML = '<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.4" stroke-dashoffset="10" style="animation:spin .8s linear infinite;transform-origin:center"/></svg> Enviando...';
      successMsg.style.display = 'none';
      errorMsg.style.display   = 'none';

      try {
        const res = await fetch(contactForm.action, {
          method:  'POST',
          body:    new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          successMsg.style.display = 'block';
          contactForm.reset();
        } else {
          errorMsg.style.display = 'block';
        }
      } catch {
        errorMsg.style.display = 'block';
      } finally {
        btn.disabled  = false;
        btn.innerHTML = '<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Enviar solicitud';
      }
    });
  }

  // ── Smooth scroll for anchor links ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── CSS Animation keyframe for filter ───────────────────────
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // ── Solar Panel Cells ────────────────────────────────────────
  const panelCells = document.getElementById('panelCells');
  if (panelCells) {
    const ROWS = 4, COLS = 6;
    // Orden de aparición en espiral desde centro hacia afuera
    const order = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // distancia desde el centro del panel para el orden de encendido
        const dr = r - (ROWS - 1) / 2;
        const dc = c - (COLS - 1) / 2;
        order.push({ r, c, dist: Math.abs(dr) + Math.abs(dc) });
      }
    }
    order.sort((a, b) => a.dist - b.dist);

    const cells = Array(ROWS * COLS);
    order.forEach((item, idx) => {
      const cell = document.createElement('div');
      cell.className = 'p-cell';
      cell.style.setProperty('--ci', idx);
      cells[item.r * COLS + item.c] = cell;
    });
    cells.forEach(cell => panelCells.appendChild(cell));
  }

});
