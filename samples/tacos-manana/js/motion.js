// Tacos Mañana motion (GSAP + ScrollTrigger from ../../js/motion-core.js). Loud and quick,
// like the market poster it is drawn from: words, tiles, stickers and photos pop in with an
// elastic overshoot and land at their usual tilt. Buttons keep their own quick CSS bumps.
// Nothing runs under prefers-reduced-motion.
(function () {
  'use strict';

  var M = window.GMMotion;
  if (!M || !M.ready) return;
  var gsap = window.gsap;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var CLEAR = 'transform,opacity';
  var POP = 'elastic.out(1, 0.55)';
  var tilt = function () { return gsap.utils.random(-14, 14); };

  // Hero: each word of the headline pops up like a sticker slapped on a poster
  var h1 = $('.hero h1');
  if (h1) {
    var words = M.split(h1, 'words');
    gsap.timeline({ delay: 0.1 })
      .from(words, { opacity: 0, scale: 0.3, yPercent: 60, rotation: tilt, duration: 1.2, stagger: 0.07, ease: POP, clearProps: CLEAR })
      .from('.hero-text, .hero .actions, .hero .status', { opacity: 0, y: 18, duration: 0.6, stagger: 0.08, ease: 'back.out(2)', clearProps: CLEAR }, 0.45)
      .from('.hero-pic', { opacity: 0, scale: 0.7, rotation: -10, duration: 1.3, ease: POP, clearProps: CLEAR }, 0.25);
    // the hand-drawn arrow is drawn in after the photo lands
    var arrow = $('.scribble .arrow path');
    if (arrow && arrow.getTotalLength) {
      var len = arrow.getTotalLength();
      // the gap is longer than the path and the offset starts past it, so no round cap shows early
      gsap.fromTo(arrow, { strokeDasharray: len + ' ' + (len + 20), strokeDashoffset: len + 6 }, { strokeDashoffset: 0, duration: 0.8, delay: 1.1, ease: 'power2.inOut', clearProps: 'strokeDasharray,strokeDashoffset' });
    }
  }

  // Taco tiles: popped onto the board one by one, stamps slapped on after, chiles light up
  var tiles = $('.tiles');
  if (tiles) {
    gsap.timeline({ scrollTrigger: { trigger: tiles, start: 'top 82%', once: true } })
      .from($$('.tile', tiles), { opacity: 0, scale: 0.6, y: 50, rotation: tilt, duration: 1.1, stagger: 0.09, ease: POP, clearProps: CLEAR })
      .from($$('.stamp', tiles), { opacity: 0, scale: 0, rotation: -60, duration: 0.9, stagger: 0.09, ease: 'elastic.out(1.1, 0.5)', clearProps: CLEAR }, 0.35)
      .from($$('.heat svg:not(.off)', tiles), { scale: 0, duration: 0.5, stagger: 0.03, ease: 'back.out(3)', clearProps: 'transform' }, 0.6);
  }

  // Salsa bar: the list deals out from the left, the round photo spins in, the starburst bounces
  var salsas = $('.salsas');
  if (salsas) {
    gsap.timeline({ scrollTrigger: { trigger: salsas, start: 'top 75%', once: true }, defaults: { clearProps: CLEAR } })
      .from($$('.salsa-list li', salsas), { opacity: 0, x: -40, duration: 0.7, stagger: 0.08, ease: 'back.out(2.2)' })
      .from($('.salsa-pic img', salsas), { opacity: 0, scale: 0.6, rotation: -40, duration: 1.3, ease: POP }, 0.1)
      .from($$('.burst, .burst-text', salsas), { scale: 0, rotation: 90, duration: 1, ease: 'elastic.out(1.2, 0.45)' }, 0.5);
  }

  // Order ticket: dropped onto the counter with a little wobble
  var ticket = $('.builder');
  if (ticket) {
    M.reveal(ticket, { opacity: 0, y: -40, rotation: 5, duration: 1.1, ease: POP }, ticket, 'top 80%');
    M.reveal('.squiggle', { scaleX: 0, transformOrigin: '0% 50%', duration: 0.8, ease: 'back.out(2)' }, '.squiggle', 'top 90%');
  }

  // Photo strip: polaroids tossed onto the table
  var strip = $$('.strip figure');
  if (strip.length) {
    M.reveal(strip, { opacity: 0, y: 70, scale: 0.8, rotation: tilt, duration: 1.1, stagger: 0.1, ease: POP }, '.strip', 'top 85%');
  }

  // Hours: day rows flip up in order, map burst bounces on its pin
  M.reveal('.week tr', { opacity: 0, y: 14, duration: 0.5, stagger: 0.05, ease: 'back.out(2)' }, '.week');
  M.reveal('.map', { opacity: 0, scale: 0.92, rotation: -2, duration: 1, ease: POP }, '.map', 'top 85%');
  M.reveal('.contact .wrap > *', { opacity: 0, y: 24, duration: 0.8, stagger: 0.08, ease: 'back.out(1.8)' }, '.contact', 'top 80%');
})();
