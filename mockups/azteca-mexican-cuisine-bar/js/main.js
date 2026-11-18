/* Azteca: walls rise into place once on load (desktop, motion allowed); service status in El Salvador time. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var o = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'America/El_Salvador', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
  var m = +o.hour * 60 + +o.minute;
  var close = o.weekday === 'Sun' ? 1260 : 1320;
  var now = document.getElementById('now');
  if (now) {
    if (m >= 720 && m < 900) now.textContent = 'Lunch is being served now.';
    else if (m >= 1080 && m < close) now.textContent = 'Dinner is being served now.';
    else if (m < 720) now.textContent = 'Lunch from 12.00 today.';
    else if (m < 1080) now.textContent = 'Back for dinner at 18.00.';
    else now.textContent = 'Closed for tonight.';
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
