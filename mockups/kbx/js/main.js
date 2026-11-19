/* KBX: the five words are toggles; the picks carry into the brief, which becomes an email. Surat clock in the header. */
(function () {
  var clock = document.getElementById('clock');
  function tick() {
    if (!clock) return;
    clock.textContent = 'Surat, ' + new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST';
  }
  tick(); setInterval(tick, 30000);

  var words = document.querySelectorAll('.word');
  var picked = document.getElementById('picked'), briefPicked = document.getElementById('brief-picked');
  function chosen() { return [].filter.call(words, function (w) { return w.getAttribute('aria-pressed') === 'true'; }).map(function (w) { return w.textContent; }); }
  function sync() {
    var c = chosen();
    picked.textContent = c.length ? 'You picked ' + c.join(' + ') + '.' : 'Nothing picked yet.';
    briefPicked.textContent = c.length ? 'You need: ' + c.join(' + ') + '.' : 'You need: pick at the top, or just describe it.';
    document.querySelectorAll('.defs div').forEach(function (d) {
      d.classList.toggle('is-on', c.map(function (x) { return x.toLowerCase(); }).indexOf(d.getAttribute('data-s')) > -1);
    });
  }
  words.forEach(function (w) {
    w.addEventListener('click', function () { w.setAttribute('aria-pressed', w.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); sync(); });
  });

  var form = document.getElementById('brief-form'), about = document.getElementById('about');
  var when = document.getElementById('when'), error = document.getElementById('error');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var c = chosen();
    if (!c.length && !about.value.trim()) { error.textContent = 'Pick a service at the top or describe the job.'; about.focus(); return; }
    error.textContent = '';
    var body = 'Hello,\n\n' + (c.length ? 'I need: ' + c.join(' + ') + '\n' : '') + (about.value.trim() ? 'What it is for: ' + about.value.trim() + '\n' : '') +
      'Timing: ' + when.value + '\n\nName:\nCompany:\nPhone:\n';
    window.location.href = 'mailto:karanjbhatia@gmail.com?subject=' + encodeURIComponent('Brief for KBX' + (c.length ? ': ' + c.join(' + ') : '')) + '&body=' + encodeURIComponent(body);
  });
  about.addEventListener('input', function () { if (about.value.trim()) error.textContent = ''; });
  sync();
})();
