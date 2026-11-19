/* Acácio Tattoo: years since 1999, open/closed line (Brasília time), and the WhatsApp quote request. */
(function () {
  var parts = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', year: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
  var year = +parts.year;
  var yearNow = document.getElementById('year-now');
  var years = document.getElementById('years');
  if (yearNow) yearNow.textContent = String(year);
  if (years) years.textContent = String(year - 1999);

  var open = document.getElementById('open-now');
  if (open) {
    var m = +parts.hour * 60 + +parts.minute, d = parts.weekday;
    var close = d === 'Sun' ? 0 : d === 'Sat' ? 900 : 1020;
    open.textContent = close && m >= 540 && m < close ? 'Open now.' : 'Closed now.';
  }

  var form = document.getElementById('quote-form');
  var send = document.getElementById('quote-send');
  if (!form || !send) return;
  function update() {
    var place = form.querySelector('input[name="place"]:checked').value;
    var size = form.querySelector('input[name="size"]:checked').value;
    var idea = form.idea.value.trim();
    var text = 'Hi Acácio, I would like a quote for a tattoo. Where: ' + place + '. Size: ' + size + '.' + (idea ? ' Idea: ' + idea + '.' : '') + ' I will send a reference image here.';
    send.href = 'https://wa.me/5547992791134?text=' + encodeURIComponent(text);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
