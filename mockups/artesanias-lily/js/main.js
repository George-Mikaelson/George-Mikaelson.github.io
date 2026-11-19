/* Artesanías Lily: each tag opens WhatsApp with a question about that kind of piece;
   the hours line says if the shop is open now (El Salvador time). */
(function () {
  [].forEach.call(document.querySelectorAll('.tag[data-item]'), function (a) {
    var text = 'Hello Lily, I saw your website. Do you have ' + a.getAttribute('data-item') + ' today? What are the prices?';
    a.href = 'https://wa.me/50377006060?text=' + encodeURIComponent(text);
  });
  var now = document.getElementById('open-now');
  if (now) {
    var o = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'America/El_Salvador', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    var m = +o.hour * 60 + +o.minute;
    now.textContent = m >= 540 && m < 1020 ? 'Open now.' : 'Closed now, opens at 9am.';
  }
})();
