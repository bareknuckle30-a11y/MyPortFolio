import { useEffect } from 'react';

/**
 * Lightweight 2D canvas interpretation of a point-lattice swell.
 * Four intersecting wave trains and a restrained expanding crest create depth
 * without adding Three.js or another runtime dependency.
 */
export function useTideform(canvasRef, wallRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const wall = wallRef.current;
    if (!canvas || !wall) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let lastFrame = 0;
    const columns = 58;
    const rows = 27;
    const startTime = performance.now();

    function resize() {
      const rect = wall.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      width = rect.width;
      height = rect.height;
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    }

    function draw(now) {
      if (!width || !height) return;
      const elapsed = reduced ? 0 : (now - startTime) * 0.00022;
      ctx.clearRect(0, 0, width, height);

      // A perspective lattice receding towards the upper horizon.
      for (let row = 0; row < rows; row++) {
        const depth = row / (rows - 1);
        const perspective = 0.18 + depth * 0.88;
        const yBase = height * (0.34 + depth * 0.74);
        for (let col = 0; col < columns; col++) {
          const across = (col / (columns - 1)) * 2 - 1;
          const x = width * 0.5 + across * width * 0.49 * perspective;
          const waveA = Math.sin(across * 5.1 + depth * 5.7 + elapsed * 1.3);
          const waveB = Math.sin(across * 8.4 - depth * 3.8 - elapsed * 0.85);
          const waveC = Math.sin(across * 3.2 - depth * 8.1 + elapsed * 0.62);
          const waveD = Math.sin(across * 10.2 + depth * 2.6 + elapsed * 0.48);
          const wave = (waveA * 0.42 + waveB * 0.24 + waveC * 0.2 + waveD * 0.14);
          const crestRadius = ((elapsed * 0.42) % 1.55);
          const radial = Math.hypot(across * 0.78, depth * 0.9 - 0.3);
          const crest = Math.exp(-Math.pow((radial - crestRadius) * 10, 2));
          const y = yBase - wave * (3 + depth * 17) - crest * (2 + depth * 13);
          const alpha = 0.13 + depth * 0.3 + crest * 0.25;
          const radius = 0.55 + depth * 0.65 + crest * 0.22;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          // Silver-grey points with a small amount of violet along the crest.
          ctx.fillStyle = crest > 0.24
            ? `rgba(132, 102, 190, ${Math.min(0.48, alpha + 0.08)})`
            : `rgba(113, 122, 137, ${alpha})`;
          ctx.fill();
        }
      }
    }

    function loop(now) {
      raf = 0;
      if (!visible || document.hidden) return;
      if (now - lastFrame >= 32) {
        draw(now);
        lastFrame = now;
      }
      if (!reduced) raf = requestAnimationFrame(loop);
    }

    function start() {
      if (reduced) {
        draw(performance.now());
        return;
      }
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(wall);
    else window.addEventListener('resize', resize);
    const intersectionObserver = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        }, { threshold: 0.01 })
      : null;
    if (intersectionObserver) intersectionObserver.observe(wall);

    const onVisibility = () => document.hidden ? stop() : start();
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    start();

    return () => {
      stop();
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', resize);
      if (intersectionObserver) intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [canvasRef, wallRef]);
}
