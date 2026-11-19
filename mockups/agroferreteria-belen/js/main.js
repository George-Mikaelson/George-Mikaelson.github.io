/* Agroferretería Belén: mark this month on the farming year (El Salvador time) and
   build the WhatsApp stock question. */
(function () {
  var month = +new Intl.DateTimeFormat('en-US', { timeZone: 'America/El_Salvador', month: 'numeric' }).format(new Date()) - 1;
  var cells = document.querySelectorAll('#months li');
  var now = document.getElementById('now-month');
  if (cells[month]) {
    cells[month].classList.add('is-now');
    cells[month].setAttribute('aria-current', 'date');
    var wet = cells[month].classList.contains('wet');
    if (now) now.textContent = 'Now: ' + new Date(2026, month, 1).toLocaleDateString('en-GB', { month: 'long' }) + ', ' + (wet ? 'rainy season' : 'dry season') + '.';
  }

  var form = document.getElementById('check-form');
  var wa = document.getElementById('wa');
  if (!form || !wa) return;
  function update() {
    var kind = form.querySelector('input[name="kind"]:checked').value;
    var detail = form.detail.value.trim();
    var text = 'Hello Agroferretería Belén, do you have ' + kind + ' in stock?' + (detail ? ' ' + detail + '.' : '') + ' What is the price?';
    wa.href = 'https://wa.me/50361902523?text=' + encodeURIComponent(text);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
