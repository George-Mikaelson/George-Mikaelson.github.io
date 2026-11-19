/* AVA Migration Agency: folder tabs (arrow keys move between them) and the assessment email.
   Without JavaScript all three sheets show one under another. */
(function () {
  document.documentElement.classList.add('js');
  var tabs = [].slice.call(document.querySelectorAll('[role="tab"]'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0];
      if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });
  if (tabs.length) select(tabs[0]);

  var form = document.getElementById('assess');
  var send = document.getElementById('assess-send');
  if (!form || !send) return;
  function update() {
    var where = form.querySelector('input[name="where"]:checked').value;
    var goal = form.querySelector('input[name="goal"]:checked').value;
    var exp = form.expiry.value ? new Date(form.expiry.value + 'T12:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : 'no current visa / not sure';
    var name = form.name.value.trim();
    var body = 'Hello Ian,\n\nI would like a visa assessment.\n\nWhere I am now: ' + where + '\nWhat I want to do: ' + goal + '\nCurrent visa ends: ' + exp + '\n\nPlease let me know when we can talk.\n\n' + (name || '') + '\n';
    send.href = 'mailto:avamigration@gmail.com?subject=' + encodeURIComponent('Visa assessment request') + '&body=' + encodeURIComponent(body);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
