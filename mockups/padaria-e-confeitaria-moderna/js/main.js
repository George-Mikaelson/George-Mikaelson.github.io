/* Padaria Moderna: places a "now" dot on the bakery-day timeline (Mato Grosso do Sul time)
   and says what's happening at the counter right now. */
(function () {
  var o = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Campo_Grande', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
  var h = +o.hour + +o.minute / 60;
  var sunday = o.weekday === 'Sun';

  var msg;
  if (h < 6) msg = 'Closed right now. Doors open at 6am.';
  else if (h < 12) msg = 'Open now. The morning bread is out.';
  else if (sunday) msg = 'Closed for the rest of Sunday. Back Monday at 6am.';
  else if (h < 14) msg = 'Lunch break. Back at 2pm.';
  else if (h < 20) msg = 'Open now. Cakes, salgados and coffee on the counter.';
  else msg = 'Closed for the night. Bread again at 6am.';
  var now = document.getElementById('now');
  if (now) now.textContent = 'Right now: ' + msg;

  var marker = document.getElementById('marker');
  var stops = Array.prototype.slice.call(document.querySelectorAll('.line__stops li'));
  var wide = window.matchMedia('(min-width: 900px)');
  function place() {
    if (!marker || h < 6 || h >= 20) return;
    var at = stops.map(function (li) { return +li.getAttribute('data-at'); });
    var i = 0;
    while (i < at.length - 2 && h >= at[i + 1]) i++;
    var f = (h - at[i]) / (at[i + 1] - at[i]);
    var a = stops[i], b = stops[i + 1];
    marker.hidden = false;
    if (wide.matches) {
      marker.style.top = '';
      marker.style.left = (a.offsetLeft + f * (b.offsetLeft - a.offsetLeft) - 2) + 'px';
    } else {
      marker.style.left = '';
      marker.style.top = (a.offsetTop + f * (b.offsetTop - a.offsetTop)) + 'px';
    }
  }
  place();
  window.addEventListener('resize', place);
})();
