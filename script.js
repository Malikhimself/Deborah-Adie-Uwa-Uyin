// =============================================
//  DEBORAH ADIE UWA-UYIN — PORTFOLIO SCRIPT
// =============================================

/* ── Theme toggle ── */
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const themeToggleIcon = document.querySelector('.theme-toggle-icon');
const themeToggleText = document.querySelector('.theme-toggle-text');

const applyTheme = (theme) => {
  body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  document.documentElement.style.colorScheme = theme;

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    if (themeToggleIcon) themeToggleIcon.textContent = theme === 'dark' ? '☾' : '☀';
    if (themeToggleText) themeToggleText.textContent = theme === 'dark' ? 'Dark' : 'Light';
    themeToggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  }
};

const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme || 'light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

/* ── Navbar scroll behaviour ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    body.style.overflow = open ? 'hidden' : '';
    hamburger.querySelectorAll('span').forEach((s, i) => {
      if (open) {
        if (i === 0) s.style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
        if (i === 1) s.style.cssText = 'opacity:0;transform:scaleX(0)';
        if (i === 2) s.style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
      } else {
        s.style.cssText = '';
      }
    });
  });

  /* close on nav-link click */
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      body.style.overflow = '';
      hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* close on outside click */
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      body.style.overflow = '';
      hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
    }
  });
}

/* ── Scroll-reveal animation ── */
const animatedEls = document.querySelectorAll('.section-label, .section-title, .service-card, .skills-col, .timeline-item, .project-card, .edu-card, .about-text, .about-image-col, .writing-feature, .hero-text, .hero-visual, .stat-card, .contact-card, .contact-intro, .why-text');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger children
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 0);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animatedEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.65s ${i * 0.05}s ease, transform 0.65s ${i * 0.05}s ease`;
  observer.observe(el);
});

/* ── Active nav link highlight ── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');

const clearActiveNav = () => {
  navAnchors.forEach(a => a.classList.remove('active'));
};

const setActiveNav = (sectionId) => {
  clearActiveNav();
  const active = document.querySelector(`.nav-link[href="#${sectionId}"]`);
  if (active) active.classList.add('active');
};

const getActiveSectionId = () => {
  const offset = navbar.offsetHeight + 32;
  const scrollPos = window.scrollY + offset;
  let activeSection = sections.length ? sections[0].id : '';

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    if (scrollPos >= sectionTop) {
      activeSection = section.id;
    }
  });

  return activeSection;
};

const updateActiveNav = () => {
  const sectionId = getActiveSectionId();
  if (sectionId) setActiveNav(sectionId);
};

window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('resize', updateActiveNav);

const setActiveNavFromHash = () => {
  const sectionId = window.location.hash.replace('#', '');
  if (sectionId) {
    setActiveNav(sectionId);
  } else {
    setActiveNav('about');
  }
};

window.addEventListener('load', () => {
  setActiveNavFromHash();
  updateActiveNav();
});
window.addEventListener('hashchange', setActiveNavFromHash);

/* ── Smooth scroll offset (for fixed nav) */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Cursor glow (desktop only) ── */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; width: 300px; height: 300px;
    border-radius: 50%; pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 70%);
    transform: translate(-50%,-50%);
    transition: left 0.3s ease, top 0.3s ease;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY  + 'px';
  }, { passive: true });
}

/* ── Parallax hero orbs ── */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  if (orb1) orb1.style.transform = `translateY(${scrollY * 0.08}px)`;
  if (orb2) orb2.style.transform = `translateY(${scrollY * -0.05}px)`;
}, { passive: true });

/* ── Card tilt effect ── */
document.querySelectorAll('.service-card, .project-card, .edu-card, .stat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
