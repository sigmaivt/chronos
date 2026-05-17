// «Хронос» — Hi-fi V3 hero.
// Dark cosmic landing with a real CSS-3D Rubik's cube, multi-layer parallax,
// epoch-coloured satellites, editorial type and date entry.
//
// Reuses EPOCHS / EPOCH_ORDER / pickCells from cube.jsx.

const HIFI_BG_DEEP = '#04040a';
const HIFI_BG_BASE = '#0a0a14';
const HIFI_INK     = '#f5f3ed';
const HIFI_INK_DIM = 'rgba(245,243,237,0.7)';
const HIFI_INK_FNT = 'rgba(245,243,237,0.42)';

// ── Hooks ────────────────────────────────────────────────────────────────

function useMouseNorm() {
  const [m, setM] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    const fn = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setM({ x, y });
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);
  return m;
}

function useTime() {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf, t0;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      setT((ts - t0) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

// ── Celestials ───────────────────────────────────────────────────────────

function Galaxy({ x, y, w, h, rotate = 0, color, time, spin = 4 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: w, height: h,
      transform: `translate(-50%, -50%) rotate(${(rotate + time * spin).toFixed(2)}deg)`,
      pointerEvents: 'none',
      mixBlendMode: 'screen',
    }}>
      {/* outer halo */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${color}55 0%, ${color}22 32%, transparent 68%)`,
        filter: 'blur(24px)',
      }} />
      {/* spiral arms suggestion */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background:
          `conic-gradient(from 0deg, transparent 0deg, ${color}88 50deg, transparent 130deg, ${color}55 220deg, transparent 290deg)`,
        filter: 'blur(18px)',
        opacity: 0.55,
      }} />
      {/* dust lane darker band */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: w * 0.9, height: h * 0.08,
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0,0,0,0.55)',
        filter: 'blur(8px)',
        borderRadius: '50%',
        opacity: 0.4,
      }} />
      {/* bright core */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: w * 0.22, height: h * 0.22,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, #fff 0%, ${color} 38%, transparent 80%)`,
        filter: 'blur(6px)',
        borderRadius: '50%',
      }} />
    </div>
  );
}

function Planet({ x, y, size, baseColor, edgeColor, ring, ringColor, lightFrom = '30% 30%' }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    }}>
      {ring && (
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          width: size * 2.4, height: size * 0.34,
          transform: `translate(-50%, -50%) rotate(${ring}deg)`,
          borderRadius: '50%',
          background:
            `linear-gradient(180deg, transparent 0%, transparent 44%, ${ringColor}aa 48%, ${ringColor}55 50%, ${ringColor}aa 52%, transparent 56%, transparent 100%)`,
          boxShadow: `inset 0 0 0 1px ${ringColor}33`,
          opacity: 0.85,
        }} />
      )}
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle at ${lightFrom}, ${baseColor} 0%, ${edgeColor} 60%, #000 110%)`,
        boxShadow: `0 0 28px ${baseColor}55, inset -6px -6px 20px rgba(0,0,0,0.7)`,
      }} />
      {/* tiny atmosphere edge */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        boxShadow: `inset 0 0 0 1px ${baseColor}55`,
      }} />
    </div>
  );
}

function Sun({ x, y, size = 90, color = '#ffe5a3' }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    }}>
      {/* far corona */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: size * 7, height: size * 7,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color}26 0%, ${color}0d 35%, transparent 65%)`,
        borderRadius: '50%',
        filter: 'blur(30px)',
      }} />
      {/* mid corona */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: size * 3.2, height: size * 3.2,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color}88 0%, ${color}44 38%, transparent 72%)`,
        borderRadius: '50%',
        filter: 'blur(14px)',
      }} />
      {/* lens flare */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: size * 9, height: 1,
        transform: 'translate(-50%, -50%)',
        background: `linear-gradient(90deg, transparent 0%, ${color}aa 50%, transparent 100%)`,
        opacity: 0.45, filter: 'blur(1.5px)',
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 1, height: size * 7,
        transform: 'translate(-50%, -50%)',
        background: `linear-gradient(180deg, transparent 0%, ${color}aa 50%, transparent 100%)`,
        opacity: 0.4, filter: 'blur(1.5px)',
      }} />
      {/* disc */}
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle, #fff 0%, ${color} 55%, ${color}cc 100%)`,
        boxShadow: `0 0 36px ${color}, 0 0 90px ${color}aa`,
      }} />
    </div>
  );
}

