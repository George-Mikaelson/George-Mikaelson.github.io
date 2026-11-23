// Copy buttons for the payment addresses on pay.html.
(function () {
  // Each button names its address element in data-copy and the characters to check in
  // data-check. Buttons start hidden so visitors without JavaScript never see a dead control.
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var el = document.getElementById(btn.getAttribute('data-copy'));
    var status = btn.parentNode.querySelector('output');
    if (!el || !status) return;
    btn.hidden = false;
    btn.addEventListener('click', function () {
      var text = el.textContent.trim();
      function done(ok) {
        status.textContent = ok
          ? 'Copied. After you paste, check it ' + btn.getAttribute('data-check') + '.'
          : 'Copy did not work here. Select the address and copy it by hand.';
      }
      function fallback() {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        done(ok);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
      } else {
        fallback();
      }
    });
  });
})();
