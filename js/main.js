// Site behaviour for index.html and pay.html: hero fallback, showcase video, copy buttons. Motion lives in js/motion.js.
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Hero entrance (index.html): one orchestrated sequence. The CSS holds the hero items
  //    hidden while scripting is on; adding .is-in plays the staggered transitions.
  //    When GSAP is running, js/motion.js has already played the full sequence instead.
  var stage = document.querySelector('.stage');
  if (stage && !stage.classList.contains('is-gsap')) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { stage.classList.add('is-in'); });
    });
  }

  // 2. Showcase video (index.html): the poster image shows until the video file loads.
  //    If media/restaurant_tiktok.mp4 is missing, the video stays hidden and nothing changes.
  var video = document.querySelector('.reel-video');
  if (video && video.getAttribute('data-src')) {
    var poster = document.querySelector('.reel-poster');
    var caption = document.querySelector('.reel-caption');
    if (reduceMotion) {
      video.removeAttribute('autoplay');
      video.autoplay = false;
      video.controls = true;
    }
    video.addEventListener('loadeddata', function () {
      video.hidden = false;
      if (poster) poster.hidden = true;
      if (caption && caption.getAttribute('data-ready')) caption.textContent = caption.getAttribute('data-ready');
      if (!reduceMotion) {
        var playing = video.play();
        if (playing && playing.catch) playing.catch(function () { video.controls = true; });
      }
    });
    video.preload = 'metadata';
    video.src = video.getAttribute('data-src');
  }

  // 3. Copy buttons for the payment addresses (pay.html). Each button names its address
  //    element in data-copy and the characters to check in data-check. Buttons start
  //    hidden so visitors without JavaScript never see a control that does nothing.
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var el = document.getElementById(btn.getAttribute('data-copy'));
    var status = btn.parentNode.querySelector('output');
    if (!el || !status) return;
    btn.hidden = false;
    btn.addEventListener('click', function () {
      var text = el.textContent.trim();
      function done(ok) {
        status.textContent = ok
          ? 'Copied. After you paste, check it ' + btn.getAttribute('data-check') + '.'
          : 'Copy did not work here. Select the address and copy it by hand.';
      }
      function fallback() {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        done(ok);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
      } else {
        fallback();
      }
    });
  });
})();
