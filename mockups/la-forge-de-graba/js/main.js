/* La Forge de Graba: the temper strip warms up once when it scrolls into view; the commission form writes an email. */
(function () {
  var temper = document.querySelector('.temper');
  if (temper) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { temper.classList.add('is-in'); io.disconnect(); } }); }, { threshold: .3 });
      io.observe(temper);
    } else { temper.classList.add('is-in'); }
  }

  var form = document.getElementById('com-form');
  if (!form) return;
  var desc = document.getElementById('desc'), when = document.getElementById('when');
  var hint = document.getElementById('hint'), send = document.getElementById('send');
  function update() {
    var k = form.querySelector('input[name="k"]:checked'), ok = !!k;
    hint.textContent = ok ? 'Ready. Attach a photo or sketch to the email if you have one.' : 'Choose what it is first.';
    var body = 'Bonjour,\n\nI would like ' + (k ? k.value : '...') + '.\n' + (desc.value.trim() ? '\n' + desc.value.trim() + '\n' : '') +
      '\nTiming: ' + when.value + '\n\nName:\nPhone:\n\nMerci.';
    send.href = 'mailto:grabaistos@gmail.com?subject=' + encodeURIComponent('A piece from the forge') + '&body=' + encodeURIComponent(body);
    send.setAttribute('aria-disabled', ok ? 'false' : 'true');
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  send.addEventListener('click', function (e) { if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); form.querySelector('input[name="k"]').focus(); } });
  update();
})();