// ── Parallax background ──────────────────────────────────────────────────

function ParallaxBG({ mouse, time, epoch }) {
  const pal = EPOCHS[epoch].colors;

  // Stars generated once, distributed across 3 depth layers, with tints.
  const stars = React.useMemo(() => {
    const tints = ['#ffffff', '#ffffff', '#ffffff', '#cfe2ff', '#fff0c8', '#ffd8e8', '#caf4ff'];
    const arr = [];
    for (let i = 0; i < 460; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: 0.4 + Math.random() * 1.6,
        o: 0.35 + Math.random() * 0.65,
        depth: Math.random() > 0.82 ? 3 : Math.random() > 0.55 ? 2 : 1,
        twinkle: Math.random() * Math.PI * 2,
        tint: tints[Math.floor(Math.random() * tints.length)],
      });
    }
    return arr;
  }, []);

  const off = (factor) => ({
    transform: `translate3d(${(mouse.x * factor).toFixed(1)}px, ${(mouse.y * factor * 0.55).toFixed(1)}px, 0)`,
    transition: 'transform 600ms cubic-bezier(.2,.7,.2,1)',
  });

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {/* deepest gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 62% 42%, ${HIFI_BG_BASE} 0%, ${HIFI_BG_DEEP} 70%)`,
      }} />

      {/* Sun — far behind, in upper-left zone */}
      <div style={{ ...off(-4), position: 'absolute', inset: 0 }}>
        <Sun x="18%" y="14%" size={70} color="#ffe5a3" />
      </div>

      {/* far stars layer */}
      <div style={{ ...off(-7), position: 'absolute', inset: -40 }}>
        {stars.filter((s) => s.depth === 1).map((s, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
            width: s.r, height: s.r, borderRadius: '50%',
            background: s.tint, opacity: s.o * 0.7,
          }} />
        ))}
      </div>

      {/* Galaxy 1 — upper-right, drifts slowly */}
      <div style={{ ...off(-14), position: 'absolute', inset: 0 }}>
        <Galaxy x="86%" y="14%" w={420} h={300}
                rotate={-18} time={time} spin={0.8}
                color="#d18bff" />
      </div>

      {/* nebula blobs — epoch-coloured */}
      <div style={{ ...off(-22), position: 'absolute', inset: 0 }}>
        {[
          { x: '18%', y: '40%', r: 700, c: pal[0] },
          { x: '74%', y: '30%', r: 580, c: pal[1] || pal[0] },
          { x: '52%', y: '88%', r: 820, c: pal[2] || pal[0] },
          { x: '92%', y: '72%', r: 540, c: pal[3] || pal[0] },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', left: b.x, top: b.y,
            width: b.r, height: b.r,
            background: `radial-gradient(circle, ${b.c}55 0%, transparent 60%)`,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(50px)',
            mixBlendMode: 'screen',
            opacity: 0.55,
          }} />
        ))}
      </div>

      {/* mid stars */}
      <div style={{ ...off(-18), position: 'absolute', inset: -40 }}>
        {stars.filter((s) => s.depth === 2).map((s, i) => {
          const tw = 0.55 + Math.sin(time * 1.3 + s.twinkle) * 0.3;
          return (
            <div key={i} style={{
              position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
              width: s.r * 1.3, height: s.r * 1.3, borderRadius: '50%',
              background: s.tint, opacity: s.o * tw,
              boxShadow: `0 0 ${s.r * 4}px ${s.tint}aa`,
            }} />
          );
        })}
      </div>

      {/* Galaxy 2 — lower-left */}
      <div style={{ ...off(-26), position: 'absolute', inset: 0 }}>
        <Galaxy x="11%" y="80%" w={340} h={240}
                rotate={28} time={time} spin={-0.5}
                color="#4fbfd9" />
      </div>

      {/* Planet — Saturn-like, upper-right zone, behind cube */}
      <div style={{ ...off(-30), position: 'absolute', inset: 0 }}>
        <Planet x="94%" y="32%" size={56}
                baseColor="#e7c489" edgeColor="#7a5530"
                ring={-22} ringColor="#f4d49a"
                lightFrom="28% 28%" />
      </div>

      {/* near stars — twinkle harder, biggest, with glow */}
      <div style={{ ...off(-34), position: 'absolute', inset: -40 }}>
        {stars.filter((s) => s.depth === 3).map((s, i) => {
          const tw = 0.5 + Math.sin(time * 2.0 + s.twinkle) * 0.5;
          return (
            <div key={i} style={{
              position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
              width: s.r * 2, height: s.r * 2, borderRadius: '50%',
              background: s.tint, opacity: s.o * tw,
              boxShadow: `0 0 ${s.r * 7}px ${s.tint}, 0 0 ${s.r * 14}px ${s.tint}66`,
            }} />
          );
        })}
      </div>

      {/* Planet — small ice-blue, lower-left */}
      <div style={{ ...off(-42), position: 'absolute', inset: 0 }}>
        <Planet x="6%" y="62%" size={32}
                baseColor="#9ccfff" edgeColor="#1f3a66"
                lightFrom="35% 30%" />
      </div>

      {/* Planet — rusty mars, mid-bottom-right */}
      <div style={{ ...off(-48), position: 'absolute', inset: 0 }}>
        <Planet x="76%" y="86%" size={42}
                baseColor="#e07852" edgeColor="#3a1a10"
                lightFrom="30% 32%" />
      </div>

      {/* orbit rings — very faint, behind cube area */}
      <div style={{
        ...off(-52), position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {[440, 660, 900, 1140].map((r, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: r * 2, height: r * 1.55,
            border: `1px solid rgba(255,255,255,${0.025 + i * 0.012})`,
            borderRadius: '50%',
            transform: `rotate(${i * 6 - 8}deg)`,
          }} />
        ))}
      </div>

      {/* vignette — bring focus to center */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.55) 100%)',
      }} />
    </div>
  );
}

