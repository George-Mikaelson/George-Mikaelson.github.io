/* Dr Komal Verma: moves the sun on the day dial to the current Pune time, says if the clinic is open,
   and builds the email request from the next five weekdays and half-hour slots (10:00 to 13:30). */
(function () {
  var p = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
  var mins = +p.hour * 60 + +p.minute;
  var weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(p.weekday) > -1;
  var open = weekday && mins >= 600 && mins < 840;

  // Dial: 6am (180 degrees, left) to 6pm (0 degrees, right), centre (160,170), radius 140
  var sun = document.getElementById('sun');
  var cap = document.getElementById('dial-now');
  var clamped = Math.min(Math.max(mins, 360), 1080);
  var angle = Math.PI * (1 - (clamped - 360) / 720);
  if (sun) {
    sun.setAttribute('cx', (160 + 140 * Math.cos(angle)).toFixed(1));
    sun.setAttribute('cy', (170 - 140 * Math.sin(angle)).toFixed(1));
    if (open) sun.classList.add('is-in');
  }
  if (cap) cap.textContent = open ? 'The clinic is open now, until 2pm.' :
    (weekday && mins < 600 ? 'Opens at 10am today, Pune time.' : 'Closed now. Next opening: a weekday at 10am, Pune time.');

  var days = document.getElementById('days'), slots = document.getElementById('slots');
  var form = document.getElementById('book-form'), send = document.getElementById('book-send');
  if (!days || !slots || !form || !send) return;
  function opt(group, name, value, label, checked) {
    var l = document.createElement('label'); l.className = 'opt';
    var i = document.createElement('input'); i.type = 'radio'; i.name = name; i.value = value; i.checked = !!checked;
    var s = document.createElement('span'); s.textContent = label;
    l.appendChild(i); l.appendChild(s); group.appendChild(l);
  }
  var d = new Date(), n = 0;
  while (n < 5) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    opt(days, 'day', d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }), d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }), n === 0);
    n++;
  }
  ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30'].forEach(function (t, i) {
    var h = +t.slice(0, 2), label = (h > 12 ? h - 12 : h) + ':' + t.slice(3) + (h >= 12 ? 'pm' : 'am');
    opt(slots, 'slot', label, label, i === 0);
  });
  function update() {
    var day = form.querySelector('input[name="day"]:checked').value;
    var slot = form.querySelector('input[name="slot"]:checked').value;
    var note = form.note.value.trim(), name = form.name.value.trim();
    var body = 'Namaste Dr Komal,\n\nI would like to request a naturopathy consultation on ' + day + ' at ' + slot + '.\n' +
      (note ? '\nA note before the visit: ' + note + '\n' : '') + '\nThank you,\n' + (name || '') + '\n';
    send.href = 'mailto:komalver1984@gmail.com?subject=' + encodeURIComponent('Consultation request: ' + day + ', ' + slot) + '&body=' + encodeURIComponent(body);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
