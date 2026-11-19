/* Airborn Paddling: the booking form writes an email request. The date field starts tomorrow. */
(function () {
  var form = document.getElementById('book-form');
  if (!form) return;
  var day = document.getElementById('day');
  var send = document.getElementById('book-send');
  var err = document.getElementById('day-error');
  var t = new Date(); t.setDate(t.getDate() + 1);
  day.min = t.toISOString().slice(0, 10);

  function body() {
    var d = day.value ? new Date(day.value + 'T12:00:00').toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long' }) : '(day to choose)';
    return 'Kia ora Airborn,\n\nI would like to book: ' + form.session.value + '\nDay: ' + d +
      '\nAdults: ' + (form.adults.value || 0) + ', kids: ' + (form.kids.value || 0) +
      '\nLaunch point: ' + form.launch.value + '\n\nWhat times do you have, and what is the price?\n';
  }
  function update() {
    send.href = 'mailto:airbornpaddling@gmail.com?subject=' + encodeURIComponent('Paddle booking: ' + form.session.value) + '&body=' + encodeURIComponent(body());
    if (day.value) err.hidden = true;
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  send.addEventListener('click', function (e) {
    if (!day.value) { e.preventDefault(); err.hidden = false; day.focus(); }
  });
  update();
})();
