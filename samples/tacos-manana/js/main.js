// Tacos Mañana sample site. 1: marks today's row in the hours table and says whether the counter is open now.
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

// 2. Pick-up order builder. Hidden without JavaScript (the page still says to call).
//    This is a sample site, so the order goes nowhere: the page says so and repeats it back.
(function () {
  var form = document.querySelector('[data-order]');
  if (!form) return;
  form.hidden = false;
  var lines = [].slice.call(form.querySelectorAll('[data-item]'));
  var total = form.querySelector('[data-total]');
  var done = form.querySelector('.done');
  var qty = lines.map(function () { return 0; });

  function money(n) { return '$' + n.toFixed(2); }
  function render() {
    var sum = 0;
    lines.forEach(function (li, i) {
      li.querySelector('output').textContent = qty[i];
      li.querySelector('[data-step="-1"]').disabled = qty[i] === 0;
      li.querySelector('[data-step="1"]').disabled = qty[i] === 20;
      sum += qty[i] * Number(li.getAttribute('data-price'));
    });
    total.textContent = money(sum);
    return sum;
  }

  lines.forEach(function (li, i) {
    li.querySelectorAll('[data-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        qty[i] = Math.max(0, Math.min(20, qty[i] + Number(btn.getAttribute('data-step'))));
        done.textContent = '';
        render();
      });
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var sum = render();
    var picked = lines.map(function (li, i) { return qty[i] ? qty[i] + ' ' + li.getAttribute('data-item').toLowerCase() : ''; }).filter(Boolean);
    if (!picked.length) {
      done.textContent = 'Add at least one item with the + buttons first.';
      return;
    }
    done.textContent = 'Sample site, so nothing was sent. On a real site the kitchen now gets: ' + picked.join(', ') +
      '. You pay ' + money(sum) + ' when you collect, in about 15 minutes.';
  });
  render();
})();
