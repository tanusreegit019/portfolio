// script.js
// Handles section reveal, nav overlay transition, mobile nav, modal, skill bars

document.addEventListener('DOMContentLoaded', () => {
  // set year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // IntersectionObserver for revealing sections
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const inner = entry.target.querySelector('.section-inner') || entry.target;
      if (entry.isIntersecting) inner.classList.add('in-view');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section').forEach(sec => observer.observe(sec));

  // Animate skill bars when skills section visible
  const skillsSection = document.querySelector('#skills');
  const skillObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.skill-fill').forEach(el => {
          const pct = el.dataset.percent || 60;
          el.style.width = pct + '%';
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  if (skillsSection) skillObserver.observe(skillsSection);

  // Navigation overlay transition
  const overlay = document.getElementById('page-overlay');
  document.querySelectorAll('.nav-link, .outline-btn, .hero-cta a, .main-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      // only for in-page anchor links
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      // show overlay
      overlay.classList.add('active');

      // after small delay, scroll to target smoothly
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 220);

      // hide overlay after animation
      setTimeout(() => overlay.classList.remove('active'), 1100);
      // if mobile nav is open, close it
      if (navOpen) toggleNav();
    });
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  let navOpen = false;
  navToggle.addEventListener('click', () => toggleNav());
  function toggleNav() {
    navOpen = !navOpen;
    if (navOpen) mainNav.style.display = 'flex';
    else mainNav.style.display = '';
  }

  // Project modal
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTech = document.getElementById('modalTech');
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.title || 'Project';
      const desc = btn.dataset.desc || '';
      const tech = btn.dataset.tech || '';
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalTech.textContent = tech;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    });
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  // Contact form (local demo: show a success toast)
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      sendBtn.textContent = 'Sent ✓';
      sendBtn.disabled = true;
      setTimeout(() => {
        sendBtn.textContent = 'Send Message';
        sendBtn.disabled = false;
        document.getElementById('contactForm').reset();
        // Small visual confirmation (overlay flash)
        overlay.classList.add('active');
        setTimeout(() => overlay.classList.remove('active'), 800);
      }, 1100);
    });
  }

  // Highlight current nav item while scrolling
  const sections = document.querySelectorAll('main .section');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => sectionObserver.observe(s));
});
