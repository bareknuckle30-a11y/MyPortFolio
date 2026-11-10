import { useRef, useState, useEffect } from 'react';
import { useSpray } from '../hooks/useSpray.js';

const COLORS = [
  { name: 'Build', value: '#b36bff' },
  { name: 'Analyze', value: '#f4f2fa' },
  { name: 'Scale', value: '#ff4fd8' },
];

export default function SprayHero() {
  const wallRef = useRef(null);
  const canvasRef = useRef(null);
  const ringRef = useRef(null);
  const videoRef = useRef(null);
  const colorRef = useRef(COLORS[0].value);
  const clearRef = useRef(() => {});
  const [color, setColor] = useState(COLORS[0].value);

  useSpray({ wallRef, canvasRef, ringRef, colorRef, clearRef });

  function pick(value) {
    colorRef.current = value;
    setColor(value);
  }

  // Autoplay muted loop, unless the visitor prefers reduced motion (then the poster image stays).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.removeAttribute('autoplay');
      v.pause();
    } else {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
  }, []);

  return (
    <section className="wall" ref={wallRef} aria-label="Interactive spray paint wall">
      <div className="wall-top">
        <span className="eyebrow">Grab the can</span>
        <button className="clear" type="button" onClick={() => clearRef.current()}>Wipe the wall</button>
      </div>

      <div className="wall-stage">
        <div className="wall-logo">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/assets/logo-poster.jpg"
          aria-label="Webhead Solutions: Build, Analyze, Scale"
        >
          <source src="/assets/logo-loop.webm" type="video/webm" />
          <source src="/assets/logo-loop.mp4" type="video/mp4" />
        </video>
        </div>

        <div className="hero-avatar" aria-label="Webhead creative developer artwork">
          <div className="avatar-orbit avatar-orbit-one" aria-hidden="true" />
          <div className="avatar-orbit avatar-orbit-two" aria-hidden="true" />
          <img src="/assets/webhead-developer-abstract.jpg" alt="Illustrated developer representing Webhead Solutions" />
          <span className="avatar-tag">Creative minds. Smart builds.</span>
        </div>
      </div>

      <div className="wall-bottom">
        <p className="wall-hint">
          <span className="d">Move over the wall to spray. Hold still and the paint runs. Click for a splat.</span>
          <span className="t">Tap for a splat. Drag sideways to spray.</span>
        </p>
        <div className="swatches" role="radiogroup" aria-label="Paint colour">
          {COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={color === c.value}
              className="sw"
              style={{ '--c': c.value }}
              onClick={() => pick(c.value)}
            >
              <i />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="ring" ref={ringRef} aria-hidden="true" />
    </section>
  );
}
