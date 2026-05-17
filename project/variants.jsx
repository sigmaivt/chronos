// Three Hero wireframe variants for «Хронос».
// Each is sized for a 1440×900 desktop hero, sketch fidelity with epoch
// color accents.  All three accept `t` (current tweak values) so they can
// re-paint when the epoch palette, density or nav-mode tweak changes.

const PAPER = '#f3ede1';
const INK = '#1f1a14';

// ── Shared sketch primitives ────────────────────────────────────────────

function SketchBox({ children, style, dashed = true, shadow = true, rotate = 0 }) {
  return (
    <div style={{
      border: `2px ${dashed ? 'dashed' : 'solid'} ${INK}`,
      borderRadius: 4,
      boxShadow: shadow ? `4px 5px 0 ${INK}` : 'none',
      background: '#fffdf6',
      padding: '10px 14px',
      transform: `rotate(${rotate}deg)`,
      ...style,
    }}>{children}</div>
  );
}

function Scribble({ w = 80, h = 14, color = INK, style }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', ...style }}>
      <path
        d={`M2 ${h/2} Q${w*0.2} 2 ${w*0.4} ${h/2} T${w*0.8} ${h/2} T${w-2} ${h/2}`}
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
      />
    </svg>
  );
}

function Arrow({ from, to, color = INK, label, curve = 0.3 }) {
  // straight-ish hand-drawn arrow inside an absolutely-positioned SVG.
  // from/to are {x, y} in container-relative px.
  const x1 = from.x, y1 = from.y, x2 = to.x, y2 = to.y;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const cx = mx - dy * curve, cy = my + dx * curve;
  const w = Math.max(x1, x2) + 40, h = Math.max(y1, y2) + 40;
  // arrow head
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const ah = 10;
  const a1x = x2 - ah * Math.cos(ang - Math.PI / 7);
  const a1y = y2 - ah * Math.sin(ang - Math.PI / 7);
  const a2x = x2 - ah * Math.cos(ang + Math.PI / 7);
  const a2y = y2 - ah * Math.sin(ang + Math.PI / 7);
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <path
        d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`}
        fill="none" stroke={color} strokeWidth="2"
        strokeDasharray="6 4" strokeLinecap="round"
      />
      <path d={`M${x2} ${y2} L${a1x} ${a1y} M${x2} ${y2} L${a2x} ${a2y}`}
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {label && (
        <text x={cx} y={cy - 6} textAnchor="middle"
          style={{ fontFamily: '"Caveat", cursive', fontSize: 18, fill: color }}>
          {label}
        </text>
      )}
    </svg>
  );
}

function EpochChip({ epoch, active }) {
  const e = EPOCHS[epoch];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px',
      border: `1.5px ${active ? 'solid' : 'dashed'} ${INK}`,
      background: active ? e.colors[0] : 'transparent',
      color: active ? '#fff' : INK,
      fontFamily: '"Caveat", cursive', fontSize: 18,
      borderRadius: 3,
      boxShadow: active ? `3px 3px 0 ${INK}` : 'none',
    }}>
      <span style={{
        width: 10, height: 10, borderRadius: 2,
        background: e.colors[0],
        boxShadow: `inset 0 0 0 1px ${INK}`,
      }} />
      {e.ru}
    </div>
  );
}

function WireMark({ text, kind = 'note', style }) {
  // numbered annotation pill, like architects use
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
      color: INK, letterSpacing: 1, textTransform: 'uppercase',
      ...style,
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: '50%',
        border: `1.5px solid ${INK}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700, background: '#fffdf6',
      }}>{kind === 'note' ? 'N' : '·'}</span>
      {text}
    </div>
  );
}