// ── CSS 3D Cube ──────────────────────────────────────────────────────────

function CubeCell({ color, highlighted }) {
  return (
    <div style={{
      position: 'relative',
      borderRadius: 9,
      background: color,
      boxShadow: highlighted
        ? `inset 0 0 0 1px rgba(255,255,255,.22), inset 0 1px 0 rgba(255,255,255,.25), 0 0 22px ${color}cc`
        : `inset 0 0 0 1px rgba(255,255,255,.07), inset 0 1px 0 rgba(255,255,255,.18), inset 0 -1px 0 rgba(0,0,0,.32)`,
      overflow: 'hidden',
      transition: 'box-shadow 280ms ease',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 38%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.22) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

function CubeFace({ size, transform, colors, dim, highlighted, name, onEnter, onLeave }) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: 'absolute', width: size, height: size,
        transform,
        backfaceVisibility: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 6,
        padding: 7,
        background: '#03030a',
        boxSizing: 'border-box',
        opacity: dim ? 0.45 : 1,
        transition: 'opacity 320ms ease',
        boxShadow: highlighted
          ? `0 0 80px ${colors[4]}55, inset 0 0 0 1px rgba(255,255,255,0.08)`
          : 'inset 0 0 0 1px rgba(255,255,255,0.04)',
        cursor: 'pointer',
      }}>
      {colors.map((c, i) => (
        <CubeCell key={i} color={c} highlighted={highlighted} />
      ))}
    </div>
  );
}

