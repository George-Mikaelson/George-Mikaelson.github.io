/* Steam Punk Cafe: gauge needle sweeps once on load; a five-minute Triple X practice clock;
   open-now line in Philippine time. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var face = document.getElementById('face');
  var status = document.getElementById('clock-status');
  var start = document.getElementById('start');
  var reset = document.getElementById('reset');
  var clock = face && face.closest('.clock');
  var LIMIT = 300, left = LIMIT, timer = null, endAt = 0;

  function show(s) { face.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function stop() { clearInterval(timer); timer = null; }
  function tick() {
    left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
    show(left);
    if (left === 60) status.textContent = 'One minute left. Keep going.';
    if (left === 0) { stop(); clock.classList.add('is-done'); status.textContent = 'Time’s up. Did the burger win?'; start.textContent = 'Start the clock'; }
  }
  if (start) start.addEventListener('click', function () {
    if (timer) { stop(); status.textContent = 'Paused at ' + face.textContent + '.'; start.textContent = 'Resume'; return; }
    if (left === 0) left = LIMIT;
    clock.classList.remove('is-done');
    endAt = Date.now() + left * 1000;
    timer = setInterval(tick, 250);
    status.textContent = 'Clock running. Five minutes, half a kilo.';
    start.textContent = 'Pause';
  });
  if (reset) reset.addEventListener('click', function () {
    stop(); left = LIMIT; show(left); clock.classList.remove('is-done');
    status.textContent = 'Ready when you are.'; start.textContent = 'Start the clock';
  });

  var now = document.getElementById('now');
  if (now) {
    var o = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    var m = +o.hour * 60 + +o.minute;
    now.textContent = m >= 660 && m < 1380 ? 'Open now.' : 'Closed now, back at 11am.';
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-in'); }); });
})();
