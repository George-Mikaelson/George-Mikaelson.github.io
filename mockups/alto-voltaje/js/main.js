/* Alto Voltaje: the cable draws itself once across the plan; the quote form writes a WhatsApp message for César. */
(function () {
  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-in'); });

  var form = document.getElementById('quote-form');
  if (!form) return;
  var notes = document.getElementById('notes'), where = document.getElementById('where');
  var hint = document.getElementById('hint'), wa = document.getElementById('wa');
  function update() {
    var job = form.querySelector('input[name="job"]:checked');
    var ok = !!job;
    hint.textContent = ok ? 'Next: open WhatsApp and attach a photo before you send.' : 'Pick the job first.';
    var msg = 'Hola César! I need a quote for ' + (job ? job.value : '...') + (where.value.trim() ? ' in ' + where.value.trim() : '') + '.' +
      (notes.value.trim() ? '\n' + notes.value.trim() : '') + '\nI am sending a photo too.';
    wa.href = 'https://wa.me/5493815564285?text=' + encodeURIComponent(msg);
    wa.setAttribute('aria-disabled', ok ? 'false' : 'true');
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  wa.addEventListener('click', function (e) {
    if (wa.getAttribute('aria-disabled') === 'true') { e.preventDefault(); form.querySelector('input[name="job"]').focus(); }
  });
  update();
})();