// Hero frame with paper grid bg + corner crop marks.
function HeroFrame({ children, label, idx }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: PAPER,
      backgroundImage: 'radial-gradient(circle, rgba(31,26,20,0.10) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Patrick Hand", cursive',
      color: INK,
    }}>
      {/* crop marks */}
      {['tl', 'tr', 'bl', 'br'].map((p) => (
        <svg key={p} width="18" height="18" style={{
          position: 'absolute',
          top: p[0] === 't' ? 10 : 'auto', bottom: p[0] === 'b' ? 10 : 'auto',
          left: p[1] === 'l' ? 10 : 'auto', right: p[1] === 'r' ? 10 : 'auto',
        }}>
          <path d={p === 'tl' ? 'M0 9 L9 9 L9 0' : p === 'tr' ? 'M18 9 L9 9 L9 0' :
                   p === 'bl' ? 'M0 9 L9 9 L9 18' : 'M18 9 L9 9 L9 18'}
                fill="none" stroke={INK} strokeWidth="1.5" />
        </svg>
      ))}
      {/* artboard label in corner */}
      <div style={{
        position: 'absolute', top: 24, left: 60,
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
        color: INK, opacity: 0.7, letterSpacing: 2,
      }}>
        WIRE / V{idx} · {label}
      </div>
      <div style={{
        position: 'absolute', top: 24, right: 60,
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
        color: INK, opacity: 0.7, letterSpacing: 2,
      }}>
        HERO · 1440 × 900 · DESKTOP
      </div>
      {children}
    </div>
  );
}

// Top navigation strip mock (logo + minimal nav) — shared across variants.
function TopBar({ density = 'regular' }) {
  return (
    <div style={{
      position: 'absolute', top: 60, left: 60, right: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <div style={{
          fontFamily: '"Caveat", cursive', fontSize: 36, fontWeight: 700,
          letterSpacing: -1,
        }}>Хронос</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          opacity: 0.55, letterSpacing: 2,
        }}>/ ХРОНО · с</div>
      </div>
      {density !== 'compact' && (
        <div style={{ display: 'flex', gap: 22, fontSize: 18 }}>
          {['эпохи', 'современники', 'линия жизни', 'о проекте'].map((s) => (
            <span key={s} style={{ position: 'relative' }}>
              {s}
              <Scribble w={s.length * 9} h={6} style={{ position: 'absolute', left: 0, bottom: -8 }} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── V1 ─ Classic centered cube ──────────────────────────────────────────

function VariantOne({ t }) {
  const cube = !t.altNav;
  return (
    <HeroFrame idx="1" label="ЦЕНТРАЛЬНЫЙ КУБИК + ВЕРТИКАЛЬНАЯ ЛЕНТА ЭПОХ">
      <TopBar density={t.density} />

      {/* Left rail — vertical epoch ribbon */}
      <div style={{
        position: 'absolute', top: 160, bottom: 160, left: 60,
        width: 110,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: 2, opacity: 0.6,
        }}>5 ЭПОХ ↓</div>
        {EPOCH_ORDER.map((id) => {
          const e = EPOCHS[id];
          const active = id === t.epoch;
          return (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 3,
                background: e.colors[0],
                border: `2px ${active ? 'solid' : 'dashed'} ${INK}`,
                boxShadow: active ? `2px 2px 0 ${INK}` : 'none',
                transform: active ? 'rotate(-3deg)' : 'none',
              }} />
              <div style={{
                fontFamily: '"Caveat", cursive', fontSize: 18,
                fontWeight: active ? 700 : 400,
                textDecoration: active ? 'underline wavy' : 'none',
              }}>{e.ru}</div>
            </div>
          );
        })}
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: 2, opacity: 0.6,
        }}>СЕЙЧАС ↑</div>
      </div>

      {/* Center stage */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 520, height: 520,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {cube ? (
          <IsoCube
            size={170}
            faceEpochs={{ top: t.epoch, left: 'ancient', right: 'renaissance' }}
            sketchy={true} labels={false}
          />
        ) : (
          <FlatNavGrid tile={140} epochAccent={t.epoch} />
        )}
      </div>

      {/* Right callouts — three face labels with arrows */}
      {t.density !== 'compact' && cube && (
        <>
          <SketchBox style={{
            position: 'absolute', right: 90, top: 200, width: 220,
          }} rotate={1.2}>
            <div style={{ fontFamily: '"Caveat", cursive', fontSize: 26, fontWeight: 700 }}>
              верхняя грань
            </div>
            <div style={{ fontSize: 14, opacity: 0.8, marginTop: 2 }}>
              вход в опыт — «Начало», «Твоя секунда», «Эпохи»
            </div>
          </SketchBox>
          <SketchBox style={{
            position: 'absolute', right: 60, top: 380, width: 220,
          }} rotate={-0.8}>
            <div style={{ fontFamily: '"Caveat", cursive', fontSize: 26, fontWeight: 700 }}>
              левая грань
            </div>
            <div style={{ fontSize: 14, opacity: 0.8, marginTop: 2 }}>
              контекст — «Современники», «Изобретения»
            </div>
          </SketchBox>
          <SketchBox style={{
            position: 'absolute', right: 100, top: 560, width: 220,
          }} rotate={1.8}>
            <div style={{ fontFamily: '"Caveat", cursive', fontSize: 26, fontWeight: 700 }}>
              правая грань
            </div>
            <div style={{ fontSize: 14, opacity: 0.8, marginTop: 2 }}>
              рефлексия — «Линия жизни»
            </div>
          </SketchBox>
          <Arrow from={{ x: 920, y: 220 }} to={{ x: 800, y: 320 }} curve={-0.2} />
          <Arrow from={{ x: 900, y: 400 }} to={{ x: 800, y: 440 }} curve={0.1} />
          <Arrow from={{ x: 930, y: 580 }} to={{ x: 800, y: 540 }} curve={0.2} />
        </>
      )}

      {/* Title overlay above cube */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 170,
        textAlign: 'center', pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: '"Caveat", cursive', fontSize: 64, fontWeight: 700,
          letterSpacing: -2, lineHeight: 1,
        }}>
          собери своё <span style={{
            background: EPOCHS[t.epoch].colors[0], color: '#fff',
            padding: '0 8px', boxShadow: `4px 4px 0 ${INK}`,
            transform: 'rotate(-1deg)', display: 'inline-block',
          }}>место</span> в истории
        </div>
        <div style={{ fontSize: 18, opacity: 0.7, marginTop: 6 }}>
          крутите грани · кликайте ячейки · открывайте разделы
        </div>
      </div>

      {/* Bottom — date entry hint + scroll cue */}
      <div style={{
        position: 'absolute', bottom: 60, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18,
      }}>
        <SketchBox style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
            opacity: 0.7,
          }}>ДД</span>
          <span>/</span>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
            opacity: 0.7,
          }}>ММ</span>
          <span>/</span>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
            opacity: 0.7,
          }}>ГГГГ</span>
          <span style={{
            fontFamily: '"Caveat", cursive', fontSize: 20, marginLeft: 8,
          }}>дата рождения</span>
        </SketchBox>
        <SketchBox dashed={false} style={{
          background: INK, color: '#fffdf6',
          fontFamily: '"Caveat", cursive', fontSize: 22, fontWeight: 700,
        }}>запустить →</SketchBox>
        <div style={{
          fontFamily: '"Caveat", cursive', fontSize: 16, opacity: 0.6,
          marginLeft: 16,
        }}>
          ↑ ввод также внутри кубика, на верхней грани
        </div>
      </div>

      {/* Annotation: numbered notes */}
      {t.density === 'comfy' && (
        <div style={{
          position: 'absolute', bottom: 24, left: 60,
          display: 'flex', gap: 18,
        }}>
          <WireMark text="01 · сборка грани = переход" />
          <WireMark text="02 · цвета привязаны к эпохам" />
          <WireMark text="03 · парящий float-anim" />
        </div>
      )}
    </HeroFrame>
  );
}

