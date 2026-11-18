// Tacos Mañana sample site: open-now status, today's tile in the hours, the pick-up ticket with a
// running total, and the call panel. The order is never sent anywhere.
(function () {
  'use strict';

  var now = new Date();
  var day = now.getDay();
  var mins = now.getHours() * 60 + now.getMinutes();

  function toMinutes(t) { var p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function hhmm(m) { return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0'); }
  function money(n) { return '$' + n.toFixed(2); }

  var rows = {};
  document.querySelectorAll('.week tr[data-day]').forEach(function (tr) { rows[tr.getAttribute('data-day')] = tr; });
  if (rows[day]) rows[day].classList.add('is-today');
  function span(tr) {
    return tr && tr.hasAttribute('data-open') ? { open: toMinutes(tr.getAttribute('data-open')), close: toMinutes(tr.getAttribute('data-close')) } : null;
  }
  var today = span(rows[day]);
  var isOpen = today && mins >= today.open && mins < today.close - 15;

  var status = document.querySelector('[data-status]');
  if (status && today) {
    if (isOpen) status.textContent = 'Open now, last orders at ' + hhmm(today.close - 15);
    else if (mins < today.open) status.textContent = 'Closed now. The press starts at ' + hhmm(today.open);
    else status.textContent = 'Closed for tonight. Back tomorrow at ' + hhmm(span(rows[(day + 1) % 7]).open);
    status.classList.toggle('is-open', !!isOpen);
  }

  // pick-up times: every 15 minutes from 15 minutes from now (or from opening) to last orders
  var when = document.querySelector('[data-when]');
  if (when && today) {
    var start = isOpen ? Math.ceil((mins + 15) / 15) * 15 : null;
    if (!isOpen) {
      when.options[0].textContent = mins < today.open ? 'When we open at ' + hhmm(today.open) : 'Tomorrow when we open';
    }
    for (var t = start; isOpen && t <= today.close - 15 && when.options.length < 13; t += 15) {
      var opt = document.createElement('option');
      opt.value = hhmm(t);
      opt.textContent = 'At ' + hhmm(t);
      when.appendChild(opt);
    }
  }

  // the ticket
  var form = document.querySelector('[data-builder]');
  if (form) {
    var lines = Array.prototype.slice.call(form.querySelectorAll('.lines li'));
    var totalOut = form.querySelector('[data-total]');
    var error = form.querySelector('[data-error]');
    var done = form.querySelector('.done');
    var qty = lines.map(function () { return 0; });

    function bump(el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    function refresh() {
      var total = 0;
      lines.forEach(function (li, i) {
        total += qty[i] * Number(li.getAttribute('data-price'));
        li.querySelector('output').textContent = qty[i];
        li.classList.toggle('has-qty', qty[i] > 0);
      });
      totalOut.textContent = money(total);
      return total;
    }
    lines.forEach(function (li, i) {
      li.querySelectorAll('[data-step]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var next = Math.max(0, Math.min(20, qty[i] + Number(btn.getAttribute('data-step'))));
          if (next === qty[i]) return;
          qty[i] = next;
          refresh();
          bump(li.querySelector('output'));
          bump(totalOut);
          if (next > 0) error.hidden = true;
          done.hidden = true;
        });
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var items = [];
      lines.forEach(function (li, i) { if (qty[i]) items.push(qty[i] + ' ' + li.getAttribute('data-name').toLowerCase()); });
      if (!items.length) { error.hidden = false; done.hidden = true; return; }
      var name = form.elements.name.value.trim();
      var pick = when ? when.options[when.selectedIndex].textContent.toLowerCase() : 'as soon as it is ready';
      done.textContent = (name ? name + ', your' : 'Your') + ' order of ' + items.join(', ') + ' comes to ' + money(refresh()) +
        ', for pick-up ' + pick + '. This is a sample site, so nothing was sent and nothing is cooking.';
      done.hidden = false;
    });
    refresh();
  }

  // call buttons open a panel with the number instead of dialling
  var dialog = document.querySelector('[data-call-dialog]');
  var opener = null;
  document.querySelectorAll('[data-call]').forEach(function (btn) {
    btn.addEventListener('click', function () { opener = btn; if (dialog && dialog.showModal) dialog.showModal(); });
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
      mapsNote.textContent = 'On the real site this opens directions in your map app. This is a sample, and Market Row is made up.';
    });
  }
})();
