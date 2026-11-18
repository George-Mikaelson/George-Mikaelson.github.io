/* 1770 Marina Cafe: raises the signal-flag bunting once on load, and a morning line in Queensland time. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var now = document.getElementById('now');
  if (now) {
    var o = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Australia/Brisbane', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    var m = +o.hour * 60 + +o.minute;
    if (m < 390) now.textContent = 'Doors open at 6.30am this morning.';
    else if (m < 450) now.textContent = 'Open now. Good time to beat the 8am rush.';
    else if (m < 540) now.textContent = 'Open now. Busiest hour of the morning, so expect a short queue.';
    else if (m < 840) now.textContent = 'Open now.';
    else now.textContent = 'Afternoon hours vary. Call before you come.';
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
