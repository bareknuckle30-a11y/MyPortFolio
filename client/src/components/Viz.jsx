// Looping 6s SVG/CSS animation tiles. Colors come from the card's --c accent.
// Every tile starts mid-cycle (negative delays in styles.css) so the first frame is fully assembled,
// and is a static finished state under prefers-reduced-motion.

const W = 280;
const H = 150;

function Frame({ label, counter, children, title, big }) {
  return (
    <div className={`viz${big ? ' big' : ''}`} aria-hidden="true">
      <span className="lbl">{label}</span>
      {counter ? <span className={`num ${counter}`} /> : null}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
        {children}
      </svg>
    </div>
  );
}

function Build({ big }) {
  return (
    <Frame label="deploy" title="A web page assembling block by block, then deploying" big={big}>
      <rect className="stroke" x="8" y="6" width="264" height="138" rx="10" />
      <rect className="b b1 main" x="20" y="18" width="240" height="14" rx="4" opacity=".9" />
      <rect className="b b2 soft" x="20" y="40" width="50" height="86" rx="5" />
      <rect className="b b3 main" x="80" y="40" width="180" height="38" rx="6" opacity=".35" />
      <rect className="b b4 soft" x="80" y="86" width="55" height="40" rx="5" />
      <rect className="b b5 soft" x="142" y="86" width="55" height="40" rx="5" />
      <rect className="b b6 soft" x="204" y="86" width="56" height="40" rx="5" />
      <g className="b b7">
        <rect x="92" y="52" width="70" height="5" rx="2.5" fill="#fff" opacity=".85" />
        <rect x="92" y="62" width="44" height="5" rx="2.5" fill="#fff" opacity=".45" />
        <rect className="cur" x="140" y="61" width="3" height="7" fill="#fff" />
      </g>
      <rect className="pg main" x="8" y="140" width="264" height="4" rx="2" />
      <g className="ship">
        <rect x="196" y="20" width="62" height="20" rx="10" fill="#0b0a0f" stroke="var(--c)" />
        <path d="M207 30 l4 4 l8 -8" fill="none" stroke="var(--c)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="223" y="34" fontSize="9" fill="#fff">live</text>
      </g>
    </Frame>
  );
}

const BAR_HEIGHTS = [34, 52, 44, 70, 92, 50, 38];

function Analyze({ big }) {
  return (
    <Frame label="sessions" counter="n-a" title="Bars growing, a trend line drawing and a scan finding the peak" big={big}>
      <line className="stroke" x1="16" y1="124" x2="264" y2="124" />
      <line className="stroke" x1="16" y1="84" x2="264" y2="84" />
      <line className="stroke" x1="16" y1="44" x2="264" y2="44" />
      {BAR_HEIGHTS.map((h, i) => (
        <rect key={i} className="vbar" style={{ animationDelay: `${(i * 0.12 - 3.2).toFixed(2)}s` }} x={24 + i * 34} y={124 - h} width="22" height={h} rx="4" />
      ))}
      <rect className="scan" x="14" y="30" width="26" height="94" rx="3" />
      <path className="trend" pathLength="1" d="M35 100 C80 94 112 76 146 58 S212 30 258 20" />
      <circle className="peak" cx="170" cy="40" r="5" fill="#fff" stroke="var(--c)" strokeWidth="2" />
    </Frame>
  );
}

const LANES = [42, 75, 108];
const SERVERS = [0, 1].flatMap((j) => [0, 1, 2, 3].map((i) => ({ x: 160 + i * 28, y: 34 + j * 52, k: j * 4 + i })));

