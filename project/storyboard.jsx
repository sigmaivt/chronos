// Storyboard: 6 frames showing the V3 interaction flow.
// idle → hover face → cells assemble → glow → unfold → «Линия жизни» section.

const STORY_PAPER = '#f1ead7';
const STORY_INK   = '#1f1a14';

// ── Reusable bits ───────────────────────────────────────────────────────

function FrameShell({ idx, total, title, caption, children, dark = false }) {
  const bg = dark ? '#0f0d18' : STORY_PAPER;
  const ink = dark ? '#f5f1e6' : STORY_INK;
  return (
    <div style={{
      width: '100%', height: '100%',
      background: bg,
      backgroundImage: dark
        ? 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)'
        : 'radial-gradient(circle, rgba(31,26,20,0.08) 1px, transparent 1px)',
      backgroundSize: dark ? '34px 34px' : '26px 26px',
      position: 'relative', overflow: 'hidden',
      fontFamily: '"Patrick Hand", cursive',
      color: ink,
    }}>
      {/* big number — top-left */}
      <div style={{
        position: 'absolute', top: 26, left: 36,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 58, height: 58, borderRadius: '50%',
          border: `2.5px solid ${ink}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Caveat", cursive', fontSize: 36, fontWeight: 700,
          background: dark ? 'rgba(255,255,255,0.05)' : '#fffdf6',
          boxShadow: dark ? 'none' : `3px 3px 0 ${ink}`,
        }}>{idx}</div>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            letterSpacing: 2, opacity: 0.6,
          }}>FRAME {idx} / {total}</div>
          <div style={{
            fontFamily: '"Caveat", cursive', fontSize: 28, fontWeight: 700,
            lineHeight: 1,
          }}>{title}</div>
        </div>
      </div>

      {/* caption — bottom strip */}
      <div style={{
        position: 'absolute', left: 36, right: 36, bottom: 28,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        gap: 30,
      }}>
        <div style={{
          maxWidth: 720, fontSize: 17, lineHeight: 1.35, opacity: 0.86,
        }}>{caption}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: 2, opacity: 0.5,
        }}>ХРОНОС · V3 · ЛИНИЯ ЖИЗНИ</div>
      </div>

      {/* scene area */}
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
    </div>
  );
}

// Compact parallax — fewer layers, no animation
function MiniParallax({ epoch, dark = false, intensity = 1 }) {
  const pal = EPOCHS[epoch].colors;
  const ink = dark ? '#f5f1e6' : STORY_INK;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* far stars */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: dark
          ? 'radial-gradient(circle, rgba(255,255,255,0.5) 1.2px, transparent 1.4px)'
          : 'radial-gradient(circle, rgba(31,26,20,0.25) 1.2px, transparent 1.4px)',
        backgroundSize: '120px 120px',
        opacity: 0.5 * intensity,
      }} />
      {/* era streaks */}
      {[
        { y: 130, w: 220, c: pal[0] },
        { y: 540, w: 280, c: pal[1] || pal[0] },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: i % 2 ? 'auto' : 60, right: i % 2 ? 60 : 'auto',
          top: s.y, width: s.w, height: 5,
          background: s.c, opacity: 0.28 * intensity,
          border: `1.5px dashed ${ink}`, borderRight: 'none',
        }} />
      ))}
      {/* orbits */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {[180, 280, 380].map((r, i) => (
          <ellipse
            key={i}
            cx="50%" cy="48%" rx={r * 1.3} ry={r * 0.5}
            fill="none" stroke={ink} strokeWidth="1.1"
            strokeDasharray={i === 0 ? '3 4' : '6 6'}
            opacity={(0.18 + i * 0.04) * intensity}
          />
        ))}
      </svg>
    </div>
  );
}

function HandCursor({ x, y, color = STORY_INK }) {
  return (
    <svg width="28" height="36" viewBox="0 0 28 36" style={{
      position: 'absolute', left: x, top: y, pointerEvents: 'none',
      filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))',
    }}>
      <path d="M3 2 L3 24 L10 19 L13 28 L17 26 L13 18 L22 16 Z"
            fill="#fffdf6" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Annotation({ x, y, text, w = 220, rotate = 0, arrow = null }) {
  return (
    <>
      <div style={{
        position: 'absolute', left: x, top: y, width: w,
        background: '#fffdf6',
        border: `2px dashed ${STORY_INK}`,
        boxShadow: `4px 5px 0 ${STORY_INK}`,
        padding: '8px 12px',
        fontFamily: '"Caveat", cursive', fontSize: 20,
        lineHeight: 1.2, color: STORY_INK,
        transform: `rotate(${rotate}deg)`,
      }}>{text}</div>
      {arrow && (
        <svg style={{
          position: 'absolute', left: 0, top: 0,
          width: '100%', height: '100%', pointerEvents: 'none',
        }}>
          <path
            d={`M${arrow.fx} ${arrow.fy} Q${(arrow.fx + arrow.tx) / 2 + (arrow.cx || 0)} ${(arrow.fy + arrow.ty) / 2 + (arrow.cy || 0)} ${arrow.tx} ${arrow.ty}`}
            fill="none" stroke={STORY_INK} strokeWidth="2"
            strokeDasharray="5 4" strokeLinecap="round"
          />
          {(() => {
            const ang = Math.atan2(arrow.ty - ((arrow.fy + arrow.ty) / 2 + (arrow.cy || 0)),
                                   arrow.tx - ((arrow.fx + arrow.tx) / 2 + (arrow.cx || 0)));
            const ah = 9;
            return (
              <path
                d={`M${arrow.tx} ${arrow.ty} L${arrow.tx - ah * Math.cos(ang - Math.PI / 7)} ${arrow.ty - ah * Math.sin(ang - Math.PI / 7)} M${arrow.tx} ${arrow.ty} L${arrow.tx - ah * Math.cos(ang + Math.PI / 7)} ${arrow.ty - ah * Math.sin(ang + Math.PI / 7)}`}
                fill="none" stroke={STORY_INK} strokeWidth="2" strokeLinecap="round"
              />
            );
          })()}
        </svg>
      )}
    </>
  );
}

function ProgressBadge({ x, y, n, total = 9, color = '#0066ff' }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#fffdf6',
      border: `2.5px solid ${STORY_INK}`,
      borderRadius: 30, padding: '6px 14px 6px 8px',
      boxShadow: `4px 4px 0 ${STORY_INK}`,
      transform: 'rotate(-3deg)',
    }}>
      {/* tiny 3x3 grid showing progress */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 10px)',
        gridTemplateRows: 'repeat(3, 10px)',
        gap: 2,
      }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{
            background: i < n ? color : 'transparent',
            border: `1.2px solid ${STORY_INK}`,
          }} />
        ))}
      </div>
      <div style={{
        fontFamily: '"Caveat", cursive', fontSize: 24, fontWeight: 700,
        lineHeight: 1,
      }}>{n}<span style={{ opacity: 0.5 }}>/{total}</span></div>
    </div>
  );
}

// Particle burst for frame 04
function Particles({ x, y, count = 18, color = '#0066ff' }) {
  return (
    <svg style={{
      position: 'absolute', left: x - 200, top: y - 200,
      width: 400, height: 400, pointerEvents: 'none',
    }}>
      {Array.from({ length: count }).map((_, i) => {
        const ang = (i / count) * Math.PI * 2;
        const r = 60 + (i % 3) * 50;
        const x2 = 200 + Math.cos(ang) * r;
        const y2 = 200 + Math.sin(ang) * r;
        const x1 = 200 + Math.cos(ang) * 40;
        const y1 = 200 + Math.sin(ang) * 40;
        return (
          <g key={i}>
            <path d={`M${x1} ${y1} L${x2} ${y2}`}
                  stroke={color} strokeWidth="2" strokeLinecap="round"
                  opacity={0.7 - (i % 3) * 0.2} />
            <circle cx={x2} cy={y2} r={(i % 3) === 0 ? 3 : 2}
                    fill={color} opacity={0.8} />
          </g>
        );
      })}
    </svg>
  );
}

// ── FRAME 01 — idle ──────────────────────────────────────────────────────

function Story01({ t }) {
  return (
    <FrameShell idx="01" total="06" title="idle · парит, ждёт"
      caption="Кубик висит в центре сцены. Параллакс-фон медленно дышит. 6 секций-спутников расставлены на орбите. Ничего не выбрано.">
      <MiniParallax epoch={t.epoch} intensity={0.85} />
      <div style={{
        position: 'absolute', left: '50%', top: '54%',
        transform: 'translate(-50%, -50%)',
        width: 360, height: 360,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IsoCube
          size={120}
          faceEpochs={{ top: t.epoch, left: 'medieval', right: 'ancient' }}
          sketchy={true} labels={false}
        />
      </div>
      {/* faint satellite dots */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[-100, -50, 0, 60, 130, 180].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = 600 + Math.cos(rad) * 280;
          const y = 432 + Math.sin(rad) * 220;
          return (
            <circle key={i} cx={x} cy={y} r="5"
                    fill={EPOCHS[t.epoch].colors[i % EPOCHS[t.epoch].colors.length]}
                    stroke={STORY_INK} strokeWidth="1.5" opacity="0.7" />
          );
        })}
      </svg>
      <Annotation x={830} y={170} w={240} rotate={2}
        text="6 спутников = 6 секций. Все блёклые — ничего не выбрано." />
      <Annotation x={80} y={460} w={220} rotate={-2}
        text="фон сдвигается ↔ при наклоне кубика" />
    </FrameShell>
  );
}

// ── FRAME 02 — hover face ────────────────────────────────────────────────

function Story02({ t }) {
  return (
    <FrameShell idx="02" total="06" title="hover · фокус на грани"
      caption="Курсор наводится на правую грань (рефлексия). Эта грань ярче, остальные приглушены. Связанный спутник «Линия жизни» подсвечивается и пульсирует.">
      <MiniParallax epoch={t.epoch} intensity={0.5} />
      <div style={{
        position: 'absolute', left: '50%', top: '54%',
        transform: 'translate(-50%, -50%)',
        width: 360, height: 360,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IsoCube
          size={130}
          faceEpochs={{ top: t.epoch, left: 'medieval', right: 'ancient' }}
          sketchy={true} labels={false}
          highlight="right"
          glowFace="right"
          solidColor={EPOCHS[t.epoch].colors[0]}
        />
      </div>
      <HandCursor x={690} y={500} />
      {/* satellite "Линия жизни" — pulsing */}
      <div style={{
        position: 'absolute', right: 110, top: 380,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: -10, borderRadius: '50%',
            border: `2px dashed ${STORY_INK}`, opacity: 0.6,
          }} />
          <div style={{
            position: 'absolute', inset: -22, borderRadius: '50%',
            border: `1.5px dashed ${STORY_INK}`, opacity: 0.3,
          }} />
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: EPOCHS[t.epoch].colors[0],
            border: `2px solid ${STORY_INK}`,
            boxShadow: `3px 3px 0 ${STORY_INK}`,
          }} />
        </div>
        <div>
          <div style={{
            fontFamily: '"Caveat", cursive', fontSize: 28, fontWeight: 700,
            lineHeight: 1,
          }}>Линия жизни</div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>
            право · рефлексия · 2 шкалы
          </div>
        </div>
      </div>
      <Annotation x={80} y={200} w={220} rotate={-1.5}
        text="другие грани → opacity 0.4, &nbsp;парят дальше" />
      <Annotation x={80} y={540} w={250} rotate={1}
        text="на свободной части грани появляется подсказка: «кликни — собери»" />
    </FrameShell>
  );
}

// ── FRAME 03 — cells assemble ────────────────────────────────────────────

function Story03({ t }) {
  return (
    <FrameShell idx="03" total="06" title="клик · сборка ячеек"
      caption="После клика 9 ячеек правой грани одна за другой меняют цвет на основной — это видимая метафора «собрать кубик Рубика». Идёт счётчик прогресса.">
      <MiniParallax epoch={t.epoch} intensity={0.4} />
      <div style={{
        position: 'absolute', left: '50%', top: '54%',
        transform: 'translate(-50%, -50%)',
        width: 360, height: 360,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IsoCube
          size={140}
          faceEpochs={{ top: t.epoch, left: 'medieval', right: 'ancient' }}
          sketchy={true} labels={false}
          highlight="right"
          glowFace="right"
          solidFace="right"
          solidColor={EPOCHS[t.epoch].colors[0]}
          solidProgress={5}
          shake={0.6}
        />
      </div>
      <ProgressBadge x={780} y={300} n={5}
        color={EPOCHS[t.epoch].colors[0]} />
      <Annotation x={90} y={200} w={230} rotate={-1.5}
        text="ячейки «защёлкиваются» по одной, ~80мс каждая" />
      <Annotation x={90} y={540} w={240} rotate={1.5}
        text="звук: тихий клик-клак на каждое защёлкивание" />
      <Annotation x={870} y={530} w={210} rotate={-1.5}
        text="параллакс замедляется → внимание на грань" />
    </FrameShell>
  );
}

// ── FRAME 04 — face complete, glow ───────────────────────────────────────

function Story04({ t }) {
  const color = EPOCHS[t.epoch].colors[0];
  return (
    <FrameShell idx="04" total="06" title="собрано · вспышка"
      caption="Все 9 ячеек одного цвета — грань «собрана». Короткая вспышка и расходящиеся частицы. Кубик замирает на 200мс — точка «обещания»: сейчас откроется.">
      <MiniParallax epoch={t.epoch} intensity={0.3} />
      <Particles x={600} y={432} count={20} color={color} />
      <div style={{
        position: 'absolute', left: '50%', top: '54%',
        transform: 'translate(-50%, -50%)',
        width: 360, height: 360,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IsoCube
          size={150}
          faceEpochs={{ top: t.epoch, left: 'medieval', right: 'ancient' }}
          sketchy={true} labels={false}
          highlight="right"
          glowFace="right"
          solidFace="right"
          solidColor={color}
          solidProgress={9}
        />
      </div>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 130,
        textAlign: 'center', pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: '"Caveat", cursive', fontSize: 56, fontWeight: 700,
          color, textShadow: `3px 3px 0 ${STORY_INK}`,
          display: 'inline-block', transform: 'rotate(-2deg)',
        }}>грань собрана ✦</div>
      </div>
      <Annotation x={90} y={420} w={210} rotate={-1.2}
        text="свечение = цвет активной эпохи (Tweak: epoch)" />
      <Annotation x={870} y={460} w={220} rotate={1.5}
        text="частицы — 18-24 коротких линий ↗" />
    </FrameShell>
  );
}

// ── FRAME 05 — unfold transition ─────────────────────────────────────────

function Story05({ t }) {
  const color = EPOCHS[t.epoch].colors[0];
  return (
    <FrameShell idx="05" total="06" title="разворот · грань → сцена" dark
      caption="Собранная грань увеличивается, поворачивается фронтально и становится «холстом» секции. Кубик и спутники уходят вглубь. Параллакс уплотняется в тёмный фон.">
      <MiniParallax epoch={t.epoch} dark intensity={1} />
      {/* shrinking cube ghost */}
      <div style={{
        position: 'absolute', left: '28%', top: '50%',
        transform: 'translate(-50%, -50%) scale(0.55)',
        opacity: 0.3,
        filter: 'blur(1px)',
        width: 360, height: 360,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IsoCube
          size={120}
          faceEpochs={{ top: t.epoch, left: 'medieval', right: 'ancient' }}
          sketchy={true} labels={false}
          solidFace="right" solidColor={color} solidProgress={9}
        />
      </div>
      {/* the face peeled forward — large rhombus morphing into a rectangle */}
      <svg viewBox="0 0 1200 800" width="100%" height="100%"
           preserveAspectRatio="none"
           style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="story-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <polygon points="780,160 780,160 780,160 780,160" fill={color} />
        <polygon
          points="500,180 1060,180 1060,660 500,660"
          fill={color} opacity="0.96"
          stroke="#f5f1e6" strokeWidth="2"
          filter="url(#story-glow)"
        />
        <polygon
          points="500,180 1060,180 1060,660 500,660"
          fill={color} opacity="0.92"
        />
        {/* slight 3D edge */}
        <polygon points="1060,180 1080,200 1080,680 1060,660" fill="rgba(0,0,0,0.35)" />
        <polygon points="500,660 520,680 1080,680 1060,660" fill="rgba(0,0,0,0.5)" />
      </svg>
      {/* what's appearing on the new "canvas" — early scaffold of «Линия жизни» */}
      <div style={{
        position: 'absolute', left: 540, top: 220, width: 480,
        color: '#fffdf6',
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: 2, opacity: 0.8,
        }}>// HYDRATING…</div>
        <div style={{
          fontFamily: '"Caveat", cursive', fontSize: 64, fontWeight: 700,
          lineHeight: 0.92, marginTop: 4,
        }}>линия<br/>жизни</div>
        <div style={{
          marginTop: 22, height: 4, background: 'rgba(255,255,255,0.4)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: '64%', background: '#fffdf6',
          }} />
        </div>
        <div style={{
          marginTop: 16, height: 4, background: 'rgba(255,255,255,0.4)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: '34%', background: '#fffdf6',
          }} />
        </div>
      </div>

      <Annotation x={70} y={460} w={260} rotate={-1.5}
        text="кубик дрейфует в правый-задний угол, &nbsp;ждёт возврата" />
      <Annotation x={870} y={680} w={230} rotate={1.5}
        text="duration ≈ 600мс, ease-out cubic" />
    </FrameShell>
  );
}

// ── FRAME 06 — full «Линия жизни» section ────────────────────────────────

function LifelineSection({ t, birthYear = 1994, currentYear = 2026, medianAge = 76 }) {
  const endYear = birthYear + medianAge;
  const total = endYear - birthYear;
  const elapsed = currentYear - birthYear;
  const elapsedPct = (elapsed / total) * 100;
  const color = EPOCHS[t.epoch].colors[0];

  // Personal milestones
  const personal = [
    { age: 0,  label: 'рождение' },
    { age: 7,  label: 'школа' },
    { age: 17, label: 'выпускной' },
    { age: 23, label: 'диплом' },
    { age: elapsed, label: 'сейчас', here: true },
    { age: 50, label: '+50' },
    { age: medianAge, label: 'медиана', end: true },
  ];

  // World events between birthYear..currentYear, mapped to same x-axis.
  const world = [
    { year: 1995, label: 'WWW для всех' },
    { year: 2001, label: '9/11' },
    { year: 2007, label: 'iPhone' },
    { year: 2008, label: 'кризис' },
    { year: 2012, label: 'Curiosity на Марсе' },
    { year: 2016, label: 'AlphaGo' },
    { year: 2020, label: 'COVID-19' },
    { year: 2022, label: 'ChatGPT' },
  ];

  // Future placeholders (greyed, post-now)
  const future = [
    { year: 2040, label: 'AGI?' },
    { year: 2060, label: '?' },
  ];

  const pctFromAge = (age) => (age / total) * 100;
  const pctFromYear = (yr) => ((yr - birthYear) / total) * 100;

  return (
    <FrameShell idx="06" total="06" title="Линия жизни · итог" dark
      caption={`Финальная секция. Сверху — твоя жизнь (рождение → сейчас → медиана ${medianAge} лет). Снизу — мировые события за то же время. Маркер «ты здесь» проходит через обе шкалы.`}>
      <MiniParallax epoch={t.epoch} dark intensity={0.4} />

      {/* breadcrumb */}
      <div style={{
        position: 'absolute', top: 110, left: 40,
        display: 'flex', alignItems: 'center', gap: 14, color: '#f5f1e6',
      }}>
        <div style={{
          fontFamily: '"Caveat", cursive', fontSize: 24,
          opacity: 0.8, cursor: 'pointer',
        }}>← к кубику</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: 2, opacity: 0.5,
        }}>ХРОНОС / ЛИНИЯ ЖИЗНИ</div>
      </div>

      {/* Headline + stat */}
      <div style={{
        position: 'absolute', top: 145, left: 40, right: 40,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        color: '#f5f1e6',
      }}>
        <div>
          <div style={{
            fontFamily: '"Caveat", cursive', fontSize: 64, fontWeight: 700,
            lineHeight: 0.95, letterSpacing: -1,
          }}>
            ты на <span style={{ color }}>{elapsedPct.toFixed(0)}%</span> своей жизни
          </div>
          <div style={{
            fontSize: 18, opacity: 0.7, marginTop: 4,
          }}>
            родился в {birthYear} · сейчас {currentYear} · медианная продолжительность {medianAge} лет
          </div>
        </div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: 2, opacity: 0.5, textAlign: 'right',
        }}>
          ДВЕ ПАРАЛЛЕЛЬНЫЕ ШКАЛЫ<br/>
          ОБЩИЙ X · ГОДЫ {birthYear}–{endYear}
        </div>
      </div>

      {/* PERSONAL SCALE */}
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 320, height: 120,
        color: '#f5f1e6',
      }}>
        <div style={{
          fontFamily: '"Caveat", cursive', fontSize: 22, fontWeight: 700,
          marginBottom: 14, opacity: 0.95,
        }}>твоя жизнь</div>
        {/* bar */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 50, height: 6,
          background: 'rgba(255,255,255,0.18)', borderRadius: 3,
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${elapsedPct}%`, background: color, borderRadius: 3,
            boxShadow: `0 0 12px ${color}`,
          }} />
        </div>
        {/* ticks */}
        {personal.map((m, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${pctFromAge(m.age)}%`, top: 38,
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            color: m.end ? 'rgba(245,241,230,0.4)' : '#f5f1e6',
          }}>
            <div style={{
              width: 2, height: 30,
              background: m.here ? color : (m.end ? 'rgba(245,241,230,0.3)' : '#f5f1e6'),
            }} />
            {m.here && (
              <div style={{
                position: 'absolute', top: -32,
                fontFamily: '"Caveat", cursive', fontSize: 22, fontWeight: 700,
                color, whiteSpace: 'nowrap',
              }}>ты здесь ↓</div>
            )}
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
              opacity: 0.7, marginTop: 6,
            }}>{birthYear + m.age}</div>
            <div style={{ fontSize: 14, marginTop: 2, opacity: 0.85 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* mirrored axis — vertical "you are here" line through both */}
      <div style={{
        position: 'absolute', top: 350, bottom: 130,
        left: `calc(60px + ${elapsedPct}% * (100% - 120px) / 100%)`,
        width: 2,
        background: color, opacity: 0.7,
        boxShadow: `0 0 10px ${color}`,
      }} />

      {/* WORLD SCALE */}
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 520, height: 120,
        color: '#f5f1e6',
      }}>
        <div style={{
          fontFamily: '"Caveat", cursive', fontSize: 22, fontWeight: 700,
          marginBottom: 14, opacity: 0.95,
        }}>мир, пока ты живёшь</div>
        {/* bar */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 50, height: 6,
          background: 'rgba(255,255,255,0.18)', borderRadius: 3,
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${elapsedPct}%`,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.85))',
            borderRadius: 3,
          }} />
        </div>
        {/* world events — alternating above/below the axis so labels don't collide */}
        {world.map((m, i) => {
          const above = i % 2 === 0;
          return (
            <div key={i} style={{
              position: 'absolute', left: `${pctFromYear(m.year)}%`,
              top: above ? -2 : 38,
              transform: 'translateX(-50%)',
              display: 'flex', flexDirection: above ? 'column-reverse' : 'column',
              alignItems: 'center',
            }}>
              <div style={{ width: 2, height: above ? 42 : 30, background: '#f5f1e6', opacity: 0.85 }} />
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                opacity: 0.7, margin: above ? '0 0 2px' : '6px 0 0',
              }}>{m.year}</div>
              <div style={{
                fontSize: 13, margin: above ? '0 0 1px' : '2px 0 0',
                opacity: 0.85, whiteSpace: 'nowrap',
              }}>{m.label}</div>
            </div>
          );
        })}
        {future.map((m, i) => (
          <div key={`f${i}`} style={{
            position: 'absolute', left: `${pctFromYear(m.year)}%`, top: 38,
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            color: 'rgba(245,241,230,0.4)',
          }}>
            <div style={{
              width: 2, height: 30,
              background: 'rgba(245,241,230,0.3)',
              borderLeft: '2px dashed rgba(245,241,230,0.4)', borderColor: 'transparent',
            }} />
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
              opacity: 0.7, marginTop: 6,
            }}>{m.year}</div>
            <div style={{ fontSize: 13, marginTop: 2, fontStyle: 'italic' }}>{m.label}</div>
          </div>
        ))}
        {/* "будущее — пустое" hint */}
        <div style={{
          position: 'absolute', left: `${elapsedPct + 4}%`, top: 16,
          fontFamily: '"Caveat", cursive', fontSize: 16,
          color: 'rgba(245,241,230,0.4)',
        }}>будущее — белое пятно →</div>
      </div>
    </FrameShell>
  );
}

function Story06({ t }) { return <LifelineSection t={t} />; }

Object.assign(window, { Story01, Story02, Story03, Story04, Story05, Story06 });
