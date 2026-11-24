(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) d.classList.add('reduce');
    var c = navigator.connection;
    if ((c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) || (navigator.deviceMemory && navigator.deviceMemory <= 1)) d.classList.add('lite');
  } catch (e) {}
})();
