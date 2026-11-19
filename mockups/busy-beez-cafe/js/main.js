/* Busy Beez Cafe: the honey strip on the board says if the café is open right now (London time),
   and today's row in the hours table is highlighted. */
(function () {
  var p = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
  var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  var m = +p.hour * 60 + +p.minute;
  var now = document.getElementById('now');
  if (now) {
    if (day === 0) now.textContent = 'Closed today. Back Monday at 7am.';
    else if (m >= 420 && m < 900) now.textContent = 'Open now, till 3pm.';
    else if (m < 420) now.textContent = 'Opening at 7am.';
    else now.textContent = day === 6 ? 'Closed now. Back Monday at 7am.' : 'Closed now. Back tomorrow at 7am.';
  }
  var row = document.querySelector('#hours tr[data-day="' + day + '"]');
  if (row) { row.classList.add('is-today'); row.setAttribute('aria-current', 'date'); }
})();
