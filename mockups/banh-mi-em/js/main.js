/* Bánh Mì EM: the sandwich layers drop in once; open/closed in Christchurch time;
   the order ticket builds a text message with quantities and a pickup time. */
(function () {
  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-in'); });

  // Hours in New Zealand time: Mon-Fri 10:00-17:30, Sat 10:00-15:30
  var HOURS = { 1: [600, 1050], 2: [600, 1050], 3: [600, 1050], 4: [600, 1050], 5: [600, 1050], 6: [600, 930] };
  function nzNow() {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Pacific/Auckland', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { day: day, min: parseInt(get('hour'), 10) % 24 * 60 + parseInt(get('minute'), 10) };
  }
  function fmt(m) { var h = Math.floor(m / 60), mm = m % 60; return (h > 12 ? h - 12 : h) + (mm ? ':' + (mm < 10 ? '0' : '') + mm : '') + (h >= 12 ? 'pm' : 'am'); }

  var now = nzNow(), today = HOURS[now.day];
  var status = document.getElementById('status');
  if (status) {
    if (today && now.min >= today[0] && now.min < today[1]) { status.textContent = 'Open now, until ' + fmt(today[1]); status.classList.add('is-open'); }
    else status.textContent = 'Closed now. Mon–Fri 10–5:30, Sat 10–3:30';
  }

  // Pickup slots: every 15 minutes inside today's hours, or the next opening day
  var select = document.getElementById('time');
  if (!select) return;
  var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var d, from, label;
  for (var i = 0; i < 8; i++) {
    d = (now.day + i) % 7; from = i === 0 ? now.min + 20 : 0;
    label = i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : names[d]);
    var h = HOURS[d];
    if (h && Math.max(from, h[0]) <= h[1] - 15) break;
  }
  var span = HOURS[d], start = Math.ceil(Math.max(from, span[0]) / 15) * 15;
  for (var m = start; m <= span[1] - 15; m += 15) {
    var o = document.createElement('option'); o.value = label + ' ' + fmt(m); o.textContent = label + ', ' + fmt(m); select.appendChild(o);
  }

  var counts = { bm: 1, cf: 0 };
  var preview = document.getElementById('preview'), sms = document.getElementById('sms'), name = document.getElementById('name');
  function update() {
    var lines = [];
    if (counts.bm) lines.push(counts.bm + ' x bánh mì');
    if (counts.cf) lines.push(counts.cf + ' x iced coffee');
    var msg = 'Hi! Order for pickup ' + select.value + ':\n' + (lines.join('\n') || '(nothing yet)') + (name.value.trim() ? '\nName: ' + name.value.trim() : '');
    preview.textContent = msg;
    sms.href = 'sms:+64212294668?&body=' + encodeURIComponent(msg);
  }
  document.querySelectorAll('.step').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-for');
      counts[k] = Math.max(0, Math.min(20, counts[k] + parseInt(b.getAttribute('data-d'), 10)));
      document.getElementById(k).textContent = counts[k];
      update();
    });
  });
  select.addEventListener('change', update);
  name.addEventListener('input', update);
  update();
})();
