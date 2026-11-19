/* Búnbò: live "now" marker on the 11:30-14:30 lunch window (Lyon time), today's date on the board,
   and a pre-order that lists bowls and a pickup slot in an email. */
(function () {
  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-in'); });

  var OPEN = 690, CLOSE = 870; // 11:30 and 14:30
  function lyonNow() {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), min: parseInt(get('hour'), 10) % 24 * 60 + parseInt(get('minute'), 10) };
  }
  function hm(m) { return Math.floor(m / 60) + ':' + ('0' + m % 60).slice(-2); }
  var now = lyonNow(), weekday = now.day >= 1 && now.day <= 5;
  var mark = document.getElementById('now-mark'), status = document.getElementById('window-status');
  if (weekday && now.min >= OPEN && now.min < CLOSE) {
    mark.hidden = false; mark.style.left = ((now.min - OPEN) / (CLOSE - OPEN) * 100) + '%';
    var left = CLOSE - now.min;
    status.textContent = 'Open now in Lyon. Kitchen closes in ' + (left >= 60 ? Math.floor(left / 60) + ' h ' : '') + (left % 60) + ' min.';
  } else if (weekday && now.min < OPEN) {
    status.textContent = 'Opens today at 11:30 (it is ' + hm(now.min) + ' in Lyon).';
  } else {
    status.textContent = 'Closed now. Next lunch: ' + (now.day >= 1 && now.day <= 4 ? 'tomorrow' : 'Monday') + ' at 11:30.';
  }

  var bd = document.getElementById('board-date');
  if (bd) bd.textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Paris' });

  var slot = document.getElementById('slot'), summary = document.getElementById('summary'), mail = document.getElementById('mail');
  if (!slot) return;
  var first = weekday && now.min < CLOSE - 30 ? Math.max(OPEN + 15, Math.ceil((now.min + 30) / 15) * 15) : OPEN + 15;
  var dayLabel = weekday && now.min < CLOSE - 30 ? 'Today' : (now.day >= 1 && now.day <= 4 ? 'Tomorrow' : 'Monday');
  for (var m = first; m <= CLOSE - 15; m += 15) {
    var o = document.createElement('option'); o.value = dayLabel + ' ' + hm(m); o.textContent = dayLabel + ', ' + hm(m); slot.appendChild(o);
  }
  var inputs = document.querySelectorAll('.pick input');
  function update() {
    var lines = [];
    inputs.forEach(function (i) { var n = Math.max(0, Math.min(10, parseInt(i.value, 10) || 0)); if (n) lines.push(n + ' x ' + i.getAttribute('data-dish')); });
    var ok = lines.length > 0;
    summary.textContent = ok ? lines.join(', ') + ', ready ' + slot.value.replace(/^To/, 'to') + '.' : 'Add at least one dish.';
    mail.setAttribute('aria-disabled', ok ? 'false' : 'true');
    mail.href = 'mailto:sarrazin.sebastien@gmail.com?subject=' + encodeURIComponent('Pre-order for ' + slot.value) +
      '&body=' + encodeURIComponent('Bonjour,\n\nCould I pick up this order ' + slot.value + '?\n' + lines.join('\n') + '\n\nName:\nPhone:\n\nThank you.');
  }
  document.getElementById('pre-form').addEventListener('input', update);
  slot.addEventListener('change', update);
  mail.addEventListener('click', function (e) { if (mail.getAttribute('aria-disabled') === 'true') { e.preventDefault(); inputs[0].focus(); } });
  update();
})();
