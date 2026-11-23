// Café Lumen motion (GSAP + ScrollTrigger from ../../js/motion-core.js). Quiet, like the
// morning room: the name sets itself letter by letter, everything else drifts in slowly.
// Nothing runs under prefers-reduced-motion.
(function () {
  'use strict';

  var M = window.GMMotion;
  if (!M || !M.ready) return;
  var gsap = window.gsap;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var CLEAR = 'transform,opacity';

  // Masthead: the letters of "Lumen" rise out of a mask at the baseline, one after another,
  // while "Café" closes up from wide tracking.
  // Adapted from "SplitText" in React Bits by David Haz (https://github.com/DavidHDev/react-bits),
  // MIT + Commons Clause licence. Ported to vanilla JS on GSAP; see CREDITS.md at the site root.
  var word = $('.cover-word');
  if (word) {
    var chars = M.split(word, 'chars');
    word.classList.add('is-masked');
    gsap.timeline({ delay: 0.1, onComplete: function () { word.classList.remove('is-masked'); } })
      .from(chars, { yPercent: 108, duration: 1.3, stagger: 0.08, ease: 'expo.out', clearProps: 'transform' })
      .from('.cover-cafe', { opacity: 0, letterSpacing: '0.45em', duration: 1.4, ease: 'power3.out', clearProps: 'opacity,letterSpacing' }, 0.15)
      .from($$('.cover-intro > *'), { opacity: 0, y: 14, duration: 0.9, stagger: 0.09, ease: 'power3.out', clearProps: CLEAR }, 0.55);
  }

  // the second cover photo floats a little slower than the page on wide screens
  gsap.matchMedia().add('(min-width: 768px)', function () {
    gsap.to('.cover-small', {
      y: -50, ease: 'none',
      scrollTrigger: { trigger: '.cover', start: 'top top', end: 'bottom top', scrub: true }
    });
  });

  // Today's bakes: the board fills in row by row, like someone chalking it up
  var oven = $('.oven');
  if (oven) {
    gsap.timeline({ scrollTrigger: { trigger: oven, start: 'top 75%', once: true }, defaults: { ease: 'power3.out', clearProps: CLEAR } })
      .from($('.oven-photo', oven), { opacity: 0, x: -30, duration: 1.1 })
      .from($$('h2, .oven-copy > p', oven), { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, 0.2)
      .from($$('.oven-board li', oven), { opacity: 0, x: -14, duration: 0.6, stagger: 0.12 }, 0.45);
  }

  // Menu: each column settles in turn, its prices a beat after the names
  $$('.menu-group').forEach(function (group, i) {
    gsap.timeline({ scrollTrigger: { trigger: group, start: 'top 85%', once: true }, delay: i * 0.08, defaults: { ease: 'power2.out', clearProps: CLEAR } })
      .from($('h3', group), { opacity: 0, y: 12, duration: 0.7 })
      .from($$('.items li', group), { opacity: 0, y: 10, duration: 0.6, stagger: 0.06 }, 0.15);
  });

  // The room: the wide photo opens like a window as it crosses the screen (a clip, so the
  // full-bleed photo never pushes past the page edge)
  var room = $('.room img');
  if (room) {
    gsap.fromTo(room, { clipPath: 'inset(9% 7% 9% 7%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: '.room', start: 'top bottom', end: 'center center', scrub: true }
    });
  }

  // Box form, hours, map and contact: plain slow fades, nothing that gets in the way of typing
  $$('.box-copy, .box-form, .hours, .find, .contact-copy, .contact-photo').forEach(function (el) {
    M.reveal(el, { opacity: 0, y: 18, duration: 1, ease: 'power2.out' });
  });
})();
