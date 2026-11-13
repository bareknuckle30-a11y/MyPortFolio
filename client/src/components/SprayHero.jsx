import { useRef } from 'react';
import { useTideform } from '../hooks/useTideform.js';

export default function SprayHero() {
  const wallRef = useRef(null);
  const tideformRef = useRef(null);

  useTideform(tideformRef, wallRef);

  return (
    <section
      className="wall"
      ref={wallRef}
      aria-label="Webhead digital studio"
      style={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        minHeight: 'clamp(430px, 66vh, 620px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(24px, 4vw, 48px)',
        borderRadius: '26px',
        background: 'linear-gradient(135deg, #16181b 0%, #24272f 52%, #34313f 100%)',
        border: '1px solid rgba(190, 195, 207, 0.18)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.06), 0 28px 80px rgba(0,0,0,.28)',
      }}
    >
      <canvas
        className="tideform-canvas"
        ref={tideformRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          opacity: 0.95,
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: [
            'radial-gradient(ellipse at 50% 62%, rgba(155, 133, 204, .15), transparent 38%)',
            'linear-gradient(180deg, rgba(20,22,28,.12), transparent 45%, rgba(20,22,28,.38))',
          ].join(', '),
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '11px',
            color: '#c1c4ce',
            fontFamily: 'var(--font-mono)',
            fontSize: '.72rem',
            letterSpacing: '.18em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ width: '24px', height: '2px', background: '#a58bd8' }} />
          Independent Digital Studio
        </span>
        <span
          style={{
            color: '#9298a5',
            fontFamily: 'var(--font-mono)',
            fontSize: '.68rem',
            letterSpacing: '.12em',
          }}
        >
          EST. DIGITAL / 01
        </span>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '850px',
          margin: 'auto',
          padding: '48px 0',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: '#a9aeba',
            fontFamily: 'var(--font-mono)',
            fontSize: '.7rem',
            letterSpacing: '.24em',
            textTransform: 'uppercase',
            marginBottom: '18px',
          }}
        >
          Design · Technology · Experience
        </div>
        <div
          style={{
            color: '#f0f1f4',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.6rem, 11vw, 8.6rem)',
            fontWeight: 700,
            lineHeight: '.88',
            letterSpacing: '-.085em',
            textShadow: '0 10px 48px rgba(0,0,0,.24)',
          }}
        >
          WEBHEAD<span style={{ color: '#a58bd8' }}>.</span>
        </div>
        <p
          style={{
            maxWidth: '510px',
            margin: '25px auto 0',
            color: '#b4b8c2',
            fontSize: 'clamp(.95rem, 1.6vw, 1.12rem)',
            lineHeight: 1.7,
            letterSpacing: '.015em',
          }}
        >
          Thoughtful digital experiences, shaped by design and built for what comes next.
        </p>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(205,210,220,.15)',
          color: '#a4a9b5',
          fontFamily: 'var(--font-mono)',
          fontSize: '.66rem',
          letterSpacing: '.13em',
          textTransform: 'uppercase',
        }}
      >
        <span>Build with clarity</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#a58bd8',
              boxShadow: '0 0 12px rgba(165,139,216,.7)',
            }}
          />
          Ideas into digital reality
        </span>
      </div>
    </section>
  );
}
