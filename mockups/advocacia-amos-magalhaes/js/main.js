/* Advocacia Amós Magalhães: office open/closed (Mon-Fri 9-18, Brasília time) and the WhatsApp meeting request. */
(function () {
  var p = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
  var m = +p.hour * 60 + +p.minute;
  var open = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(p.weekday) > -1 && m >= 540 && m < 1080;
  var el = document.getElementById('open-now');
  if (el) el.textContent = open ? 'The office is open now.' : 'The office is closed now.';

  var form = document.getElementById('meet-form');
  var send = document.getElementById('meet-send');
  if (!form || !send) return;
  function update() {
    var how = form.querySelector('input[name="how"]:checked').value;
    var when = form.querySelector('input[name="when"]:checked').value;
    var topic = form.topic.value.trim();
    var text = 'Good day, Dr. Amós. I would like to book a first meeting, ' + how + ', on ' + when + '.' + (topic ? ' It is about: ' + topic + '.' : '') + ' Which days do you have?';
    send.href = 'https://wa.me/5533999874568?text=' + encodeURIComponent(text);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
