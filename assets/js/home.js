/* ==========================================================================
   AyVision home
   1. Monogram "AV" in Rubik Bubbles, filled with a soft, slowly drifting
      colour gradient. Intro: the colour blooms open inside the letters.
      Hover: from the cursor a flower-shaped colour spreads through the letters
      and fades slowly after the cursor leaves. The colours pulse gently all
      the time and faster, stronger while the cursor is on the letters.
   2. Portals: before the first room the AV shrinks into the room's coloured dot
      and takes on its colour, then the dot grows into the room. Between rooms a
      dot grows on the previous room's colour, so the hero does not come back.
   3. Header: docks a nav pill, switches tone over dark rooms, marks the room.
   Canvas 2D + one requestAnimationFrame loop, transform-only DOM updates.
   ========================================================================== */
(function () {
  'use strict';

  var html = document.documentElement;
  var canvas = document.querySelector('[data-dots]');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var mq = function (q) { try { return window.matchMedia(q).matches; } catch (e) { return false; } };
  var reduced = mq('(prefers-reduced-motion: reduce)');
  var fine = mq('(hover: hover) and (pointer: fine)');
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var qa = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var TAU = Math.PI * 2;

  var head = document.querySelector('[data-head]');
  var heroUi = document.querySelector('[data-hero-ui]');
  var hero = document.querySelector('[data-hero]');
  var roomDots = qa('[data-room-dot]');
  var roomSecs = qa('[data-room-sec]');
  var navLinks = qa('[data-nav]');
  var portals = qa('[data-portal]').map(function (el) {
    return { el: el, kind: el.getAttribute('data-portal'), from: el.getAttribute('data-from') || 'hero', room: +el.getAttribute('data-room'), disc: el.querySelector('.portal-disc'), label: el.querySelector('.portal-label'), lv: -1, D: 0, cx: 0, cy: 0, s: -1, top: 0, h: 1 };
  });

  /* ---------- colours ---------- */
  function rgb(str) {
    if (str.charAt(0) === '#') return [parseInt(str.substr(1, 2), 16), parseInt(str.substr(3, 2), 16), parseInt(str.substr(5, 2), 16)];
    var m = str.match(/[\d.]+/g) || [0, 0, 0];
    return [+m[0], +m[1], +m[2]];
  }
  var rgba = function (c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')'; };

  var BASE = '#3a1824';
  /* soft colour fields inside the letters (positions relative to the letters' box) */
  var FIELDS = [
    { c: rgb('#9b2f4b'), x: 0.26, y: 0.46, r: 0.50, ax: 0.08, ay: 0.07, sp: 1 / 9000, ph: 0.0 },
    { c: rgb('#93acba'), x: 0.72, y: 0.24, r: 0.40, ax: 0.07, ay: 0.09, sp: 1 / 11000, ph: 1.7 },
    { c: rgb('#1f3048'), x: 0.50, y: 0.94, r: 0.42, ax: 0.09, ay: 0.05, sp: 1 / 13000, ph: 3.1 },
    { c: rgb('#eab3be'), x: 0.86, y: 0.72, r: 0.44, ax: 0.05, ay: 0.08, sp: 1 / 10000, ph: 4.4 },
    { c: rgb('#eab3be'), x: 0.14, y: 0.12, r: 0.30, ax: 0.06, ay: 0.06, sp: 1 / 12000, ph: 2.3 }
  ];
  /* colours that spread on hover, in turn */
  var BLOOM = [rgb('#e6b8c0'), rgb('#93acba'), rgb('#b24a64')];
  var roomColor = roomDots.map(function (d) { return rgb(d.getAttribute('data-room-color') || getComputedStyle(d).backgroundColor); });

  var W = 0, H = 0, DPR = 1;
  var bg = null, mask = null, paint = null, pctx = null;
  var box = { x: 0, y: 0, w: 1, h: 1, pad: 8 };
  var mouse = { x: -9999, y: -9999, on: false };

  var FONT = '"Rubik Bubbles", "Geist", "Helvetica Neue", Arial, sans-serif';

  function layout() {
    /* stacked layout only on narrow portrait screens; short landscape screens use the side-by-side layout */
    var mobile = W <= 900 && (H >= W || W <= 560);
    var txt = mobile && document.querySelector('.ay-hero-text');
    var room = txt ? txt.offsetTop - 76 - 20 : Infinity; /* keep the monogram above the intro text */
    return mobile
      ? { x: W * 0.05, y: 76, w: W * 0.9, h: Math.max(120, Math.min(H * 0.4, W * 0.75, room)), mobile: true }
      : W <= 900
        ? { x: W * 0.5, y: H * 0.17, w: W * 0.46, h: H * 0.6, mobile: false }
        : { x: W * 0.43, y: H * 0.15, w: W * 0.52, h: H * 0.7, mobile: false };
  }

  function build() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    var L = layout();

    /* measure the letters and fit them into the layout box */
    var m = document.createElement('canvas').getContext('2d');
    m.font = '400 100px ' + FONT;
    var tm = m.measureText('AV');
    var asc = tm.actualBoundingBoxAscent || 72, desc = tm.actualBoundingBoxDescent || 0;
    var left = tm.actualBoundingBoxLeft || 0, right = tm.actualBoundingBoxRight || tm.width;
    var size = 100 * Math.min(L.w / (left + right), L.h / (asc + desc));
    var bw = (left + right) * size / 100, bh = (asc + desc) * size / 100;
    var pad = box.pad;
    box.w = bw; box.h = bh;
    box.x = L.mobile ? L.x + (L.w - bw) / 2 : L.x + L.w - bw;
    box.y = L.y + (L.h - bh) / 2;
    /* let the sticker sit next to the letters */
    if (hero) ['x', 'y', 'w', 'h'].forEach(function (k) { hero.style.setProperty('--av-' + k, box[k].toFixed(1) + 'px'); });

    /* letter mask, drawn once */
    mask = document.createElement('canvas');
    mask.width = Math.ceil((bw + pad * 2) * DPR); mask.height = Math.ceil((bh + pad * 2) * DPR);
    var mc = mask.getContext('2d');
    mc.scale(DPR, DPR);
    mc.font = '400 ' + size + 'px ' + FONT;
    mc.textBaseline = 'alphabetic';
    mc.fillStyle = '#000';
    mc.fillText('AV', pad + left * size / 100, pad + asc * size / 100);

    paint = document.createElement('canvas');
    paint.width = mask.width; paint.height = mask.height;
    pctx = paint.getContext('2d');

    /* no background raster: the hero is a plain colour (set in CSS) */
    bg = null;

    /* portal discs, sized to cover the screen: from the hero they start in the
       room's dot, between rooms in the middle of the screen */
    portals.forEach(function (pt) {
      var dot = roomDots[pt.room];
      if (pt.from === 'room' || !dot) { pt.cx = W / 2; pt.cy = H / 2; }
      else { var r = dot.getBoundingClientRect(); pt.cx = r.left + r.width / 2; pt.cy = r.top + r.height / 2; }
      pt.D = 2 * Math.hypot(Math.max(pt.cx, W - pt.cx), Math.max(pt.cy, H - pt.cy)) + 8;
      pt.disc.style.width = pt.D + 'px'; pt.disc.style.height = pt.D + 'px';
      pt.disc.style.left = (pt.cx - pt.D / 2) + 'px'; pt.disc.style.top = (pt.cy - pt.D / 2) + 'px';
      pt.s = -1;
    });
    measure();
  }

  /* positions of portals and rooms, measured once (and when the page changes size),
     so the scroll loop does not have to ask the browser for layout every frame */
  var rooms = roomSecs.map(function (sec) { return { el: sec, top: 0, bottom: 0, tone: sec.getAttribute('data-tone') || 'dark', color: sec.style.getPropertyValue('--room') }; });
  function measure() {
    var y = window.scrollY;
    portals.forEach(function (pt) { var r = pt.el.getBoundingClientRect(); pt.top = r.top + y; pt.h = r.height; });
    rooms.forEach(function (rm) { var r = rm.el.getBoundingClientRect(); rm.top = r.top + y; rm.bottom = r.bottom + y; });
  }
  var flow = document.querySelector('.ay-flow');
  if (flow && 'ResizeObserver' in window) new ResizeObserver(function () { measure(); }).observe(flow);
  window.addEventListener('load', function () { measure(); });

  /* ---------- painting the letters ---------- */
  function field(c, x, y, r, col, a) {
    var gr = c.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, rgba(col, a));
    gr.addColorStop(0.4, rgba(col, a * 0.6));
    gr.addColorStop(1, rgba(col, 0));
    c.fillStyle = gr;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }

  /* a soft round shape with six gentle petals */
  function flower(c, x, y, r, col, a, t) {
    if (r < 1 || a < 0.01) return;
    var light = [col[0] + (255 - col[0]) * 0.35 | 0, col[1] + (255 - col[1]) * 0.35 | 0, col[2] + (255 - col[2]) * 0.35 | 0];
    var gr = c.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, rgba(light, a));
    gr.addColorStop(0.28, rgba(col, a));
    gr.addColorStop(0.7, rgba(col, a * 0.5));
    gr.addColorStop(1, rgba(col, 0));
    c.fillStyle = gr;
    c.beginPath();
    for (var i = 0; i <= 96; i++) {
      var th = i / 96 * TAU;
      var rr = r * (0.84 + 0.16 * Math.sin(6 * th + t * 0.0005));
      if (i === 0) c.moveTo(x + Math.cos(th) * rr, y + Math.sin(th) * rr);
      else c.lineTo(x + Math.cos(th) * rr, y + Math.sin(th) * rr);
    }
    c.closePath();
    c.fill();
  }

  function paintLetters(t, open, g, gcol) {
    var w = paint.width, h = paint.height, S = Math.max(w, h);
    var ox = (box.pad) * DPR, oy = box.pad * DPR, bw = box.w * DPR, bh = box.h * DPR;
    pctx.setTransform(1, 0, 0, 1, 0, 0);
    pctx.globalCompositeOperation = 'source-over';
    pctx.globalAlpha = 1;
    pctx.fillStyle = BASE;
    pctx.fillRect(0, 0, w, h);
    for (var i = 0; i < FIELDS.length; i++) {
      var f = FIELDS[i];
      var cx = ox + (f.x + Math.sin(t * f.sp * TAU + f.ph) * f.ax) * bw;
      var cy = oy + (f.y + Math.cos(t * f.sp * TAU * 0.8 + f.ph) * f.ay) * bh;
      var amp = 0.1 + 0.2 * hov;
      var wave = Math.sin(beat + f.ph * 1.3);
      field(pctx, cx, cy, f.r * S * (0.1 + 0.9 * open) * (1 + amp * wave), f.c, clamp(0.86 + (0.14 + 0.1 * hov) * wave, 0, 1));
    }
    for (var j = 0; j < blooms.length; j++) {
      var bl = blooms[j];
      flower(pctx, (bl.x - box.x + box.pad) * DPR, (bl.y - box.y + box.pad) * DPR, bl.r * DPR * (1 + 0.09 * hov * Math.sin(beat * 1.1 + bl.seed)), bl.c, bl.a, t + bl.seed);
    }
    if (g > 0 && gcol) { pctx.fillStyle = rgba(gcol, clamp(g * 1.15, 0, 1)); pctx.fillRect(0, 0, w, h); }
    pctx.globalCompositeOperation = 'destination-in';
    pctx.drawImage(mask, 0, 0);
    pctx.globalCompositeOperation = 'source-over';
  }

  /* ---------- hover: colour spreads from the cursor ---------- */
  var blooms = [], active = null, bloomN = 0;
  /* pulse: the colours breathe; while hovering they pulse faster and stronger */
  var hov = 0, beat = 0, lastNow = 0;
  var boost = 0;
  function pulse(now, over) {
    var dt = lastNow ? Math.min(now - lastNow, 50) : 16;
    lastNow = now;
    hov += (Math.max(over ? 1 : 0, boost) - hov) * 0.06;
    beat += dt * TAU * (1 / 2600 + hov * (1 / 900 - 1 / 2600));
  }
  var hovering = false;
  function updateBlooms(enabled, now) {
    var m = box.h * 0.04;
    var over = hovering = enabled && mouse.on &&
      mouse.x > box.x - m && mouse.x < box.x + box.w + m &&
      mouse.y > box.y - m && mouse.y < box.y + box.h + m;
    if (over) {
      if (!active) {
        active = { x: mouse.x, y: mouse.y, r: box.h * 0.04, a: 0.95, c: BLOOM[bloomN++ % BLOOM.length], seed: Math.random() * 9000 };
        blooms.push(active);
        if (blooms.length > 5) blooms.shift();
      }
      active.x += (mouse.x - active.x) * 0.08;
      active.y += (mouse.y - active.y) * 0.08;
      active.r += (Math.max(box.w, box.h) * 0.55 - active.r) * 0.025;
    } else {
      active = null;
    }
    for (var i = blooms.length - 1; i >= 0; i--) {
      var bl = blooms[i];
      if (bl === active) continue;
      if (bl.until && now < bl.until) { bl.r += (Math.max(box.w, box.h) * 0.5 - bl.r) * 0.035; continue; }
      bl.a *= 0.978; bl.r *= 1.003;
      if (bl.a < 0.015) blooms.splice(i, 1);
    }
  }

  /* ---------- replay: the brand link brings the AV back, pulsing ---------- */
  var replayAt = 0;
  document.addEventListener('ay:replay', function () {
    replayAt = performance.now() + 220; /* starts while the disc moves away */
    blooms.length = 0; active = null;
    blooms.push({ x: box.x + box.w * 0.5, y: box.y + box.h * 0.55, r: box.h * 0.05, a: 0.9, c: BLOOM[bloomN++ % BLOOM.length], seed: Math.random() * 9000, until: replayAt + 1500 });
  });

  /* ---------- intro ---------- */
  var intro = true, t0 = 0;
  var seen = false;
  try { seen = !!sessionStorage.getItem('ay-intro') || !!sessionStorage.getItem('curtain'); } catch (e) {}
  if (reduced || seen || window.scrollY > 10) intro = false;
  var INTRO = 1500;

  function ready() {
    html.classList.add('is-ready');
    try { sessionStorage.setItem('ay-intro', '1'); } catch (e) {}
  }

  /* ---------- pointer ---------- */
  if (fine) {
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true; }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { mouse.on = false; mouse.x = mouse.y = -9999; });
  } else {
    var touch = function (e) { var t = e.touches[0]; if (t) { mouse.x = t.clientX; mouse.y = t.clientY; mouse.on = true; } };
    window.addEventListener('touchstart', touch, { passive: true });
    window.addEventListener('touchmove', touch, { passive: true });
    window.addEventListener('touchend', function () { mouse.on = false; mouse.x = mouse.y = -9999; });
  }

  var resizeTimer = 0, lastW = 0;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastW && !fine) return; /* phones: ignore URL-bar height jumps */
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { lastW = window.innerWidth; build(); }, 150);
  });

  /* ---------- portals + header ---------- */
  var setDisc = function (pt, s) {
    if (Math.abs(s - pt.s) < 0.0005) return;
    pt.s = s;
    var s0 = 14 / (pt.D || 1000);
    pt.disc.style.transform = s <= 0.0001 ? 'scale(0)' : 'scale(' + (s0 + (1 - s0) * s).toFixed(5) + ')';
  };

  var tone = '', docked = null, activeNav = -2, lastTarget = -2;
  var roomItems = qa('.ay-rooms li');

  function scene() {
    var Vh = H, y = window.scrollY;
    var g = 0, gRoom = -1, covered = false, room = -1;
    portals.forEach(function (pt) {
      var top = pt.top - y, bottom = top + pt.h;
      var p = clamp(-top / Math.max(1, pt.h - Vh), 0, 1);
      var s, gp = 0;
      if (pt.from === 'room') {
        s = ease(clamp((p - 0.04) / 0.6, 0, 1));
      } else {
        gp = ease(clamp((p - 0.06) / 0.36, 0, 1));
        s = ease(clamp((p - 0.42) / 0.5, 0, 1));
      }
      var vis = top < Vh && bottom > 0;
      setDisc(pt, s);
      if (!vis) return;
      if (gp > g) { g = gp; gRoom = pt.room; }
      /* the room's title simply fades in once the disc has grown */
      if (pt.label) {
        var lv = clamp((s - 0.72) / 0.24, 0, 1);
        if (Math.abs(lv - pt.lv) > 0.002) { pt.lv = lv; pt.label.style.opacity = lv.toFixed(3); }
      }
      /* header: the room that fills the screen right now */
      if (top <= 40 && bottom > 40) room = s > 0.55 ? pt.room : (pt.from === 'room' ? pt.room - 1 : -1);
      if (s >= 0.999 || (pt.from === 'room' && top <= 0 && bottom >= Vh)) covered = true;
    });
    rooms.forEach(function (rm, k) {
      var top = rm.top - y, bottom = rm.bottom - y;
      if (top <= 40 && bottom > 40) room = k;
      if (top <= 0 && bottom >= Vh) covered = true;
    });

    var t = room >= 0 ? rooms[room].tone : 'dark';
    if (t !== tone) { tone = t; head.setAttribute('data-tone', t); }
    var d = y > Vh * 0.45;
    if (d !== docked) { docked = d; head.classList.toggle('is-docked', d); }
    if (room !== activeNav) {
      activeNav = room;
      navLinks.forEach(function (a, k) { a.classList.toggle('is-on', k === room); });
      head.style.setProperty('--hb', room >= 0 ? rooms[room].color : 'var(--bg)');
    }

    /* while the AV moves into a room's dot, that room stays in focus and the rest steps back */
    var target = g > 0.04 ? gRoom : -1;
    if (target !== lastTarget) {
      lastTarget = target;
      if (heroUi) heroUi.classList.toggle('has-target', target >= 0);
      roomItems.forEach(function (li, k) { li.classList.toggle('is-target', k === target); });
    }

    return { g: g, room: gRoom, covered: covered };
  }

  /* ---------- drawing ---------- */
  function draw(t, open, g, gx, gy, gcol) {
    paintLetters(t, open, g, gcol);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (bg) ctx.drawImage(bg, 0, 0);

    /* intro: grows slightly while the colour blooms; portal: shrinks into the room dot */
    var cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    var sEnd = 16 / box.h;
    var sc = (0.94 + 0.06 * open) * (1 + (sEnd - 1) * g);
    var tx = cx + (gx - cx) * g, ty = cy + (gy - cy) * g;
    var alpha = clamp(open * 1.6, 0, 1) * (1 - clamp((g - 0.82) / 0.18, 0, 1));
    if (alpha <= 0.002) return;
    ctx.globalAlpha = alpha;
    var hw = box.w / 2 + box.pad, hh = box.h / 2 + box.pad;
    ctx.setTransform(DPR * sc, 0, 0, DPR * sc, DPR * (tx - hw * sc), DPR * (ty - hh * sc));
    ctx.drawImage(paint, 0, 0, paint.width / DPR, paint.height / DPR);
    ctx.globalAlpha = 1;
  }

  /* ---------- the loop ---------- */
  function frame(now) {
    requestAnimationFrame(frame);
    if (!t0) t0 = now;
    var st = scene();
    if (st.covered) return;

    var t = now - t0;
    var open = intro ? ease(clamp(t / INTRO, 0, 1)) : 1;
    if (intro && t > INTRO) { intro = false; ready(); }
    if (replayAt) {
      var rp = now - replayAt;
      open = Math.min(open, ease(clamp(rp / 900, 0, 1)));
      boost = rp < 900 ? 1 : 1 - ease(clamp((rp - 900) / 2000, 0, 1));
      if (rp > 2900) { replayAt = 0; boost = 0; }
    }

    var gx = 0, gy = 0, gcol = null;
    if (st.room >= 0) {
      for (var q = 0; q < portals.length; q++) if (portals[q].room === st.room) { gx = portals[q].cx; gy = portals[q].cy; gcol = roomColor[st.room]; break; }
    }
    updateBlooms(!intro && st.g < 0.05, now);
    pulse(now, hovering);
    draw(t, open, st.g, gx, gy, gcol);
  }

  /* ---------- reduced motion: draw once, no animation ---------- */
  function still() {
    var st = function () { build(); draw(0, 1, 0, 0, 0, null); };
    st();
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(st, 150); });
    ready();
    head.classList.add('is-docked');
  }

  var fontLoad = (document.fonts && document.fonts.load)
    ? document.fonts.load('400 100px "Rubik Bubbles"').catch(function () {})
    : Promise.resolve();
  var timeout = new Promise(function (r) { setTimeout(r, 1800); });

  Promise.race([fontLoad, timeout]).then(function () {
    lastW = window.innerWidth;
    if (reduced) { still(); fontLoad.then(function () { build(); draw(0, 1, 0, 0, 0, null); }); return; }
    build();
    /* the font arrived late: measure again */
    fontLoad.then(function () { if (mask && document.fonts.check('400 100px "Rubik Bubbles"')) build(); });
    if (!intro) ready();
    requestAnimationFrame(frame);
  });
})();