// ── V2 ─ Editorial split, cube on the right ─────────────────────────────

function VariantTwo({ t }) {
  const cube = !t.altNav;
  return (
    <HeroFrame idx="2" label="EDITORIAL SPLIT · КУБИК ОТЪЕХАЛ ВПРАВО">
      <TopBar density={t.density} />

      {/* Left column — huge title + date input */}
      <div style={{
        position: 'absolute', left: 60, top: 160, width: 640,
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: 3, opacity: 0.6, marginBottom: 14,
        }}>{`// HERO · ИНТЕРАКТИВНЫЙ ЛЕНДИНГ`}</div>
        <div style={{
          fontFamily: '"Caveat", cursive',
          fontSize: 128, fontWeight: 700, lineHeight: 0.92,
          letterSpacing: -4,
        }}>
          ты —<br/>
          <span style={{ position: 'relative' }}>
            одна
            <Scribble w={140} h={10}
              style={{ position: 'absolute', left: 0, bottom: -4 }}
              color={EPOCHS[t.epoch].colors[0]} />
          </span>
          {' '}секунда<br/>
          из 5000 лет
        </div>
        <div style={{
          fontSize: 22, lineHeight: 1.3, marginTop: 18,
          maxWidth: 480, opacity: 0.85,
        }}>
          введи дату рождения — построим твою линию жизни поверх
          мировой истории. соберём кубик, найдём современников.
        </div>

        {/* Date input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginTop: 28,
        }}>
          <SketchBox style={{
            display: 'flex', gap: 8, alignItems: 'baseline',
            fontFamily: '"JetBrains Mono", monospace', fontSize: 22,
            padding: '14px 18px',
          }}>
            <span style={{ opacity: 0.35 }}>16</span>
            <span style={{ opacity: 0.6 }}>·</span>
            <span style={{ opacity: 0.35 }}>05</span>
            <span style={{ opacity: 0.6 }}>·</span>
            <span style={{ opacity: 0.35 }}>1994</span>
          </SketchBox>
          <SketchBox dashed={false} style={{
            background: EPOCHS[t.epoch].colors[0], color: '#fff',
            fontFamily: '"Caveat", cursive', fontSize: 28, fontWeight: 700,
            padding: '12px 24px',
          }}>
            собрать ▣
          </SketchBox>
        </div>

        {/* Epoch chips strip */}
        {t.density !== 'compact' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 30 }}>
            {EPOCH_ORDER.map((id) => (
              <EpochChip key={id} epoch={id} active={id === t.epoch} />
            ))}
          </div>
        )}
      </div>

      {/* Right column — cube + floating section cards */}
      <div style={{
        position: 'absolute', right: 40, top: 130, width: 620, height: 700,
      }}>
        {/* floating mini-cards orbiting the cube */}
        {t.density !== 'compact' && cube && (
          <>
            <SketchBox style={{ position: 'absolute', top: 30, right: 20, width: 170 }} rotate={3}>
              <div style={{ fontFamily: '"Caveat", cursive', fontSize: 22, fontWeight: 700 }}>
                Современники
              </div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>карточки великих</div>
              <div style={{
                marginTop: 6, display: 'flex', gap: 4,
              }}>
                {[0,1,2].map((i) => (
                  <div key={i} style={{
                    width: 30, height: 38,
                    background: EPOCHS.renaissance.colors[i % 3],
                    border: `1.5px dashed ${INK}`,
                  }} />
                ))}
              </div>
            </SketchBox>
            <SketchBox style={{ position: 'absolute', top: 400, left: 0, width: 180 }} rotate={-2}>
              <div style={{ fontFamily: '"Caveat", cursive', fontSize: 22, fontWeight: 700 }}>
                Линия жизни
              </div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>две параллельные шкалы</div>
              <div style={{
                marginTop: 8,
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <div style={{
                  height: 4, background: EPOCHS[t.epoch].colors[0],
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', left: '60%', top: -3,
                    width: 10, height: 10, borderRadius: '50%',
                    background: '#fff', border: `2px solid ${INK}`,
                  }} />
                </div>
                <div style={{ height: 4, background: '#cdbfa0' }} />
              </div>
            </SketchBox>
            <SketchBox style={{
              position: 'absolute', bottom: 30, right: 30, width: 160,
            }} rotate={1.5}>
              <div style={{ fontFamily: '"Caveat", cursive', fontSize: 22, fontWeight: 700 }}>
                Твоя секунда
              </div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>сутки = 5000 лет</div>
              <div style={{
                marginTop: 6, height: 14,
                background: 'linear-gradient(90deg, #1a1530 0%, #c9a14a 60%, #d23df0 100%)',
                border: `1.5px solid ${INK}`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', right: '4%', top: -4,
                  width: 6, height: 22,
                  background: '#fff', border: `2px solid ${INK}`,
                }} />
              </div>
            </SketchBox>
          </>
        )}

        {/* The cube itself */}
        <div style={{
          position: 'absolute', left: '50%', top: '52%',
          transform: 'translate(-50%, -50%)',
          width: 460, height: 460,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {cube ? (
            <IsoCube
              size={150}
              faceEpochs={{ top: t.epoch, left: 'medieval', right: 'modern' }}
              sketchy={true} labels={false}
            />
          ) : (
            <FlatNavGrid tile={130} epochAccent={t.epoch} />
          )}
        </div>
      </div>

      {/* Bottom annotation line */}
      <div style={{
        position: 'absolute', bottom: 30, left: 60, right: 60,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <WireMark text="LAYOUT · 50/50 split · type-led слева" />
        <WireMark text="cube — пассивный hero, активен по hover" />
        <WireMark text="↓ scroll: эпохи timeline" />
      </div>
    </HeroFrame>
  );
}

// ── V3 ─ Cube as a stage with parallax background + satellites ──────────

// ParallaxBG — 4 layered backdrops whose translate is driven by the cube
// rotation (in deg). Layers move at different speeds so depth reads.  Each
// layer is sketched (dots, scribbles, era streaks, year glyphs) so the
// wireframe feel survives.
function ParallaxBG({ rotation, epoch, density }) {
  const r = rotation; // deg, typically -45..45
  // wireframe palette layers
  const pal = EPOCHS[epoch].colors;
  const lay = (depth, children) => ({
    position: 'absolute', inset: -80,
    transform: `translate3d(${(-r * depth).toFixed(1)}px, ${(-r * depth * 0.25).toFixed(1)}px, 0)`,
    pointerEvents: 'none',
    transition: 'transform 280ms cubic-bezier(.2,.7,.2,1)',
    ...children,
  });
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {/* Layer 1 — far: sparse star/dot field (slowest) */}
      <div style={lay(0.4, {
        backgroundImage:
          'radial-gradient(circle, rgba(31,26,20,0.22) 1.2px, transparent 1.4px),' +
          'radial-gradient(circle, rgba(31,26,20,0.10) 1px, transparent 1.2px)',
        backgroundSize: '140px 140px, 60px 60px',
        backgroundPosition: '0 0, 30px 30px',
        opacity: 0.7,
      })} />

      {/* Layer 2 — mid: long era streaks, faint epoch colors */}
      <div style={lay(1.2, {})}>
        {[
          { y: 130, w: 360, c: pal[0], t: 'Древний' },
          { y: 280, w: 280, c: pal[1] || pal[0], t: 'Средние' },
          { y: 540, w: 220, c: pal[2] || pal[0], t: 'Ренессанс' },
          { y: 720, w: 320, c: pal[3] || pal[0], t: 'Новое' },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', left: 80 + (i % 2) * 880, top: s.y,
            display: 'flex', alignItems: 'center', gap: 8,
            opacity: 0.32,
          }}>
            <div style={{
              width: s.w, height: 6, background: s.c,
              border: `1.5px dashed ${INK}`,
              borderRight: 'none',
            }} />
            <div style={{
              fontFamily: '"Caveat", cursive', fontSize: 22,
              color: INK, opacity: 0.6, fontStyle: 'italic',
            }}>{s.t}</div>
          </div>
        ))}
      </div>

      {/* Layer 3 — mid-near: floating year/glyph labels */}
      <div style={lay(2.4, {})}>
        {[
          { x: 90,   y: 220, t: '−2800', s: 14 },
          { x: 1280, y: 180, t: '1492', s: 22 },
          { x: 220,  y: 740, t: '1969', s: 18 },
          { x: 1140, y: 760, t: 'MMXXV', s: 16 },
          { x: 1330, y: 460, t: '⌛', s: 28 },
          { x: 60,   y: 460, t: '☼',  s: 26 },
          { x: 380,  y: 110, t: '•••', s: 14 },
          { x: 980,  y: 90,  t: '↻',  s: 22 },
        ].map((g, i) => (
          <div key={i} style={{
            position: 'absolute', left: g.x, top: g.y,
            fontFamily: '"JetBrains Mono", monospace', fontSize: g.s,
            color: INK, opacity: 0.38, letterSpacing: 1,
          }}>{g.t}</div>
        ))}
      </div>

      {/* Layer 4 — near: tilted concentric "orbit" rings, fastest */}
      <div style={lay(3.6, {})}>
        <svg width="1600" height="1100" style={{ position: 'absolute', left: -80, top: -80 }}>
          {[160, 260, 360, 460].map((rr, i) => (
            <ellipse
              key={i}
              cx={800} cy={550} rx={rr * 1.4} ry={rr * 0.55}
              fill="none" stroke={INK} strokeWidth="1.2"
              strokeDasharray={i === 0 ? '2 3' : i === 1 ? '4 5' : i === 2 ? '6 6' : '10 6'}
              opacity={0.18 + i * 0.04}
            />
          ))}
        </svg>
      </div>

      {/* Rotation indicator chip — bottom-right */}
      {density !== 'compact' && (
        <div style={{
          position: 'absolute', bottom: 130, right: 80,
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          color: INK, opacity: 0.7, letterSpacing: 1.5,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M9 2 a7 7 0 1 0 7 7" fill="none" stroke={INK} strokeWidth="1.5" />
            <path d="M14 5 L16 9 L12 9 Z" fill={INK} />
          </svg>
          ROT · {r > 0 ? '+' : ''}{r.toFixed(0)}°
        </div>
      )}
    </div>
  );
}

function VariantThree({ t }) {
  const cube = !t.altNav;
  const rot = t.rotation ?? 12;

  // satellite definitions: angle around cube center, label, sub, face, epoch
  const sats = [
    { ang: -100, label: 'Начало',       sub: 'ввод даты',      face: 'top',   e: 'contemporary' },
    { ang: -50,  label: 'Твоя секунда', sub: '24ч = 5000 лет', face: 'top',   e: 'ancient'      },
    { ang: 0,    label: 'Линия жизни',  sub: '2 шкалы',        face: 'right', e: t.epoch        },
    { ang: 60,   label: 'Изобретения',  sub: 'что уже было',   face: 'left',  e: 'modern'       },
    { ang: 130,  label: 'Современники', sub: 'кто был жив',    face: 'left',  e: 'renaissance'  },
    { ang: 180,  label: 'Эпохи',        sub: 'scroll-лента',   face: 'top',   e: 'medieval'     },
  ];

  return (
    <HeroFrame idx="3" label="КУБИК-СЦЕНА · ПАРАЛЛАКС + 6 СПУТНИКОВ">
      <ParallaxBG rotation={rot} epoch={t.epoch} density={t.density} />
      <TopBar density={t.density} />

      {/* center coordinates */}
      {(() => {
        const cx = 720, cy = 430, R = 330;
        // satellites also drift slightly with cube rotation — sells the parallax
        const satShift = rot * 0.6;
        // connector lines first, behind everything
        return (
          <>
            {cube && (
              <svg width="1440" height="900" style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
              }}>
                {sats.map((s, i) => {
                  const rad = (s.ang * Math.PI) / 180;
                  const x2 = cx + Math.cos(rad) * R + satShift * Math.cos(rad);
                  const y2 = cy + Math.sin(rad) * R + satShift * Math.sin(rad) * 0.4;
                  const x1 = cx + Math.cos(rad) * 200;
                  const y1 = cy + Math.sin(rad) * 200;
                  return (
                    <g key={i}>
                      <path
                        d={`M${x1} ${y1} L${x2} ${y2}`}
                        stroke={INK} strokeWidth="1.6"
                        strokeDasharray="4 4"
                        fill="none"
                      />
                      <circle cx={x2} cy={y2} r="4" fill={EPOCHS[s.e].colors[0]}
                              stroke={INK} strokeWidth="1.5" />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* center cube — bigger, with rotation-driven tilt */}
            <div style={{
              position: 'absolute', left: cx, top: cy,
              width: 560, height: 560,
              transform: `translate(-50%, -50%) rotate(${(rot * 0.18).toFixed(2)}deg)`,
              transition: 'transform 280ms cubic-bezier(.2,.7,.2,1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `perspective(1400px) rotateY(${(rot * 0.45).toFixed(2)}deg) rotateX(${(-rot * 0.12).toFixed(2)}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 280ms cubic-bezier(.2,.7,.2,1)',
                filter: `drop-shadow(${(rot * 0.4).toFixed(1)}px 8px 0 rgba(31,26,20,0.15))`,
              }}>
                {cube ? (
                  <IsoCube
                    size={190}
                    faceEpochs={{ top: t.epoch, left: 'medieval', right: 'ancient' }}
                    sketchy={true} labels={false}
                  />
                ) : (
                  <FlatNavGrid tile={140} epochAccent={t.epoch} />
                )}
              </div>
            </div>

            {/* satellite cards */}
            {cube && sats.map((s, i) => {
              const rad = (s.ang * Math.PI) / 180;
              const x = cx + Math.cos(rad) * (R + 60) + satShift * Math.cos(rad);
              const y = cy + Math.sin(rad) * (R + 60) + satShift * Math.sin(rad) * 0.4;
              const e = EPOCHS[s.e];
              return (
                <SketchBox key={i} style={{
                  position: 'absolute', left: x, top: y,
                  transform: `translate(-50%, -50%) rotate(${((i % 2) ? 1.5 : -1.5)}deg)`,
                  width: 170, padding: '10px 12px',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                    letterSpacing: 1.5, opacity: 0.6,
                  }}>
                    <span style={{
                      width: 10, height: 10, background: e.colors[0],
                      border: `1.5px solid ${INK}`,
                    }} />
                    {s.face.toUpperCase()} · {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{
                    fontFamily: '"Caveat", cursive', fontSize: 26,
                    fontWeight: 700, lineHeight: 1, marginTop: 4,
                  }}>{s.label}</div>
                  <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>
                    {s.sub}
                  </div>
                  {/* tiny preview thumb */}
                  {t.density === 'comfy' && (
                    <div style={{
                      marginTop: 8, height: 30,
                      background: e.colors[0],
                      border: `1.5px dashed ${INK}`,
                      position: 'relative', overflow: 'hidden',
                    }}>
                      {/* fake content lines */}
                      <div style={{
                        position: 'absolute', left: 6, right: 6, top: 6,
                        height: 3, background: '#fff', opacity: 0.6,
                      }} />
                      <div style={{
                        position: 'absolute', left: 6, right: 40, top: 14,
                        height: 3, background: '#fff', opacity: 0.4,
                      }} />
                      <div style={{
                        position: 'absolute', left: 6, right: 60, top: 22,
                        height: 3, background: '#fff', opacity: 0.3,
                      }} />
                    </div>
                  )}
                </SketchBox>
              );
            })}
          </>
        );
      })()}

      {/* Title floating top-left */}
      <SketchBox style={{
        position: 'absolute', left: 60, top: 130, width: 320,
        background: '#fffdf6',
      }} rotate={-1.2}>
        <div style={{
          fontFamily: '"Caveat", cursive', fontSize: 48, fontWeight: 700,
          lineHeight: 0.95,
        }}>
          собери<br/>себя<br/>во&nbsp;времени
        </div>
        <div style={{ fontSize: 15, marginTop: 6, opacity: 0.8 }}>
          грани кубика = разделы.<br/>спутники = превью каждого.
        </div>
      </SketchBox>

      {/* Bottom timeline rail — historic scale */}
      <div style={{
        position: 'absolute', bottom: 60, left: 60, right: 60,
        height: 56,
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 26,
          height: 2, background: INK, opacity: 0.6,
        }} />
        {[
          { x: 0, label: '~3000 BCE', e: 'ancient' },
          { x: 0.35, label: '500', e: 'medieval' },
          { x: 0.6, label: '1500', e: 'renaissance' },
          { x: 0.78, label: '1800', e: 'modern' },
          { x: 0.92, label: 'XX', e: 'contemporary' },
          { x: 1, label: 'now', e: 'contemporary' },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${p.x * 100}%`, top: 0,
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              letterSpacing: 1, opacity: 0.7,
            }}>{p.label}</div>
            <div style={{
              width: 14, height: 14, borderRadius: '50%',
              background: EPOCHS[p.e].colors[0],
              border: `2px solid ${INK}`,
              marginTop: 10,
              transform: p.e === t.epoch ? 'scale(1.3)' : 'scale(1)',
              boxShadow: p.e === t.epoch ? `2px 2px 0 ${INK}` : 'none',
            }} />
          </div>
        ))}
        <div style={{
          position: 'absolute', right: 0, bottom: -22,
          fontFamily: '"Caveat", cursive', fontSize: 16, opacity: 0.7,
        }}>
          ↑ та же линия идёт через все секции
        </div>
      </div>

      {/* annotations */}
      {t.density === 'comfy' && (
        <div style={{
          position: 'absolute', top: 130, right: 60,
          display: 'flex', flexDirection: 'column', gap: 6,
          alignItems: 'flex-end',
        }}>
          <WireMark text="ORBITAL · 6 спутников / 60°" />
          <WireMark text="hover на ячейке = подсветка спутника" />
          <WireMark text="сборка грани → fullscreen раздел" />
        </div>
      )}
    </HeroFrame>
  );
}

Object.assign(window, { VariantOne, VariantTwo, VariantThree });
