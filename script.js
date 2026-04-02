/* ============================================
   VERNIQ UAVs — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // Cinematic Logo Intro
  // ============================================
  const videoIntro = document.getElementById('videoIntro');
  const introSkip = document.getElementById('introSkip');

  // --- Particle Grid ---
  const canvas = document.getElementById('introParticles');
  let animFrameId;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.strokeStyle = 'rgba(10,132,255,0.08)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      animFrameId = requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // --- Orchestrated Intro Sequence ---
  function runIntroSequence() {
    const path1 = document.getElementById('logoPath1');
    const path2 = document.getElementById('logoPath2');
    const glowRing = document.querySelector('.intro-glow-ring');
    const companyName = document.getElementById('introCompanyName');
    const tagline = document.getElementById('introTagline');
    const accentLine = document.getElementById('introAccentLine');

    // Step 1: Draw SVG paths (0ms)
    setTimeout(() => {
      if (path1) path1.classList.add('drawn');
    }, 300);
    setTimeout(() => {
      if (path2) path2.classList.add('drawn');
    }, 600);

    // Step 2: Fill the logo + glow ring (1.8s)
    setTimeout(() => {
      if (path1) path1.classList.add('filled');
      if (path2) path2.classList.add('filled');
      if (glowRing) glowRing.classList.add('active');
    }, 2000);

    // Step 3: Typewriter company name (2.5s)
    setTimeout(() => {
      if (companyName) {
        const text = 'VERNIQ UAVS';
        const wrap = companyName.querySelector('.intro-char-wrap');
        if (wrap) {
          text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'intro-char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${i * 0.06}s`;
            wrap.appendChild(span);
          });
        }
      }
    }, 2500);

    // Step 4: Tagline + accent line (3.4s)
    setTimeout(() => {
      if (tagline) tagline.classList.add('visible');
      if (accentLine) accentLine.classList.add('visible');
    }, 3400);
  }

  function dismissIntro() {
    if (videoIntro) {
      videoIntro.classList.add('hidden');
      document.body.style.overflow = '';
      if (animFrameId) cancelAnimationFrame(animFrameId);
      setTimeout(() => {
        videoIntro.style.display = 'none';
      }, 1000);
    }
  }

  if (videoIntro) {
    document.body.style.overflow = 'hidden';
    runIntroSequence();

    // Auto-dismiss after 6 seconds
    setTimeout(dismissIntro, 6000);

    // Click anywhere to dismiss
    videoIntro.addEventListener('click', dismissIntro);

    if (introSkip) {
      introSkip.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissIntro();
      });
    }
  }

  // ============================================
  // Navigation — Scroll Effect
  // ============================================
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // ============================================
  // Mobile Menu Toggle
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ============================================
  // Scroll Reveal Animations
  // ============================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keep it visible
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // Counter Animation
  // ============================================
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease out quad
          const easeOut = 1 - (1 - progress) * (1 - progress);
          const current = Math.floor(easeOut * target);

          counter.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => counterObserver.observe(counter));

  // ============================================
  // Active Nav Link Highlight
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  // Set active based on the current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinksAll.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // Parallax Effect on Hero
  // ============================================
  const heroBg = document.querySelector('.hero-bg img');

  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
      }
    });
  }

  // ============================================
  // Product Card Hover — Tilt Effect
  // ============================================
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ============================================
  // Products Page: Filter Logic
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterableCards = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active filter
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      filterableCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  // ============================================
  // Custom Order Form Handling (Web3Forms)
  // ============================================
  const customOrderForm = document.getElementById('customOrderForm');
  const formStatus = document.getElementById('formStatus');

  if (customOrderForm) {
    customOrderForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = document.getElementById('orderSubmitBtn');
      const originalText = submitBtn.textContent;

      // Loading State
      submitBtn.textContent = 'Sending Inquiry...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Prepare Form Data for Web3Forms
      // The access key is managed in the HTML form directly
      const formData = new FormData(customOrderForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          // Success Feedback
          submitBtn.textContent = 'Inquiry Sent ✓';
          submitBtn.style.background = '#c8a84e';
          submitBtn.style.color = '#000';
          submitBtn.style.borderColor = '#c8a84e';

          if (formStatus) {
            formStatus.textContent = "Thank you! Your custom UAV inquiry has been received. Our team will contact you within 24 hours.";
            formStatus.style.display = 'block';
            formStatus.style.color = '#4CAF50';
            formStatus.style.marginTop = '15px';
            formStatus.style.textAlign = 'center';
          }

          customOrderForm.reset();

          // Reset button after 5 seconds
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
        // Error Feedback
        console.error("Form Submission Error:", error);
        submitBtn.textContent = 'Submission Failed ✕';
        submitBtn.style.background = '#ff4444';
        submitBtn.style.borderColor = '#ff4444';

        if (formStatus) {
          formStatus.textContent = "Oops! Something went wrong. Please try again or email us directly at verniquavs@gmail.com.";
          formStatus.style.display = 'block';
          formStatus.style.color = '#ff4444';
          formStatus.style.marginTop = '15px';
          formStatus.style.textAlign = 'center';
        }

        // Reset button to try again
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
  // Domain Card — Subtle glow on hover
  // ============================================
  const domainCards = document.querySelectorAll('.domain-card');

  domainCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.04), var(--bg-card))`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = 'var(--bg-card)';
    });
  });

  // ============================================
  // Cursor Glow (Desktop only)
  // ============================================
  if (window.innerWidth > 768) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: left 0.1s, top 0.1s;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }
});
