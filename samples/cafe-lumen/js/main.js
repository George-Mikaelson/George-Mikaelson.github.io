// Café Lumen sample site: opening status, today's row in the hours table, which bakes are already
// out of the oven, the pastry box form and the call panel. Nothing here sends data anywhere.
(function () {
  'use strict';

  var now = new Date();
  var day = now.getDay();
  var mins = now.getHours() * 60 + now.getMinutes();
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function toMinutes(t) { var p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function show(t) { return t.replace(/^0/, ''); }

  // hours table and status line
  var rows = {};
  document.querySelectorAll('.week tr[data-day]').forEach(function (tr) { rows[tr.getAttribute('data-day')] = tr; });
  var todayRow = rows[day];
  if (todayRow) {
    todayRow.classList.add('is-today');
    var tag = document.createElement('span');
    tag.className = 'today-tag';
    tag.textContent = 'today';
    todayRow.querySelector('th').appendChild(tag);
  }

  function span(tr) {
    if (!tr || !tr.hasAttribute('data-open')) return null;
    return { open: toMinutes(tr.getAttribute('data-open')), close: toMinutes(tr.getAttribute('data-close')),
             openText: show(tr.getAttribute('data-open')), closeText: show(tr.getAttribute('data-close')) };
  }
  var today = span(todayRow);
  var status = document.querySelector('[data-status]');
  if (status) {
    var text;
    if (today && mins >= today.open && mins < today.close) {
      text = 'Open now, until ' + today.closeText;
    } else if (today && mins < today.open) {
      text = 'Closed now. Opens today at ' + today.openText;
    } else {
      for (var i = 1; i <= 7; i++) {
        var next = span(rows[(day + i) % 7]);
        if (next) { text = 'Closed now. Opens ' + (i === 1 ? 'tomorrow' : DAYS[(day + i) % 7]) + ' at ' + next.openText; break; }
      }
    }
    status.textContent = text;
    status.classList.toggle('is-open', text.indexOf('Open now') === 0);
  }

  // today's bakes: mark what is already out (Saturday runs half an hour later, Sunday no baking)
  var board = document.querySelector('[data-oven]');
  var note = document.querySelector('[data-oven-note]');
  if (board) {
    var shift = day === 6 ? 30 : 0;
    var baking = day !== 0 && today;
    board.querySelectorAll('li[data-time]').forEach(function (li) {
      var at = toMinutes(li.getAttribute('data-time')) + shift;
      var when = li.querySelector('.oven-when');
      var clock = Math.floor(at / 60) + ':' + String(at % 60).padStart(2, '0');
      if (baking && mins >= at && mins < today.close) {
        li.classList.add('is-out');
        when.textContent = 'Out at ' + clock;
      } else if (baking && mins < at) {
        when.textContent = 'Due at ' + clock;
      } else {
        when.textContent = clock;
      }
    });
    if (note && !baking) note.textContent = 'No baking today. These are the usual weekday times.';
    else if (note && mins >= today.close) note.textContent = 'The oven is off for the day. These are tomorrow\'s usual times.';
  }

  // pastry box: offer the next six days the café is open
  var form = document.querySelector('[data-box]');
  if (form) {
    var select = form.querySelector('[data-days]');
    var added = 0;
    for (var d = 1; added < 6 && d < 14; d++) {
      var date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);
      if (!span(rows[date.getDay()])) continue;
      var opt = document.createElement('option');
      opt.textContent = (d === 1 ? 'Tomorrow, ' : DAYS[date.getDay()] + ' ') + date.getDate() + ' ' + date.toLocaleString('en-GB', { month: 'long' });
      select.appendChild(opt);
      added++;
    }
    var name = form.elements.name;
    var error = form.querySelector('[data-error]');
    var done = form.querySelector('[data-done]');
    name.addEventListener('blur', function () {
      if (name.value.trim() === '' && name.dataset.touched) { name.setAttribute('aria-invalid', 'true'); error.hidden = false; }
    });
    name.addEventListener('input', function () {
      name.dataset.touched = '1';
      if (name.value.trim() !== '') { name.removeAttribute('aria-invalid'); error.hidden = true; }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (name.value.trim() === '') {
        name.setAttribute('aria-invalid', 'true');
        error.hidden = false;
        name.focus();
        return;
      }
      var size = form.querySelector('input[name="size"]:checked').value;
      done.textContent = size + ' reserved for ' + select.value + ' at ' + form.elements.time.value +
        ', under the name ' + name.value.trim() + '. This is a sample site, so nothing was sent and no box is waiting.';
      done.hidden = false;
    });
  }

  // call buttons open a panel with the number instead of dialling
  var dialog = document.querySelector('[data-call-dialog]');
  var opener = null;
  document.querySelectorAll('[data-call]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      opener = btn;
      if (dialog && dialog.showModal) dialog.showModal();
    });
  });
  if (dialog) {
    dialog.querySelector('[data-close]').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () { if (opener) opener.focus(); });
  }

  var maps = document.querySelector('[data-maps]');
  var mapsNote = document.querySelector('[data-maps-note]');
  if (maps && mapsNote) {
    maps.addEventListener('click', function () {
      mapsNote.textContent = 'On the real site this opens directions in your map app. This is a sample, and 14 Alder Street is made up.';
    });
  }
})();
