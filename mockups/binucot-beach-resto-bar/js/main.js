/* Binucot Beach Resto Bar: works out tonight's sunset for Ferrol (NOAA approximation, Philippine time),
   says whether the bar is open, and writes the booking text message. */
(function () {
  var LAT = 12.3100189, LON = 121.9241775, OFFSET = 8; // Asia/Manila, no daylight saving

  function sunsetUTC(date) {
    var rad = Math.PI / 180;
    var start = Date.UTC(date.getUTCFullYear(), 0, 0);
    var n = Math.floor((date - start) / 86400000);
    var g = 2 * Math.PI / 365 * (n - 1 + 0.5);
    var eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    var ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(LAT * rad) * Math.cos(decl)) - Math.tan(LAT * rad) * Math.tan(decl)) / rad;
    return 720 - 4 * (LON - ha) - eqt; // minutes after UTC midnight
  }
  function clock(mins) {
    mins = ((Math.round(mins) % 1440) + 1440) % 1440;
    var h = Math.floor(mins / 60), m = mins % 60;
    return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + (h < 12 ? 'am' : 'pm');
  }
  var nowUTC = new Date();
  var localMins = (nowUTC.getUTCHours() * 60 + nowUTC.getUTCMinutes() + OFFSET * 60) % 1440;
  var set = sunsetUTC(nowUTC) + OFFSET * 60;
  var out = document.getElementById('sunset');
  var note = document.getElementById('sunset-note');
  if (out) out.textContent = clock(set);
  if (note) {
    if (localMins > set + 30) note.textContent = 'Tonight’s has gone. Tomorrow’s is around the same time.';
    else if (localMins > set - 90) note.textContent = 'That’s soon. Grab a table facing the water.';
    else note.textContent = 'The bar is open until 9pm.';
  }
  var open = document.getElementById('open-now');
  if (open) open.textContent = localMins >= 480 && localMins < 1260 ? 'Open now.' : 'Closed now, opens at 8am.';

  var form = document.getElementById('book-form');
  if (!form) return;
  var sms = document.getElementById('send-sms');
  var mail = document.getElementById('send-mail');
  function update() {
    var what = form.querySelector('input[name="what"]:checked').value;
    var d = form.date.value ? new Date(form.date.value + 'T12:00:00').toLocaleDateString('en-PH', { weekday: 'long', day: 'numeric', month: 'long' }) : 'a date to agree';
    var text = 'Hi Binucot Beach, I would like to book ' + what + ' for ' + (form.people.value || 2) + ' on ' + d + '. Is it available, and what is the price?';
    sms.href = 'sms:+639472075504?body=' + encodeURIComponent(text);
    mail.href = 'mailto:binucot.beach@yahoo.com?subject=' + encodeURIComponent('Booking: ' + what) + '&body=' + encodeURIComponent(text);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
