import { useEffect } from 'react';

/**
 * Spray-paint interaction for the hero wall.
 *  - pointer move sprays gaussian-spread dots (faster movement = tighter spray)
 *  - holding still for ~0.6s makes a drip (50-170px, slowing, ending in a round bead)
 *  - click / tap makes a splat (~120 dots + 3 drips)
 *  - paint fades slowly; `clearRef.current()` wipes it at once
 *  - touch: tap = splat, sideways drag = spray, vertical swipe scrolls (touch-action: pan-y in CSS)
 * The loop pauses while the wall is off-screen or the tab is hidden.
 */
export function useSpray({ wallRef, canvasRef, ringRef, colorRef, clearRef }) {
  useEffect(() => {
    const wall = wallRef.current;
    const cv = canvasRef.current;
    const ring = ringRef.current;
    if (!wall || !cv || !ring) return undefined;
    const ctx = cv.getContext('2d');
    if (!ctx) return undefined;

    let W = 0;
    let H = 0;
    let inside = false;
    let px = 0;
    let py = 0;
    let lx = 0;
    let ly = 0;
    let speed = 0;
    let dwell = 0;
    let frame = 0;
    let drips = [];
    let raf = 0;
    let visible = true;
    let running = false;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
    const dot = (x, y, r, a) => {
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    function spray(x, y, spread, n, alpha) {
      ctx.fillStyle = colorRef.current;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = Math.abs(gauss()) * spread;
        dot(x + Math.cos(a) * d, y + Math.sin(a) * d, rnd(0.4, 1.7), rnd(0.35, 0.95) * alpha);
      }
      dot(x, y, spread * 0.28, 0.2 * alpha);
      ctx.globalAlpha = 1;
    }

    function addDrip(x, y) {
      drips.push({ x: x + gauss() * 5, y: y + 4, len: 0, max: rnd(50, 170), v: rnd(1.4, 2.6), w: rnd(2.2, 4), c: colorRef.current });
    }

    function seed() {
      const keep = colorRef.current;
      colorRef.current = '#B8BEC8';
      spray(W * 0.16, H * 0.3, 24, 105, 1);
      addDrip(W * 0.16 - 8, H * 0.3 + 10);
      addDrip(W * 0.16 + 10, H * 0.3 + 14);
      spray(W * 0.86, H * 0.7, 22, 90, 1);
      addDrip(W * 0.86, H * 0.7 + 12);
      colorRef.current = keep;
    }

    function size() {
      const r = wall.getBoundingClientRect();
      if (!r.width || !r.height) return;
      // Ignore tiny height changes (mobile browser toolbars sliding in and out) so paint is not wiped while scrolling.
      if (W && Math.abs(r.width - W) < 1 && Math.abs(r.height - H) < 90) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drips = [];
      seed();
    }

    function pos(e) {
      const r = wall.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    }
    const isUi = (e) => e.target.closest && e.target.closest('button, a');

    function onMove(e) {
      if (isUi(e)) {
        inside = false;
        ring.classList.remove('on');
        return;
      }
      pos(e);
      speed = Math.max(speed, Math.hypot(px - lx, py - ly));
      lx = px;
      ly = py;
      inside = true;
      ring.style.transform = `translate(${px}px,${py}px)`;
      ring.style.borderColor = colorRef.current;
      ring.classList.add('on');
    }
    function onLeave() {
      inside = false;
      ring.classList.remove('on');
    }
    function onDown(e) {
      if (isUi(e)) return;
      pos(e);
      lx = px;
      ly = py;
      inside = true;
      ring.classList.add('down');
      spray(px, py, 34, 84, 1);
      addDrip(px - 10, py);
      addDrip(px + 9, py + 6);
      addDrip(px, py + 10);
    }
    function onUp() {
      ring.classList.remove('down');
      if (coarse) inside = false;
    }

    function step() {
      frame++;
      if (inside) {
        const sp = Math.min(speed, 40);
        speed *= 0.7;
        spray(px, py, sp > 14 ? 9 : sp > 4 ? 13 : 18, sp > 14 ? 10 : 18, 0.9);
        if (sp < 3) dwell++;
        else dwell = Math.max(0, dwell - 3);
        if (dwell > 38) {
          addDrip(px, py);
          dwell = 12;
        }
      }
      for (let i = drips.length - 1; i >= 0; i--) {
        const d = drips[i];
        const y0 = d.y + d.len;
        d.len += d.v;
        d.v *= 0.994;
        const y1 = d.y + d.len;
        ctx.globalAlpha = 0.95;
        ctx.strokeStyle = d.c;
        ctx.lineWidth = d.w;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(d.x, y0);
        ctx.lineTo(d.x, y1);
        ctx.stroke();
        if (d.len >= d.max || d.v < 0.15) {
          ctx.fillStyle = d.c;
          dot(d.x, y1, d.w * 0.75, 0.95);
          ctx.globalAlpha = 1;
          drips.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1;
      // Slow fade so the wall cleans itself.
      if (frame % 8 === 0) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 0.03;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }

    function loop() {
      step();
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    clearRef.current = () => {
      ctx.clearRect(0, 0, W, H);
      drips = [];
    };

    wall.addEventListener('pointermove', onMove);
    wall.addEventListener('pointerleave', onLeave);
    wall.addEventListener('pointerdown', onDown);
    wall.addEventListener('pointerup', onUp);
    wall.addEventListener('pointercancel', onUp);

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(size) : null;
    if (ro) ro.observe(wall);
    else {
      size();
      window.addEventListener('resize', size);
    }

    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        })
      : null;
    if (io) io.observe(wall);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => {
      stop();
      clearRef.current = () => {};
      wall.removeEventListener('pointermove', onMove);
      wall.removeEventListener('pointerleave', onLeave);
      wall.removeEventListener('pointerdown', onDown);
      wall.removeEventListener('pointerup', onUp);
      wall.removeEventListener('pointercancel', onUp);
      document.removeEventListener('visibilitychange', onVis);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', size);
      if (io) io.disconnect();
    };
  }, [wallRef, canvasRef, ringRef, colorRef, clearRef]);
}
