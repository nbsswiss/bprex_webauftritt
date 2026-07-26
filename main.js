// ─── Hero Bubbles Data ───
const heroBubblesData = {
  governance: {
    de: ['Project Controlling', 'Regulatory Compliance', 'Risikomanagement'],
    en: ['Project Controlling', 'Regulatory Compliance', 'Risk Management']
  },
  'it-audit': {
    de: ['Cyber Risk Check', 'ITGC', 'IT-Healthcheck'],
    en: ['Cyber Risk Check', 'ITGC', 'IT Health Check']
  },
  isms: {
    de: ['ISO 27001', 'NIST-CSF', 'CISO as a Service'],
    en: ['ISO 27001', 'NIST-CSF', 'CISO as a Service']
  },
  compliance: {
    de: ['ISAE 3402', 'SOC 2', 'IKT-Minimalstandard'],
    en: ['ISAE 3402', 'SOC 2', 'ICT minimum standard']
  }
};

let currentLang = 'de';
let currentHeroCategory = 'governance';

// Orbit configuration — radius per breakpoint, base angle per category
// Angles: 0°=right, 90°=bottom, 180°=left, -90°=top
// Start at -30° so badges sit right-top, right-bottom, left — all visible
const orbitRadius = { desktop: 160, tablet: 150, mobile: 100 };
const categoryAngles = {
  governance: -30,
  'it-audit': 60,
  isms: 150,
  compliance: 240
};

function getBreakpoint() {
  if (window.innerWidth <= 480) return 'mobile';
  if (window.innerWidth <= 1024) return 'tablet';
  return 'desktop';
}

function applyBubblePositions(category) {
  const radius = orbitRadius[getBreakpoint()];
  const baseAngle = categoryAngles[category];
  const floats = document.querySelectorAll('.hero-float');
  if (!floats.length) return;

  floats.forEach((el, i) => {
    const angleDeg = baseAngle + i * 120;
    const angleRad = angleDeg * (Math.PI / 180);
    const x = Math.cos(angleRad) * radius;
    const y = Math.sin(angleRad) * radius;
    el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  });
}

function setHeroBubbles(category) {
  currentHeroCategory = category;
  const bubbles = heroBubblesData[category][currentLang];
  const floats = document.querySelectorAll('.hero-float');

  floats.forEach((el, index) => {
    const span = el.querySelector('span:not(.float-icon)');
    if (span && bubbles[index]) {
      span.textContent = bubbles[index];
    }
  });
  applyBubblePositions(category);

  // Update active button style
  document.querySelectorAll('.hero-tag').forEach(btn => {
    btn.classList.remove('active');
  });
  if (event && event.target) event.target.classList.add('active');
}

// Set initial positions on load
window.addEventListener('DOMContentLoaded', () => {
  applyBubblePositions('governance');
});

// Update positions on resize
window.addEventListener('resize', () => {
  applyBubblePositions(currentHeroCategory);
});

function switchLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update lang switch buttons
  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === lang);
  });

  // Update all translatable elements
  document.querySelectorAll('[data-' + lang + ']').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'BUTTON') {
      // skip — buttons are handled separately below
    } else {
      el.innerHTML = text;
    }
  });

  // Update placeholders (textareas and inputs)
  document.querySelectorAll('[data-placeholder-' + lang + ']').forEach(el => {
    el.placeholder = el.getAttribute('data-placeholder-' + lang);
  });

  // Update buttons with spans
  document.querySelectorAll('.btn-primary[data-' + lang + '], .btn-secondary[data-' + lang + ']').forEach(btn => {
    const span = btn.querySelector('span');
    if (span) span.textContent = btn.getAttribute('data-' + lang);
  });

  // Update hero-tag buttons (skipped by the BUTTON exclusion above)
  document.querySelectorAll('.hero-tag[data-' + lang + ']').forEach(btn => {
    btn.textContent = btn.getAttribute('data-' + lang);
  });

  // Update hero bubbles with current category
  const bubbles = heroBubblesData[currentHeroCategory][lang];
  const floatElements = document.querySelectorAll('.hero-float');
  floatElements.forEach((el, index) => {
    const span = el.querySelector('span:not(.float-icon)');
    if (span && bubbles[index]) {
      span.textContent = bubbles[index];
    }
  });
}

