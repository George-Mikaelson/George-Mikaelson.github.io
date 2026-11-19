/* Flores de Apaneca: open/closed in El Salvador time; the bouquet preview follows the chosen colours and size;
   the request goes to Yanira on WhatsApp. */
(function () {
  var OPEN = { 0: [480, 960], 1: [420, 1020], 2: [420, 1020], 3: [420, 1020], 4: [420, 1020], 5: [420, 1020], 6: [420, 1020] };
  var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/El_Salvador', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
  var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  var min = parseInt(get('hour'), 10) % 24 * 60 + parseInt(get('minute'), 10);
  var o = document.getElementById('open'), h = OPEN[day];
  function fmt(m) { var x = Math.floor(m / 60); return (x > 12 ? x - 12 : x) + (x >= 12 ? 'pm' : 'am'); }
  if (o) o.textContent = min >= h[0] && min < h[1] ? 'Open now, until ' + fmt(h[1]) : 'Closed now. Opens at ' + fmt(OPEN[min >= h[1] ? (day + 1) % 7 : day][0]);

  var form = document.getElementById('b-form');
  if (!form) return;
  var posy = document.getElementById('posy'), occasion = document.getElementById('occasion'), d = document.getElementById('day');
  var hint = document.getElementById('hint'), wa = document.getElementById('wa');
  d.min = new Date().toISOString().slice(0, 10);
  function nice(v) { return new Date(v + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); }
  function update() {
    var c = form.querySelector('input[name="c"]:checked').value, s = form.querySelector('input[name="s"]:checked').value;
    posy.setAttribute('data-c', c); posy.setAttribute('data-s', s);
    var ok = !!d.value;
    hint.textContent = ok ? 'A ' + s + ' bouquet in ' + c + ' for ' + nice(d.value) + '.' : 'Pick a day to continue.';
    var msg = 'Hola Yanira! I would like a ' + s + ' bouquet in ' + c + ' for a ' + occasion.value.toLowerCase() + ' occasion, for ' +
      (ok ? nice(d.value) : '...') + '. What flowers do you have and what would it cost? Gracias!';
    wa.href = 'https://wa.me/50376043429?text=' + encodeURIComponent(msg);
    wa.setAttribute('aria-disabled', ok ? 'false' : 'true');
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  wa.addEventListener('click', function (e) { if (wa.getAttribute('aria-disabled') === 'true') { e.preventDefault(); d.focus(); } });
  update();
})();