function Scale({ big }) {
  return (
    <Frame label="traffic" counter="n-r" title="Traffic flowing to a growing group of servers" big={big}>
      {SERVERS.map((s) => (
        <path key={`l${s.k}`} className="link" d={`M118 75 C140 75 142 ${s.y + 15} ${s.x} ${s.y + 15}`} />
      ))}
      {LANES.flatMap((y, lane) =>
        [0, 1, 2].map((k) => (
          <circle key={`d${lane}${k}`} className="dot" style={{ animationDelay: `${(k * 0.5 + lane * 0.17).toFixed(2)}s` }} cx="14" cy={y} r="3" />
        ))
      )}
      <circle cx="118" cy="75" r="11" fill="#0b0a0f" stroke="var(--c)" strokeWidth="2" />
      <circle cx="118" cy="75" r="3.5" fill="var(--c)" />
      {SERVERS.map((s) => (
        <g key={`s${s.k}`}>
          <rect className="srv" style={{ animationDelay: `${(0.2 + s.k * 0.5 - 3.2).toFixed(2)}s` }} x={s.x} y={s.y} width="20" height="30" rx="4" />
          <rect x={s.x + 5} y={s.y + 6} width="10" height="3" rx="1.5" fill="#0b0a0f" opacity=".6" />
        </g>
      ))}
      <text x="16" y="141" fontSize="8.5" fill="#9b96ab">p95</text>
      <rect x="38" y="135" width="90" height="5" rx="2.5" fill="rgba(255,255,255,.1)" />
      <rect x="38" y="135" width="22" height="5" rx="2.5" fill="var(--c)" />
      <text x="136" y="141" fontSize="8.5" fill="#9b96ab">flat at 180ms</text>
    </Frame>
  );
}

const GALLERY = [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => ({ r, c, i: r * 3 + c })));
const SHADES = [0.14, 0.2, 0.12, 0.18, 0.1, 0.22, 0.12, 0.16, 0.2];

function Portfolios({ big }) {
  return (
    <Frame label="gallery" counter="n-g" title="Project cards flipping into a gallery" big={big}>
      <rect className="stroke" x="8" y="6" width="264" height="138" rx="10" />
      {GALLERY.map((g) => {
        const x = 24 + g.c * 84;
        const y = 26 + g.r * 38;
        return (
          <g key={g.i} className="flip" style={{ animationDelay: `${(g.i * 0.22 - 3.4).toFixed(2)}s` }}>
            <rect x={x} y={y} width="76" height="32" rx="6" fill="rgba(255,255,255,1)" opacity={SHADES[g.i]} />
            <rect x={x + 8} y={y + 8} width="34" height="4" rx="2" fill="var(--c)" opacity=".8" />
            <rect x={x + 8} y={y + 17} width="52" height="3" rx="1.5" fill="#fff" opacity=".35" />
          </g>
        );
      })}
      <rect className="pick" x="22" y="24" width="80" height="36" rx="8" />
    </Frame>
  );
}

function Tasks({ big }) {
  const cols = [20, 106, 192];
  const heads = ['to do', 'doing', 'done'];
  return (
    <Frame label="board" counter="n-t" title="Task cards moving across kanban columns" big={big}>
      {cols.map((x, i) => (
        <g key={x}>
          <rect x={x} y="22" width="74" height="112" rx="8" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" />
          <text x={x + 8} y="38" fontSize="8" fill="#9b96ab" letterSpacing="1">{heads[i].toUpperCase()}</text>
        </g>
      ))}
      <g>
        <rect x="26" y="108" width="62" height="18" rx="5" fill="rgba(255,255,255,.14)" />
        <rect x="112" y="108" width="62" height="18" rx="5" fill="rgba(255,255,255,.14)" />
        <rect x="198" y="108" width="62" height="18" rx="5" fill="var(--c)" opacity=".35" />
      </g>
      <g className="k1"><rect x="26" y="46" width="62" height="18" rx="5" fill="var(--c)" /><rect x="32" y="53" width="30" height="4" rx="2" fill="#0b0a0f" opacity=".6" /></g>
      <g className="k2"><rect x="26" y="68" width="62" height="18" rx="5" fill="rgba(255,255,255,.28)" /><rect x="32" y="75" width="38" height="4" rx="2" fill="#fff" opacity=".6" /></g>
      <g className="k3"><rect x="112" y="68" width="62" height="18" rx="5" fill="rgba(255,255,255,.2)" /><rect x="118" y="75" width="26" height="4" rx="2" fill="#fff" opacity=".5" /></g>
    </Frame>
  );
}

