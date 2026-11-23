// Shared motion setup for the site and the three sample sites.
// Load after js/vendor/gsap.min.js, js/vendor/ScrollTrigger.min.js and js/vendor/lenis.min.js
// (all with defer, so they run in order). Exposes window.GMMotion for the page scripts.
//
// With prefers-reduced-motion: reduce, or if a vendor file is missing, nothing here runs:
// no smooth scrolling, no tweens, and every element stays where the CSS puts it.
(function () {
  'use strict';

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  var api = { reduce: !!(mq && mq.matches), ready: false, lenis: null };
  window.GMMotion = api;
  if (api.reduce || !gsap || !ST) return;

  gsap.registerPlugin(ST);
  // page scripts list optional parts (only one wallet has a QR code, not every section has an
  // intro); a selector with no match is expected, so GSAP need not warn about it
  gsap.config({ nullTargetWarn: false });
  api.ready = true;
  document.documentElement.classList.add('has-motion');

  // Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger reads the same position.
  // anchors: true makes in-page links glide too; Lenis honours each target's scroll-margin-top.
  if (window.Lenis) {
    var lenis = new window.Lenis({ anchors: true, autoRaf: false, lerp: 0.11 });
    lenis.on('scroll', ST.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    api.lenis = lenis;
    // a modal dialog (the sample sites' call panels) stops the page behind it from scrolling
    document.querySelectorAll('dialog').forEach(function (d) {
      new MutationObserver(function () {
        if (d.open) lenis.stop(); else lenis.start();
      }).observe(d, { attributes: true, attributeFilter: ['open'] });
    });
  }

  // Splits an element's text into word spans (or character spans inside word spans) for a
  // staggered entrance. Screen readers get one visually hidden copy of the text; the
  // animated copy is aria-hidden, so nobody hears a word spelled letter by letter.
  api.split = function (el, by) {
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    var copy = document.createElement('span');
    copy.className = 'visually-hidden';
    copy.textContent = text;
    var shown = document.createElement('span');
    shown.className = 'split';
    shown.setAttribute('aria-hidden', 'true');
    var pieces = [];
    text.split(' ').forEach(function (word, i, words) {
      var w = document.createElement('span');
      w.className = 'split-w';
      if (by === 'chars') {
        Array.from(word).forEach(function (ch) {
          var c = document.createElement('span');
          c.className = 'split-c';
          c.textContent = ch;
          w.appendChild(c);
          pieces.push(c);
        });
      } else {
        w.textContent = word;
        pieces.push(w);
      }
      shown.appendChild(w);
      if (i < words.length - 1) shown.appendChild(document.createTextNode(' '));
    });
    el.textContent = '';
    el.appendChild(copy);
    el.appendChild(shown);
    return pieces;
  };

  // Plays a tween once, the first time `trigger` scrolls into view. Inline styles are
  // cleared at the end so hover rules in the CSS work again.
  api.reveal = function (targets, vars, trigger, start) {
    var list = gsap.utils.toArray(targets);
    if (!list.length) return null;
    vars.clearProps = vars.clearProps || 'transform,opacity,filter,clipPath,visibility';
    vars.scrollTrigger = { trigger: trigger || list[0], start: start || 'top 86%', once: true };
    return gsap.from(list, vars);
  };

  // Images inside `.pic`-style frames drift a little slower than the page. The image is
  // scaled up by the same amount so its edges never show.
  api.drift = function (img, amount, trigger) {
    if (!img) return;
    gsap.fromTo(img, { yPercent: -amount, scale: 1 + amount / 50 }, {
      yPercent: amount, scale: 1 + amount / 50, ease: 'none',
      scrollTrigger: { trigger: trigger || img, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  };
})();
