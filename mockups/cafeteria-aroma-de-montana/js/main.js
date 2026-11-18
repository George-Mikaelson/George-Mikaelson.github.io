/* Aroma de Montaña: draws the contour lines once on load (skipped under reduced motion in CSS). */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
