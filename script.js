/**
 * Harshit Saharan — AWS Cloud Engineer & DevOps / SRE Portfolio JavaScript
 */

(function () {
  'use strict';

  // ---------- Helper Functions ----------
  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function smoothstep(x, a, b) {
    const t = clamp01((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  }

  function mixColor(c1, c2, t) {
    const p1 = c1.match(/\w\w/g).map(h => parseInt(h, 16));
    const p2 = c2.match(/\w\w/g).map(h => parseInt(h, 16));
    const r = p1.map((v, i) => Math.round(v + (p2[i] - v) * t));
    return `rgb(${r[0]},${r[1]},${r[2]})`;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Hero Skills Background Grid ----------
  const ALL_SKILLS = [
    'AWS', 'EC2', 'S3', 'VPC', 'IAM', 'CloudWatch', 'CloudFront', 'Auto Scaling',
    'Internal ALB', 'Aurora', 'Prometheus', 'Grafana', 'Jenkins', 'Pytest',
    'Docker Compose', 'Docker', 'Python (Flask)', 'Nginx', 'REST API', 'SRE Metrics',
    'API Gateway', 'AWS Lambda', 'DynamoDB', 'CodePipeline', 'CloudFormation',
    'Kubernetes', 'CI/CD', 'Git', 'GitHub Actions', 'Linux', 'PM2', 'Security Groups'
  ];

  function buildHeroGrid() {
    const grid = document.getElementById('heroGrid');
    if (!grid) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const cellSize = w < 700 ? 96 : 150;
    const cols = Math.max(1, Math.round(w / cellSize));
    const rows = Math.max(1, Math.round(h / cellSize));
    const total = cols * rows;

    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    let pool = [];
    while (pool.length < total) {
      pool = pool.concat(shuffle(ALL_SKILLS));
    }
    pool = pool.slice(0, total);

    let html = '';
    for (let i = 0; i < total; i++) {
      html += `<div class="hero-cell has-skill"><span>${pool[i]}</span></div>`;
    }
    grid.innerHTML = html;
  }

  buildHeroGrid();
  let gridResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(gridResizeTimer);
    gridResizeTimer = setTimeout(buildHeroGrid, 200);
  });

  // ---------- Navigation & Hero Scroll Controller ----------
  const nav = document.getElementById('mainNav');
  const navBrand = document.getElementById('navBrand');
  const progressBar = document.getElementById('progressBar');
  const heroContent = document.getElementById('heroContent');

  function onScroll() {
    const y = window.scrollY;
    const heroH = window.innerHeight;

    // Toggle nav bar scrolled class
    if (nav) nav.classList.toggle('scrolled', y > 60);

    // Scroll progress bar
    if (progressBar) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    }

    // Hero parallax & opacity fade
    if (heroContent) {
      if (y < heroH) {
        const p = y / heroH;
        heroContent.style.transform = `translateY(${p * 60}px) scale(${1 - p * 0.06})`;
        heroContent.style.opacity = 1 - p * 1.15;
      } else {
        heroContent.style.opacity = 0;
      }
    }

    // Nav-brand crossfade
    if (navBrand) {
      const t = smoothstep(y, heroH * 0.45, heroH * 0.92);
      navBrand.style.opacity = t;
      navBrand.style.transform = `translateY(${(1 - t) * -4}px)`;
      navBrand.style.color = mixColor('ffffff', '0B0F14', t);
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  // ---------- Scroll Reveal Animations ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---------- Generic Pinned Scroll Controller ----------
  function makePinController({ wrapId, stageCount, onProgress }) {
    const wrap = document.getElementById(wrapId);
    if (!wrap) return () => {};

    return function update() {
      if (window.innerWidth <= 900) return;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      let progress = (-rect.top) / total;
      progress = clamp01(progress);
      const stageIdx = Math.min(stageCount - 1, Math.floor(progress * stageCount));
      onProgress(stageIdx, progress);
    };
  }

  // Project 1 Pinned Controller (AWS 3-Tier)
  const updateProjectPin = makePinController({
    wrapId: 'pinWrap',
    stageCount: 3,
    onProgress: (stageIdx) => {
      document.querySelectorAll('.pin-stage[data-set="proj"]').forEach((s, i) => s.classList.toggle('active', i === stageIdx));
      document.querySelectorAll('.pdot[data-set="proj"]').forEach((d, i) => d.classList.toggle('active', i === stageIdx));
      document.querySelectorAll('.diag-tier').forEach(t => t.classList.toggle('lit', parseInt(t.dataset.tier, 10) <= stageIdx));
      document.querySelectorAll('.diag-edge').forEach(e => e.classList.toggle('lit', parseInt(e.dataset.edge, 10) <= stageIdx));
    }
  });

  // Project 2 Pinned Controller (SRE DevOps API)
  const updateSrePin = makePinController({
    wrapId: 'srePinWrap',
    stageCount: 3,
    onProgress: (stageIdx) => {
      document.querySelectorAll('.pin-stage[data-set="sre"]').forEach((s, i) => s.classList.toggle('active', i === stageIdx));
      document.querySelectorAll('.pdot[data-set="sre"]').forEach((d, i) => d.classList.toggle('active', i === stageIdx));
      document.querySelectorAll('.diag-tier-sre').forEach(t => t.classList.toggle('lit', parseInt(t.dataset.stier, 10) <= stageIdx));
      document.querySelectorAll('.diag-edge-sre').forEach(e => e.classList.toggle('lit', parseInt(e.dataset.sedge, 10) <= stageIdx));
    }
  });

  // Skills Pinned Controller
  const skillsFinalNote = document.getElementById('skillsFinalNote');
  const updateSkillsPin = makePinController({
    wrapId: 'skillsPinWrap',
    stageCount: 4,
    onProgress: (stageIdx, progress) => {
      document.querySelectorAll('.pin-stage[data-set="skills"]').forEach((s, i) => s.classList.toggle('active', i === stageIdx));
      document.querySelectorAll('.pdot[data-set="skills"]').forEach((d, i) => d.classList.toggle('active', i === stageIdx));
      document.querySelectorAll('.skill-chip2').forEach(c => c.classList.toggle('lit', parseInt(c.dataset.group, 10) <= stageIdx));
      if (skillsFinalNote) skillsFinalNote.classList.toggle('lit', progress > 0.88);
    }
  });

  function updateAllPins() {
    updateProjectPin();
    updateSrePin();
    updateSkillsPin();
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateAllPins);
  }, { passive: true });
  window.addEventListener('resize', updateAllPins);
  updateAllPins();

  // ---------- Mobile Navigation Menu Toggle ----------
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileNavToggle && navLinks) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      mobileNavToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileNavToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // ---------- Copy Email to Clipboard Feature ----------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const email = 'harshit777saharan@gmail.com';
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Email address copied to clipboard!');
        }).catch(() => {
          showToast('Copied: ' + email);
        });
      } else {
        showToast('Copied: ' + email);
      }
    });
  }

})();
