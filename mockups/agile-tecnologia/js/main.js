/* Agile Tecnologia: the repair ticket fills in from the form and becomes a WhatsApp message.
   The status LED shows if the shop is open (Mon-Fri 8:30-17:00, Recife time). */
(function () {
  var p = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Recife', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
  var m = +p.hour * 60 + +p.minute;
  var open = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(p.weekday) > -1 && m >= 510 && m < 1020;
  var status = document.getElementById('open-now');
  if (status) {
    status.textContent = open ? 'Open now, until 5pm.' : 'Closed now. Open Monday to Friday, 8:30am to 5pm.';
    if (!open) status.previousElementSibling.classList.add('is-off');
  }

  var form = document.getElementById('ticket-form');
  var send = document.getElementById('ticket-send');
  if (!form || !send) return;
  var out = { device: document.getElementById('t-device'), fault: document.getElementById('t-fault'), model: document.getElementById('t-model') };
  function val(name) { return form.querySelector('input[name="' + name + '"]:checked').value; }
  function update() {
    var device = val('device'), fault = val('fault'), model = form.model.value.trim();
    out.device.textContent = device;
    out.fault.textContent = fault.replace("Won't", 'Won’t');
    out.model.textContent = model || 'not given';
    var text = 'Hi Agile, I would like to open a repair ticket.\nDevice: ' + device + '\nProblem: ' + fault + '\nModel: ' + (model || 'not sure') + '\nWhen can I bring it in for diagnosis?';
    send.href = 'https://wa.me/5583991592048?text=' + encodeURIComponent(text);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
