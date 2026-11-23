(function () {
  var nav = navigator;
  var ok = 'WebGL2RenderingContext' in window;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ok = false;
  if (nav.connection && nav.connection.saveData) ok = false;
  if (nav.deviceMemory && nav.deviceMemory < 4) ok = false;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency < 4) ok = false;
  if (ok) document.documentElement.classList.add('will-3d');
})();
