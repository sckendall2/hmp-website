/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   The Heather Mumford Project — script.js
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

'use strict';

// ── Nav: switch to dark background once user scrolls past hero ──
const nav  = document.getElementById('main-nav');
const hero = document.getElementById('home');

const navObserver = new IntersectionObserver(
  ([entry]) => nav.classList.toggle('scrolled', !entry.isIntersecting),
  { threshold: 0.15 }
);
navObserver.observe(hero);

// ── Mobile nav toggle ──────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close drawer on any link click or Escape
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', closeNav)
);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) closeNav();
});

function closeNav() {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// ── Gallery lightbox ───────────────────────────────────────────
const galleryImgs = Array.from(document.querySelectorAll('.gallery img'));
const lightbox    = document.getElementById('lightbox');
const lbImg       = lightbox.querySelector('.lightbox-img');
let   currentIdx  = 0;

function openLightbox(index) {
  currentIdx = index;
  lbImg.src = galleryImgs[index].src;
  lbImg.alt = galleryImgs[index].alt;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  galleryImgs[currentIdx].focus();
}

function showAdjacent(delta) {
  currentIdx = (currentIdx + delta + galleryImgs.length) % galleryImgs.length;
  lbImg.src = galleryImgs[currentIdx].src;
  lbImg.alt = galleryImgs[currentIdx].alt;
}

galleryImgs.forEach((img, i) => {
  img.addEventListener('click', () => openLightbox(i));
  img.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
  });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showAdjacent(+1));
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showAdjacent(-1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') showAdjacent(+1);
  if (e.key === 'ArrowLeft')  showAdjacent(-1);
});

// ── Mailing list submission ────────────────────────────────────
async function submitToMailingList(email) {
  const res = await fetch('https://app.kit.com/forms/9569058/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_address: email })
  });
  return { success: res.ok, message: res.ok ? '' : 'Something went wrong. Please try again.' };
}

const signupForm    = document.getElementById('signup-form');
const signupSuccess = document.getElementById('signup-success');
const signupError   = document.getElementById('signup-error');
const signupInput   = document.getElementById('email-input');
const signupAgain   = document.getElementById('signup-again');

signupForm.addEventListener('submit', async e => {
  e.preventDefault();

  const email = signupInput.value.trim();
  const btn   = signupForm.querySelector('button[type="submit"]');

  btn.disabled    = true;
  btn.textContent = 'Signing up…';
  signupError.hidden = true;

  try {
    const result = await submitToMailingList(email);
    if (result.success) {
      signupForm.hidden    = true;
      signupSuccess.hidden = false;
    } else {
      throw new Error(result.message || 'Something went wrong. Please try again.');
    }
  } catch (err) {
    signupError.textContent = err.message;
    signupError.hidden      = false;
    btn.disabled    = false;
    btn.textContent = 'Sign Up';
  }
});

// "Add another email" — reset the form so a second person can sign up
signupAgain.addEventListener('click', () => {
  const btn = signupForm.querySelector('button[type="submit"]');
  signupForm.reset();
  signupSuccess.hidden = true;
  signupForm.hidden    = false;
  btn.disabled    = false;
  btn.textContent = 'Sign Up';
  signupInput.focus();
});
