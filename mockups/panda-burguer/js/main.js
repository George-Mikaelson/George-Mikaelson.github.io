/* Panda Burguer: speech bubble pops once, and the order box says whether the grill is on (Brazil time). */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var status = document.getElementById('status');
  if (status) {
    var o = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    var m = +o.hour * 60 + +o.minute;
    status.textContent = m >= 1110 && m < 1410 ? 'The grill is on right now.' : 'Grill’s off. Back at 6.30pm.';
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
