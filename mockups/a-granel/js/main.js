/* A Granel: products and weights go onto a receipt; the receipt becomes a WhatsApp order. */
(function () {
  var form = document.getElementById('add-form');
  if (!form) return;
  var item = document.getElementById('item'), error = document.getElementById('error');
  var lines = document.getElementById('lines'), empty = document.getElementById('empty'), send = document.getElementById('send');
  var list = [];

  function render() {
    lines.innerHTML = '';
    list.forEach(function (l, i) {
      var li = document.createElement('li');
      var name = document.createElement('span'); name.textContent = l.name;
      var w = document.createElement('span'); w.textContent = l.w;
      var del = document.createElement('button'); del.type = 'button'; del.textContent = '×'; del.setAttribute('aria-label', 'Remove ' + l.name);
      del.addEventListener('click', function () { list.splice(i, 1); render(); item.focus(); });
      li.appendChild(name); li.appendChild(w); li.appendChild(del); lines.appendChild(li);
    });
    empty.hidden = list.length > 0;
    var msg = 'Hola! I would like to order for pickup:\n' + list.map(function (l) { return '- ' + l.name + ', ' + l.w; }).join('\n') + '\nWhen can I collect it? Thank you!';
    send.href = 'https://wa.me/5493813365504?text=' + encodeURIComponent(msg);
    send.setAttribute('aria-disabled', list.length ? 'false' : 'true');
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = item.value.trim();
    if (!name) { error.textContent = 'Write a product name first.'; item.focus(); return; }
    list.push({ name: name, w: form.querySelector('input[name="w"]:checked').value });
    item.value = ''; error.textContent = ''; render(); item.focus();
  });
  item.addEventListener('input', function () { if (item.value.trim()) error.textContent = ''; });
  send.addEventListener('click', function (e) { if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); item.focus(); } });
  render();
})();
