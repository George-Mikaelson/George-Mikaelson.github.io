/* La Estância: open-now line (Porto Alegre time), copy-address button with a confirmation,
   poncho stripes weave in once. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var o = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
  var m = +o.hour * 60 + +o.minute;
  var now = document.getElementById('now');
  if (now) now.textContent = m >= 660 && m < 1320 ? 'We’re open right now.' : (m < 660 ? 'We open at 11am today.' : 'Closed for tonight. Back tomorrow at 11am.');

  var copy = document.getElementById('copy');
  var toast = document.getElementById('toast');
  var text = 'La Estância, Praia de Belas Shopping, store 2080, Av. Praia de Belas 1181, Porto Alegre - RS, 90110-000';
  if (copy) copy.addEventListener('click', function () {
    function done(ok) { toast.textContent = ok ? 'Address copied. Paste it into your maps or a message.' : 'Copy didn’t work here. Select the address above instead.'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else { done(false); }
  });

  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
