/* Dr. Adenil Brito: the next five weekdays as day choices, the WhatsApp request,
   and an open/closed line (Mon-Fri 8-18, Belém time, which Macapá uses). */
(function () {
  var TZ = 'America/Belem';
  var p = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
  var m = +p.hour * 60 + +p.minute;
  var weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(p.weekday) > -1;
  var el = document.getElementById('open-now');
  if (el) el.textContent = weekday && m >= 480 && m < 1080 ? 'Open now.' : 'Closed now.';

  var days = document.getElementById('days');
  var form = document.getElementById('book-form');
  var send = document.getElementById('book-send');
  if (!days || !form || !send) return;
  var d = new Date(), added = 0;
  while (added < 5) {
    d.setDate(d.getDate() + 1);
    var w = d.getDay();
    if (w === 0 || w === 6) continue;
    var label = document.createElement('label'); label.className = 'opt';
    var input = document.createElement('input'); input.type = 'radio'; input.name = 'day';
    input.value = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!added) input.checked = true;
    var span = document.createElement('span'); span.textContent = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
    label.appendChild(input); label.appendChild(span); days.appendChild(label);
    added++;
  }
  function update() {
    var day = form.querySelector('input[name="day"]:checked').value;
    var part = form.querySelector('input[name="part"]:checked').value;
    var why = form.querySelector('input[name="why"]:checked').value;
    var text = 'Hello Dr. Adenil, I would like an appointment on ' + day + ' ' + part + ' for ' + why + '. Do you have a free time?';
    send.href = 'https://wa.me/5596991260825?text=' + encodeURIComponent(text);
  }
  form.addEventListener('change', update);
  update();
})();
