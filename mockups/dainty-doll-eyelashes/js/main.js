/* Dainty Doll Eyelashes: pick a day (next 7) and a time (10am to 4pm starts), then send an email request.
   The visit line says whether the studio is open now, in Sydney time. */
(function () {
  var TZ = 'Australia/Sydney';
  var days = document.getElementById('days');
  var times = document.getElementById('times');
  var send = document.getElementById('book-send');
  var summary = document.getElementById('summary');
  var form = document.getElementById('book-form');
  var chosen = { day: null, time: null };

  function button(label, value, group) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pick'; b.textContent = label;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () {
      [].forEach.call(group.querySelectorAll('.pick'), function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      chosen[group === days ? 'day' : 'time'] = value;
      update();
    });
    group.appendChild(b);
  }
  if (days && times) {
    for (var i = 0; i < 7; i++) {
      var d = new Date(); d.setDate(d.getDate() + i);
      var label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric' });
      button(label, d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }), days);
    }
    ['10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'].forEach(function (t) { button(t, t, times); });
  }
  function update() {
    var ready = chosen.day && chosen.time;
    summary.textContent = ready ? 'Requesting ' + chosen.day + ' at ' + chosen.time + '.' : 'Pick a day and a time.';
    send.setAttribute('aria-disabled', ready ? 'false' : 'true');
    var name = form.name.value.trim();
    var body = 'Hi Dainty Doll,\n\nCould I book a keratin lash lift on ' + (chosen.day || '(day)') + ' at ' + (chosen.time || '(time)') + '?\n\n' + (name ? 'Thanks,\n' + name + '\n' : 'Thanks!\n');
    send.href = 'mailto:daintydolleyelashes@gmail.com?subject=' + encodeURIComponent('Lash lift booking request') + '&body=' + encodeURIComponent(body);
  }
  if (form) {
    form.addEventListener('input', update);
    send.addEventListener('click', function (e) {
      if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); summary.textContent = 'Choose a day and a time first.'; }
    });
    update();
  }

  var now = document.getElementById('open-now');
  if (now) {
    var o = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    var m = +o.hour * 60 + +o.minute;
    now.textContent = m >= 600 && m < 1020 ? 'Open now.' : 'Closed now, opens at 10am.';
  }
})();
