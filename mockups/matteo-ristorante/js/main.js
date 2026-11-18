/* Matteo Ristorante: lunch builder sentence, today's row and service status (Brazil time), red rule entrance. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var form = document.getElementById('builder');
  var out = document.getElementById('plate-text');
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function update() {
    var pasta = form.querySelector('input[name="pasta"]:checked').value;
    var sauce = form.querySelector('input[name="sauce"]:checked').value;
    out.textContent = cap(pasta) + ' with ' + sauce + ', salad on the side.';
  }
  if (form && out) { form.addEventListener('change', update); form.addEventListener('submit', function (e) { e.preventDefault(); }); }

  var DAYS = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  var o = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
  var day = DAYS[o.weekday], min = +o.hour * 60 + +o.minute;
  function m(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  var row = document.querySelector('.matrix tr[data-day="' + day + '"]');
  var now = document.getElementById('now');
  if (row && now) {
    row.classList.add('is-today');
    var slots = row.getAttribute('data-slots') ? row.getAttribute('data-slots').split(',') : [];
    var msg = 'Closed today. Lunch again on Monday at 11.30.';
    for (var i = 0; i < slots.length; i++) {
      var ab = slots[i].split('-');
      if (min >= m(ab[0]) && min < m(ab[1])) { msg = (i === 0 ? 'Lunch is on now' : 'Dinner is on now') + ', until ' + ab[1].replace(':', '.'); break; }
      if (min < m(ab[0])) { msg = (i === 0 ? 'Lunch' : 'Dinner') + ' starts today at ' + ab[0].replace(':', '.'); break; }
      msg = 'Done for today. See you tomorrow.';
    }
    if (day === 5 && slots.length === 1 && min >= m('14:00')) msg = 'Done for today. Back on Monday.';
    now.textContent = msg;
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
