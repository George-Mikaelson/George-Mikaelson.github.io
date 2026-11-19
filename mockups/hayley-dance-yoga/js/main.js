/* Hayley Dance-Yoga: the two class days light up once; "next class" is worked out in Melbourne time;
   the spot form lists the next four dates of the chosen class and writes a text or email. */
(function () {
  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-in'); });

  var CLASSES = { 5: { start: 555, label: 'Friday 9:15' }, 0: { start: 540, label: 'Sunday 9:00' } };
  var parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Melbourne', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  var g = function (t) { return parseInt(parts.filter(function (p) { return p.type === t; })[0].value, 10); };
  var today = new Date(Date.UTC(g('year'), g('month') - 1, g('day'), 12));
  var nowMin = g('hour') % 24 * 60 + g('minute');

  function upcoming(dow, n) {
    var out = [], d = new Date(today);
    for (var i = 0; out.length < n && i < 60; i++) {
      if (d.getUTCDay() === dow && !(i === 0 && nowMin >= CLASSES[dow].start)) out.push(new Date(d));
      d.setUTCDate(d.getUTCDate() + 1);
    }
    return out;
  }
  function nice(d) { return d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }); }

  var nf = upcoming(5, 1)[0], ns = upcoming(0, 1)[0];
  var next = nf < ns ? { d: nf, c: CLASSES[5] } : { d: ns, c: CLASSES[0] };
  var days = Math.round((next.d - today) / 86400000);
  var el = document.getElementById('next');
  if (el) el.textContent = 'Next class: ' + next.c.label.split(' ')[0] + ' at ' + next.c.label.split(' ')[1] + (days === 0 ? ', today.' : days === 1 ? ', tomorrow.' : ', in ' + days + ' days.');

  var form = document.getElementById('spot-form');
  if (!form) return;
  var date = document.getElementById('date'), name = document.getElementById('name'), first = document.getElementById('first');
  var preview = document.getElementById('preview'), sms = document.getElementById('sms'), mail = document.getElementById('mail');
  function fillDates() {
    var dow = parseInt(form.querySelector('input[name="cls"]:checked').value, 10);
    date.innerHTML = '';
    upcoming(dow, 4).forEach(function (d) { var o = document.createElement('option'); o.value = nice(d); o.textContent = nice(d); date.appendChild(o); });
  }
  function update() {
    var cls = CLASSES[form.querySelector('input[name="cls"]:checked').value].label;
    var msg = 'Hi Hayley! Could I save a spot in the ' + cls.split(' ')[1] + ' class on ' + date.value + '?' +
      (first.checked ? " It's my first class." : '') + (name.value.trim() ? ' ' + name.value.trim() : '');
    preview.textContent = msg;
    sms.href = 'sms:+61401188772?&body=' + encodeURIComponent(msg);
    mail.href = 'mailto:hayleydanceandyoga@gmail.com?subject=' + encodeURIComponent('Spot in the ' + cls + ' class') + '&body=' + encodeURIComponent(msg);
  }
  form.addEventListener('change', function (e) { if (e.target.name === 'cls') fillDates(); update(); });
  form.addEventListener('input', update);
  fillDates(); update();
})();
