/* Armazém Di Vino: the ridge on the label draws once; today's hours are marked in Brazil time;
   the table form writes a WhatsApp message. */
(function () {
  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-in'); });

  var CLOSE = { 0: 1080, 1: 1080, 2: 1320, 3: 1080, 4: 1320, 5: 1320, 6: 1320 }, OPEN = 600;
  var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
  var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  var min = parseInt(get('hour'), 10) % 24 * 60 + parseInt(get('minute'), 10);
  var row = document.querySelector('.week li[data-d="' + day + '"]');
  if (row) row.classList.add('is-today');
  var note = document.getElementById('open-now');
  if (note) note.textContent = (min >= OPEN && min < CLOSE[day] ? 'Open now, until ' + (CLOSE[day] / 60) + ':00.' : 'Closed now.') + ' Hours to be confirmed by the shop.';

  var form = document.getElementById('table-form');
  if (!form) return;
  var d = document.getElementById('day'), t = document.getElementById('time'), p = document.getElementById('people');
  var hint = document.getElementById('hint'), wa = document.getElementById('wa');
  d.min = new Date().toISOString().slice(0, 10);
  function nice(v) { return new Date(v + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); }
  function update() {
    var ok = !!d.value;
    var dow = ok ? new Date(d.value + 'T12:00:00').getDay() : null;
    var late = ok && t.value && (parseInt(t.value.slice(0, 2), 10) * 60 + parseInt(t.value.slice(3), 10)) > CLOSE[dow] - 30;
    hint.textContent = !ok ? 'Pick a day to continue.' : (late ? 'That is close to closing time on ' + nice(d.value).split(' ')[0] + '. Try earlier.' : 'Table for ' + p.value + ', ' + nice(d.value) + ' at ' + t.value + '.');
    var msg = 'Olá! Could I reserve an outside table for ' + p.value + ' on ' + (ok ? nice(d.value) : '...') + ' at ' + t.value + '? Obrigado!';
    wa.href = 'https://wa.me/5512996525336?text=' + encodeURIComponent(msg);
    wa.setAttribute('aria-disabled', ok && !late ? 'false' : 'true');
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  wa.addEventListener('click', function (e) { if (wa.getAttribute('aria-disabled') === 'true') { e.preventDefault(); d.focus(); } });
  update();
})();
