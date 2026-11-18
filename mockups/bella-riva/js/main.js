/* BellaRiva: postmark stamps once on load; today's row and service status in Paris time. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var DAYS = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  var SLOTS = [[630, 840, 1140, 1320], [720, 840, 1140, 1320], [720, 840, 1140, 1320], [720, 840, 1140, 1320], [720, 840, 1140, 1350], [720, 840, 1140, 1350], null];
  var o = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
  var d = DAYS[o.weekday], m = +o.hour * 60 + +o.minute;
  var row = document.querySelector('.tbl tr[data-day="' + d + '"]');
  if (row) row.classList.add('is-today');
  var now = document.getElementById('now');
  if (now) {
    var s = SLOTS[d], msg;
    if (!s) msg = 'Sunday: call us to check if we’re open.';
    else if (m >= s[0] && m < s[1]) msg = 'Lunch service is on now.';
    else if (m >= s[2] && m < s[3]) msg = 'Dinner service is on now.';
    else if (m < s[0]) msg = 'Lunch starts today at ' + (s[0] === 630 ? '10.30' : '12.00') + '.';
    else if (m < s[2]) msg = 'Back for dinner at 19.00.';
    else msg = 'Closed for tonight.';
    now.textContent = msg;
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
