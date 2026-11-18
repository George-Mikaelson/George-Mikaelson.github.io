// The Amber Room sample site: open-now status (late nights run past midnight), today's row in the
// hours table, menu tabs, the booth request form and the call panel. Nothing is sent anywhere.
(function () {
  'use strict';

  var now = new Date();
  var day = now.getDay();
  var mins = now.getHours() * 60 + now.getMinutes();
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function toMinutes(t) { var p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function clock(t) { return t === '00:00' ? 'midnight' : t; }

  var rows = {};
  document.querySelectorAll('.week tr[data-day]').forEach(function (tr) { rows[tr.getAttribute('data-day')] = tr; });
  if (rows[day]) rows[day].classList.add('is-today');

  function span(tr) {
    if (!tr || !tr.hasAttribute('data-open')) return null;
    var o = toMinutes(tr.getAttribute('data-open'));
    var c = toMinutes(tr.getAttribute('data-close'));
    if (c <= o) c += 1440; // closes after midnight
    return { open: o, close: c, openText: tr.getAttribute('data-open'), closeText: clock(tr.getAttribute('data-close')) };
  }

  var status = document.querySelector('[data-status]');
  if (status) {
    var today = span(rows[day]);
    var yesterday = span(rows[(day + 6) % 7]);
    var text;
    if (yesterday && mins < yesterday.close - 1440) {
      text = 'Open now, until ' + yesterday.closeText;
    } else if (today && mins >= today.open) {
      text = 'Open now, until ' + today.closeText;
    } else if (today) {
      text = 'Closed now. Doors open tonight at ' + today.openText;
    } else {
      for (var i = 1; i <= 7; i++) {
        var next = span(rows[(day + i) % 7]);
        if (next) { text = 'Closed tonight. Open ' + (i === 1 ? 'tomorrow' : DAYS[(day + i) % 7]) + ' from ' + next.openText; break; }
      }
    }
    status.textContent = text;
    status.classList.toggle('is-open', text.indexOf('Open now') === 0);
  }

  // menu tabs: arrow keys move between tabs, only the chosen panel is shown
  var tablist = document.querySelector('[data-tabs]');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !on;
        if (on) {
          panel.classList.remove('is-entering');
          void panel.offsetWidth;
          panel.classList.add('is-entering');
        }
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var to = null;
        if (e.key === 'ArrowRight') to = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') to = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') to = tabs[0];
        if (e.key === 'End') to = tabs[tabs.length - 1];
        if (to) { e.preventDefault(); select(to, true); }
      });
    });
    select(tabs[0], false);
  }

  // booth request
  var form = document.querySelector('[data-booking]');
  if (form) {
    var date = form.elements.date;
    var name = form.elements.name;
    var error = form.querySelector('[data-error]');
    var done = form.querySelector('.done');
    function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
    var first = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    while (!span(rows[first.getDay()])) first.setDate(first.getDate() + 1);
    date.min = iso(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    date.value = iso(first);

    function problem() {
      if (!date.value) return { field: date, text: 'Pick a date for the booth.' };
      var d = new Date(date.value + 'T12:00:00');
      if (!span(rows[d.getDay()])) return { field: date, text: 'The bar is closed on ' + DAYS[d.getDay()] + 's. Pick a Wednesday to Sunday.' };
      if (name.value.trim() === '') return { field: name, text: 'Add a name so the booth can be held for you.' };
      return null;
    }
    function clear() {
      [date, name].forEach(function (f) { f.removeAttribute('aria-invalid'); });
      error.hidden = true;
    }
    [date, name].forEach(function (f) { f.addEventListener('input', function () { if (!problem()) clear(); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clear();
      var p = problem();
      if (p) {
        p.field.setAttribute('aria-invalid', 'true');
        error.textContent = p.text;
        error.hidden = false;
        p.field.focus();
        return;
      }
      var d = new Date(date.value + 'T12:00:00');
      done.textContent = 'Booth for ' + form.elements.guests.value + ' requested for ' + DAYS[d.getDay()] + ' ' + d.getDate() + ' ' +
        d.toLocaleString('en-GB', { month: 'long' }) + ' at ' + form.elements.time.value + ', name ' + name.value.trim() +
        '. This is a sample site, so nothing was sent and no booth is held.';
      done.hidden = false;
    });
  }

  // call panel
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
      mapsNote.textContent = 'On the real site this opens walking directions in your map app. This is a sample, and Cooper Lane is made up.';
    });
  }
})();
