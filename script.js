/**
 * Braces & Smile — Premium Dental Clinic
 * Main JavaScript (Vanilla ES6+)
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════
     1. PRELOADER
     ═══════════════════════════════════════════ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
      }
    }, 400);
  });

  /* ═══════════════════════════════════════════
     2. STICKY NAVBAR
     ═══════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ═══════════════════════════════════════════
     3. MOBILE MENU
     ═══════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  /* Close mobile menu on link click + smooth scroll */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      /* close mobile drawer */
      hamburger?.classList.remove('active');
      navMenu?.classList.remove('active');
      document.body.style.overflow = '';

      const id = link.getAttribute('href');
      if (id?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(id);
        if (target) {
          const offset = navbar ? navbar.offsetHeight : 0;
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
      }
    });
  });

  /* ═══════════════════════════════════════════
     4. ACTIVE NAV LINK ON SCROLL
     ═══════════════════════════════════════════ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const navObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -60% 0px' });

  sections.forEach(s => navObs.observe(s));

  /* ═══════════════════════════════════════════
     5. SCROLL REVEAL
     ═══════════════════════════════════════════ */
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ═══════════════════════════════════════════
     6. HERO STATS COUNTER
     ═══════════════════════════════════════════ */
  const counters = document.querySelectorAll('.stat-number');
  let countersDone = false;

  const animateCounter = el => {
    const target = +el.dataset.target;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const tick = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.ceil(current);
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    };
    tick();
  };

  const counterObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersDone) {
        countersDone = true;
        counters.forEach(c => animateCounter(c));
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => counterObs.observe(c));

  /* ═══════════════════════════════════════════
     7. TESTIMONIALS CAROUSEL
     ═══════════════════════════════════════════ */
  const track = document.getElementById('carousel-track');
  const dots  = document.querySelectorAll('#carousel-dots .dot');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  let current = 0;
  let autoSlide;

  const goTo = idx => {
    current = ((idx % cards.length) + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const next = () => goTo(current + 1);

  const startAuto = () => { autoSlide = setInterval(next, 5000); };
  const stopAuto  = () => clearInterval(autoSlide);

  if (track && cards.length) {
    dots.forEach(d => d.addEventListener('click', () => { stopAuto(); goTo(+d.dataset.index); startAuto(); }));
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);

    /* Touch/swipe */
    let sx = 0;
    track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; stopAuto(); }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (dx < -50) goTo(current + 1);
      if (dx >  50) goTo(current - 1);
      startAuto();
    }, { passive: true });

    startAuto();
  }

  /* ═══════════════════════════════════════════
     8. FAQ ACCORDION
     ═══════════════════════════════════════════ */
  const faqList = document.querySelector('.faq-list');
  if (faqList) {
    faqList.addEventListener('click', e => {
      const btn = e.target.closest('.faq-question');
      if (!btn) return;
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');

      const isOpen = item.classList.toggle('open');
      answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : null;
      btn.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ═══════════════════════════════════════════
     9. PHOTO GALLERY LIGHTBOX
     ═══════════════════════════════════════════ */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lightbox-img');
  const lbClose      = document.getElementById('lightbox-close');
  const lbPrev       = document.getElementById('lightbox-prev');
  const lbNext       = document.getElementById('lightbox-next');
  let lbIdx = 0;

  const images = Array.from(galleryItems).map(g => g.querySelector('img')?.src).filter(Boolean);

  const openLB = idx => {
    lbIdx = idx;
    lbImg.src = images[lbIdx];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeLB = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
  const navLB = dir => {
    lbIdx = (lbIdx + dir + images.length) % images.length;
    lbImg.style.opacity = '0';
    setTimeout(() => { lbImg.src = images[lbIdx]; lbImg.style.opacity = '1'; }, 200);
  };

  galleryItems.forEach(g => g.addEventListener('click', () => openLB(+g.dataset.index)));
  lbClose?.addEventListener('click', closeLB);
  lbPrev?.addEventListener('click', () => navLB(-1));
  lbNext?.addEventListener('click', () => navLB(1));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLB();
    if (e.key === 'ArrowLeft')  navLB(-1);
    if (e.key === 'ArrowRight') navLB(1);
  });

  /* ═══════════════════════════════════════════
     10. WHATSAPP BOOKING FORM
     ═══════════════════════════════════════════ */
  const form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name    = form.querySelector('#patient-name').value.trim();
      const phone   = form.querySelector('#patient-phone').value.trim();
      const email   = form.querySelector('#patient-email').value.trim() || 'Not provided';
      const service = form.querySelector('#patient-service').value || 'General Consultation';
      const message = form.querySelector('#patient-message').value.trim() || 'N/A';

      if (!name || !phone) {
        /* visual shake */
        form.style.animation = 'shake .4s';
        setTimeout(() => { form.style.animation = ''; }, 400);
        alert('Please enter your Name and Phone Number.');
        return;
      }

      const text = `New Appointment Request:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`;
      window.location.href = `https://wa.me/917567866302?text=${encodeURIComponent(text)}`;
    });
  }

  /* ═══════════════════════════════════════════
     11. BACK TO TOP
     ═══════════════════════════════════════════ */
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('active', window.scrollY > 500);
    }, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════
     12. AUDIO WAVEFORM SIMULATION
     ═══════════════════════════════════════════ */
  document.querySelectorAll('.audio-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const waveform = btn.closest('.testimonial-audio')?.querySelector('.audio-waveform');
      const playIcon  = btn.querySelector('.play-icon');
      const pauseIcon = btn.querySelector('.pause-icon');
      if (!waveform) return;

      const isPlaying = waveform.classList.toggle('playing');

      /* stop other waveforms */
      document.querySelectorAll('.audio-waveform.playing').forEach(w => {
        if (w !== waveform) {
          w.classList.remove('playing');
          const otherBtn = w.closest('.testimonial-audio')?.querySelector('.audio-play-btn');
          if (otherBtn) {
            otherBtn.querySelector('.play-icon').style.display = '';
            otherBtn.querySelector('.pause-icon').style.display = 'none';
          }
        }
      });

      if (playIcon && pauseIcon) {
        playIcon.style.display  = isPlaying ? 'none' : '';
        pauseIcon.style.display = isPlaying ? ''     : 'none';
      }
    });
  });

});
