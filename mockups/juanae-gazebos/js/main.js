/* JuanaE: the canopy unfolds once; the date form writes a WhatsApp message for Victoria. */
(function () {
  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-in'); });

  var form = document.getElementById('date-form');
  if (!form) return;
  var day = document.getElementById('day'), kind = document.getElementById('kind'), place = document.getElementById('place');
  var hint = document.getElementById('hint'), wa = document.getElementById('wa');
  day.min = new Date().toISOString().slice(0, 10);

  function nice(v) { return new Date(v + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); }
  function update() {
    var guests = form.querySelector('input[name="guests"]:checked').value;
    var ok = !!day.value;
    hint.textContent = ok ? kind.value + ' on ' + nice(day.value) + ', ' + guests + ' guests.' : 'Pick a date to continue.';
    var msg = 'Hola Victoria! Do you have a gazebo free on ' + (ok ? nice(day.value) : '...') + '? It is a ' + kind.value.toLowerCase() +
      ' for ' + guests + ' guests' + (place.value.trim() ? ', in ' + place.value.trim() : '') + '. What would it cost, with delivery and set-up?';
    wa.href = 'https://wa.me/5493815620851?text=' + encodeURIComponent(msg);
    wa.setAttribute('aria-disabled', ok ? 'false' : 'true');
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  wa.addEventListener('click', function (e) { if (wa.getAttribute('aria-disabled') === 'true') { e.preventDefault(); day.focus(); } });
  update();
})();
