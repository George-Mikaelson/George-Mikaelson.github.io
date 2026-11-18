/* Concept site script: one entrance sequence, today's hours, open/closed status.
   Times are computed in the venue's own time zone (data-tz on <body>). */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var DAY_INDEX = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

  function venueNow(tz) {
    var d = new Date();
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(d);
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      return { day: DAY_INDEX[o.weekday], min: parseInt(o.hour, 10) * 60 + parseInt(o.minute, 10) };
    } catch (err) {
      return { day: (d.getDay() + 6) % 7, min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function toMin(t) {
    var p = t.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function isOpenAt(slots, minute) {
    if (!slots) return false;
    return slots.split(',').some(function (s) {
      var ab = s.split('-');
      return minute >= toMin(ab[0]) && minute < toMin(ab[1]);
    });
  }

  function markToday(rows, today, label) {
    rows.forEach(function (row) {
      if (row.day !== today) return;
      row.el.classList.add('is-today');
      var th = row.el.querySelector('th');
      if (th && !th.querySelector('.today-tag')) {
        var tag = document.createElement('span');
        tag.className = 'today-tag';
        tag.textContent = label;
        th.appendChild(tag);
      }
    });
  }

  function collect(attr) {
    return Array.prototype.map.call(document.querySelectorAll('[' + attr + ']'), function (el) {
      return { el: el, day: parseInt(el.getAttribute(attr), 10), slots: el.getAttribute('data-slots') || '' };
    });
  }

  function init() {
    var body = document.body;
    var now = venueNow(body.getAttribute('data-tz'));
    var label = body.getAttribute('data-today') || 'Today';
    var rows = collect('data-day');
    markToday(rows, now.day, label);
    markToday(collect('data-kday'), now.day, label);

    var status = document.querySelector('.status');
    if (status && rows.length) {
      var open = rows.some(function (r) { return r.day === now.day && isOpenAt(r.slots, now.min); });
      status.querySelector('.status__text').textContent = status.getAttribute(open ? 'data-open' : 'data-closed');
      status.classList.add(open ? 'is-open' : 'is-closed');
      status.hidden = false;
    }

    /* Entrance: CSS hides [data-enter] only when motion is allowed; two frames let the
       browser paint the start state before the transition runs. */
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { root.classList.add('is-in'); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
