// Scroll and entrance motion for pay.html (GSAP + ScrollTrigger, set up in js/motion-core.js).
// Nothing runs under prefers-reduced-motion.
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

  function seq(trigger, start) {
    return gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.8, clearProps: 'transform,opacity,filter,clipPath' },
      scrollTrigger: { trigger: trigger, start: start || 'top 80%', once: true }
    });
  }

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

  // images and fonts can change heights after load; re-measure the trigger points once
  window.addEventListener('load', function () { ST.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
})();