function Shop({ big }) {
  return (
    <Frame label="checkout" counter="n-o" title="A product dropping into a cart while the order count ticks up" big={big}>
      <rect className="stroke" x="8" y="6" width="264" height="138" rx="10" />
      <g className="prod">
        <rect x="118" y="30" width="44" height="40" rx="8" fill="var(--c)" />
        <circle cx="140" cy="48" r="8" fill="#0b0a0f" opacity=".45" />
        <rect x="126" y="60" width="28" height="4" rx="2" fill="#0b0a0f" opacity=".45" />
      </g>
      <g className="cart">
        <path d="M96 84 h14 l10 34 h46 l10 -26 h-62" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
        <circle cx="126" cy="128" r="5" fill="var(--c)" />
        <circle cx="164" cy="128" r="5" fill="var(--c)" />
      </g>
      <g className="badge">
        <circle cx="190" cy="82" r="11" fill="var(--c)" />
        <text x="190" y="86" fontSize="11" textAnchor="middle" fill="#0b0a0f" fontWeight="700">+1</text>
      </g>
      <rect x="24" y="22" width="60" height="6" rx="3" fill="rgba(255,255,255,.14)" />
      <rect x="24" y="34" width="40" height="6" rx="3" fill="rgba(255,255,255,.08)" />
    </Frame>
  );
}

const STAGE_X = [22, 90, 158, 226];
const STAGE_NAMES = ['ingest', 'clean', 'load', 'report'];

function Pipeline({ big }) {
  return (
    <Frame label="pipeline" counter="n-p" title="Records flowing through ingest, clean, load and report, with an alert that turns healthy" big={big}>
      <line x1="40" y1="78" x2="258" y2="78" stroke="rgba(255,255,255,.18)" strokeWidth="2" strokeDasharray="4 4" />
      {[0, 1, 2, 3, 4].map((k) => (
        <rect key={k} className="rec" style={{ animationDelay: `${(k * 0.6 - 1.6).toFixed(2)}s` }} x="30" y={74 + (k % 2) * 2} width="7" height="7" rx="2" />
      ))}
      {STAGE_X.map((x, i) => (
        <g key={x}>
          <rect x={x - 16} y="52" width="52" height="52" rx="10" fill="#14121b" stroke="rgba(255,255,255,.2)" />
          <text x={x + 10} y="122" fontSize="8" textAnchor="middle" fill="#9b96ab">{STAGE_NAMES[i]}</text>
          {i === 1 ? <circle className="led" cx={x + 10} cy="78" r="6" /> : <circle cx={x + 10} cy="78" r="6" fill="#7fe3b2" />}
        </g>
      ))}
      <g className="alert">
        <rect x="52" y="14" width="96" height="22" rx="11" fill="#14121b" stroke="#ff7a90" />
        <text x="100" y="29" fontSize="9" textAnchor="middle" fill="#ff7a90">null spike: clean</text>
      </g>
      <g className="okmsg">
        <rect x="52" y="14" width="96" height="22" rx="11" fill="#14121b" stroke="#7fe3b2" />
        <text x="100" y="29" fontSize="9" textAnchor="middle" fill="#7fe3b2">all checks pass</text>
      </g>
    </Frame>
  );
}

const MAP = { build: Build, analyze: Analyze, scale: Scale, portfolios: Portfolios, tasks: Tasks, shop: Shop, pipeline: Pipeline };

export default function Viz({ kind, big = false }) {
  const Comp = MAP[kind];
  return Comp ? <Comp big={big} /> : null;
}
