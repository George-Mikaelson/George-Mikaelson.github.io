(function () {
  'use strict';

  var THREE = window.THREE;
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;

  var COLORS = {
    paint: 0x1f5a50, plaster: 0xd3c2a3, trim: 0xe6d9bd, roof: 0x3a3f4f, door: 0x163a33,
    metal: 0x262b38, stripeA: 0xece3cf, stripeB: 0x2f7f6d, pavement: 0x3a4259, plinth: 0x20283e,
    bush: 0x3d7356, wood: 0x6b4a35, pin: 0xff6b57, warm: 0xffb366, sky: 0x1a2238
  };

  // camera and object states per section; sxL/syL frame the scene on wide screens, sxP/syP on tall ones
  var KEYS = {
    hero: { az: -0.62, el: 0.27, dist: 12.6, tx: 0, ty: 1.55, tz: -0.2, explode: 0, phone: 0, door: 0, dscale: 1, sxL: 0.2, syL: 0.02, sxP: 0, syP: -0.3 },
    includes: { az: -0.5, el: 0.2, dist: 18, tx: 0, ty: 2.9, tz: -0.4, explode: 1, phone: 0, door: 0, dscale: 1, sxL: 0.22, syL: 0, sxP: 0, syP: 0.2 },
    prices: { az: -0.32, el: 0.1, dist: 23, tx: 0, ty: 3.5, tz: -1.4, explode: 0, phone: 1, door: 0, dscale: 0.9, sxL: -0.22, syL: 0, sxP: 0, syP: 0.24 },
    process: { az: 0.2, el: 0.14, dist: 22.5, tx: 0, ty: 3.5, tz: -1.4, explode: 0, phone: 1, door: 0, dscale: 0.9, sxL: 0.21, syL: 0, sxP: 0, syP: 0.22 },
    contact: { az: -0.34, el: 0.1, dist: 10.5, tx: 0.4, ty: 1.5, tz: -0.2, explode: 0, phone: 0, door: 1, dscale: 1, sxL: 0.27, syL: 0, sxP: 0, syP: -0.24 }
  };
  var FIELDS = Object.keys(KEYS.hero);

  function smooth(t) { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function canvasTexture(w, h, draw) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    draw(c.getContext('2d'), w, h);
    var t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }

  function glowTexture() {
    return canvasTexture(128, 128, function (g, w) {
      var r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      r.addColorStop(0, 'rgba(255,255,255,1)');
      r.addColorStop(0.25, 'rgba(255,255,255,.45)');
      r.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = r;
      g.fillRect(0, 0, w, w);
    });
  }

  function interiorTexture() {
    return canvasTexture(512, 272, function (g, w, h) {
      var bg = g.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#ffe0aa');
      bg.addColorStop(0.55, '#f0a052');
      bg.addColorStop(1, '#8a4a22');
      g.fillStyle = bg;
      g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(90,45,20,.55)';
      for (var s = 0; s < 3; s++) g.fillRect(30, 86 + s * 34, 220, 5);
      var bottles = ['#3f6b4a', '#7c2f24', '#d9b25a', '#2f4f6b', '#a85a2a'];
      for (var b = 0; b < 26; b++) {
        g.fillStyle = bottles[b % bottles.length];
        var bx = 36 + (b % 9) * 24;
        var by = 86 + Math.floor(b / 9) * 34;
        g.fillRect(bx, by - 18, 9, 18);
        g.fillRect(bx + 3, by - 25, 3, 7);
      }
      [110, 250, 390].forEach(function (x) {
        g.strokeStyle = 'rgba(60,30,10,.7)';
        g.lineWidth = 2;
        g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 46); g.stroke();
        var r = g.createRadialGradient(x, 54, 0, x, 54, 60);
        r.addColorStop(0, 'rgba(255,250,230,1)');
        r.addColorStop(0.2, 'rgba(255,232,180,.8)');
        r.addColorStop(1, 'rgba(255,200,120,0)');
        g.fillStyle = r;
        g.fillRect(x - 60, 0, 120, 120);
        g.fillStyle = '#3b2412';
        g.beginPath(); g.moveTo(x - 16, 52); g.lineTo(x + 16, 52); g.lineTo(x + 9, 40); g.lineTo(x - 9, 40); g.fill();
      });
      g.fillStyle = '#4a2a17';
      g.fillRect(0, h * 0.7, w * 0.62, h * 0.3);
      g.fillStyle = '#c98a4e';
      g.fillRect(0, h * 0.7, w * 0.62, 5);
      g.fillStyle = 'rgba(60,32,16,.85)';
      [[380, 0.8], [470, 0.84]].forEach(function (t) {
        g.beginPath(); g.ellipse(t[0], h * t[1], 34, 8, 0, 0, Math.PI * 2); g.fill();
        g.fillRect(t[0] - 3, h * t[1], 6, h * (1 - t[1]));
      });
      g.beginPath(); g.arc(330, h * 0.6, 14, 0, Math.PI * 2); g.fill();
      g.fillRect(318, h * 0.6 + 12, 26, 60);
    });
  }

  function signTextures() {
    function draw(lit) {
      return canvasTexture(512, 96, function (g, w, h) {
        g.fillStyle = lit ? '#000' : '#173f39';
        g.fillRect(0, 0, w, h);
        if (!lit) {
          g.strokeStyle = '#e6d9bd';
          g.lineWidth = 4;
          g.strokeRect(8, 8, w - 16, h - 16);
        }
        g.fillStyle = lit ? '#ffc979' : '#ffd99a';
        g.font = '600 62px "Big Shoulders Display", "Arial Narrow", sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText('Your place', w / 2, h / 2 + 3);
      });
    }
    return { map: draw(false), glow: draw(true) };
  }

  function boardTexture() {
    return canvasTexture(256, 384, function (g, w, h) {
      g.fillStyle = '#26302d';
      g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(240,236,224,.92)';
      g.font = '600 64px "Big Shoulders Display", "Arial Narrow", sans-serif';
      g.textAlign = 'center';
      g.fillText('Menu', w / 2, 82);
      g.fillStyle = 'rgba(240,236,224,.55)';
      for (var i = 0; i < 6; i++) {
        var y = 130 + i * 40;
        g.fillRect(34, y, 120 + (i * 37) % 50, 5);
        g.fillRect(w - 70, y, 36, 5);
      }
    });
  }

  function clockTexture() {
    return canvasTexture(256, 256, function (g, w) {
      var c = w / 2;
      g.fillStyle = '#e6d9bd';
      g.fillRect(0, 0, w, w);
      g.fillStyle = '#fbf6ea';
      g.beginPath(); g.arc(c, c, 104, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#1f2a2a';
      for (var i = 0; i < 12; i++) {
        var a = i / 12 * Math.PI * 2;
        g.lineWidth = i % 3 ? 4 : 8;
        g.beginPath();
        g.moveTo(c + Math.sin(a) * 84, c - Math.cos(a) * 84);
        g.lineTo(c + Math.sin(a) * 98, c - Math.cos(a) * 98);
        g.stroke();
      }
      g.lineCap = 'round';
      g.lineWidth = 9;
      g.beginPath(); g.moveTo(c, c); g.lineTo(c + Math.sin(-0.4) * 52, c - Math.cos(-0.4) * 52); g.stroke();
      g.lineWidth = 6;
      g.beginPath(); g.moveTo(c, c); g.lineTo(c, c + 78); g.stroke();
    });
  }

  function screenTexture() {
    return canvasTexture(128, 256, function (g, w, h) {
      var bg = g.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#1d2a52');
      bg.addColorStop(0.6, '#2a2f5a');
      bg.addColorStop(1, '#5a3b4a');
      g.fillStyle = bg;
      g.fillRect(0, 0, w, h);
    });
  }

  function roundedRect(path, w, h, r) {
    var x = -w / 2;
    var y = -h / 2;
    path.moveTo(x + r, y);
    path.lineTo(x + w - r, y);
    path.quadraticCurveTo(x + w, y, x + w, y + r);
    path.lineTo(x + w, y + h - r);
    path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    path.lineTo(x + r, y + h);
    path.quadraticCurveTo(x, y + h, x, y + h - r);
    path.lineTo(x, y + r);
    path.quadraticCurveTo(x, y, x + r, y);
    return path;
  }

  function start(fail) {
    var canvas = document.querySelector('.scene');
    if (!canvas || !THREE || !gsap || !ST) return false;
    var gl = canvas.getContext('webgl2', { antialias: true, alpha: false, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: true });
    if (!gl) return false;

    var coarse = window.matchMedia('(pointer: coarse)').matches;
    var small = Math.min(window.innerWidth, window.innerHeight) < 600;
    var lowTier = coarse || small;
    var maxRatio = lowTier ? 1.5 : 2;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, context: gl, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxRatio));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !lowTier;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(COLORS.sky, 1);

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(COLORS.sky, 20, 46);
    var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 120);

    var pmrem = new THREE.PMREMGenerator(renderer);
    var studio = new THREE.Scene();
    studio.add(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x141a2a, side: THREE.BackSide })));
    function panel(color, strength, x, y, z, w, h) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(strength), side: THREE.DoubleSide }));
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      studio.add(m);
    }
    panel(0xffa860, 4, -8, 2, 4, 6, 5);
    panel(0x8aa4ff, 2.5, 3, 9, 0, 10, 6);
    panel(0xffffff, 1, 8, 1, -4, 4, 4);
    scene.environment = pmrem.fromScene(studio, 0.04).texture;
    scene.environmentIntensity = 0.45;
    pmrem.dispose();

    var skyGeo = new THREE.SphereGeometry(70, 32, 16);
    var skyColors = [];
    var top = new THREE.Color(0x0e1424);
    var mid = new THREE.Color(0x2c3556);
    var low = new THREE.Color(0x141b2c);
    var pos = skyGeo.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      var yv = pos.getY(i) / 70;
      var c = yv > 0 ? mid.clone().lerp(top, Math.pow(yv, 0.6)) : mid.clone().lerp(low, Math.pow(-yv, 0.5));
      skyColors.push(c.r, c.g, c.b);
    }
    skyGeo.setAttribute('color', new THREE.Float32BufferAttribute(skyColors, 3));
    scene.add(new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })));

    scene.add(new THREE.HemisphereLight(0x7083c0, 0x1c2234, 1.15));
    var moon = new THREE.DirectionalLight(0xb3c2ff, 1.3);
    moon.position.set(-5, 9, 5);
    moon.castShadow = !lowTier;
    moon.shadow.mapSize.set(1024, 1024);
    moon.shadow.camera.left = -5; moon.shadow.camera.right = 5;
    moon.shadow.camera.top = 6; moon.shadow.camera.bottom = -4;
    moon.shadow.camera.near = 1; moon.shadow.camera.far = 25;
    moon.shadow.bias = -0.0008;
    moon.shadow.radius = 3;
    scene.add(moon);

    var mats = {};
    function mat(name, color, rough, metal) {
      if (!mats[name]) mats[name] = new THREE.MeshStandardMaterial({ color: color, roughness: rough === undefined ? 0.8 : rough, metalness: metal || 0 });
      return mats[name];
    }
    function box(parent, w, h, d, material, x, y, z) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    }
    function cyl(parent, rt, rb, h, material, x, y, z, seg) {
      var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 20), material);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    }
    function part(parent, x, y, z, ex, ey, ez) {
      var g = new THREE.Group();
      g.position.set(x, y, z);
      g.userData.base = new THREE.Vector3(x, y, z);
      g.userData.out = new THREE.Vector3(ex, ey, ez);
      parent.add(g);
      parts.push(g);
      return g;
    }

    var glowMap = glowTexture();
    function glow(parent, color, x, y, z, sx, sy) {
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
      s.position.set(x, y, z);
      s.scale.set(sx, sy || sx, 1);
      parent.add(s);
      return s;
    }

    var parts = [];
    var diorama = new THREE.Group();
    scene.add(diorama);

    var plinth = cyl(diorama, 3.4, 3.25, 0.5, mat('plinth', COLORS.plinth, 0.9), 0, -0.26, 0, 72);
    plinth.castShadow = false;
    var pave = cyl(diorama, 3.4, 3.4, 0.04, mat('pave', COLORS.pavement, 0.85), 0, 0.0, 0, 72);
    pave.castShadow = false;
    var curb = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.05, 8, 96), mat('trim', COLORS.trim, 0.6));
    curb.rotation.x = Math.PI / 2;
    curb.position.y = 0.02;
    diorama.add(curb);

    var ground = part(diorama, 0, 0, 0, 0, 0, 0);
    var paint = mat('paint', COLORS.paint, 0.6);
    var interior = interiorTexture();
    var interiorMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: interior, emissiveIntensity: 0.1, roughness: 1 });
    var core = new THREE.Mesh(new THREE.BoxGeometry(3, 1.6, 1.4), [paint, paint, mat('roof', COLORS.roof), paint, interiorMat, paint]);
    core.position.set(0, 0.8, -1.2);
    core.receiveShadow = true;
    ground.add(core);
    var trim = mat('trim', COLORS.trim, 0.6);
    box(ground, 0.2, 1.6, 0.2, paint, -1.4, 0.8, -0.4);
    box(ground, 1.65, 0.35, 0.2, paint, -0.475, 0.175, -0.4);
    box(ground, 1.65, 0.25, 0.2, paint, -0.475, 1.475, -0.4);
    box(ground, 0.2, 1.6, 0.2, paint, 0.45, 0.8, -0.4);
    box(ground, 0.7, 0.3, 0.2, paint, 0.9, 1.45, -0.4);
    box(ground, 0.25, 1.6, 0.2, paint, 1.375, 0.8, -0.4);
    box(ground, 1.75, 0.06, 0.3, trim, -0.475, 0.36, -0.33);
    box(ground, 0.04, 1.0, 0.04, trim, -0.475, 0.85, -0.33);
    box(ground, 1.65, 0.04, 0.04, trim, -0.475, 1.15, -0.33);
    var glass = new THREE.MeshStandardMaterial({ color: 0x223044, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.22 });
    var pane = new THREE.Mesh(new THREE.PlaneGeometry(1.65, 1.0), glass);
    pane.position.set(-0.475, 0.85, -0.36);
    ground.add(pane);

    var doorPart = part(ground, 1.25, 0, -0.32, 0, 0, 0.35);
    var doorLeaf = new THREE.Group();
    doorPart.add(doorLeaf);
    box(doorLeaf, 0.7, 1.3, 0.06, mat('door', COLORS.door, 0.5), -0.35, 0.65, 0);
    var doorGlassMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: COLORS.warm, emissiveIntensity: 0.1, roughness: 0.2 });
    box(doorLeaf, 0.44, 0.5, 0.07, doorGlassMat, -0.35, 0.92, 0);
    box(doorLeaf, 0.04, 0.16, 0.08, mat('brass', 0xc9a25a, 0.3, 0.8), -0.62, 0.62, 0.05);
    var doorGlow = glow(ground, COLORS.warm, 0.9, 0.7, -0.1, 1.6, 2);

    var planter = part(ground, -0.475, 0, -0.05, 0, 0, 0.35);
    box(planter, 1.5, 0.3, 0.3, mat('wood', COLORS.wood, 0.75), 0, 0.15, 0);
    var bushMat = new THREE.MeshStandardMaterial({ color: COLORS.bush, roughness: 0.9, flatShading: true });
    [-0.55, -0.18, 0.2, 0.55].forEach(function (x, i) {
      var b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.19 + (i % 2) * 0.04, 0), bushMat);
      b.position.set(x, 0.42, 0);
      b.rotation.set(i, i * 2, 0);
      b.castShadow = true;
      planter.add(b);
    });

    var sign = signTextures();
    var fascia = part(ground, -0.475, 1.46, -0.27, 0, 0.15, 0.6);
    var signMat = new THREE.MeshStandardMaterial({ map: sign.map, emissive: 0xffffff, emissiveMap: sign.glow, emissiveIntensity: 0.1, roughness: 0.6 });
    box(fascia, 1.9, 0.34, 0.06, [trim, trim, trim, trim, signMat, trim], 0, 0, 0);

    var awning = part(ground, -0.475, 1.66, -0.28, 0, 0.35, 0.9);
    var awningHinge = new THREE.Group();
    awning.add(awningHinge);
    var stripes = 9;
    for (var s = 0; s < stripes; s++) {
      var sw = 1.95 / stripes;
      var sm = mat(s % 2 ? 'stripeB' : 'stripeA', s % 2 ? COLORS.stripeB : COLORS.stripeA, 0.85);
      box(awningHinge, sw, 0.03, 0.85, sm, -0.975 + sw * (s + 0.5), 0, 0.425);
      box(awningHinge, sw, 0.16, 0.02, sm, -0.975 + sw * (s + 0.5), -0.08, 0.85);
    }

    var upper = part(diorama, 0, 1.6, 0, 0, 1.05, 0);
    box(upper, 3.0, 1.5, 1.6, mat('plaster', COLORS.plaster, 0.9), 0, 0.75, -1.1);
    box(upper, 3.2, 0.12, 1.75, trim, 0, 0.03, -1.1);
    box(upper, 3.2, 0.16, 1.8, trim, 0, 1.52, -1.1);
    var winLit = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffc98a, emissiveIntensity: 0.1, roughness: 0.3 });
    var winDark = new THREE.MeshStandardMaterial({ color: 0x1b2438, roughness: 0.08, metalness: 0.3 });
    [-0.75, 0.75].forEach(function (x, i) {
      box(upper, 0.7, 0.85, 0.05, trim, x, 0.78, -0.3);
      box(upper, 0.58, 0.73, 0.06, i ? winDark : winLit, x, 0.78, -0.28);
      box(upper, 0.04, 0.73, 0.07, trim, x, 0.78, -0.27);
      box(upper, 0.2, 0.85, 0.04, paint, x - 0.47, 0.78, -0.28);
      box(upper, 0.2, 0.85, 0.04, paint, x + 0.47, 0.78, -0.28);
      box(upper, 0.8, 0.06, 0.16, trim, x, 0.33, -0.24);
    });
    var upperGlow = glow(upper, 0xffc98a, -0.75, 0.78, -0.1, 1.2);

    var roof = part(diorama, 0, 3.1, 0, 0, 1.95, 0);
    box(roof, 0.32, 0.6, 0.32, mat('brick', 0x7a4a3a, 0.9), -0.95, 0.38, -1.5);
    box(roof, 0.62, 0.34, 0.46, mat('steel', 0x8c93a3, 0.45, 0.6), 0.7, 0.25, -1.3);
    cyl(roof, 0.015, 0.015, 0.9, mat('metal', COLORS.metal, 0.4, 0.6), 1.2, 0.5, -1.7, 6);

    var clockPart = part(diorama, 1.28, 2.32, -0.3, 0.45, 0.25, 0.2);
    box(clockPart, 0.05, 0.05, 0.42, mat('metal', COLORS.metal, 0.4, 0.6), 0, 0.26, 0.21);
    var clockFace = new THREE.MeshStandardMaterial({ map: clockTexture(), roughness: 0.5 });
    var clock = cyl(clockPart, 0.24, 0.24, 0.07, [trim, clockFace, clockFace], 0, 0, 0.45, 32);
    clock.rotation.z = Math.PI / 2;
    var clockGlow = glow(clockPart, 0xfff0d0, 0, 0, 0.45, 1.1);

    var board = part(diorama, -1.3, 0, 0.85, -0.2, 0, 0.9);
    var chalk = new THREE.MeshStandardMaterial({ map: boardTexture(), roughness: 0.9 });
    var wood = mat('wood', COLORS.wood, 0.75);
    var front = box(board, 0.55, 0.8, 0.03, [wood, wood, wood, wood, chalk, wood], 0, 0.39, 0.1);
    front.rotation.x = -0.24;
    var back = box(board, 0.55, 0.8, 0.03, wood, 0, 0.39, -0.1);
    back.rotation.x = 0.24;
    var boardGlow = glow(board, 0xfff0d0, 0, 0.45, 0.2, 1.3);

    var table = part(diorama, 2.1, 0, 0.55, 0.45, 0, 0.3);
    var metal = mat('metal', COLORS.metal, 0.4, 0.6);
    cyl(table, 0.32, 0.32, 0.04, trim, 0, 0.72, 0, 28);
    cyl(table, 0.03, 0.03, 0.7, metal, 0, 0.36, 0, 8);
    cyl(table, 0.18, 0.2, 0.03, metal, 0, 0.015, 0, 20);
    [-1, 1].forEach(function (side) {
      var chair = new THREE.Group();
      chair.position.set(side * 0.52, 0, 0.05);
      chair.rotation.y = side * Math.PI / 2;
      table.add(chair);
      box(chair, 0.32, 0.04, 0.32, metal, 0, 0.45, 0);
      box(chair, 0.32, 0.36, 0.03, metal, 0, 0.66, 0.16);
      [[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]].forEach(function (l) {
        cyl(chair, 0.015, 0.015, 0.45, metal, l[0], 0.225, l[1], 6);
      });
    });

    var lamp = part(diorama, -2.45, 0, 0.9, -0.35, 0, 0);
    cyl(lamp, 0.13, 0.15, 0.22, metal, 0, 0.11, 0, 16);
    cyl(lamp, 0.045, 0.05, 2.6, metal, 0, 1.4, 0, 10);
    box(lamp, 0.28, 0.38, 0.28, metal, 0, 2.86, 0);
    var lampGlassMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffd08a, emissiveIntensity: 0.1 });
    var lampGlass = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), lampGlassMat);
    lampGlass.position.y = 2.86;
    lamp.add(lampGlass);
    var cap = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.16, 4), metal);
    cap.position.y = 3.13;
    cap.rotation.y = Math.PI / 4;
    lamp.add(cap);
    var lampGlow = glow(lamp, 0xffc06a, 0, 2.86, 0, 2.2);
    var lampLight = new THREE.PointLight(0xffbf73, 0, 8, 2);
    lampLight.position.set(0, 2.7, 0.1);
    lamp.add(lampLight);

    var windowLight = new THREE.PointLight(COLORS.warm, 0, 7, 2);
    windowLight.position.set(-0.47, 0.95, 0.45);
    ground.add(windowLight);
    var windowGlow = glow(ground, COLORS.warm, -0.47, 0.85, -0.15, 3.4, 2.2);
    var doorLight = new THREE.PointLight(COLORS.warm, 0, 5, 2);
    doorLight.position.set(0.9, 0.8, 0.3);
    ground.add(doorLight);

    var pin = new THREE.Group();
    pin.position.set(-0.3, 5.6, -1.1);
    diorama.add(pin);
    var pinMat = new THREE.MeshStandardMaterial({ color: COLORS.pin, roughness: 0.35, emissive: COLORS.pin, emissiveIntensity: 0.15 });
    var pinHead = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 16), pinMat);
    pinHead.position.y = 0.55;
    pin.add(pinHead);
    var pinTip = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.75, 32), pinMat);
    pinTip.rotation.x = Math.PI;
    pinTip.position.y = 0.15;
    pin.add(pinTip);
    var pinDot = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 8), mat('white', 0xfbf6ea, 0.4));
    pinDot.position.set(0, 0.6, 0.27);
    pin.add(pinDot);
    var pinGlow = glow(pin, 0xff8a70, 0, 0.5, 0, 1.6);

    var phone = new THREE.Group();
    phone.position.set(0, 3.5, -3.9);
    scene.add(phone);
    var frameShape = roundedRect(new THREE.Shape(), 4.9, 8.8, 0.75);
    frameShape.holes.push(roundedRect(new THREE.Path(), 4.5, 8.4, 0.55));
    var frameGeo = new THREE.ExtrudeGeometry(frameShape, { depth: 0.28, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3, curveSegments: 14 });
    frameGeo.translate(0, 0, -0.14);
    var phoneFrame = new THREE.Mesh(frameGeo, new THREE.MeshStandardMaterial({ color: 0x2a2f3c, roughness: 0.28, metalness: 0.75 }));
    phoneFrame.castShadow = true;
    phone.add(phoneFrame);
    var screenMat = new THREE.MeshBasicMaterial({ map: screenTexture(), fog: false });
    var screen = new THREE.Mesh(new THREE.PlaneGeometry(4.55, 8.45), screenMat);
    screen.position.z = -0.06;
    phone.add(screen);
    box(phone, 1.0, 0.2, 0.04, mat('ink', 0x0b0f1a, 0.5), 0, 3.9, -0.03);
    phone.visible = false;

    var count = lowTier ? 80 : 160;
    var dust = new Float32Array(count * 3);
    var speeds = new Float32Array(count);
    for (var d = 0; d < count; d++) {
      var ang = Math.random() * Math.PI * 2;
      var rad = 1 + Math.random() * 6;
      dust[d * 3] = Math.cos(ang) * rad;
      dust[d * 3 + 1] = Math.random() * 7;
      dust[d * 3 + 2] = Math.sin(ang) * rad;
      speeds[d] = 0.05 + Math.random() * 0.15;
    }
    var dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dust, 3));
    var dustMat = new THREE.PointsMaterial({ size: 0.07, map: glowMap, color: 0xffd9a0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    scene.add(new THREE.Points(dustGeo, dustMat));

    var highlights = [
      { group: board, glow: boardGlow, v: 0 },
      { group: clockPart, glow: clockGlow, v: 0 },
      { group: pin, glow: pinGlow, v: 0 },
      { group: doorPart, glow: null, v: 0 }
    ];

    var cur = {};
    FIELDS.forEach(function (f) { cur[f] = KEYS.hero[f]; });
    var tgt = Object.assign({}, cur);
    var intro = { v: 0 };
    var spin = 0;
    var focus = -1;
    var pointer = { x: 0, y: 0, cx: 0, cy: 0 };

    var chapters = [];
    function chapter(id, key, start, end) {
      var el = document.getElementById(id);
      if (!el) return;
      chapters.push({ key: KEYS[key], st: ST.create({ trigger: el, start: start, end: end }) });
    }
    chapter('includes', 'includes', 'top bottom', 'top top');
    chapter('prices', 'prices', 'top bottom', 'top 15%');
    chapter('process', 'process', 'top bottom', 'top top');
    chapter('contact', 'contact', 'top bottom', 'bottom bottom');

    var processEl = document.getElementById('process');
    var spinST = processEl ? ST.create({ trigger: processEl, start: 'top bottom', end: 'bottom top' }) : null;
    var includesEl = document.getElementById('includes');
    var items = includesEl ? Array.prototype.slice.call(includesEl.querySelectorAll('.parts li')) : [];
    var focusST = includesEl ? ST.create({
      trigger: includesEl, start: 'top top', end: 'bottom bottom',
      onUpdate: function (self) {
        var idx = self.progress <= 0.04 || self.progress >= 0.99 ? -1 : Math.min(items.length - 1, Math.floor((self.progress - 0.04) / 0.92 * items.length));
        if (idx !== focus) {
          focus = idx;
          items.forEach(function (li, i) { li.classList.toggle('is-on', i === idx); });
        }
      },
      onLeave: function () { focus = -1; items.forEach(function (li) { li.classList.remove('is-on'); }); },
      onLeaveBack: function () { focus = -1; items.forEach(function (li) { li.classList.remove('is-on'); }); }
    }) : null;

    function readTargets() {
      FIELDS.forEach(function (f) { tgt[f] = KEYS.hero[f]; });
      chapters.forEach(function (c) {
        var p = smooth(c.st.progress);
        if (p <= 0) return;
        FIELDS.forEach(function (f) { tgt[f] = lerp(tgt[f], c.key[f], p); });
      });
      spin = spinST ? (spinST.progress - 0.5) * 1.4 : 0;
    }

    var width = 0;
    var height = 0;
    function resize(force) {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      if (!force && w === width && Math.abs(h - height) < 120) return;
      width = w;
      height = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function applyState(t, dt) {
      var k = 1 - Math.exp(-dt * 4.5);
      FIELDS.forEach(function (f) { cur[f] += (tgt[f] - cur[f]) * k; });
      pointer.cx += (pointer.x - pointer.cx) * (1 - Math.exp(-dt * 3));
      pointer.cy += (pointer.y - pointer.cy) * (1 - Math.exp(-dt * 3));

      var lights = intro.v;
      var e = smooth(cur.explode);
      parts.forEach(function (p) {
        p.position.copy(p.userData.base).addScaledVector(p.userData.out, e);
      });
      highlights.forEach(function (h, i) {
        var want = focus === i ? 1 : 0;
        h.v += (want - h.v) * (1 - Math.exp(-dt * 6));
        var v = h.v * e;
        if (h.glow) {
          h.group.position.y += v * 0.3;
          h.glow.material.opacity = v * 0.5;
        }
      });
      awningHinge.rotation.x = lerp(-1.45, 0.42, smooth((lights - 0.35) / 0.65));
      var doorOpen = smooth(cur.door) * 1.5 + highlights[3].v * e * 0.55;
      doorLeaf.rotation.y = doorOpen;
      var doorShow = Math.min(1, doorOpen);

      interiorMat.emissiveIntensity = 0.08 + lights * (1.05 + doorShow * 0.25);
      signMat.emissiveIntensity = 0.1 + lights * 1.6;
      winLit.emissiveIntensity = 0.1 + lights * 1.4;
      lampGlassMat.emissiveIntensity = 0.1 + lights * 3;
      doorGlassMat.emissiveIntensity = 0.1 + lights * 1.2;
      windowLight.intensity = lights * 5;
      lampLight.intensity = lights * 7;
      doorLight.intensity = lights * doorShow * 6;
      windowGlow.material.opacity = lights * 0.42;
      upperGlow.material.opacity = lights * 0.35;
      lampGlow.material.opacity = lights * 0.75;
      doorGlow.material.opacity = lights * doorShow * 0.5;
      dustMat.opacity = lights * 0.8;

      pin.scale.setScalar(Math.max(0.001, e));
      pin.position.y = 5.6 + Math.sin(t * 1.4) * 0.08;
      pin.rotation.y = t * 0.5;

      var ph = smooth(cur.phone);
      phone.visible = ph > 0.002;
      phone.position.y = lerp(-9, 3.5, ph);
      screenMat.color.setScalar(0.35 + 0.65 * ph);

      diorama.rotation.y = spin * smooth(cur.phone);
      diorama.scale.setScalar(cur.dscale);

      var p = dustGeo.attributes.position.array;
      for (var i = 0; i < count; i++) {
        p[i * 3 + 1] += speeds[i] * dt;
        if (p[i * 3 + 1] > 7) p[i * 3 + 1] = 0;
      }
      dustGeo.attributes.position.needsUpdate = true;

      var aspect = width / height;
      var portrait = aspect < 1;
      var dist = cur.dist * (portrait ? 1 + (1 / aspect - 1) * 0.55 : 1);
      var az = cur.az + pointer.cx * 0.06;
      var el = cur.el + pointer.cy * 0.03;
      camera.position.set(
        cur.tx + dist * Math.sin(az) * Math.cos(el),
        cur.ty + dist * Math.sin(el),
        cur.tz + dist * Math.cos(az) * Math.cos(el)
      );
      camera.lookAt(cur.tx, cur.ty, cur.tz);
      var sx = portrait ? cur.sxP : cur.sxL;
      var sy = portrait ? cur.syP : cur.syL;
      camera.setViewOffset(width, height, -sx * width, sy * height, width, height);
    }

    var running = false;
    var raf = 0;
    var last = 0;
    var clock0 = performance.now();
    var samples = [];
    var tier = 0;
    var firstFrame = true;

    function degrade() {
      tier += 1;
      if (tier === 1) {
        renderer.setPixelRatio(1);
        renderer.shadowMap.enabled = false;
        moon.castShadow = false;
        scene.traverse(function (o) {
          if (!o.material) return;
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { m.needsUpdate = true; });
        });
        resize(true);
        return;
      }
      stop();
      ST.getAll().forEach(function (s) {
        if (s === focusST || s === spinST || chapters.some(function (c) { return c.st === s; })) s.kill();
      });
      items.forEach(function (li) { li.classList.remove('is-on'); });
      renderer.dispose();
      canvas.classList.remove('is-ready');
      fail();
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      var dt = Math.min(0.1, (now - (last || now)) / 1000);
      last = now;
      resize(false);
      readTargets();
      applyState((now - clock0) / 1000, dt || 0.016);
      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        canvas.classList.add('is-ready');
        gsap.to(intro, { v: 1, duration: 1.8, delay: 0.25, ease: 'power2.inOut' });
      }
      if (dt > 0 && !document.hidden) {
        samples.push(dt);
        if (samples.length === 90) {
          var avg = samples.slice(20).reduce(function (a, b) { return a + b; }, 0) / 70;
          samples = [];
          if ((tier === 0 && avg > 0.026) || (tier === 1 && avg > 0.04)) degrade();
        }
      }
    }
    function play() {
      if (running) return;
      running = true;
      last = 0;
      samples = [];
      canvas.classList.remove('is-paused');
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    var visible = new Set();
    var zones = document.querySelectorAll('[data-scene]');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target);
      });
      update();
    });
    zones.forEach(function (z) { io.observe(z); });
    function update() {
      if (visible.size && !document.hidden && tier < 2) {
        play();
      } else {
        stop();
        if (!firstFrame) canvas.classList.add('is-paused');
      }
    }
    document.addEventListener('visibilitychange', update);

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('pointermove', function (e) {
        pointer.x = e.clientX / window.innerWidth * 2 - 1;
        pointer.y = e.clientY / window.innerHeight * 2 - 1;
      }, { passive: true });
    }
    window.addEventListener('resize', function () { resize(false); });

    resize(true);
    ST.refresh();
    return true;
  }

  window.GMScene = { start: start };
})();
