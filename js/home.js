(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header = document.querySelector('.top');
  if (header) {
    var setHeader = function () { header.classList.toggle('is-solid', window.scrollY > 16); };
    window.addEventListener('scroll', setHeader, { passive: true });
    setHeader();
  }

  var menu = document.querySelector('.menu');
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) menu.open = false;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
  }

  var video = document.querySelector('.reel-video');
  if (video && video.getAttribute('data-src')) {
    var poster = document.querySelector('.reel-poster');
    video.addEventListener('loadeddata', function () {
      video.hidden = false;
      if (poster) poster.hidden = true;
      if (reduceMotion) {
        video.controls = true;
        return;
      }
      var playing = video.play();
      if (playing && playing.catch) playing.catch(function () { video.controls = true; });
    });
    var startVideo = function () {
      video.preload = 'metadata';
      video.src = video.getAttribute('data-src');
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); startVideo(); }
      }, { rootMargin: '400px 0px' });
      io.observe(video);
    } else {
      startVideo();
    }
  }

  if (!root.classList.contains('will-3d')) return;

  function giveUp() {
    root.classList.remove('will-3d');
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  if (!window.GMMotion || !window.GMMotion.ready) { giveUp(); return; }

  function load(src, done) {
    var s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = done;
    s.onerror = giveUp;
    document.head.appendChild(s);
  }
  function start() {
    load('js/vendor/three.min.js', function () {
      load('js/scene.js', function () {
        if (!window.GMScene || !window.GMScene.start(giveUp)) giveUp();
      });
    });
  }
  function whenIdle() {
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1200 });
    else setTimeout(start, 200);
  }
  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle);
})();
