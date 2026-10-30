// Motion engine: scroll-driven hero, gallery and text effects, cursor, menu and page curtain.
(function () {
  const root = document.querySelector('.ap');
  if (!root) return;

  const qs = (s) => root.querySelector(s);
  const qsa = (s) => Array.from(root.querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

  const EFFECTS = 8; // 0 to 10; 0 turns all scroll effects off
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fxF = () => (reduced() ? 0 : EFFECTS / 8);
  const isStill = () => fxF() === 0;
  const V = () => window.innerHeight || 800;
  const getY = () => window.scrollY || (document.scrollingElement && document.scrollingElement.scrollTop) || 0;

  const touched = new Set();
  const S = (el, prop, val) => { if (!el) return; el.style[prop] = val; touched.add(el); };
  const clearInline = () => {
    touched.forEach((el) => {
      el.style.transform = ''; el.style.opacity = ''; el.style.filter = '';
      el.style.clipPath = ''; el.style.height = ''; el.style.pointerEvents = ''; el.style.maxWidth = '';
    });
    touched.clear();
    hzs.forEach((s) => { s._dist = 0; });
  };

  const setVh = () => root.style.setProperty('--vh', Math.min(V(), 1500) + 'px');
  setVh();

  /* ---------------- Elements ---------------- */
  const pars = qsa('[data-par]');
  const tilts = qsa('[data-tilt]');
  const mags = qsa('[data-mag]');
  const tracks = qsa('[data-track]');
  const band = qs('[data-band]');
  const hA = qs('[data-hero-a]'); const hAfig = qs('[data-a-fig]'); const hAphoto = qs('[data-a-photo]');
  const hAtext = qs('[data-a-text]'); const hAcap = qs('[data-a-cap]');
  const hzs = qsa('[data-hz]').map((s) => {
    s._track = s.querySelector('[data-hz-track]'); s._sticky = s.querySelector('[data-hz-sticky]');
    s._items = Array.from(s.querySelectorAll('[data-hz-item]')); s._bar = s.querySelector('[data-hz-bar]');
    s._imgs = s._items.map((it) => it.querySelector('[data-hz-img]')); s._dist = 0;
    return s;
  });
  const seq = qs('[data-seq]'); const seqItems = qsa('[data-seq-item]'); const seqDots = qsa('[data-seq-dot]');
  const hls = qsa('[data-hl]').map((b) => { b._w = Array.from(b.querySelectorAll('.hlw')); return b; });
  const cz = qs('[data-cz]'); const czFig = qs('[data-cz-fig]'); const czImg = qs('[data-cz-img]');
  const zooms = qsa('[data-zoomtext]');
  const steps = qsa('[data-step]'); const pns = qsa('[data-pn]');
  const dot = qs('[data-cur-dot]'); const ring = qs('[data-cur-ring]');
  const curtain = qs('[data-curtain]'); const curtainT = qs('[data-curtain-title]');

  /* ---------------- Reveals and counters ---------------- */
  const counters = [];
  const startCount = (el) => {
    if (isStill()) return;
    const real = el.querySelector('.cnt-real'); const anim = el.querySelector('[data-cnt-anim]');
    if (!real || !anim) return;
    const txt = real.textContent || '';
    if (!/\d/.test(txt)) return;
    el.setAttribute('data-counting', '');
    counters.push({ el, anim, txt, t0: performance.now() + 150 });
  };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.setAttribute('data-in', '');
      if (en.target.hasAttribute('data-count')) startCount(en.target);
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 }) : null;
  qsa('[data-rv]').forEach((el) => {
    if (!io || reduced()) el.setAttribute('data-in', ''); else io.observe(el);
  });

  /* ---------------- Pointer ---------------- */
  const m = { x: -200, y: -200, rx: -200, ry: -200 };
  let fine = false;
  try { fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) {}
  if (fine) root.setAttribute('data-fine', '');
  let live = false; let hoverCard = null; let cs = '';

  document.addEventListener('mousemove', (e) => {
    m.x = e.clientX; m.y = e.clientY;
    if (!live) { live = true; root.setAttribute('data-live', ''); m.rx = e.clientX; m.ry = e.clientY; }
    const card = e.target && e.target.closest ? e.target.closest('[data-tilt]') : null;
    if (card !== hoverCard) {
      if (hoverCard) { hoverCard._tx = 0; hoverCard._ty = 0; hoverCard._th = 0; }
      hoverCard = card;
    }
    if (card && fine) {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; const py = (e.clientY - r.top) / r.height;
      const max = 10 * fxF();
      card._ty = (px - 0.5) * 2 * max; card._tx = -(py - 0.5) * 2 * max; card._th = 1;
      card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    }
  }, { passive: true });
  document.addEventListener('mouseover', (e) => {
    const t = e.target; let next = '';
    if (t && t.closest) {
      if (t.closest('[data-tilt]')) next = 'card';
      else if (t.closest('a,button,[data-mag]')) next = 'link';
    }
    if (next !== cs) { cs = next; root.setAttribute('data-cs', next); }
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => { live = false; root.removeAttribute('data-live'); });

  let measureDirty = true;
  window.addEventListener('resize', () => { measureDirty = true; setVh(); });

  /* ---------------- Menu ---------------- */
  const burger = qs('.burger'); const menu = qs('.menu');
  const setMenu = (open) => {
    if (!burger || !menu) return;
    root.setAttribute('data-menu', open ? '1' : '0');
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
  };
  if (burger) burger.addEventListener('click', () => setMenu(root.getAttribute('data-menu') !== '1'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.getAttribute('data-menu') === '1') { setMenu(false); burger.focus(); }
  });

  /* ---------------- Links ---------------- */
  const scrollToSec = (id, behavior) => {
    const el = document.getElementById(id); if (!el) return;
    const y = el.getBoundingClientRect().top + getY() - (id === 'top' ? 0 : 60);
    window.scrollTo({ top: Math.max(0, y), behavior: behavior || (reduced() ? 'auto' : 'smooth') });
  };
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) {
      e.preventDefault();
      const wasOpen = root.getAttribute('data-menu') === '1';
      setMenu(false);
      setTimeout(() => scrollToSec(url.hash.slice(1)), wasOpen ? 380 : 0);
      return;
    }
    const label = a.getAttribute('data-curtain-label');
    if (label && curtain && !isStill()) {
      e.preventDefault();
      if (curtainT) curtainT.textContent = label;
      requestAnimationFrame(() => curtain.setAttribute('data-phase', 'in'));
      try { sessionStorage.setItem('curtain', label); } catch (err) {}
      setTimeout(() => { location.href = a.href; }, 760);
    }
  });

  // Finish the curtain started on the previous page.
  let arriving = null;
  try { arriving = sessionStorage.getItem('curtain'); sessionStorage.removeItem('curtain'); } catch (e) {}
  if (arriving && curtain) {
    requestAnimationFrame(() => {
      curtain.setAttribute('data-phase', 'out');
      setTimeout(() => curtain.setAttribute('data-phase', ''), 760);
    });
  }
  window.addEventListener('pageshow', (e) => { if (e.persisted && curtain) curtain.setAttribute('data-phase', ''); });

  /* ---------------- Frame loop ---------------- */
  let sy = getY(); let vel = 0; let skew = 0; let last = 0; let wasStill; let activeStep; let hashDone = !location.hash;
  const pos = [];

  function tick(ts) {
    requestAnimationFrame(tick);
    const still = isStill();
    if (still !== wasStill) {
      wasStill = still;
      if (still) { root.setAttribute('data-still', ''); qsa('[data-rv]').forEach((el) => el.setAttribute('data-in', '')); }
      else root.removeAttribute('data-still');
      clearInline();
    }
    const dt = Math.min(64, last ? ts - last : 16) / 1000; last = ts;
    const f = fxF();
    const H0 = V();
    const VW = window.innerWidth || 1280;
    const y = getY(); const dy = y - sy; sy = y;
    vel += (dy - vel) * 0.14;
    const prog = (el) => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - H0), 0, 1); };

    if (counters.length) {
      const now = performance.now();
      for (let i = counters.length - 1; i >= 0; i--) {
        const c = counters[i];
        const k = clamp((now - c.t0) / 1600, 0, 1); const e = 1 - Math.pow(1 - k, 3);
        if (k >= 1 || !c.el.isConnected) { c.el.removeAttribute('data-counting'); c.anim.textContent = ''; counters.splice(i, 1); continue; }
        c.anim.textContent = c.txt.replace(/\d+/g, (mm) => String(Math.round(parseInt(mm, 10) * e)));
      }
    }

    if (!still) {
      /* Parallax */
      for (const el of pars) {
        const p = el.parentElement.getBoundingClientRect();
        if (p.bottom < -300 || p.top > H0 + 300) continue;
        const sp = parseFloat(el.getAttribute('data-par')) || 0;
        const sc = parseFloat(el.getAttribute('data-par-scale')) || 1;
        let ty = -(p.top + p.height / 2 - H0 / 2) * sp * f;
        if (sc > 1) { const lim = ((sc - 1) / 2) * p.height; ty = clamp(ty, -lim, lim); }
        S(el, 'transform', 'translate3d(0,' + ty.toFixed(2) + 'px,0)' + (sc > 1 ? ' scale(' + sc + ')' : ''));
      }

      /* Hero: the face circle grows into a card the shape of the photo */
      if (hA && hAfig && hAphoto) {
        const p = prog(hA);
        const e = ease(clamp(p / 0.72, 0, 1));
        const W = hAfig.offsetWidth; const H = hAfig.offsetHeight;
        const ph = hAphoto.offsetHeight; const pw = hAphoto.offsetWidth;
        const pl = (W - pw) / 2;
        const fx = pl + pw * 0.5; const fy = ph * 0.34;
        const head = ph * 0.5;
        const d0 = clamp(Math.min(W, H) * 0.24, 130, 190);
        const s = (d0 / head) + (1 - d0 / head) * e;
        S(hAphoto, 'transform', 'scale(' + s.toFixed(4) + ')');
        const endW = Math.min(W, pw);
        const cw = d0 + (endW - d0) * e; const ch = d0 + (H - d0) * e;
        const cx = fx + (W / 2 - fx) * e; const cy = fy + (H / 2 - fy) * e;
        const top = clamp(cy - ch / 2, 0, H); const left = clamp(cx - cw / 2, 0, W);
        const bottom = clamp(H - (cy + ch / 2), 0, H); const right = clamp(W - (cx + cw / 2), 0, W);
        const rad = d0 / 2 + (28 - d0 / 2) * e;
        S(hAfig, 'clipPath', 'inset(' + top.toFixed(1) + 'px ' + right.toFixed(1) + 'px ' + bottom.toFixed(1) + 'px ' + left.toFixed(1) + 'px round ' + rad.toFixed(1) + 'px)');
        const ty0 = H * 0.83 - fy;
        S(hAfig, 'transform', 'translate3d(0,' + (ty0 * (1 - e)).toFixed(1) + 'px,0)');
        if (hAtext) {
          const tp = clamp(p / 0.32, 0, 1);
          S(hAtext, 'opacity', (1 - tp).toFixed(3));
          S(hAtext, 'transform', 'translate3d(0,' + (-90 * tp * Math.min(f, 1.25)).toFixed(1) + 'px,0) scale(' + (1 - 0.07 * tp).toFixed(4) + ')');
          S(hAtext, 'pointerEvents', tp > 0.5 ? 'none' : '');
        }
        if (hAcap) {
          // The caption sits beside the photo, so it needs the free space on the left.
          const room = (W - endW) / 2 - 40;
          const cp = room < 180 ? 0 : clamp((p - 0.74) / 0.18, 0, 1);
          S(hAcap, 'maxWidth', Math.min(360, Math.max(0, room)).toFixed(0) + 'px');
          S(hAcap, 'opacity', cp.toFixed(3));
          S(hAcap, 'transform', 'translate3d(0,' + ((1 - cp) * 40).toFixed(1) + 'px,0)');
        }
      }

      /* Horizontal project gallery */
      for (const s of hzs) {
        if (VW <= 820 || !s._track || !s._sticky) { if (s._dist) { s._dist = 0; clearInline(); } continue; }
        if (!s._dist || measureDirty) {
          s._dist = Math.max(1, s._track.scrollWidth - s._sticky.clientWidth);
          S(s, 'height', (s._dist + H0 * 1.15).toFixed(0) + 'px');
          s._items.forEach((it) => { it._ol = it.offsetLeft; it._ow = it.offsetWidth; });
        }
        const r = s.getBoundingClientRect();
        const p = clamp(-r.top / Math.max(1, r.height - H0), 0, 1);
        const x = -ease(p) * s._dist;
        S(s._track, 'transform', 'translate3d(' + x.toFixed(2) + 'px,0,0)');
        if (s._bar) S(s._bar, 'transform', 'scaleX(' + p.toFixed(4) + ')');
        const cw = s._sticky.clientWidth;
        s._items.forEach((it, i) => {
          const c = (it._ol || 0) + (it._ow || 0) / 2 + x;
          const d = clamp((c - cw / 2) / cw, -1, 1);
          S(it, 'transform', 'scale(' + (1 - Math.abs(d) * 0.12 * Math.min(f, 1.25)).toFixed(4) + ')');
          S(it, 'opacity', (1 - Math.abs(d) * 0.45).toFixed(3));
          const img = s._imgs[i];
          if (img) S(img, 'transform', 'translate3d(' + (-d * 90 * f).toFixed(1) + 'px,0,0) scale(1.2)');
        });
      }

      /* Motto sequence */
      if (seq && seqItems.length) {
        const p = prog(seq); const n = seqItems.length;
        const seg = p * n + 0.3; let on = 0;
        seqItems.forEach((it, i) => {
          const l = seg - i; let o; let sc; let b; let ty = 0;
          if (l < 0) { o = 0; sc = 1.6; b = 16; }
          else if (l < 0.35) { const t = ease(l / 0.35); o = t; sc = 1.6 - 0.6 * t; b = 16 * (1 - t); }
          else if (l < 0.78 || i === n - 1) { o = 1; sc = 1; b = 0; on = i; }
          else { const t = clamp((l - 0.78) / 0.22, 0, 1); o = 1 - t; sc = 1 - 0.18 * t; ty = -60 * t; b = 10 * t; }
          if (l >= 0.35) on = Math.max(on, i);
          S(it, 'opacity', o.toFixed(3));
          S(it, 'transform', 'translate3d(0,' + ty.toFixed(1) + 'px,0) scale(' + (1 + (sc - 1) * Math.min(f, 1.25)).toFixed(4) + ')');
          S(it, 'filter', b > 0.2 ? 'blur(' + (b * Math.min(f, 1)).toFixed(1) + 'px)' : 'none');
        });
        seqDots.forEach((d, i) => { if (i === on) d.setAttribute('data-on', ''); else d.removeAttribute('data-on'); });
      }

      /* Scroll-highlighted text */
      for (const b of hls) {
        const r = b.getBoundingClientRect();
        if (r.bottom < -100 || r.top > H0 + 100) continue;
        const p = clamp((H0 * 0.82 - r.top) / (r.height + H0 * 0.3), 0, 1);
        const n = b._w.length; const lit = p * (n + 3);
        b._w.forEach((w, i) => {
          const o = 0.16 + 0.84 * clamp(lit - i, 0, 1);
          if (Math.abs((w._o || 0) - o) > 0.01) { w._o = o; S(w, 'opacity', o.toFixed(3)); }
        });
      }

      /* Case cover: full-bleed zooms out into a framed card */
      if (cz && czFig) {
        const p = prog(cz); const e = ease(p);
        const W = czFig.offsetWidth; const H = czFig.offsetHeight;
        const ix = Math.max(16, (W - 1408) / 2) * e; const iy = H * 0.08 * e;
        S(czFig, 'clipPath', 'inset(' + iy.toFixed(1) + 'px ' + ix.toFixed(1) + 'px round ' + (28 * e).toFixed(1) + 'px)');
        S(czImg, 'transform', 'scale(' + (1.22 - 0.22 * e).toFixed(4) + ')');
      }

      /* Contact headline zooms into place */
      for (const z of zooms) {
        const r = z.parentElement.getBoundingClientRect();
        const p = clamp((H0 - r.top) / (H0 * 0.85), 0, 1);
        S(z, 'transform', 'scale(' + (1 + 0.55 * (1 - ease(p)) * Math.min(f, 1.25)).toFixed(4) + ')');
      }

      /* Marquee */
      const speed = 46 * (1 + Math.min(Math.abs(vel) * 0.22, 9) * Math.max(f, 0.15));
      tracks.forEach((t, i) => {
        if (!t._w || measureDirty) t._w = t.scrollWidth / 2;
        const dir = parseFloat(t.getAttribute('data-track')) || 1;
        pos[i] = (pos[i] || 0) + speed * dt * dir;
        const w = t._w || 1; const x = ((pos[i] % w) + w) % w;
        S(t, 'transform', 'translate3d(' + (-x).toFixed(2) + 'px,0,0)');
      });
      if (band) {
        const target = clamp(vel * 0.16, -4, 4) * f;
        skew += (target - skew) * 0.1;
        S(band, 'transform', 'skewY(' + (-skew).toFixed(3) + 'deg)');
      }
      measureDirty = false;
    }

    /* Jump to the linked section once the page has its final height */
    if (!hashDone) { hashDone = true; scrollToSec(location.hash.slice(1), 'auto'); }

    /* Active process step */
    if (steps.length) {
      let best = 0; let bd = 1e9;
      steps.forEach((s, i) => { const r = s.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - H0 * 0.5); if (d < bd) { bd = d; best = i; } });
      if (best !== activeStep) {
        activeStep = best;
        steps.forEach((s, i) => { if (i === best) s.setAttribute('data-active', ''); else s.removeAttribute('data-active'); });
        pns.forEach((s, i) => { if (i === best) s.setAttribute('data-active', ''); else s.removeAttribute('data-active'); });
      }
    }

    /* Magnetic buttons */
    if (fine && live) {
      for (const el of mags) {
        const r = el.getBoundingClientRect();
        const ox = el._mx || 0; const oy = el._my || 0;
        const cx = r.left - ox + r.width / 2; const cy = r.top - oy + r.height / 2;
        const dx = m.x - cx; const dy2 = m.y - cy;
        const inside = Math.abs(dx) < r.width / 2 + 24 && Math.abs(dy2) < r.height / 2 + 24;
        const tx = inside ? dx * 0.32 * f : 0; const ty = inside ? dy2 * 0.32 * f : 0;
        el._mx = ox + (tx - ox) * 0.2; el._my = oy + (ty - oy) * 0.2;
        if (Math.abs(el._mx) > 0.05 || Math.abs(el._my) > 0.05) el.style.transform = 'translate3d(' + el._mx.toFixed(2) + 'px,' + el._my.toFixed(2) + 'px,0)';
        else if (el.style.transform) el.style.transform = '';
      }
    }

    /* Card tilt */
    for (const c of tilts) {
      const tx = c._tx || 0; const ty = c._ty || 0; const th = c._th || 0;
      c._rx = (c._rx || 0) + (tx - (c._rx || 0)) * 0.12;
      c._ry = (c._ry || 0) + (ty - (c._ry || 0)) * 0.12;
      c._h = (c._h || 0) + (th - (c._h || 0)) * 0.12;
      if (Math.abs(c._rx) < 0.01 && Math.abs(c._ry) < 0.01 && c._h < 0.001 && !th) { if (!c._clean) { c.style.transform = ''; c._clean = true; } continue; }
      c._clean = false;
      c.style.transform = 'perspective(1100px) rotateX(' + c._rx.toFixed(3) + 'deg) rotateY(' + c._ry.toFixed(3) + 'deg) translate3d(0,' + (-10 * c._h * Math.min(f, 1.25)).toFixed(2) + 'px,0)';
    }

    /* Cursor */
    if (live && dot && ring) {
      m.rx += (m.x - m.rx) * 0.17;
      m.ry += (m.y - m.ry) * 0.17;
      dot.style.transform = 'translate3d(' + (m.x - 3) + 'px,' + (m.y - 3) + 'px,0)';
      ring.style.transform = 'translate3d(' + (m.rx - 48).toFixed(2) + 'px,' + (m.ry - 48).toFixed(2) + 'px,0)';
    }
  }
  requestAnimationFrame(tick);
})();
