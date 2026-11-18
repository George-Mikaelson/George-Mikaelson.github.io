/* Postrecita: dessert filters, rail arrows, open/closed line (El Salvador time), scoop entrance. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var chips = document.querySelectorAll('.chip');
  var treats = document.querySelectorAll('.treat');
  var rail = document.getElementById('rail');
  var empty = document.getElementById('empty');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      var shown = 0;
      treats.forEach(function (t) {
        var match = f === 'all' || t.getAttribute('data-tags').split(' ').indexOf(f) > -1;
        t.hidden = !match;
        if (match) shown++;
      });
      empty.hidden = shown > 0;
      rail.scrollTo({ left: 0 });
    });
  });

  var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.round').forEach(function (b) {
    b.addEventListener('click', function () {
      var step = rail.clientWidth * 0.8 * +b.getAttribute('data-dir');
      rail.scrollBy({ left: step, behavior: smooth ? 'smooth' : 'auto' });
    });
  });

  var status = document.getElementById('status');
  if (status) {
    var o = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'America/El_Salvador', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    var m = +o.hour * 60 + +o.minute;
    status.textContent = m >= 480 && m < 1200 ? 'Open right now' : (m < 480 ? 'Opens at 8am today' : 'Closed now, back at 8am');
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
