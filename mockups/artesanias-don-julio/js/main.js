/* Artesanías Don Julio: WhatsApp messages for a craft question and for planning a hike. */
(function () {
  var NUM = '50375391876';
  var craft = document.getElementById('ask-craft');
  if (craft) craft.href = 'https://wa.me/' + NUM + '?text=' + encodeURIComponent('Hello Don Julio, I saw your website. Which handmade pieces do you have in the shop right now, and what are the prices?');

  var form = document.getElementById('plan');
  var send = document.getElementById('plan-send');
  var day = document.getElementById('day');
  if (!form || !send) return;
  day.min = new Date().toISOString().slice(0, 10);
  function update() {
    var pace = form.querySelector('input[name="pace"]:checked').value;
    var d = day.value ? new Date(day.value + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'a day to agree';
    var text = 'Hello Don Julio, I would like to go hiking with you on ' + d + '. We are ' + (form.people.value || 2) + ' people and would like ' + pace + '. Which route do you suggest, and what is the price?';
    send.href = 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(text);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
