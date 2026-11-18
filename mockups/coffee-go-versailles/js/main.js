/* Coffee Go Versailles: highlight today's row, say whether the room is open now
   (Paris time), and draw the parterre ornament once. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var DAYS = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

  function parisNow() {
    var o = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    return { day: DAYS[o.weekday], min: +o.hour * 60 + +o.minute };
  }
  function mins(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }

  var now = parisNow();
  var row = document.querySelector('[data-day="' + now.day + '"]');
  var today = document.getElementById('today');
  if (row && today) {
    row.classList.add('is-today');
    var slot = row.getAttribute('data-slots').split('-');
    var open = now.min >= mins(slot[0]) && now.min < mins(slot[1]);
    var close = row.querySelector('td').textContent.split('–')[1].trim();
    var opens = row.querySelector('td').textContent.split('–')[0].trim();
    today.textContent = open ? 'Open now, until ' + close : (now.min < mins(slot[0]) ? 'Opens today at ' + opens : 'Closed for today. See you tomorrow');
    today.classList.add(open ? 'is-open' : 'is-closed');
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
