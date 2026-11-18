// Café Lumen sample site: marks today's row in the hours table and says whether the café is open now.
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
