/* Coeur de Provence: shutters open once on load; the date form counts nights and writes the email request. */
(function () {
  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('is-open'); }); });

  var form = document.getElementById('book-form');
  if (!form) return;
  var arrive = document.getElementById('in'), leave = document.getElementById('out');
  var nights = document.getElementById('nights'), send = document.getElementById('book-send');
  var today = new Date().toISOString().slice(0, 10);
  arrive.min = today; leave.min = today;

  function nice(v) { return new Date(v + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }); }
  function update() {
    if (arrive.value) leave.min = arrive.value;
    var n = arrive.value && leave.value ? Math.round((new Date(leave.value) - new Date(arrive.value)) / 86400000) : 0;
    var ok = n > 0;
    nights.textContent = ok ? n + (n === 1 ? ' night' : ' nights') + ', ' + nice(arrive.value) + ' to ' + nice(leave.value) + '.' :
      (arrive.value && leave.value ? 'Departure must be after arrival.' : 'Pick an arrival and a departure date.');
    send.setAttribute('aria-disabled', ok ? 'false' : 'true');
    var body = 'Bonjour,\n\nIs the apartment on the Place du Marché free from ' + (arrive.value ? nice(arrive.value) : '...') + ' to ' + (leave.value ? nice(leave.value) : '...') +
      ' (' + (ok ? n + ' nights' : '...') + ') for ' + (form.guests.value || 2) + ' guests? What would the price be if I book direct?\n\nThank you.\n';
    send.href = 'mailto:nascostobtc@pm.me?subject=' + encodeURIComponent('Booking request, Coeur de Provence') + '&body=' + encodeURIComponent(body);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  send.addEventListener('click', function (e) { if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); arrive.focus(); } });
  update();
})();