// ─── Navigation Scroll Effect ───
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 20);
  // Mobile-Menü beim Scrollen automatisch schliessen
  const links = document.getElementById('navLinks');
  if (links) links.classList.remove('mobile-open');
});

// ─── Mobile Menu ───
function toggleMobileMenu() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.toggle('mobile-open');
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('mobile-open');
  });
});

// ─── Accordion ───
function toggleAccordion(header) {
  const item = header.parentElement;
  const body = item.querySelector('.accordion-body');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.accordion-item').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.accordion-body').style.maxHeight = null;
  });

  // Open clicked if it was closed
  if (!isOpen) {
    item.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
}

// ─── Scroll Reveal ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Ticker reflow nach Bilderladen (iOS-Safari Fix) ───
// Erzwingt Neuberechnung der max-content-Breite, sobald alle Bilder geladen sind.
// Simuliert effektiv den Reflow, der bei Orientation-Change passiert.
function restartTickerAnimation() {
  document.querySelectorAll('.ticker-track').forEach(track => {
    track.style.animation = 'none';
    // Reflow erzwingen
    void track.offsetWidth;
    track.style.animation = '';
  });
}
window.addEventListener('load', restartTickerAnimation);
// Zusätzlich nach jedem einzelnen Ticker-Bildladen (für langsames 4G)
document.querySelectorAll('.ticker-item img').forEach(img => {
  if (!img.complete) img.addEventListener('load', restartTickerAnimation, { once: true });
});

// ─── AJAX Form Submit (Kontakt & Assessment) ───
const ajaxForms = [
  {
    id: 'kontaktForm',
    success: { de: 'Vielen Dank! Ihre Nachricht wurde gesendet.', en: 'Thank you! Your message has been sent.' },
    error: { de: 'Fehler beim Senden. Bitte versuchen Sie es erneut oder schreiben Sie an contact@bprex.ch.', en: 'Error sending. Please try again or email contact@bprex.ch.' }
  },
  {
    id: 'assessmentForm',
    success: { de: 'Vielen Dank! Wir melden uns innert eines Werktags mit einem Terminvorschlag per Teams.', en: 'Thank you! We will get back to you within one business day with a Teams appointment proposal.' },
    error: { de: 'Fehler beim Senden. Bitte versuchen Sie es erneut oder schreiben Sie an contact@bprex.ch.', en: 'Error sending. Please try again or email contact@bprex.ch.' }
  }
];

ajaxForms.forEach(({ id, success, error }) => {
  const form = document.getElementById(id);
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const feedback = form.querySelector('.form-feedback');
    const btnSpan = btn.querySelector('span');
    const originalText = btnSpan.textContent;

    btn.disabled = true;
    btnSpan.textContent = '...';

    fetch('send.php', {
      method: 'POST',
      body: new FormData(form)
    })
    .then(r => r.json().then(data => ({ ok: r.ok, data })))
    .then(({ ok, data }) => {
      feedback.style.display = 'block';
      if (ok && data.status === 'ok') {
        feedback.style.background = '#e6f9f0';
        feedback.style.color = '#1a7f4b';
        feedback.textContent = success[currentLang] || success.de;
        form.reset();
      } else {
        feedback.style.background = '#fde8e8';
        feedback.style.color = '#b91c1c';
        feedback.textContent = data.message || (error[currentLang] || error.de);
      }
    })
    .catch(() => {
      feedback.style.display = 'block';
      feedback.style.background = '#fde8e8';
      feedback.style.color = '#b91c1c';
      feedback.textContent = error[currentLang] || error.de;
    })
    .finally(() => {
      btn.disabled = false;
      btnSpan.textContent = originalText;
    });
  });
});

// ─── Cookie Banner ───
(function() {
  const KEY = 'bprex_cookie_consent';
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  if (!localStorage.getItem(KEY)) banner.hidden = false;
  const acceptBtn = document.getElementById('cookieAccept');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem(KEY, '1');
      banner.hidden = true;
    });
  }
})();
