/* Artti Pet: open/closed in Brazil time; the booking form fills a pet's card live, and the card's button sends the email. */
(function () {
  var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
  var dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  var min = parseInt(get('hour'), 10) % 24 * 60 + parseInt(get('minute'), 10);
  var open = document.getElementById('open');
  if (open) open.textContent = dow >= 1 && dow <= 6 && min >= 480 && min < 1080 ? 'Open now, until 18:00' : 'Closed now. Mon–Sat, 8:00–18:00';

  var form = document.getElementById('pet-form');
  if (!form) return;
  var pname = document.getElementById('pname'), day = document.getElementById('day'), time = document.getElementById('time');
  var hint = document.getElementById('hint'), send = document.getElementById('send'), card = document.querySelector('.card');
  for (var m = 480; m <= 960; m += 60) { var o = document.createElement('option'); o.textContent = (m / 60 < 10 ? '0' : '') + m / 60 + ':00'; time.appendChild(o); }
  day.min = new Date().toISOString().slice(0, 10);
  function val(n) { return form.querySelector('input[name="' + n + '"]:checked').value; }
  function nice(v) { return new Date(v + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
  function update() {
    var sunday = day.value && new Date(day.value + 'T12:00:00').getDay() === 0;
    var ok = !!day.value && !sunday;
    document.getElementById('c-kind').textContent = val('kind');
    document.getElementById('c-name').textContent = pname.value.trim() || 'Your pet';
    document.getElementById('c-size').textContent = val('size').charAt(0).toUpperCase() + val('size').slice(1);
    document.getElementById('c-svc').textContent = val('svc');
    document.getElementById('c-when').textContent = ok ? nice(day.value) + ', ' + time.value : 'Pick a day';
    hint.textContent = sunday ? 'The shop is closed on Sundays. Pick another day.' : (ok ? 'Your card is ready to send.' : 'Pick a day to continue.');
    var body = 'Olá! I would like to book a ' + val('svc').toLowerCase() + ' for ' + (pname.value.trim() || 'my pet') + ', a ' + val('size') + ' ' + val('kind').toLowerCase() +
      ', on ' + (ok ? nice(day.value) + ' at ' + time.value : '...') + '. Is that time free, and what is the price?\n\nMy name:\nMy phone:\n\nObrigado!';
    send.href = 'mailto:arttipet@gmail.com?subject=' + encodeURIComponent('Bath booking for ' + (pname.value.trim() || 'my pet')) + '&body=' + encodeURIComponent(body);
    send.setAttribute('aria-disabled', ok ? 'false' : 'true');
    card.classList.remove('is-bump'); void card.offsetWidth; card.classList.add('is-bump');
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  send.addEventListener('click', function (e) { if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); day.focus(); } });
  update();
})();
