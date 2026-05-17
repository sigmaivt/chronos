// Isometric Rubik's cube — wireframe edition.
// Three visible faces (top, left, right), each 3×3, drawn as SVG polygons
// with a "sketchy" hand-drawn look (dashed strokes, jittered fills).

const EPOCHS = /*EPOCHS*/ {
  ancient: {
    id: 'ancient',
    ru: 'Древний мир',
    range: '~3000 BCE – 500',
    colors: ['#c9a14a', '#a06a2d', '#c25a3b', '#e3b97a', '#7a4a26'],
    ink: '#5a3a14',
  },
  medieval: {
    id: 'medieval',
    ru: 'Средневековье',
    range: '500 – 1400',
    colors: ['#2d4a8a', '#a8b0c0', '#1f2f5c', '#5d75aa', '#d8dde6'],
    ink: '#1c2a4a',
  },
  renaissance: {
    id: 'renaissance',
    ru: 'Ренессанс',
    range: '1400 – 1650',
    colors: ['#2e7d5b', '#7a2238', '#e8dcc0', '#4ea37e', '#a8344e'],
    ink: '#3a1a20',
  },
  modern: {
    id: 'modern',
    ru: 'Новое время',
    range: '1650 – 1900',
    colors: ['#1f4a2a', '#6b3a2a', '#bf945a', '#3f7a4a', '#8a5a32'],
    ink: '#2a1a10',
  },
  contemporary: {
    id: 'contemporary',
    ru: 'Современность',
    range: '1900 – сейчас',
    colors: ['#0066ff', '#d23df0', '#f5f5f7', '#22d3ee', '#fbbf24'],
    ink: '#0a0a14',
  },
};

const EPOCH_ORDER = ['ancient', 'medieval', 'renaissance', 'modern', 'contemporary'];

// Pick 9 cells from an epoch palette, deterministically (so same epoch → same look).
function pickCells(epoch, seed = 0) {
  const pal = EPOCHS[epoch].colors;
  // simple LCG for stable jitter
  let s = (seed * 2654435761) >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return (s >>> 8) / 0xffffff; };
  const out = [];
  for (let i = 0; i < 9; i++) {
    out.push(pal[Math.floor(rnd() * pal.length)]);
  }
  return out;
}

