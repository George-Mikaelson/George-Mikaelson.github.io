// The Amber Room sample site. 1: marks today's row in the hours table and says whether the bar is open now.
(function () {
  var table = document.querySelector('[data-hours]');
  var status = document.querySelector('[data-status]');
  if (!table) return;

  function minutes(t) { var p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function show(t) { return t.replace(/^0/, ''); }

  var rows = {};
  table.querySelectorAll('tr[data-day]').forEach(function (tr) { rows[tr.getAttribute('data-day')] = tr; });

  var now = new Date();
  var day = now.getDay();
  var mins = now.getHours() * 60 + now.getMinutes();
  if (rows[day]) rows[day].classList.add('is-today');
  if (!status) return;

  function span(tr) {
    if (!tr || !tr.hasAttribute('data-open')) return null;
    var o = minutes(tr.getAttribute('data-open'));
    var c = minutes(tr.getAttribute('data-close'));
    if (c <= o) c += 1440; // closes after midnight
    return { open: o, close: c, openText: show(tr.getAttribute('data-open')), closeText: show(tr.getAttribute('data-close')), name: tr.querySelector('th').textContent };
  }

  var today = span(rows[day]);
  var yesterday = span(rows[(day + 6) % 7]);
  var text;
  if (yesterday && mins < yesterday.close - 1440) {
    text = 'Open now, until ' + yesterday.closeText;
  } else if (today && mins >= today.open && mins < today.close) {
    text = 'Open now, until ' + today.closeText;
  } else if (today && mins < today.open) {
    text = 'Closed now. Opens today at ' + today.openText;
  } else {
    for (var i = 1; i <= 7; i++) {
      var next = span(rows[(day + i) % 7]);
      if (next) { text = 'Closed now. Opens ' + (i === 1 ? 'tomorrow' : next.name) + ' at ' + next.openText; break; }
    }
  }
  if (text) {
    status.textContent = text;
    status.classList.toggle('is-open', text.indexOf('Open now') === 0);
  }
})();

// 2. Booking form. This is a sample site, so the request goes nowhere: the page says so
//    and repeats back what a real booking would send.
(function () {
  var form = document.querySelector('[data-booking]');
  if (!form) return;
  var date = form.elements.date;
  var name = form.elements.name;
  var done = form.querySelector('.done');

  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var today = iso(new Date());
  date.min = today;
  if (!date.value) date.value = today;

  function check(input) {
    var err = document.getElementById(input.id + '-err');
    var bad = !input.value.trim() || (input === date && input.value < today);
    input.setAttribute('aria-invalid', bad ? 'true' : 'false');
    if (err) {
      err.hidden = !bad;
      if (bad) input.setAttribute('aria-describedby', err.id); else input.removeAttribute('aria-describedby');
    }
    return !bad;
  }
  [date, name].forEach(function (input) {
    input.addEventListener('blur', function () { if (input.value) check(input); });
    input.addEventListener('input', function () { if (input.getAttribute('aria-invalid') === 'true') check(input); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var okDate = check(date);
    var okName = check(name);
    if (!okDate) { date.focus(); return; }
    if (!okName) { name.focus(); return; }
    var when = new Date(date.value + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    done.textContent = 'Sample site, so nothing was sent. On a real site the bar now gets a request for ' +
      form.elements.guests.value + ' people on ' + when + ' at ' + form.elements.time.value +
      ', under the name ' + name.value.trim() + ', and confirms by text.';
  });
})();
