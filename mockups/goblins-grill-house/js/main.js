/* Goblin's Grill House: the wordmark glows once like a coal; the booking form writes an email. */
(function () {
  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-in'); });

  var form = document.getElementById('table-form');
  if (!form) return;
  var day = document.getElementById('day'), people = document.getElementById('people'), ev = document.getElementById('event');
  var hint = document.getElementById('hint'), send = document.getElementById('send');
  day.min = new Date().toISOString().slice(0, 10);
  function nice(v) { return new Date(v + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); }
  function update() {
    var when = form.querySelector('input[name="when"]:checked').value;
    var n = Math.max(1, parseInt(people.value, 10) || 1), ok = !!day.value;
    hint.textContent = ok ? 'A table for ' + n + ', ' + when + ' on ' + nice(day.value) + (ev.checked ? ', group event.' : '.') : 'Pick a date to continue.';
    var body = 'Hello,\n\nI would like a table for ' + n + ' at ' + when + ' on ' + (ok ? nice(day.value) : '...') + '.' +
      (ev.checked ? '\nIt is a group event. Can you tell me what you offer for groups?' : '') + '\n\nMy name:\nMy phone:\n\nThank you!';
    send.href = 'mailto:cathybasa3@gmail.com?subject=' + encodeURIComponent((ev.checked ? 'Group event' : 'Table') + ' at Goblin’s Grill House') + '&body=' + encodeURIComponent(body);
    send.setAttribute('aria-disabled', ok ? 'false' : 'true');
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  send.addEventListener('click', function (e) { if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); day.focus(); } });
  update();
})();
