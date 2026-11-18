/* A Virgem: floor-plan tabs (click or arrow keys), open-now line in Porto Alegre time, neon flicker once. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.room'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t, false); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowLeft' || k === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0];
      if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });

  var status = document.getElementById('status');
  if (status) {
    var o = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    var m = +o.hour * 60 + +o.minute;
    status.textContent = m >= 660 && m < 1380 ? 'Listed as open right now (11am to 11pm).' : 'Listed hours are 11am to 11pm.';
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