function Cube3D({ size = 420, mouse, time, epoch, hoveredFace, onHover }) {
  // Base orientation: front-top-right are visible at rotateX(-22), rotateY(-30)
  const wobX = Math.sin(time * 0.36) * 2.5;
  const wobY = Math.cos(time * 0.28) * 5;
  const rotX = -22 + wobX + mouse.y * 6;
  const rotY = -28 + wobY + mouse.x * 12;

  const half = size / 2;
  const accent = EPOCHS[epoch].colors[0];

  // Map sections to faces.
  // Visible after baseline rotation: top, front, right.
  // Per brief: top = entry, left side surface = context, right = reflection.
  // We'll set:
  //   top    → contemporary palette (entry trio) — colour follows tweak
  //   front  → renaissance (context-context for the cube's "face")
  //   right  → epoch (reflection · линия жизни — matches active tweak)
  //   left   → medieval
  //   back   → ancient
  //   bottom → modern
  const FACES = [
    { name: 'top',    e: epoch,          transform: `rotateX(90deg)  translateZ(${half}px)`, seed: 11 },
    { name: 'front',  e: 'renaissance',  transform: `translateZ(${half}px)`,                  seed: 22 },
    { name: 'right',  e: epoch,          transform: `rotateY(90deg)  translateZ(${half}px)`, seed: 33 },
    { name: 'left',   e: 'medieval',     transform: `rotateY(-90deg) translateZ(${half}px)`, seed: 44 },
    { name: 'back',   e: 'ancient',      transform: `rotateY(180deg) translateZ(${half}px)`, seed: 55 },
    { name: 'bottom', e: 'modern',       transform: `rotateX(-90deg) translateZ(${half}px)`, seed: 66 },
  ];

  return (
    <div style={{
      perspective: 2400, perspectiveOrigin: '50% 50%',
      width: size, height: size, position: 'relative',
    }}>
      {/* glow puddle below */}
      <div style={{
        position: 'absolute', left: '50%', top: '85%',
        width: size * 1.4, height: size * 0.3,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(ellipse, ${accent}66 0%, transparent 65%)`,
        filter: 'blur(28px)',
        pointerEvents: 'none', zIndex: -1,
      }} />
      {/* halo */}
      <div style={{
        position: 'absolute', inset: -size * 0.4,
        background: `radial-gradient(circle, ${accent}38 0%, transparent 55%)`,
        filter: 'blur(50px)',
        pointerEvents: 'none', zIndex: -1,
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`,
        transition: 'transform 240ms cubic-bezier(.3,.7,.3,1)',
      }}>
        {FACES.map((f) => {
          const colors = pickCells(f.e, f.seed);
          return (
            <CubeFace
              key={f.name}
              size={size}
              transform={f.transform}
              colors={colors}
              dim={hoveredFace && hoveredFace !== f.name}
              highlighted={hoveredFace === f.name}
              name={f.name}
              onEnter={() => onHover(f.name)}
              onLeave={() => onHover(null)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Satellites ───────────────────────────────────────────────────────────

function Satellites({ epoch, hoveredFace }) {
  const sats = [
    { ang: -100, label: 'Начало',       sub: 'ввод даты',      face: 'top',   e: 'contemporary' },
    { ang: -50,  label: 'Твоя секунда', sub: '24ч = 5000 лет', face: 'top',   e: 'ancient'      },
    { ang: 10,   label: 'Линия жизни',  sub: 'две шкалы',      face: 'right', e: epoch          },
    { ang: 70,   label: 'Изобретения',  sub: 'что уже было',   face: 'front', e: 'modern'       },
    { ang: 130,  label: 'Современники', sub: 'кто был жив',    face: 'left',  e: 'renaissance'  },
    { ang: 200,  label: 'Эпохи',        sub: 'scroll-лента',   face: 'top',   e: 'medieval'     },
  ];
  const R = 360;

  return (
    <>
      {sats.map((s, i) => {
        const active = hoveredFace === s.face;
        const rad = (s.ang * Math.PI) / 180;
        const x = Math.cos(rad) * R;
        const y = Math.sin(rad) * R * 0.62;
        const e = EPOCHS[s.e];
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', top: '50%',
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) ${active ? 'scale(1.04)' : 'scale(1)'}`,
            opacity: hoveredFace && !active ? 0.32 : 1,
            transition: 'opacity 320ms ease, transform 320ms cubic-bezier(.3,.7,.3,1)',
            width: 170,
            padding: '13px 15px',
            background: active
              ? `linear-gradient(135deg, ${e.colors[0]}33 0%, rgba(15,15,25,0.78) 100%)`
              : 'rgba(15,15,25,0.55)',
            border: `1px solid ${active ? e.colors[0] : 'rgba(245,243,237,0.1)'}`,
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderRadius: 14,
            boxShadow: active
              ? `0 12px 40px ${e.colors[0]}33, inset 0 1px 0 rgba(255,255,255,0.06)`
              : '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
            zIndex: 3,
            cursor: 'pointer',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: e.colors[0],
                boxShadow: `0 0 8px ${e.colors[0]}`,
              }} />
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                letterSpacing: 1.5, color: HIFI_INK_FNT, textTransform: 'uppercase',
              }}>{s.face}</span>
            </div>
            <div style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 22, fontWeight: 700, color: '#fff',
              lineHeight: 1, marginBottom: 4,
            }}>{s.label}</div>
            <div style={{
              fontSize: 13, color: HIFI_INK_DIM,
              fontFamily: '"DM Sans", sans-serif',
            }}>{s.sub}</div>
          </div>
        );
      })}
    </>
  );
}

// ── Composition pieces ───────────────────────────────────────────────────

function TopBar() {
  return (
    <header style={{
      position: 'absolute', top: 36, left: 60, right: 60,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      zIndex: 10,
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 14,
      }}>
        <div style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 30, fontWeight: 800, letterSpacing: -1.2,
          color: HIFI_INK,
        }}>Хронос</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: 2.5, color: HIFI_INK_FNT, textTransform: 'uppercase',
        }}>/ chronos · v0.3</div>
      </div>
      <nav style={{
        display: 'flex', gap: 36, fontSize: 14,
        fontFamily: '"DM Sans", sans-serif',
        color: HIFI_INK_DIM, fontWeight: 400,
      }}>
        {['эпохи', 'современники', 'линия жизни', 'о проекте'].map((s) => (
          <a key={s} style={{
            color: 'inherit', textDecoration: 'none', cursor: 'pointer',
            transition: 'color 200ms',
          }}
             onMouseEnter={(e) => e.currentTarget.style.color = HIFI_INK}
             onMouseLeave={(e) => e.currentTarget.style.color = HIFI_INK_DIM}
          >{s}</a>
        ))}
      </nav>
    </header>
  );
}

function DateInput({ accent }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 14,
      padding: '14px 22px',
      background: 'rgba(245,243,237,0.04)',
      border: '1px solid rgba(245,243,237,0.16)',
      borderRadius: 999,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 15, color: '#fff',
      transition: 'border-color 200ms, background 200ms',
    }}>
      <span style={{ opacity: 0.55 }}>16</span>
      <span style={{ opacity: 0.25 }}>·</span>
      <span style={{ opacity: 0.55 }}>05</span>
      <span style={{ opacity: 0.25 }}>·</span>
      <span style={{ opacity: 0.55 }}>1994</span>
      <span style={{
        marginLeft: 8, paddingLeft: 14,
        borderLeft: '1px solid rgba(245,243,237,0.12)',
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 11, color: HIFI_INK_FNT,
        textTransform: 'uppercase', letterSpacing: 2,
      }}>дата рождения</span>
    </div>
  );
}

function EpochChip({ epoch, active, onClick }) {
  const e = EPOCHS[epoch];
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none', cursor: 'pointer',
        padding: '6px 13px',
        background: active ? `${e.colors[0]}26` : 'transparent',
        border: `1px solid ${active ? e.colors[0] : 'rgba(245,243,237,0.18)'}`,
        borderRadius: 999,
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 13, fontWeight: 500,
        color: active ? '#fff' : HIFI_INK_DIM,
        display: 'inline-flex', alignItems: 'center', gap: 7,
        transition: 'all 220ms',
      }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: e.colors[0],
        boxShadow: active ? `0 0 8px ${e.colors[0]}` : 'none',
      }} />
      {e.ru}
    </button>
  );
}

function BottomTimeline({ epoch, mouse }) {
  const points = [
    { x: 0.0,  label: '~3000 BCE', e: 'ancient' },
    { x: 0.34, label: '500',       e: 'medieval' },
    { x: 0.59, label: '1500',      e: 'renaissance' },
    { x: 0.78, label: '1800',      e: 'modern' },
    { x: 0.93, label: 'XX',        e: 'contemporary' },
    { x: 1.0,  label: 'now',       e: 'contemporary' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 42, left: 60, right: 60, height: 56,
      zIndex: 5, transform: `translateX(${(mouse.x * -8).toFixed(1)}px)`,
      transition: 'transform 500ms cubic-bezier(.2,.7,.2,1)',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 30, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(245,243,237,0.18) 10%, rgba(245,243,237,0.18) 90%, transparent 100%)',
      }} />
      {points.map((p, i) => {
        const e = EPOCHS[p.e];
        const active = p.e === epoch;
        return (
          <div key={i} style={{
            position: 'absolute', left: `${p.x * 100}%`, top: 0,
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: active ? HIFI_INK : HIFI_INK_FNT,
              letterSpacing: 1.4,
              transition: 'color 280ms',
            }}>{p.label}</div>
            <div style={{
              width: active ? 12 : 7, height: active ? 12 : 7, borderRadius: '50%',
              background: e.colors[0],
              boxShadow: active ? `0 0 18px ${e.colors[0]}, 0 0 4px ${e.colors[0]}` : 'none',
              transition: 'all 320ms cubic-bezier(.3,.7,.3,1)',
            }} />
          </div>
        );
      })}
      <div style={{
        position: 'absolute', right: -10, bottom: 6,
        fontFamily: '"DM Sans", sans-serif', fontSize: 11,
        color: HIFI_INK_FNT, fontStyle: 'italic',
      }}>5 000 лет в одной полосе ↑</div>
    </div>
  );
}

// ── Hero composition ─────────────────────────────────────────────────────

function HiFiHero({ t, setTweak }) {
  const mouse = useMouseNorm();
  const time = useTime();
  const [hoveredFace, setHoveredFace] = React.useState(null);
  const accent = EPOCHS[t.epoch].colors[0];

  return (
    <div style={{
      position: 'relative',
      width: '100%', minHeight: '100vh',
      background: HIFI_BG_DEEP,
      color: HIFI_INK,
      overflow: 'hidden',
      fontFamily: '"DM Sans", sans-serif',
    }}>
      <ParallaxBG mouse={mouse} time={time} epoch={t.epoch} />
      <TopBar />

      {/* Main grid */}
      <div style={{
        position: 'relative', zIndex: 4,
        display: 'grid',
        gridTemplateColumns: '5fr 7fr',
        alignItems: 'center',
        padding: '160px 60px 160px',
        gap: 40,
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}>
        {/* Left column — editorial */}
        <div style={{ maxWidth: 560, position: 'relative' }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            letterSpacing: 3, color: HIFI_INK_FNT,
            textTransform: 'uppercase', marginBottom: 28,
          }}>
            <span style={{ color: accent }}>●</span>&nbsp;&nbsp;5000 лет · одна жизнь
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 104, fontWeight: 900, lineHeight: 0.94,
            letterSpacing: -3.5, margin: 0,
            textWrap: 'pretty',
          }}>
            твоё&nbsp;место<br />
            в&nbsp;<em style={{
              fontStyle: 'italic', fontWeight: 400,
              color: accent,
              textShadow: `0 0 30px ${accent}55`,
            }}>истории</em>
          </h1>
          <p style={{
            fontSize: 19, lineHeight: 1.5,
            color: HIFI_INK_DIM, margin: '30px 0 0',
            maxWidth: 480,
          }}>
            Введи дату рождения — построим твою личную линию жизни поверх
            мировой истории. От древних цивилизаций до сегодня.
          </p>

          <div style={{
            marginTop: 40, display: 'flex', gap: 14, alignItems: 'stretch',
            flexWrap: 'wrap',
          }}>
            <DateInput accent={accent} />
            <button
              onClick={() => {}}
              style={{
                padding: '14px 28px',
                background: accent,
                color: '#fff',
                border: 'none', borderRadius: 999,
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 15, fontWeight: 600,
                letterSpacing: 0.3,
                cursor: 'pointer',
                boxShadow: `0 0 0 1px ${accent}, 0 12px 32px ${accent}55`,
                transition: 'transform 200ms, box-shadow 200ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}, 0 18px 42px ${accent}77`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}, 0 12px 32px ${accent}55`;
              }}
            >собрать кубик →</button>
          </div>

          {/* Epoch chips */}
          <div style={{
            marginTop: 38, display: 'flex', gap: 8, flexWrap: 'wrap',
            maxWidth: 520,
          }}>
            {EPOCH_ORDER.map((id) => (
              <EpochChip
                key={id} epoch={id}
                active={id === t.epoch}
                onClick={() => setTweak('epoch', id)}
              />
            ))}
          </div>
        </div>

        {/* Right column — cube stage */}
        <div style={{
          position: 'relative',
          width: '100%', height: 720,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'relative', width: 820, height: 820,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Satellites epoch={t.epoch} hoveredFace={hoveredFace} />
            <Cube3D
              size={400} mouse={mouse} time={time}
              epoch={t.epoch}
              hoveredFace={hoveredFace}
              onHover={setHoveredFace}
            />
          </div>
        </div>
      </div>

      <BottomTimeline epoch={t.epoch} mouse={mouse} />
    </div>
  );
}

Object.assign(window, { HiFiHero });
