/* Soya Nutribar: the sun stripes rise once on load; open-now line in El Salvador time. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var now = document.getElementById('now');
  if (now) {
    var o = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'America/El_Salvador', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    var m = +o.hour * 60 + +o.minute;
    now.textContent = m >= 480 && m < 1260 ? 'Open right now.' : (m < 480 ? 'Opens at 8am. Surf first, then breakfast.' : 'Closed for tonight. Back at 8am.');
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
