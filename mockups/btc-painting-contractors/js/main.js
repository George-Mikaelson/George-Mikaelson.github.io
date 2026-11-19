/* BTC Painting Contractors: the fan deck opens once on load; the quote form writes a text message. */
(function () {
  var fan = document.querySelector('.fan');
  if (fan) requestAnimationFrame(function () { requestAnimationFrame(function () { fan.classList.add('is-open'); }); });

  var form = document.getElementById('quote-form');
  if (!form) return;
  var sms = document.getElementById('send-sms');
  var mail = document.getElementById('send-mail');
  var preview = document.getElementById('preview');
  var error = document.getElementById('quote-error');

  function jobs() {
    return [].slice.call(form.querySelectorAll('input[name="job"]:checked')).map(function (i) { return i.value; });
  }
  function message() {
    var j = jobs();
    var text = 'Hi, I\'d like a painting quote';
    if (j.length) text += ' for: ' + j.join(', ');
    text += '.';
    var suburb = form.suburb.value.trim();
    if (suburb) text += ' Suburb: ' + suburb + '.';
    text += ' Timing: ' + form.when.value.toLowerCase() + '.';
    var notes = form.notes.value.trim();
    if (notes) text += ' ' + notes;
    return text;
  }
  function update() {
    var text = message();
    preview.textContent = text;
    sms.href = 'sms:+64212769863?body=' + encodeURIComponent(text);
    mail.href = 'mailto:btcpaintingnz@gmail.com?subject=' + encodeURIComponent('Painting quote request') + '&body=' + encodeURIComponent(text);
    if (jobs().length) error.hidden = true;
  }
  function guard(e) {
    if (!jobs().length) { e.preventDefault(); error.hidden = false; form.querySelector('input[name="job"]').focus(); }
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  sms.addEventListener('click', guard);
  mail.addEventListener('click', guard);
  update();
})();