// IsoCube — `size` is the edge length in px. Renders centered around (0,0)
// inside its own SVG viewBox. Pass `faceEpochs` to colour individual faces.
function IsoCube({
  size = 240,
  faceEpochs = { top: 'contemporary', left: 'ancient', right: 'renaissance' },
  sketchy = true,
  labels = true,
  glow = true,
  hideRight = false,
  hideLeft = false,
  highlight = null, // 'top' | 'left' | 'right' | null
  // Storyboard extras:
  glowFace = null,         // 'top' | 'left' | 'right' — paint a glow halo on this face
  solidFace = null,        // which face is being "assembled"
  solidColor = '#0066ff',  // the target color of assembled cells
  solidProgress = 0,       // 0..9 — how many cells already match
  shake = 0,               // -1..1 — small rotation applied to the whole cube
}) {
  const U = size;
  // iso unit vectors
  const ax = { x: 0.866 * U, y: 0.5 * U };   // right
  const ay = { x: -0.866 * U, y: 0.5 * U };  // back/left
  const az = { x: 0, y: -U };                 // up

  // origin: front-bottom corner where all 3 faces meet at the top? No —
  // in iso, the topmost vertex is up. Let's set origin at the FRONT vertex
  // (center, the one where top/left/right faces meet at the front).
  // Then:
  //   front (top/left/right share): (0, 0)
  //   right-top corner of top:      front + ax + az/U? wait — top face vertices are at z=U
  // Easier: place vertices directly.

  // Top face vertices (going around):
  const topV = [
    { x: 0, y: -U },                       // back-top (highest)
    { x: ax.x, y: -U + ax.y },             // right-top
    { x: ax.x + ay.x, y: -U + ax.y + ay.y }, // front-top
    { x: ay.x, y: -U + ay.y },             // left-top
  ];
  // Front-top is at (0, 0).

  // Left face (between left-top, front-top, front-bottom, left-bottom)
  const leftV = [
    topV[3],                               // left-top
    topV[2],                               // front-top (0,0)
    { x: topV[2].x, y: topV[2].y + U },    // front-bottom
    { x: topV[3].x, y: topV[3].y + U },    // left-bottom
  ];
  // Right face
  const rightV = [
    topV[2],                               // front-top
    topV[1],                               // right-top
    { x: topV[1].x, y: topV[1].y + U },    // right-bottom
    { x: topV[2].x, y: topV[2].y + U },    // front-bottom
  ];

  // For each face, build a 3×3 grid of small parallelogram cells.
  // Given 4 corners A,B,C,D (in order), cell (i,j) for i,j in 0..2 maps to
  // bilinear interp.
  const bilerp = (A, B, C, D, u, v) => {
    // u along A→B, v along A→D (so A,B,C,D winding A→B→C→D forms quad)
    const ab = { x: A.x + (B.x - A.x) * u, y: A.y + (B.y - A.y) * u };
    const dc = { x: D.x + (C.x - D.x) * u, y: D.y + (C.y - D.y) * u };
    return { x: ab.x + (dc.x - ab.x) * v, y: ab.y + (dc.y - ab.y) * v };
  };

  const buildCells = (corners, epoch, seed) => {
    const colors = pickCells(epoch, seed);
    const cells = [];
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        const u0 = i / 3, u1 = (i + 1) / 3;
        const v0 = j / 3, v1 = (j + 1) / 3;
        const A = bilerp(corners[0], corners[1], corners[2], corners[3], u0, v0);
        const B = bilerp(corners[0], corners[1], corners[2], corners[3], u1, v0);
        const C = bilerp(corners[0], corners[1], corners[2], corners[3], u1, v1);
        const D = bilerp(corners[0], corners[1], corners[2], corners[3], u0, v1);
        cells.push({
          pts: [A, B, C, D],
          color: colors[j * 3 + i],
          idx: j * 3 + i,
        });
      }
    }
    return cells;
  };

  const topCells = buildCells(topV, faceEpochs.top, 1);
  const leftCells = buildCells(leftV, faceEpochs.left, 2);
  const rightCells = buildCells(rightV, faceEpochs.right, 3);

  // Storyboard: paint the first N cells of the "assembling" face with the
  // target colour, leaving the rest unchanged. This is what frame 03 shows.
  const applySolid = (face, cells) => {
    if (solidFace !== face) return cells;
    const n = Math.max(0, Math.min(9, solidProgress));
    return cells.map((c, i) => i < n ? { ...c, color: solidColor, solid: true } : c);
  };
  const _top = applySolid('top', topCells);
  const _left = applySolid('left', leftCells);
  const _right = applySolid('right', rightCells);

  const toPoints = (pts) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // viewBox bounding box
  const allPts = [...topV, ...leftV, ...rightV];
  const xs = allPts.map((p) => p.x), ys = allPts.map((p) => p.y);
  const pad = 60;
  const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
  const w = maxX - minX, h = maxY - minY;

  const stroke = '#2a2218';
  const sw = 2.2;

  // Pre-compute the polygon for the highlighted/glowing face so we can blur
  // and draw it behind everything.
  const glowPolys = {
    top: topV, left: leftV, right: rightV,
  };

  return (
    <svg
      viewBox={`${minX} ${minY} ${w} ${h}`}
      width="100%"
      height="100%"
      style={{
        overflow: 'visible', display: 'block',
        transform: shake ? `rotate(${(shake * 1.5).toFixed(2)}deg)` : 'none',
        transformOrigin: 'center center',
      }}
    >
      <defs>
        <filter id="sketchy-rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale={sketchy ? 1.8 : 0} />
        </filter>
        <filter id="cube-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* glow halo behind a specific face */}
      {glowFace && glowPolys[glowFace] && (
        <polygon
          points={toPoints(glowPolys[glowFace])}
          fill={solidColor}
          opacity="0.55"
          filter="url(#cube-glow)"
          transform={`scale(1.15) translate(${glowFace === 'right' ? 10 : glowFace === 'left' ? -10 : 0} ${glowFace === 'top' ? -10 : 6})`}
          transform-origin="center center"
        />
      )}

      {/* glow puddle under cube */}
      {glow && (
        <ellipse
          cx={0} cy={U + 24}
          rx={U * 0.95} ry={U * 0.18}
          fill="#2a2218"
          opacity="0.08"
        />
      )}

      <g filter={sketchy ? 'url(#sketchy-rough)' : undefined}>
        {/* TOP FACE */}
        {!false && (
          <g opacity={highlight && highlight !== 'top' ? 0.5 : 1}>
            {_top.map((c, k) => (
              <polygon
                key={`t${k}`}
                points={toPoints(c.pts)}
                fill={c.color}
                fillOpacity={c.solid ? 0.96 : 0.78}
                stroke={stroke}
                strokeWidth={sw * (c.solid ? 1.2 : 0.8)}
                strokeLinejoin="round"
                strokeDasharray={sketchy && !c.solid ? '5 3' : '0'}
              />
            ))}
            <polygon
              points={toPoints(topV)}
              fill="none"
              stroke={stroke}
              strokeWidth={sw * 1.6}
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* LEFT FACE */}
        {!hideLeft && (
          <g opacity={highlight && highlight !== 'left' ? 0.5 : 1}>
            {_left.map((c, k) => (
              <polygon
                key={`l${k}`}
                points={toPoints(c.pts)}
                fill={c.color}
                fillOpacity={c.solid ? 0.96 : 0.7}
                stroke={stroke}
                strokeWidth={sw * (c.solid ? 1.2 : 0.8)}
                strokeLinejoin="round"
                strokeDasharray={sketchy && !c.solid ? '5 3' : '0'}
              />
            ))}
            <polygon
              points={toPoints(leftV)}
              fill="none"
              stroke={stroke}
              strokeWidth={sw * 1.6}
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* RIGHT FACE */}
        {!hideRight && (
          <g opacity={highlight && highlight !== 'right' ? 0.5 : 1}>
            {_right.map((c, k) => (
              <polygon
                key={`r${k}`}
                points={toPoints(c.pts)}
                fill={c.color}
                fillOpacity={c.solid ? 0.96 : 0.82}
                stroke={stroke}
                strokeWidth={sw * (c.solid ? 1.2 : 0.8)}
                strokeLinejoin="round"
                strokeDasharray={sketchy && !c.solid ? '5 3' : '0'}
              />
            ))}
            <polygon
              points={toPoints(rightV)}
              fill="none"
              stroke={stroke}
              strokeWidth={sw * 1.6}
              strokeLinejoin="round"
            />
          </g>
        )}
      </g>

      {/* face labels — outside the sketchy filter so type stays crisp */}
      {labels && (
        <g style={{ fontFamily: '"Caveat", cursive', fontSize: 22, fill: '#2a2218' }}>
          <text x={0} y={-U - 14} textAnchor="middle">верх → вход</text>
          <text
            x={leftV[3].x - 14} y={leftV[3].y + U * 0.6}
            textAnchor="end"
          >
            лево → контекст
          </text>
          <text
            x={rightV[2].x + 14} y={rightV[2].y - U * 0.4}
            textAnchor="start"
          >
            право → рефлексия
          </text>
        </g>
      )}
    </svg>
  );
}

// Flat alternative-navigation grid (used when the "альт. навигация" tweak is on).
function FlatNavGrid({ tile = 130, epochAccent = 'contemporary' }) {
  const sections = [
    { face: 'top', cell: 'Начало', sub: 'дата рождения', e: 'contemporary' },
    { face: 'top', cell: 'Твоя секунда', sub: 'сутки = 5000 лет', e: 'ancient' },
    { face: 'top', cell: 'Эпохи', sub: 'scroll-лента', e: 'medieval' },
    { face: 'left', cell: 'Современники', sub: 'кто был жив', e: 'renaissance' },
    { face: 'left', cell: 'Изобретения', sub: 'что уже было', e: 'modern' },
    { face: 'right', cell: 'Линия жизни', sub: 'две шкалы', e: epochAccent },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(3, ${tile}px)`,
      gridTemplateRows: `repeat(2, ${tile}px)`,
      gap: 14,
    }}>
      {sections.map((s, i) => {
        const pal = EPOCHS[s.e].colors;
        return (
          <div key={i} style={{
            width: tile, height: tile,
            background: pal[0],
            border: '2.5px dashed #2a2218',
            borderRadius: 6,
            position: 'relative',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: 10,
            boxShadow: '4px 5px 0 #2a2218',
            transform: `rotate(${(i % 2 ? 1 : -1) * 0.4}deg)`,
          }}>
            <div style={{
              position: 'absolute', top: 8, right: 10,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: '#2a2218', opacity: 0.6, letterSpacing: 1,
            }}>{s.face}/{String(i + 1).padStart(2, '0')}</div>
            <div style={{
              fontFamily: '"Caveat", cursive', fontSize: 22, fontWeight: 700,
              color: '#fff', lineHeight: 1,
            }}>{s.cell}</div>
            <div style={{
              fontFamily: '"Patrick Hand", cursive', fontSize: 13,
              color: '#fff', opacity: 0.85, marginTop: 4,
            }}>{s.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { IsoCube, FlatNavGrid, EPOCHS, EPOCH_ORDER, pickCells });
