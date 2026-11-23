// Scroll and entrance motion for index.html and pay.html (GSAP + ScrollTrigger, set up in
// js/motion-core.js). Each section gets its own move instead of one fade everywhere.
// Nothing runs under prefers-reduced-motion; js/main.js then shows the hero with a short fade.
//
// Timing: entrances run 0.6 to 1.2 s with expo/power ease-out. That is longer than the
// 100 to 300 ms used for buttons and links, on purpose: these are one-time scroll reveals,
// never repeated and never in the way of a click.
(function () {
  'use strict';

  var M = window.GMMotion;
  if (!M || !M.ready) return;
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function seq(trigger, start) {
    return gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.8, clearProps: 'transform,opacity,filter,clipPath' },
      scrollTrigger: { trigger: trigger, start: start || 'top 80%', once: true }
    });
  }

  // ---------- index.html: hero ----------
  var stage = $('.stage');
  if (stage) {
    var h1 = $('h1', stage);
    var device = $('.device', stage);
    var seal = $('.seal', stage);
    // BlurText: words come into focus one after another.
    // Adapted from "BlurText" in React Bits by David Haz (https://github.com/DavidHDev/react-bits),
    // MIT + Commons Clause licence. Ported to vanilla JS on GSAP; see CREDITS.md.
    var words = M.split(h1, 'words');
    gsap.set(words, { opacity: 0, yPercent: 45, filter: 'blur(10px)' });
    stage.classList.add('is-in', 'is-gsap'); // CSS hero hide lifted; GSAP holds the start state

    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from($('.stage-photo img', stage), { scale: 1.1, duration: 2.4, ease: 'power2.out', clearProps: 'transform' }, 0)
      .to(words, { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 1, stagger: 0.06, clearProps: 'all' }, 0.1)
      .from($('.lede', stage), { opacity: 0, y: 18, duration: 0.9, clearProps: 'transform,opacity' }, 0.5)
      .from($$('.actions .btn', stage), { opacity: 0, y: 14, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.65)
      .from(device, { opacity: 0, y: 80, duration: 1.3 }, 0.3)
      .from(seal, { opacity: 0, scale: 1.5, rotation: -70, duration: 0.8, ease: 'back.out(1.6)' }, 1.05);

    // While the hero scrolls away the phone rises a little faster than the page and the badge
    // keeps turning, so the scene has depth. The phone keeps browsing its sample site (CSS).
    gsap.to(device, {
      yPercent: -9, ease: 'none',
      scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom top', scrub: true }
    });
    tl.eventCallback('onComplete', function () {
      gsap.fromTo(seal, { rotation: -10 }, {
        rotation: 35, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom top', scrub: 0.6 }
      });
    });
  }

  // ---------- index.html: sections ----------
  var inc = $('#includes');
  if (inc) {
    // the six things unfold top-down like tickets, then their icons settle
    seq(inc)
      .from($$('h2, .intro', inc), { opacity: 0, y: 20, stagger: 0.08 })
      .fromTo($$('.includes li', inc), { clipPath: 'inset(0% 0% 100% 0% round 16px)' }, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 0.7, stagger: 0.07, ease: 'power2.inOut' }, 0.2)
      .from($$('.includes svg', inc), { scale: 0.4, rotation: -25, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'back.out(2)' }, 0.45);
  }

  var prices = $('#prices');
  if (prices && $('.offers', prices)) {
    seq(prices).from($$('h2, .intro', prices), { opacity: 0, y: 20, stagger: 0.08 });
    // each offer: the photo is uncovered from the top, the dotted leader runs to the price
    $$('.offer', prices).forEach(function (offer) {
      seq(offer, 'top 82%')
        .fromTo($('.pic', offer), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut' })
        .from($('.pic img', offer), { scale: 1.18, duration: 1.4, ease: 'power2.out' }, 0)
        .from($('.leader', offer), { scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: 'power2.inOut', clearProps: 'transform' }, 0.45)
        .from($('.price', offer), { opacity: 0, x: -10, duration: 0.5 }, 0.95);
    });
    seq($('.extras', prices), 'top 85%')
      .from($$('.extra', prices), { opacity: 0, y: 28, stagger: 0.12 })
      .from($$('.extra .leader', prices), { scaleX: 0, transformOrigin: 'left center', duration: 0.6, clearProps: 'transform' }, 0.25);
  }

  var samples = $('#samples');
  if (samples) {
    seq(samples).from($$('h2, .intro', samples), { opacity: 0, y: 20, stagger: 0.08 });
    // each card enters the way its sample site moves: Lumen slides out like a page,
    // The Amber Room comes up out of the dark, Tacos Mañana pops
    var cards = seq($('.samples', samples), 'top 82%');
    cards.fromTo('.s-cafe', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut' }, 0)
      .fromTo('.s-bar', { opacity: 0, filter: 'brightness(0.2)' }, { opacity: 1, filter: 'brightness(1)', duration: 1.4, ease: 'power2.out' }, 0.15)
      .from('.s-taco', { opacity: 0, scale: 0.86, rotation: -3, duration: 0.9, ease: 'back.out(2.2)' }, 0.3);

    // SpotlightCard: a soft light follows the pointer over each card.
    // Adapted from "SpotlightCard" in React Bits by David Haz (https://github.com/DavidHDev/react-bits),
    // MIT + Commons Clause licence. Ported to vanilla JS and CSS custom properties; see CREDITS.md.
    if (finePointer) {
      $$('.sample', samples).forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          card.style.setProperty('--my', (e.clientY - r.top) + 'px');
          card.classList.add('is-lit');
        });
        card.addEventListener('pointerleave', function () { card.classList.remove('is-lit'); });
      });
    }
  }

  var video = $('#video');
  if (video) {
    // the reel phone swings in from the side while the facts line up
    seq(video, 'top 75%')
      .from($$('h2, .intro', video), { opacity: 0, y: 20, stagger: 0.08 })
      .from($$('.facts-list li', video), { opacity: 0, x: -24, stagger: 0.09, duration: 0.6 }, 0.25)
      .from($('.reel-device', video), { opacity: 0, x: 70, rotation: 7, duration: 1.2, ease: 'expo.out' }, 0.1)
      .from($$('.reel .price, .reel .actions', video), { opacity: 0, y: 14, stagger: 0.08, duration: 0.6 }, 0.6);
  }

  var process = $('#process');
  if (process) {
    // a real sequence, so the four steps are dealt out in order, left to right
    seq(process)
      .from($$('h2, .intro', process), { opacity: 0, y: 20, stagger: 0.08 })
      .from($$('.steps li', process), { opacity: 0, x: -36, rotation: -2, duration: 0.7, stagger: 0.16, ease: 'power2.out' }, 0.2);
  }

  var payment = $('#payment');
  if (payment) {
    // bank transfer first, then crypto: the order of preference reads in the motion too
    seq(payment)
      .from($('h2', payment), { opacity: 0, y: 20 })
      .from($$('.method', payment), { opacity: 0, y: 34, stagger: 0.18, duration: 0.8 }, 0.1)
      .from($$('.coins li', payment), { opacity: 0, scale: 0.9, stagger: 0.06, duration: 0.5 }, 0.5)
      .from($('.pay-text', payment), { opacity: 0, duration: 0.9, ease: 'power1.out' }, 0.4);
  }

  var who = $('#who');
  if (who) {
    // the plainest section gets the plainest move: opacity only
    seq(who).from($$('h2, p', who), { opacity: 0, duration: 1, stagger: 0.12, ease: 'power1.out' });
  }

  var closer = $('#contact.closer');
  if (closer) {
    M.drift($('picture img', closer), 8, closer);
    var cWords = M.split($('h2', closer), 'words');
    seq(closer, 'top 70%')
      .fromTo(cWords, { opacity: 0, yPercent: 45, filter: 'blur(8px)' }, { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.06, ease: 'expo.out', clearProps: 'all' })
      .from($$('p, .mail', closer), { opacity: 0, y: 16, stagger: 0.1, duration: 0.7 }, 0.4);
  }

  // ---------- pay.html ----------
  var bank = $('#bank');
  if (bank) {
    // the facts table fills in row by row next to the headline
    gsap.from($$('.hero h1, .hero .lede, .hero .actions, .coin-row li'), {
      opacity: 0, y: 16, duration: 0.8, stagger: 0.07, ease: 'expo.out', clearProps: 'transform,opacity'
    });
    gsap.from($$('.facts dt, .facts dd'), {
      opacity: 0, x: 12, duration: 0.6, stagger: 0.04, delay: 0.25, ease: 'power3.out', clearProps: 'transform,opacity'
    });
    seq(bank)
      .from($$('h2, .intro', bank), { opacity: 0, y: 20, stagger: 0.08 })
      .from($('.bank-card', bank), { opacity: 0, y: 30, duration: 0.9 }, 0.15)
      .from($('.bank-icon', bank), { scale: 0.5, rotation: -20, duration: 0.7, ease: 'back.out(2)' }, 0.4)
      .from($$('.bank-card .checks li', bank), { opacity: 0, x: -14, stagger: 0.08, duration: 0.5 }, 0.5)
      .from($('.warn', bank), { opacity: 0, x: -20, duration: 0.7 }, 0.7);

    var addr = $('#address');
    seq(addr).from($$('h2, .intro', addr), { opacity: 0, y: 20, stagger: 0.08 });
    $$('.wallet', addr).forEach(function (w) {
      seq(w, 'top 84%')
        .from(w, { opacity: 0, y: 30, duration: 0.8 })
        .fromTo($$('.addr', w), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut' }, 0.2)
        .from($$('.qr .tile', w), { opacity: 0, scale: 0.92, duration: 0.7 }, 0.3);
    });

    $$('.route').forEach(function (route) {
      seq(route, 'top 84%')
        .from(route, { opacity: 0, y: 26, duration: 0.7 })
        .from($$('.flow li', route), { opacity: 0, y: 12, stagger: 0.08, duration: 0.5 }, 0.2);
    });
    $$('#invoice-qr, #prices, #refunds').forEach(function (s) {
      seq(s).from($$('h2, .intro, .link, .table tr, .table-cap, .note', s), { opacity: 0, y: 12, stagger: 0.04, duration: 0.55 });
    });
    var after = $('#after');
    if (after) {
      seq(after)
        .from($$('h2, .intro', after), { opacity: 0, y: 20, stagger: 0.08 })
        .from($$('.steps li', after), { opacity: 0, x: -36, rotation: -2, duration: 0.7, stagger: 0.16, ease: 'power2.out' }, 0.2);
    }
  }

  // ---------- Magnet ----------
  // Buttons marked data-magnet lean towards a nearby pointer and settle back when it leaves.
  // Adapted from "Magnet" in React Bits by David Haz (https://github.com/DavidHDev/react-bits),
  // MIT + Commons Clause licence: same reach test (distance outside the box, smoothstep
  // falloff, pull divided by a strength), with a GSAP quickTo in place of the spring.
  // Mouse and trackpad only; touch screens never see it.
  var magnets = finePointer ? $$('[data-magnet]') : [];
  if (magnets.length) {
    var PADDING = 70;
    var STRENGTH = 5;
    var smoothstep = function (a, b, v) { var t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
    var items = magnets.map(function (el) {
      return { el: el, x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }) };
    });
    var pointer = null;
    var queued = false;
    var update = function () {
      queued = false;
      items.forEach(function (m) {
        var tx = 0;
        var ty = 0;
        if (pointer) {
          var r = m.el.getBoundingClientRect();
          var dx = pointer.x - (r.left + r.width / 2);
          var dy = pointer.y - (r.top + r.height / 2);
          var outside = Math.hypot(Math.max(0, Math.abs(dx) - r.width / 2), Math.max(0, Math.abs(dy) - r.height / 2));
          if (outside <= PADDING) {
            var pull = 1 - smoothstep(PADDING * 0.5, PADDING, outside);
            tx = dx / STRENGTH * pull;
            ty = dy / STRENGTH * pull;
          }
        }
        m.x(tx);
        m.y(ty);
      });
    };
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      pointer = { x: e.clientX, y: e.clientY };
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { pointer = null; update(); });
  }

  // images and fonts can change heights after load; re-measure the trigger points once
  window.addEventListener('load', function () { ST.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
})();
