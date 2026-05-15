/* ============================================
   VERNIQ UAVs — Aerospace Interactive Layer
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // Cinematic Logo Intro
  // ============================================
  const videoIntro = document.getElementById('videoIntro');
  const introSkip = document.getElementById('introSkip');

  // Particle Grid (intro)
  const canvas = document.getElementById('introParticles');
  let animFrameId;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 90;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.4,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.55)';
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.10)';
      ctx.lineWidth = 0.6;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 160) {
            ctx.globalAlpha = 1 - dist / 160;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      animFrameId = requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // Orchestrated intro sequence
  function runIntroSequence() {
    const path1 = document.getElementById('logoPath1');
    const path2 = document.getElementById('logoPath2');
    const glowRing = document.querySelector('.intro-glow-ring');
    const companyName = document.getElementById('introCompanyName');
    const tagline = document.getElementById('introTagline');
    const accentLine = document.getElementById('introAccentLine');

    setTimeout(() => path1 && path1.classList.add('drawn'), 300);
    setTimeout(() => path2 && path2.classList.add('drawn'), 600);

    setTimeout(() => {
      if (path1) path1.classList.add('filled');
      if (path2) path2.classList.add('filled');
      if (glowRing) glowRing.classList.add('active');
    }, 2000);

    setTimeout(() => {
      if (!companyName) return;
      const text = 'VERNIQ UAVS';
      const wrap = companyName.querySelector('.intro-char-wrap');
      if (!wrap) return;
      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'intro-char';
        span.textContent = char === ' ' ? ' ' : char;
        span.style.animationDelay = `${i * 0.06}s`;
        wrap.appendChild(span);
      });
    }, 2500);

    setTimeout(() => {
      tagline && tagline.classList.add('visible');
      accentLine && accentLine.classList.add('visible');
    }, 3400);
  }

  function dismissIntro() {
    if (!videoIntro) return;
    videoIntro.classList.add('hidden');
    document.body.style.overflow = '';
    if (animFrameId) cancelAnimationFrame(animFrameId);
    setTimeout(() => { videoIntro.style.display = 'none'; }, 1000);
  }

  if (videoIntro) {
    document.body.style.overflow = 'hidden';
    runIntroSequence();
    setTimeout(dismissIntro, 3200);
    videoIntro.addEventListener('click', dismissIntro);
    if (introSkip) {
      introSkip.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissIntro();
      });
    }
  }

  // ============================================
  // Hero Radar Sweep — slowed, instrumentation-like
  // ============================================
  const radarSweepGroup = document.getElementById('radarSweepGroup');
  if (radarSweepGroup && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let angle = 0;
    let last = performance.now();
    function sweep(now) {
      const dt = Math.min(now - last, 60);
      last = now;
      angle = (angle + dt * 0.018) % 360; // ~6.5 sec per revolution
      radarSweepGroup.setAttribute('transform', `rotate(${angle} 400 400)`);
      requestAnimationFrame(sweep);
    }
    requestAnimationFrame(sweep);
  }

  // ============================================
  // Navigation scroll state
  // ============================================
  const navbar = document.getElementById('navbar');
  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ============================================
  // Mobile menu toggle
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ============================================
  // Scroll reveal
  // ============================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // Counter animation
  // ============================================
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target.toLocaleString();
      }
      requestAnimationFrame(update);
      counterObserver.unobserve(counter);
    });
  }, { threshold: 0.4 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ============================================
  // Active nav state by current page
  // ============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });

  // ============================================
  // Smooth scroll for anchors
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });

  // ============================================
  // Hero parallax
  // ============================================
  const heroBg = document.querySelector('.hero-bg img');
  const heroGrid = document.querySelector('.hero-grid');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.25}px) scale(1.08)`;
        if (heroGrid) heroGrid.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    }, { passive: true });
  }

  // ============================================
  // Product card subtle tilt
  // ============================================
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = (y - cy) / 28;
      const ry = (cx - x) / 28;
      card.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1100px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ============================================
  // Products page filter logic
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterableCards = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');
      filterableCards.forEach(card => {
        const matches = category === 'all' || card.getAttribute('data-category') === category;
        if (matches) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'all 0.4s cubic-bezier(0.16,1,0.3,1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 400);
        }
      });
    });
  });

  // ============================================
  // Custom Order Form (Web3Forms)
  // ============================================
  const customOrderForm = document.getElementById('customOrderForm');
  const formStatus = document.getElementById('formStatus');

  if (customOrderForm) {
    customOrderForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = document.getElementById('orderSubmitBtn');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Transmitting...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      const formData = new FormData(customOrderForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (data.success) {
          submitBtn.textContent = 'Brief Received ✓';
          submitBtn.style.background = '#34D399';
          submitBtn.style.color = '#03161B';
          submitBtn.style.borderColor = '#34D399';

          if (formStatus) {
            formStatus.textContent = 'Brief transmitted. Our engineering team will respond within 24 hours.';
            formStatus.style.display = 'block';
            formStatus.style.color = '#34D399';
            formStatus.style.marginTop = '20px';
            formStatus.style.textAlign = 'center';
            formStatus.style.fontFamily = 'JetBrains Mono, monospace';
            formStatus.style.fontSize = '0.85rem';
            formStatus.style.letterSpacing = '0.1em';
          }

          customOrderForm.reset();

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.background = '';
            submitBtn.style.color = '';
            submitBtn.style.borderColor = '';
            if (formStatus) formStatus.style.display = 'none';
          }, 5000);
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (error) {
        console.error('Form Submission Error:', error);
        submitBtn.textContent = 'Transmission Failed ✕';
        submitBtn.style.background = '#F87171';
        submitBtn.style.borderColor = '#F87171';

        if (formStatus) {
          formStatus.textContent = 'Transmission failed. Please retry, or email verniquavs@gmail.com directly.';
          formStatus.style.display = 'block';
          formStatus.style.color = '#F87171';
          formStatus.style.marginTop = '20px';
          formStatus.style.textAlign = 'center';
        }

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.style.borderColor = '';
        }, 4000);
      }
    });
  }

  // ============================================
  // Domain card spotlight on hover
  // ============================================
  const domainCards = document.querySelectorAll('.domain-card');
  domainCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(34, 211, 238, 0.07), var(--bg-card-hover))`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });

  // ============================================
  // Cursor glow (desktop only)
  // ============================================
  if (window.innerWidth > 992
      && !window.matchMedia('(pointer: coarse)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
      position: fixed;
      width: 360px;
      height: 360px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(34, 211, 238, 0.035) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      mix-blend-mode: screen;
      will-change: left, top;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursorGlow.style.opacity = '1'; });
  }
});
