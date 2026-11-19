/* Boutique Room by Fer: the key tag swings once; dates build a WhatsApp message and an email to Fer. */
(function () {
  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-in'); });

  var arrive = document.getElementById('in'), leave = document.getElementById('out'), guests = document.getElementById('guests');
  var nights = document.getElementById('nights'), wa = document.getElementById('wa'), mail = document.getElementById('mail');
  if (!arrive) return;
  var today = new Date().toISOString().slice(0, 10);
  arrive.min = today; leave.min = today;

  function nice(v) { return new Date(v + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' }); }
  function update() {
    if (arrive.value) leave.min = arrive.value;
    var n = arrive.value && leave.value ? Math.round((new Date(leave.value) - new Date(arrive.value)) / 86400000) : 0;
    var ok = n > 0;
    nights.textContent = ok ? n + (n === 1 ? ' night' : ' nights') + ', ' + nice(arrive.value) + ' to ' + nice(leave.value) + '.' :
      (arrive.value && leave.value ? 'Departure must be after arrival.' : 'Pick an arrival and a departure date.');
    var msg = 'Hola Fer! Is the room at Monteagudo 633 free from ' + (arrive.value ? nice(arrive.value) : '...') + ' to ' +
      (leave.value ? nice(leave.value) : '...') + ' (' + (ok ? n + ' nights' : '...') + ') for ' + guests.value + (guests.value === '1' ? ' guest' : ' guests') +
      '? What would the price be? Thank you!';
    wa.href = 'https://wa.me/5493816242212?text=' + encodeURIComponent(msg);
    mail.href = 'mailto:fer.bustamante033@gmail.com?subject=' + encodeURIComponent('Room at Monteagudo 633') + '&body=' + encodeURIComponent(msg);
    [wa, mail].forEach(function (b) { b.setAttribute('aria-disabled', ok ? 'false' : 'true'); });
  }
  ['input', 'change'].forEach(function (ev) { document.getElementById('book-form').addEventListener(ev, update); });
  [wa, mail].forEach(function (b) { b.addEventListener('click', function (e) { if (b.getAttribute('aria-disabled') === 'true') { e.preventDefault(); arrive.focus(); } }); });
  update();
})();
