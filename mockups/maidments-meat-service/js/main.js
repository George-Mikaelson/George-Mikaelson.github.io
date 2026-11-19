/* Maidment's: the sign drops in once; ticket buttons add lines with an amount field; the order becomes an email. */
(function () {
  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-in'); });

  var form = document.getElementById('order-form');
  if (!form) return;
  var amounts = document.getElementById('amounts'), day = document.getElementById('day'), name = document.getElementById('name');
  var hint = document.getElementById('hint'), send = document.getElementById('send');
  day.min = new Date().toISOString().slice(0, 10);

  function slug(t) { return 'amt-' + t.toLowerCase(); }
  document.querySelectorAll('.ticket').forEach(function (t) {
    t.addEventListener('click', function () {
      var on = t.getAttribute('aria-pressed') !== 'true';
      t.setAttribute('aria-pressed', on ? 'true' : 'false');
      var id = slug(t.textContent), existing = document.getElementById(id);
      if (on && !existing) {
        var label = document.createElement('label'); label.className = 'amount'; label.id = id;
        var span = document.createElement('span'); span.textContent = t.textContent + ': how much?';
        var input = document.createElement('input'); input.type = 'text'; input.placeholder = 'e.g. 1 kg, or 6 chops'; input.setAttribute('data-item', t.textContent);
        label.appendChild(span); label.appendChild(input); amounts.appendChild(label); input.focus();
      } else if (!on && existing) { existing.remove(); }
      update();
    });
  });
  function nice(v) { return new Date(v + 'T12:00:00').toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }); }
  function update() {
    var lines = [].map.call(amounts.querySelectorAll('input'), function (i) { return '- ' + i.getAttribute('data-item') + (i.value.trim() ? ': ' + i.value.trim() : ''); });
    var ok = lines.length > 0;
    hint.textContent = ok ? lines.length + (lines.length === 1 ? ' item' : ' items') + (day.value ? ', pickup ' + nice(day.value) + '.' : '. Add a pickup day if you know it.') : 'Tap at least one item.';
    var body = 'Hello,\n\nCould I order the following' + (day.value ? ' for pickup on ' + nice(day.value) : '') + '?\n' + lines.join('\n') +
      '\n\nName: ' + (name.value.trim() || '') + '\nPhone:\n\nThanks!';
    send.href = 'mailto:maidmentsmeats@gmail.com?subject=' + encodeURIComponent('Order for pickup') + '&body=' + encodeURIComponent(body);
    send.setAttribute('aria-disabled', ok ? 'false' : 'true');
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  send.addEventListener('click', function (e) { if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); document.querySelector('.ticket').focus(); } });
  update();
})();
