/* ==========================================================================
   Aylin Stäuble – Portfolio · motion engine
   Vanilla JS, one requestAnimationFrame loop, transform/opacity only.
   Respects prefers-reduced-motion. No custom cursor on touch devices.
   ========================================================================== */
(function () {
  'use strict';

  var html = document.documentElement;
  var root = document.querySelector('.ap');
  if (!root) return;

  var mq = function (q) { try { return window.matchMedia(q).matches; } catch (e) { return false; } };
  var reduced = mq('(prefers-reduced-motion: reduce)');
  var fine = mq('(hover: hover) and (pointer: fine)');
  var f = reduced ? 0 : 1;              /* effect strength */
  var still = reduced;
  if (still) html.classList.add('is-still');

  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var qa = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var q = function (s) { return document.querySelector(s); };
  var V = function () { return window.innerHeight || 800; };
  var getY = function () { return window.scrollY || document.documentElement.scrollTop || 0; };

  var setVh = function () { html.style.setProperty('--vh', V() + 'px'); };
  setVh();

  /* ---------------- Smooth scroll (Lenis) ---------------- */
  var lenis = null;
  if (!reduced && window.Lenis) {
    try {
      lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, gestureOrientation: 'vertical' });
      var lraf = function (t) { lenis.raf(t); requestAnimationFrame(lraf); };
      requestAnimationFrame(lraf);
    } catch (e) { lenis = null; }
  }
  var scrollToY = function (y) {
    y = Math.max(0, y);
    if (lenis) {
      var dist = Math.abs(y - getY());
      lenis.scrollTo(y, { duration: clamp(dist / 2200, 0.9, 3.2), easing: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; } });
    } else {
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  /* ---------------- Page transition: a dot grows into the next page ---------------- */
  var curtain = q('[data-curtain]');
  var curtainLabel = q('[data-curtain-label]');
  var curtainDisc = q('[data-curtain-disc]');
  var busy = false;

  var inkFor = function (c) {
    var m = String(c).trim().match(/^#?([0-9a-f]{6})$/i), r, g, b;
    if (m) { r = parseInt(m[1].slice(0, 2), 16); g = parseInt(m[1].slice(2, 4), 16); b = parseInt(m[1].slice(4, 6), 16); }
    else { m = String(c).match(/(\d+)\D+(\d+)\D+(\d+)/); if (!m) return '#f3efe7'; r = +m[1]; g = +m[2]; b = +m[3]; }
    var L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return L > 0.6 ? '#1c1d1f' : '#f3efe7';
  };
  var placeDisc = function (x, y) {
    var Wd = window.innerWidth, Hd = window.innerHeight;
    var D = 2 * Math.hypot(Math.max(x, Wd - x), Math.max(y, Hd - y)) + 8;
    curtainDisc.style.width = D + 'px'; curtainDisc.style.height = D + 'px';
    curtainDisc.style.left = (x - D / 2) + 'px'; curtainDisc.style.top = (y - D / 2) + 'px';
  };

  var arriving = null;
  try { arriving = sessionStorage.getItem('curtain'); sessionStorage.removeItem('curtain'); } catch (e) {}
  if (arriving && curtain && curtainDisc) {
    var info = {};
    try { info = JSON.parse(arriving); } catch (e) { info = { label: arriving }; }
    curtainLabel.textContent = info.label || '';
    if (info.color) { html.style.setProperty('--cc', info.color); html.style.setProperty('--cc-ink', info.ink || inkFor(info.color)); }
    placeDisc(window.innerWidth / 2, window.innerHeight / 2);
    curtain.setAttribute('data-phase', 'cover');
    html.classList.remove('is-arriving');
    var revealed = false;
    var reveal = function () {
      if (revealed) return; revealed = true;
      requestAnimationFrame(function () {
        curtain.setAttribute('data-phase', 'out');
        setTimeout(function () { curtain.setAttribute('data-phase', ''); }, 800);
      });
    };
    if (document.readyState === 'complete') setTimeout(reveal, 120);
    else window.addEventListener('load', function () { setTimeout(reveal, 120); });
    setTimeout(reveal, 1800); /* safety net */
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-transition]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    var href = a.getAttribute('href');
    if (!href || href === window.location.pathname) return;
    if (!curtain || !curtainDisc || still || busy) return;  /* plain navigation */
    e.preventDefault();
    busy = true;
    var label = a.getAttribute('data-transition') || '';
    var color = a.getAttribute('data-color') || getComputedStyle(html).getPropertyValue('--dark').trim() || '#211f1c';
    var ink = inkFor(color);
    html.style.setProperty('--cc', color); html.style.setProperty('--cc-ink', ink);
    curtainLabel.textContent = label;
    var x = e.clientX || window.innerWidth / 2, y = e.clientY || window.innerHeight / 2;
    placeDisc(x, y);
    try { sessionStorage.setItem('curtain', JSON.stringify({ label: label, color: color, ink: ink })); } catch (err) {}
    curtain.setAttribute('data-phase', '');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        curtain.setAttribute('data-phase', 'in');
        setTimeout(function () { window.location.href = href; }, 820);
      });
    });
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && curtain) { curtain.setAttribute('data-phase', ''); busy = false; }
  });

  /* ---------------- Smooth anchor scroll + mobile menu ---------------- */
  var menuBtn = q('[data-burger]');
  var menu = q('[data-menu]');
  var setMenu = function (open) {
    html.classList.toggle('menu-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (menu) menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  };
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(!html.classList.contains('menu-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* In-page links (header, menu, hero list, brand): instead of scrolling through
     the whole page, a disc in the target colour covers the screen, the page jumps,
     the disc shrinks away. The brand brings the AV back with a pulse (home.js). */
  var jumpNow = function (y) {
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  };
  var bgColor = function () { return getComputedStyle(html).getPropertyValue('--bg').trim() || '#ebebeb'; };
  qa('[data-scroll]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('data-scroll');
      var el = q('[data-sec="' + id + '"]');
      if (!el) return;
      e.preventDefault();
      setMenu(false);
      var targetY = function () { return id === 'top' ? 0 : el.getBoundingClientRect().top + getY() - (el.hasAttribute('data-room-sec') ? 0 : 60); };
      var arrive = function () {
        history.replaceState(null, '', '#' + id);
        if (id === 'top') { document.dispatchEvent(new CustomEvent('ay:replay')); return; }
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        try { el.focus({ preventScroll: true }); } catch (err) {}
      };
      if (still || !curtain || !curtainDisc) { jumpNow(targetY()); arrive(); return; }
      if (busy) return;
      busy = true;
      var color = id === 'top' ? bgColor() : (el.style.getPropertyValue('--room').trim() || bgColor());
      html.style.setProperty('--cc', color); html.style.setProperty('--cc-ink', inkFor(color));
      curtainLabel.textContent = id === 'top' ? '' : (el.getAttribute('data-label') || '');
      placeDisc(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
      curtain.setAttribute('data-fast', '');
      curtain.setAttribute('data-phase', '');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          curtain.setAttribute('data-phase', 'in');
          setTimeout(function () {
            jumpNow(targetY());
            arrive();
            setTimeout(function () {
              placeDisc(window.innerWidth / 2, window.innerHeight / 2);
              curtain.setAttribute('data-phase', 'out');
              setTimeout(function () { curtain.setAttribute('data-phase', ''); curtain.removeAttribute('data-fast'); busy = false; }, 650);
            }, 140);
          }, 620);
        });
      });
    });
  });

  /* ---------------- Reveals + counters ---------------- */
  var counters = [];
  var startCount = function (el) {
    if (still) return;
    var real = el.querySelector('.cnt-real'), anim = el.querySelector('[data-cnt-anim]');
    if (!real || !anim) return;
    var txt = real.textContent || '';
    if (!/\d/.test(txt)) return;
    el.setAttribute('data-counting', '');
    counters.push({ el: el, anim: anim, txt: txt, t0: performance.now() + 150 });
  };
  var rvEls = qa('[data-rv]');
  if (!('IntersectionObserver' in window) || reduced) {
    rvEls.forEach(function (el) { el.setAttribute('data-in', ''); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.setAttribute('data-in', '');
        if (en.target.hasAttribute('data-count')) startCount(en.target);
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    rvEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Headlines: words wobble once on hover ---------------- */
  if (!reduced) {
    qa('.h2, .contact-h, .cs-title').forEach(function (h) {
      if (!h.querySelector('.w')) return;
      var busy = false;
      h.addEventListener('pointerenter', function (e) {
        if (busy || e.pointerType !== 'mouse') return;
        if (h.hasAttribute('data-rv') && !h.hasAttribute('data-in')) return;
        busy = true; h.classList.add('is-wob');
        setTimeout(function () { h.classList.remove('is-wob'); busy = false; }, 1300);
      });
    });
  }

  /* ---------------- Drag-to-scroll galleries ---------------- */
  qa('[data-gal]').forEach(function (g) {
    var down = false, sx = 0, sl = 0, moved = false;
    g.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; sx = e.clientX; sl = g.scrollLeft; g.classList.add('is-drag');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true;
      g.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () { down = false; g.classList.remove('is-drag'); });
    g.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    g.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { g.scrollBy({ left: 300, behavior: 'smooth' }); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { g.scrollBy({ left: -300, behavior: 'smooth' }); e.preventDefault(); }
    });
  });

  /* ---------------- Project carousel: drag, swipe, arrows, keys ---------------- */
  qa('[data-pj]').forEach(function (pj) {
    var track = pj.querySelector('[data-pj-track]');
    if (!track) return;
    var items = Array.prototype.slice.call(track.querySelectorAll('[data-pj-item]'));
    var prev = pj.querySelector('[data-pj-prev]'), next = pj.querySelector('[data-pj-next]');
    var bar = pj.querySelector('[data-pj-bar]'), cur = pj.querySelector('[data-pj-cur]');
    var padL = function () { return parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0; };
    var current = function () {
      var x = track.scrollLeft, best = 0, bd = 1e9;
      items.forEach(function (it, k) { var d = Math.abs(it.offsetLeft - padL() - x); if (d < bd) { bd = d; best = k; } });
      return best;
    };
    var go = function (k) {
      k = clamp(k, 0, items.length - 1);
      track.scrollTo({ left: items[k].offsetLeft - padL(), behavior: reduced ? 'auto' : 'smooth' });
    };
    var update = function () {
      var max = Math.max(1, track.scrollWidth - track.clientWidth), x = track.scrollLeft;
      if (bar) bar.style.transform = 'scaleX(' + clamp((x / max) * (1 - 1 / items.length) + 1 / items.length, 0, 1).toFixed(4) + ')';
      if (cur) cur.textContent = String(current() + 1);
      if (prev) prev.disabled = x < 4;
      if (next) next.disabled = x > max - 4;
    };
    var raf = 0;
    track.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; update(); }); }, { passive: true });
    window.addEventListener('resize', update);
    if (prev) prev.addEventListener('click', function () { go(current() - 1); });
    if (next) next.addEventListener('click', function () { go(current() + 1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(current() + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { go(current() - 1); e.preventDefault(); }
    });
    /* mouse drag; touch devices swipe natively */
    var down = false, moved = false, sx = 0, sl = 0, start = 0, lastX = 0, v = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; sx = lastX = e.clientX; sl = track.scrollLeft; start = current(); v = 0;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 4) { moved = true; track.classList.add('is-drag'); }
      if (moved) { v = e.clientX - lastX; lastX = e.clientX; track.scrollLeft = sl - dx; }
    });
    window.addEventListener('pointerup', function (e) {
      if (!down) return;
      down = false;
      if (!moved) return;
      track.classList.remove('is-drag');
      var dx = e.clientX - sx, k = current();
      if (Math.abs(dx) > 60 || Math.abs(v) > 8) k = start + (dx < 0 ? 1 : -1);
      go(k);
    });
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });
    update();
  });

  /* ---------------- Element lists ---------------- */
  var pars = qa('[data-par]');
  var tilts = qa('[data-tilt]');
  var mags = qa('[data-mag]');
  var tracks = qa('[data-track]');
  var band = q('[data-band]');
  var hA = q('[data-hero-a]'), hAfig = q('[data-a-fig]'), hAphoto = q('[data-a-photo]'), hAtext = q('[data-a-text]'), hAcap = q('[data-a-cap]');
  var hzs = qa('[data-hz]').map(function (s) {
    var items = Array.prototype.slice.call(s.querySelectorAll('[data-hz-item]'));
    return { el: s, track: s.querySelector('[data-hz-track]'), sticky: s.querySelector('[data-hz-sticky]'), bar: s.querySelector('[data-hz-bar]'),
      items: items, imgs: items.map(function (it) { return it.querySelector('[data-hz-img]'); }), dist: 0 };
  });
  var seq = q('[data-seq]'), seqItems = qa('[data-seq-item]'), seqDots = qa('[data-seq-dot]');
  var hls = qa('[data-hl]').map(function (b) { return { el: b, w: Array.prototype.slice.call(b.querySelectorAll('.hlw')) }; });
  var cz = q('[data-cz]'), czFig = q('[data-cz-fig]'), czImg = q('[data-cz-img]');
  var zooms = qa('[data-zoomtext]');
  var steps = qa('[data-step]'), pns = qa('[data-pn]');
  var dot = q('[data-cur-dot]'), ring = q('[data-cur-ring]');

  var measureDirty = true;
  window.addEventListener('resize', function () { measureDirty = true; setVh(); });

  /* ---------------- Pointer: cursor, tilt, magnet ---------------- */
  var m = { x: -200, y: -200, rx: -200, ry: -200 }, live = false, hoverCard = null, cs = '';
  if (fine) {
    document.addEventListener('mousemove', function (e) {
      m.x = e.clientX; m.y = e.clientY;
      if (!live) { live = true; html.classList.add('has-cursor'); m.rx = e.clientX; m.ry = e.clientY; }
      var card = e.target.closest ? e.target.closest('[data-tilt]') : null;
      if (card !== hoverCard) {
        if (hoverCard) { hoverCard._tx = 0; hoverCard._ty = 0; hoverCard._th = 0; }
        hoverCard = card;
      }
      if (card) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        var max = 10 * f;
        card._ty = (px - 0.5) * 2 * max; card._tx = -(py - 0.5) * 2 * max; card._th = 1;
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      }
    }, { passive: true });
    document.addEventListener('mouseover', function (e) {
      var t = e.target, next = '';
      if (t && t.closest) {
        if (t.closest('[data-tilt]')) next = 'card';
        else if (t.closest('a,button,[data-mag],[data-gal]')) next = 'link';
      }
      if (next !== cs) { cs = next; root.setAttribute('data-cs', cs); }
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { live = false; html.classList.remove('has-cursor'); });
  }

  /* ---------------- The loop ---------------- */
  var sy = getY(), vel = 0, skew = 0, pos = [0, 0], last = 0, stepIdx = -1, lastScrollWork = 0;

  var prog = function (el, Vh) { var r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - Vh), 0, 1); };

  function tick(ts) {
    requestAnimationFrame(tick);
    var dt = Math.min(64, last ? ts - last : 16) / 1000; last = ts;
    var Vh = V(), VW = window.innerWidth || 1280;
    var y = getY(), dy = y - sy; sy = y;
    vel += (dy - vel) * 0.14;
    var scrolled = dy !== 0 || measureDirty || ts - lastScrollWork > 500;
    if (scrolled) lastScrollWork = ts;

    /* counters */
    if (counters.length) {
      var now = performance.now();
      counters = counters.filter(function (c) {
        var k = clamp((now - c.t0) / 1600, 0, 1), e = 1 - Math.pow(1 - k, 3);
        if (k >= 1) { c.el.removeAttribute('data-counting'); c.anim.textContent = ''; c.el.setAttribute('data-popped', ''); return false; }
        c.anim.textContent = c.txt.replace(/\d+/g, function (mm) { return String(Math.round(parseInt(mm, 10) * e)); });
        return true;
      });
    }

    if (!still && scrolled) {
      /* parallax: read all positions first, then write (no layout thrashing) */
      var pr = [];
      for (var i = 0; i < pars.length; i++) pr[i] = pars[i].parentElement.getBoundingClientRect();
      for (i = 0; i < pars.length; i++) {
        var el = pars[i], p = pr[i];
        if (p.bottom < -300 || p.top > Vh + 300) continue;
        var sp = parseFloat(el.getAttribute('data-par')) || 0, sc = parseFloat(el.getAttribute('data-par-scale')) || 1;
        var ty = -(p.top + p.height / 2 - Vh / 2) * sp * f;
        if (sc > 1) { var lim = ((sc - 1) / 2) * p.height; ty = clamp(ty, -lim, lim); }
        var tf = 'translate3d(0,' + ty.toFixed(1) + 'px,0)' + (sc > 1 ? ' scale(' + sc + ')' : '');
        if (el._tf !== tf) { el._tf = tf; el.style.transform = tf; }
      }

      /* hero: face circle grows into the full portrait stage */
      if (hA && hAfig && hAphoto) {
        var pa = prog(hA, Vh), e1 = ease(clamp(pa / 0.72, 0, 1));
        var W = hAfig.offsetWidth, H = hAfig.offsetHeight, ph = hAphoto.offsetHeight, pw = hAphoto.offsetWidth;
        var fx = (W - pw) / 2 + pw * 0.5, fy = ph * 0.34, head = ph * 0.5;
        var d0 = clamp(Math.min(W, H) * 0.24, 130, 190);
        var s = (d0 / head) + (1 - d0 / head) * e1;
        hAphoto.style.transform = 'scale(' + s.toFixed(4) + ')';
        var cw = d0 + (W - d0) * e1, ch = d0 + (H - d0) * e1;
        var cx = fx + (W / 2 - fx) * e1, cy = fy + (H / 2 - fy) * e1;
        var top = clamp(cy - ch / 2, 0, H), left = clamp(cx - cw / 2, 0, W), bottom = clamp(H - (cy + ch / 2), 0, H), right = clamp(W - (cx + cw / 2), 0, W);
        var rad = d0 / 2 + (28 - d0 / 2) * e1;
        hAfig.style.clipPath = 'inset(' + top.toFixed(1) + 'px ' + right.toFixed(1) + 'px ' + bottom.toFixed(1) + 'px ' + left.toFixed(1) + 'px round ' + rad.toFixed(1) + 'px)';
        hAfig.style.transform = 'translate3d(0,' + ((H * 0.83 - fy) * (1 - e1)).toFixed(1) + 'px,0)';
        if (hAtext) {
          var tp = clamp(pa / 0.32, 0, 1);
          hAtext.style.opacity = (1 - tp).toFixed(3);
          hAtext.style.transform = 'translate3d(0,' + (-90 * tp).toFixed(1) + 'px,0) scale(' + (1 - 0.07 * tp).toFixed(4) + ')';
          hAtext.style.pointerEvents = tp > 0.5 ? 'none' : '';
        }
        if (hAcap) {
          var cp = clamp((pa - 0.74) / 0.18, 0, 1);
          hAcap.style.opacity = cp.toFixed(3);
          hAcap.style.transform = 'translate3d(0,' + ((1 - cp) * 40).toFixed(1) + 'px,0)';
        }
      }

      /* horizontal project gallery */
      hzs.forEach(function (h) {
        if (VW <= 820 || !h.track || !h.sticky) {
          if (h.dist) { h.dist = 0; h.el.style.height = ''; h.track.style.transform = ''; h.items.forEach(function (it) { it.style.transform = ''; it.style.opacity = ''; }); }
          return;
        }
        if (!h.dist || measureDirty) {
          h.dist = Math.max(1, h.track.scrollWidth - h.sticky.clientWidth);
          h.el.style.height = (h.dist + Vh * 1.15).toFixed(0) + 'px';
          h.items.forEach(function (it) { it._ol = it.offsetLeft; it._ow = it.offsetWidth; });
        }
        var r = h.el.getBoundingClientRect();
        var p2 = clamp(-r.top / Math.max(1, r.height - Vh), 0, 1);
        var x = -ease(p2) * h.dist;
        h.track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
        if (h.bar) h.bar.style.transform = 'scaleX(' + p2.toFixed(4) + ')';
        var cwd = h.sticky.clientWidth;
        h.items.forEach(function (it, j) {
          var c = (it._ol || 0) + (it._ow || 0) / 2 + x, d = clamp((c - cwd / 2) / cwd, -1, 1);
          it.style.transform = 'scale(' + (1 - Math.abs(d) * 0.12 * f).toFixed(4) + ')';
          it.style.opacity = (1 - Math.abs(d) * 0.45).toFixed(3);
          if (h.imgs[j]) h.imgs[j].style.transform = 'translate3d(' + (-d * 90 * f).toFixed(1) + 'px,0,0) scale(1.2)';
        });
      });

      /* motto sequence */
      if (seq && seqItems.length) {
        var p3 = prog(seq, Vh), n = seqItems.length, seg = p3 * n + 0.3, on = 0;
        seqItems.forEach(function (it, k) {
          var l = seg - k, o, scl, b, tY = 0, t;
          if (l < 0) { o = 0; scl = 1.6; b = 16; }
          else if (l < 0.35) { t = ease(l / 0.35); o = t; scl = 1.6 - 0.6 * t; b = 16 * (1 - t); }
          else if (l < 0.78 || k === n - 1) { o = 1; scl = 1; b = 0; }
          else { t = clamp((l - 0.78) / 0.22, 0, 1); o = 1 - t; scl = 1 - 0.18 * t; tY = -60 * t; b = 10 * t; }
          if (l >= 0.35) on = Math.max(on, k);
          it.style.opacity = o.toFixed(3);
          it.style.transform = 'translate3d(0,' + tY.toFixed(1) + 'px,0) scale(' + scl.toFixed(4) + ')';
          it.style.filter = b > 0.2 ? 'blur(' + b.toFixed(1) + 'px)' : 'none';
        });
        seqDots.forEach(function (d, k) { if (k === on) d.setAttribute('data-on', ''); else d.removeAttribute('data-on'); });
      }

      /* scroll-highlighted text */
      hls.forEach(function (h) {
        var r = h.el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > Vh + 100) return;
        var p4 = clamp((Vh * 0.82 - r.top) / (r.height + Vh * 0.3), 0, 1), lit = p4 * (h.w.length + 3);
        h.w.forEach(function (w, k) {
          var o = 0.16 + 0.84 * clamp(lit - k, 0, 1);
          if (Math.abs((w._o || 0) - o) > 0.01) { w._o = o; w.style.opacity = o.toFixed(3); }
        });
      });

      /* case cover zoom-out */
      if (cz && czFig) {
        var p5 = ease(prog(cz, Vh)), W2 = czFig.offsetWidth, H2 = czFig.offsetHeight;
        var ix = Math.max(16, (W2 - 1408) / 2) * p5, iy = H2 * 0.08 * p5;
        czFig.style.clipPath = 'inset(' + iy.toFixed(1) + 'px ' + ix.toFixed(1) + 'px round ' + (28 * p5).toFixed(1) + 'px)';
        if (czImg) czImg.style.transform = 'scale(' + (1.22 - 0.22 * p5).toFixed(4) + ')';
      }

      /* contact headline zoom */
      zooms.forEach(function (z) {
        var r = z.parentElement.getBoundingClientRect(), p6 = clamp((Vh - r.top) / (Vh * 0.85), 0, 1);
        z.style.transform = 'scale(' + (1 + 0.55 * (1 - ease(p6))).toFixed(4) + ')';
      });

      /* marquee */
      var speed = 46 * (1 + Math.min(Math.abs(vel) * 0.22, 9));
      tracks.forEach(function (t, k) {
        if (!t._w || measureDirty) t._w = t.scrollWidth / 4;
        var dir = parseFloat(t.getAttribute('data-track')) || 1;
        pos[k] = (pos[k] || 0) + speed * dt * dir;
        var w = t._w || 1, xx = ((pos[k] % w) + w) % w;
        t.style.transform = 'translate3d(' + (-xx).toFixed(2) + 'px,0,0)';
      });
      if (band) {
        skew += (clamp(vel * 0.16, -4, 4) - skew) * 0.1;
        band.style.transform = 'skewY(' + (-skew).toFixed(3) + 'deg)';
      }
      measureDirty = false;
    }

    /* active process step */
    if (steps.length && scrolled) {
      var best = 0, bd = 1e9;
      steps.forEach(function (s2, k) { var r = s2.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - Vh * 0.5); if (d < bd) { bd = d; best = k; } });
      if (best !== stepIdx) {
        stepIdx = best;
        steps.forEach(function (s2, k) { s2.toggleAttribute('data-active', k === best); });
        pns.forEach(function (s2, k) { s2.toggleAttribute('data-active', k === best); });
      }
    }

    if (fine && live && f > 0) {
      /* magnetic buttons */
      mags.forEach(function (el) {
        var r = el.getBoundingClientRect(), ox = el._mx || 0, oy = el._my || 0;
        var cx2 = r.left - ox + r.width / 2, cy2 = r.top - oy + r.height / 2, dx = m.x - cx2, dy2 = m.y - cy2;
        var inside = Math.abs(dx) < r.width / 2 + 24 && Math.abs(dy2) < r.height / 2 + 24;
        var tx = inside ? dx * 0.32 : 0, ty2 = inside ? dy2 * 0.32 : 0;
        el._mx = ox + (tx - ox) * 0.2; el._my = oy + (ty2 - oy) * 0.2;
        if (Math.abs(el._mx) > 0.05 || Math.abs(el._my) > 0.05) el.style.transform = 'translate3d(' + el._mx.toFixed(2) + 'px,' + el._my.toFixed(2) + 'px,0)';
        else if (el.style.transform) el.style.transform = '';
      });
      /* card tilt */
      tilts.forEach(function (c) {
        var tx3 = c._tx || 0, ty3 = c._ty || 0, th = c._th || 0;
        c._rx = (c._rx || 0) + (tx3 - (c._rx || 0)) * 0.12;
        c._ry = (c._ry || 0) + (ty3 - (c._ry || 0)) * 0.12;
        c._h = (c._h || 0) + (th - (c._h || 0)) * 0.12;
        if (Math.abs(c._rx) < 0.01 && Math.abs(c._ry) < 0.01 && c._h < 0.001 && !th) { if (!c._clean) { c.style.transform = ''; c._clean = true; } return; }
        c._clean = false;
        c.style.transform = 'perspective(1100px) rotateX(' + c._rx.toFixed(3) + 'deg) rotateY(' + c._ry.toFixed(3) + 'deg) translate3d(0,' + (-10 * c._h).toFixed(2) + 'px,0)';
      });
    }

    /* cursor */
    if (live && dot && ring) {
      m.rx += (m.x - m.rx) * 0.17; m.ry += (m.y - m.ry) * 0.17;
      dot.style.transform = 'translate3d(' + (m.x - 3) + 'px,' + (m.y - 3) + 'px,0)';
      ring.style.transform = 'translate3d(' + (m.rx - 48).toFixed(2) + 'px,' + (m.ry - 48).toFixed(2) + 'px,0)';
    }
  }
  requestAnimationFrame(tick);
})();
