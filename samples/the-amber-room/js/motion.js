// The Amber Room motion (GSAP + ScrollTrigger from ../../js/motion-core.js). Slow and low-lit:
// the name gathers on the centre line as the lights come up (the CSS veil), the lamp behind
// the glass warms, and the photos brighten and drift slowly as they reach the middle of the
// screen. Nothing runs under prefers-reduced-motion.
(function () {
  'use strict';

  var M = window.GMMotion;
  if (!M || !M.ready) return;
  var gsap = window.gsap;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // Wordmark: the letters slide in from both sides and meet on the centre axis, timed with the
  // veil fading (1.4 s, see --lights-up in the CSS).
  var parts = [$('.wordmark-the'), $('.wordmark-name')].filter(Boolean);
  parts.forEach(function (el) {
    var chars = M.split(el, 'chars');
    var mid = (chars.length - 1) / 2;
    gsap.from(chars, {
      opacity: 0,
      x: function (i) { return (i - mid) * 18; },
      duration: 1.8, delay: 0.35, ease: 'expo.out', clearProps: 'transform,opacity'
    });
  });
  gsap.from($$('.hero-lede, .hero-side'), { opacity: 0, y: 14, duration: 1.2, delay: 1, stagger: 0.15, ease: 'power3.out', clearProps: 'transform,opacity' });

  // The lamp behind the arch warms up after the veil, then dims as the hero scrolls away
  var arch = $('.arch');
  if (arch) {
    gsap.fromTo(arch, { '--glow': 0 }, { '--glow': 1, duration: 2.6, delay: 0.6, ease: 'power2.inOut' });
    gsap.to(arch, {
      '--glow': 0.25, ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: '.hero', start: 'center top', end: 'bottom top', scrub: true }
    });
  }

  // Full-width band: slow parallax inside its frame, and the bar "lights up" from dim to full
  // as it rises to the middle of the screen
  var band = $('.band-pic img');
  if (band) {
    M.drift(band, 7, '.band');
    gsap.fromTo(band, { filter: 'brightness(0.45)' }, {
      filter: 'brightness(1)', ease: 'none',
      scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'center 55%', scrub: true }
    });
  }

  // Two photos in mirrored frames drift in opposite directions, and brighten the same way
  gsap.matchMedia().add('(min-width: 768px)', function () {
    gsap.fromTo('.pair-a', { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.pair', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.pair-b', { y: -30 }, { y: 30, ease: 'none', scrollTrigger: { trigger: '.pair', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('.pair img').forEach(function (img) {
    gsap.fromTo(img, { filter: 'brightness(0.4)' }, {
      filter: 'brightness(1)', ease: 'none',
      scrollTrigger: { trigger: img, start: 'top bottom', end: 'center 60%', scrub: true }
    });
  });

  // Fan ornaments open upwards from their base line, like a Deco sunburst
  $$('.ornament').forEach(function (fan) {
    M.reveal(fan, { scaleY: 0, opacity: 0, transformOrigin: '50% 100%', duration: 1.2, ease: 'expo.out' }, fan, 'top 88%');
  });

  // Framed panels come up out of the dark, then their contents follow
  $$('.frame').forEach(function (frame) {
    gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 80%', once: true }, defaults: { clearProps: 'transform,opacity,filter' } })
      .fromTo(frame, { opacity: 0, filter: 'brightness(0.3)' }, { opacity: 1, filter: 'brightness(1)', duration: 1.4, ease: 'power2.out' })
      .from($$(':scope > h2, :scope > .intro, :scope > .tabs', frame), { opacity: 0, y: 12, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 0.3);
  });

  // Hours, map and the call panel: rows and blocks fade up slowly, one after another
  M.reveal('.week tr', { opacity: 0, y: 10, duration: 0.7, stagger: 0.07, ease: 'power2.out' }, '.week');
  $$('.find .map, .contact').forEach(function (el) {
    M.reveal(el, { opacity: 0, y: 20, duration: 1.2, ease: 'power2.out' });
  });
})();
