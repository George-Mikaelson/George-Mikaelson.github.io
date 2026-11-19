/* The Glass House: one light glint across the glass on load; the date form counts nights and writes the email. */
(function () {
  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('is-lit'); }); });

  var form = document.getElementById('stay-form');
  if (!form) return;
  var arrive = document.getElementById('in'), leave = document.getElementById('out');
  var guests = document.getElementById('guests'), pickup = document.getElementById('pickup');
  var nights = document.getElementById('nights'), send = document.getElementById('send');
  var today = new Date().toISOString().slice(0, 10);
  arrive.min = today; leave.min = today;

  function nice(v) { return new Date(v + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' }); }
  function update() {
    if (arrive.value) leave.min = arrive.value;
    var n = arrive.value && leave.value ? Math.round((new Date(leave.value) - new Date(arrive.value)) / 86400000) : 0;
    var ok = n > 0;
    nights.textContent = ok ? n + (n === 1 ? ' night' : ' nights') + ', ' + nice(arrive.value) + ' to ' + nice(leave.value) + '.' :
      (arrive.value && leave.value ? 'Departure must be after arrival.' : 'Pick an arrival and a departure date.');
    send.setAttribute('aria-disabled', ok ? 'false' : 'true');
    var body = 'Hello,\n\nIs the Glass House free from ' + (arrive.value ? nice(arrive.value) : '...') + ' to ' + (leave.value ? nice(leave.value) : '...') +
      ' (' + (ok ? n + ' nights' : '...') + ') for ' + (guests.value || 2) + ' guests? What is the price if we book with you directly?' +
      (pickup.checked ? '\n\nWe would also need a pickup in Mambajao.' : '') + '\n\nThank you.\n';
    send.href = 'mailto:timetim@gmail.com?subject=' + encodeURIComponent('Dates at the Glass House') + '&body=' + encodeURIComponent(body);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  send.addEventListener('click', function (e) { if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); arrive.focus(); } });
  update();
})();
