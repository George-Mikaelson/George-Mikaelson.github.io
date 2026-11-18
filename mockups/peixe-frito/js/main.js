/* Peixe Frito: order slip. +/− steppers, a running count, and "Send on WhatsApp" opens a chat with
   the list already written. Also an evening status line in Brazil time. */
(function () {
  var WA = '5518997330252';
  var slip = document.getElementById('slip');
  var count = document.getElementById('count');
  var error = document.getElementById('error');
  var rows = Array.prototype.slice.call(slip.querySelectorAll('[data-item]'));

  function total() { return rows.reduce(function (n, r) { return n + +r.querySelector('output').value; }, 0); }
  function render() {
    var n = total();
    count.textContent = n === 0 ? 'Nothing on the slip yet.' : n + (n === 1 ? ' item' : ' items') + ' on the slip.';
    count.classList.remove('is-bump'); void count.offsetWidth; count.classList.add('is-bump');
    if (n > 0) error.hidden = true;
  }
  rows.forEach(function (r) {
    var out = r.querySelector('output');
    out.value = 0;
    r.querySelectorAll('.qty__b').forEach(function (b) {
      b.addEventListener('click', function () {
        out.value = Math.max(0, Math.min(20, +out.value + +b.getAttribute('data-step')));
        render();
      });
    });
  });

  slip.addEventListener('submit', function (e) {
    e.preventDefault();
    if (total() === 0) { error.hidden = false; return; }
    var how = slip.querySelector('input[name="how"]:checked').value;
    var lines = rows.filter(function (r) { return +r.querySelector('output').value > 0; })
      .map(function (r) { return r.querySelector('output').value + ' x ' + r.getAttribute('data-item'); });
    var text = 'Hi Peixe Frito! I would like to order (' + how + '):\n' + lines.join('\n');
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });

  var status = document.getElementById('status');
  if (status) {
    var o = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    var m = +o.hour * 60 + +o.minute;
    if (o.weekday === 'Mon') status.textContent = 'Closed on Mondays.';
    else status.textContent = m >= 1050 && m < 1380 ? 'Open now.' : (m < 1050 ? 'Opens later today.' : 'Closed for tonight.');
  }
})();
