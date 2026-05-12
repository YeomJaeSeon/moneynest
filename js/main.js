/* MoneyNest - main.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Menu ─────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  /* ── Active Nav Link ─────────────────────── */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop() || '';
    if (href === path) link.classList.add('active');
  });

  /* ── Newsletter Form ─────────────────────── */
  const form = document.querySelector('.newsletter-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const input = form.querySelector('input');
      if (input.value.trim()) {
        btn.textContent = '구독 완료!';
        btn.disabled = true;
        input.value = '';
        setTimeout(() => { btn.textContent = '무료 구독'; btn.disabled = false; }, 3000);
      }
    });
  }

  /* ── Contact Form ────────────────────────── */
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');
      btn.textContent = '전송 완료! 빠르게 답변 드리겠습니다.';
      btn.disabled = true;
      contactForm.reset();
    });
  }

  /* ── Smooth Anchor Scroll ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Header shadow on scroll ─────────────── */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(0,0,0,.12)'
        : '0 1px 4px rgba(0,0,0,.06)';
    }, { passive: true });
  }

});
