/* Encanto da Pizza: tonight's status (Brasília time), today's row, and the stars coming out once
   when the night section scrolls into view. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var DAYS = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  var o = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
  var day = DAYS[o.weekday], min = +o.hour * 60 + +o.minute;
  var openDay = [0, 3, 4, 5, 6].indexOf(day) > -1;
  var row = document.querySelector('.nights tr[data-day="' + day + '"]');
  if (row) row.classList.add('is-today');
  var status = document.getElementById('status');
  if (status) {
    if (openDay && min >= 1110 && min < 1380) status.textContent = 'Open tonight until 11pm.';
    else if (openDay && min < 1110) status.textContent = 'Open tonight from 6.30pm.';
    else if (day === 1 || day === 2 || (day === 0 && min >= 1380)) status.textContent = 'Closed tonight. Back on Thursday at 6.30pm.';
    else status.textContent = 'Closed for tonight. Back tomorrow at 6.30pm.';
  }

  var night = document.querySelector('.night');
  if (night && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { night.classList.add('is-lit'); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(night);
  } else if (night) {
    night.classList.add('is-lit');
  }
})();
