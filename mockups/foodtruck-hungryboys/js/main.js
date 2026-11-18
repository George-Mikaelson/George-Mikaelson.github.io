/* HungryBoys: smoke rises once off the headline; the hire form checks the guest count on blur and
   on send, then opens the visitor's email app with a pre-written request. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var form = document.getElementById('ticket');
  var guests = document.getElementById('guests');
  var err = document.getElementById('guests-err');
  function valid() { var n = parseInt(guests.value, 10); return n >= 20; }
  function mark(ok) { guests.setAttribute('aria-invalid', String(!ok)); err.hidden = ok; }
  guests.addEventListener('blur', function () { if (guests.value) mark(valid()); });
  guests.addEventListener('input', function () { if (!err.hidden && valid()) mark(true); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valid()) { mark(false); guests.focus(); return; }
    var kind = document.getElementById('kind').value;
    var date = document.getElementById('date').value || 'date to be confirmed';
    var place = document.getElementById('place').value || 'town to be confirmed';
    var body = 'Hello HungryBoys,\n\nWe would like to hire the truck.\n\nOccasion: ' + kind + '\nDate: ' + date +
      '\nGuests: ' + guests.value + '\nTown: ' + place + '\n\nCould you send us a quote?\n\nThanks!';
    window.location.href = 'mailto:hungryboysfr@gmail.com?subject=' + encodeURIComponent('Truck hire: ' + kind + ', ' + guests.value + ' guests') + '&body=' + encodeURIComponent(body);
  });

  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
