// «Хронос» — Hi-fi V5 unfolded timeline.
// Куб развернулся в горизонтальную ленту. Нелинейная шкала: чем ближе к
// «сейчас», тем шире — иначе личная жизнь схлопывается в точку. 7 дорожек:
// эпохи (фон) · идеи · изобретения · искусство · ТЫ · современники · места.
// Серое = база. Цветное = «выбрано на грани куба».

// ── Data (placeholder, born 1994-05-16) ──────────────────────────────────

const TL_BIRTH = 1994;
const TL_NOW   = 2026;
const TL_END   = 2074;

// Marker shape: { y: year, label: string, sub?: string, picked?: bool, e?: epoch }
// Lifeline shape: { y0, y1, label, sub?, picked?, e? }
const TL_DATA = {
  ideas: [
    { y: -300, label: 'Геометрия Евклида' },
    { y: 1543, label: 'Гелиоцентризм',     sub: 'Коперник' },
    { y: 1687, label: 'Гравитация',        sub: 'Ньютон' },
    { y: 1859, label: 'Эволюция',          sub: 'Дарвин',     picked: true, e: 'modern' },
    { y: 1905, label: 'Относительность',   sub: 'Эйнштейн',   picked: true, e: 'contemporary' },
    { y: 1925, label: 'Квантовая механика' },
    { y: 1953, label: 'ДНК',               sub: 'Уотсон, Крик', picked: true, e: 'contemporary' },
  ],
  inventions: [
    { y: -3500, label: 'Колесо' },
    { y:   105, label: 'Бумага' },
    { y:  1440, label: 'Книгопечатание' },
    { y:  1769, label: 'Паровой двигатель' },
    { y:  1879, label: 'Лампочка' },
    { y:  1903, label: 'Самолёт' },
    { y:  1969, label: 'Луна',    picked: true, e: 'contemporary' },
    { y:  1983, label: 'Интернет', picked: true, e: 'contemporary' },
    { y:  2007, label: 'iPhone',   picked: true, e: 'contemporary' },
    { y:  2022, label: 'GPT',      picked: true, e: 'contemporary' },
  ],
  art: [
    { y: -750, label: '«Илиада»',        sub: 'Гомер' },
    { y: 1512, label: '«Сотворение Адама»', sub: 'Микеланджело' },
    { y: 1601, label: '«Гамлет»',        sub: 'Шекспир' },
    { y: 1824, label: 'Симфония №9',     sub: 'Бетховен' },
    { y: 1869, label: '«Война и мир»',   sub: 'Толстой' },
    { y: 1889, label: '«Звёздная ночь»', sub: 'Ван Гог', picked: true, e: 'modern' },
    { y: 1973, label: '«Dark Side»',     sub: 'Pink Floyd', picked: true, e: 'contemporary' },
  ],
  contemporaries: [
    // Жизненные линии — y0/y1 = рождение/смерть (или now если жив)
    { y0: 1931, y1: 2022, label: 'М. Горбачёв',   sub: 'политик' },
    { y0: 1942, y1: 2018, label: 'С. Хокинг',     sub: 'физик',    picked: true, e: 'contemporary' },
    { y0: 1947, y1: 2016, label: 'Д. Боуи',       sub: 'музыка',   picked: true, e: 'contemporary' },
    { y0: 1955, y1: 2011, label: 'С. Джобс',      sub: 'технологии', picked: true, e: 'contemporary' },
    { y0: 1958, y1: TL_NOW, label: 'Мадонна',     sub: 'музыка' },
    { y0: 1971, y1: TL_NOW, label: 'И. Маск',     sub: 'технологии' },
  ],
  places: [
    // Места — y0 = год основания, длятся до сегодня
    { y0: -3000, y1: TL_NOW, label: 'Стоунхендж' },
    { y0: -2600, y1: TL_NOW, label: 'Пирамиды Гизы', picked: true, e: 'ancient' },
    { y0:  -440, y1: TL_NOW, label: 'Парфенон' },
    { y0:    80, y1: TL_NOW, label: 'Колизей',        picked: true, e: 'ancient' },
    { y0:  1248, y1: TL_NOW, label: 'Кёльнский собор' },
    { y0:  1889, y1: TL_NOW, label: 'Эйфелева башня', picked: true, e: 'modern' },
    { y0:  2010, y1: TL_NOW, label: 'Бурдж-Халифа' },
  ],
  // ТЫ — личные события
  you: {
    born: TL_BIRTH,
    now:  TL_NOW,
    end:  TL_END,
    events: [
      { y: 2000, label: 'школа' },
      { y: 2011, label: 'выпуск' },
      { y: 2016, label: 'первая работа' },
      { y: 2020, label: 'переезд' },
    ],
  },
};

// Эпохи как фон
const TL_EPOCHS_BG = [
  { id: 'ancient',      y0: -3000, y1:  500 },
  { id: 'medieval',     y0:   500, y1: 1400 },
  { id: 'renaissance',  y0:  1400, y1: 1650 },
  { id: 'modern',       y0:  1650, y1: 1900 },
  { id: 'contemporary', y0:  1900, y1: TL_END },
];

// ── Non-linear scale ────────────────────────────────────────────────────
// Piecewise linear segments — each "era" gets equal visual share so the
// last 150 years aren't a hair-thin sliver. Returns 0..1.
const TL_YEAR_MIN = -3000;
const TL_YEAR_MAX = TL_END;

function tlYearToFrac(year) {
  const stops = [
    [TL_YEAR_MIN, 0.00],
    [    0,       0.18],
    [ 1500,       0.36],
    [ 1900,       0.58],
    [TL_BIRTH,    0.70],
    [TL_NOW,      0.84],
    [TL_YEAR_MAX, 1.00],
  ];
  if (year <= stops[0][0]) return 0;
  if (year >= stops[stops.length - 1][0]) return 1;
  for (let i = 0; i < stops.length - 1; i++) {
    const [y0, f0] = stops[i];
    const [y1, f1] = stops[i + 1];
    if (year <= y1) {
      return f0 + ((year - y0) / (y1 - y0)) * (f1 - f0);
    }
  }
  return 1;
}

// Format a year as «1543» / «300 до н.э.»
function tlFmtYear(y) {
  if (y < 0) return `${-y} до н.э.`;
  return String(y);
}

// ── Lane primitives ──────────────────────────────────────────────────────

const LANE_H = 78;
const TL_GRAY = 'rgba(180, 180, 195, 0.32)';
const TL_GRAY_INK = 'rgba(220, 220, 230, 0.55)';
const TL_INK = '#f5f3ed';

// Greedy row packer — sorts items by start position and drops each into the
// lowest row whose last item is at least `minGap` to the left (or to its
// right edge for ranges). Mutates each item by writing `_row`.
function packRows(items, getStart, getEnd, minGap) {
  const sorted = items.map((it, _i) => ({ it, _i, x0: getStart(it), x1: getEnd ? getEnd(it) : getStart(it) }));
  sorted.sort((a, b) => a.x0 - b.x0);
  const lastX = [];
  for (const s of sorted) {
    let row = 0;
    while (lastX[row] != null && s.x0 - lastX[row] < minGap) row++;
    lastX[row] = s.x1;
    s.it._row = row;
  }
  return Math.max(1, lastX.length);
}

// Pick a horizontal anchor for a label so the rightmost items don't get
// clipped by the canvas edge.
function labelAnchor(x) {
  if (x > 0.92) return { right: 8, textAlign: 'right' };
  return { left: 8, textAlign: 'left' };
}

function MarkerDot({ x, label, sub, picked, color, row = 0 }) {
  const c = picked ? color : TL_GRAY;
  const ink = picked ? '#fff' : TL_GRAY_INK;
  // Alternate rows above/below the dot. Row 0 = just above, row 1 = just
  // below, row 2 = higher, row 3 = lower, etc.
  const dir = row % 2 === 0 ? -1 : 1;
  const tier = Math.floor(row / 2);
  const labelOffsetY = dir * (20 + tier * 38);
  const anchor = labelAnchor(x);
  return (
    <div style={{
      position: 'absolute',
      left: `${x * 100}%`,
      top: 0, bottom: 0,
      width: 1,
      pointerEvents: 'none',
    }}>
      {/* dot */}
      <div style={{
        position: 'absolute',
        left: -4, top: '50%', transform: 'translateY(-50%)',
        width: 8, height: 8, borderRadius: '50%',
        background: c,
        boxShadow: picked ? `0 0 12px ${color}aa, 0 0 3px ${color}` : 'none',
      }} />
      {/* leader line from dot to label */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: dir > 0 ? 'calc(50% + 4px)' : `calc(50% - ${Math.abs(labelOffsetY)}px)`,
        width: 1, height: Math.abs(labelOffsetY) - 4,
        background: picked ? `${color}55` : 'rgba(245,243,237,0.10)',
      }} />
      {/* label */}
      <div style={{
        position: 'absolute',
        ...anchor,
        top: `calc(50% + ${labelOffsetY}px)`,
        transform: dir > 0 ? 'translateY(0)' : 'translateY(-100%)',
        fontFamily: '"DM Sans", sans-serif',
        fontSize: picked ? 12 : 10,
        fontWeight: picked ? 600 : 400,
        color: ink,
        whiteSpace: 'nowrap',
        lineHeight: 1.15,
      }}>
        <div>{label}</div>
        {sub && (
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 8.5, opacity: 0.55,
            marginTop: 1, letterSpacing: 0.5,
          }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

function LifelineBar({ x0, x1, label, sub, picked, color, row = 0 }) {
  const c = picked ? color : TL_GRAY;
  const ink = picked ? '#fff' : TL_GRAY_INK;
  // Each row stacks vertically. Bar centered on its row; label sits above.
  const rowStep = 28;
  const topPx = 18 + row * rowStep;
  const anchor = labelAnchor(x0);
  return (
    <div style={{
      position: 'absolute',
      left: `${x0 * 100}%`,
      width: `${(x1 - x0) * 100}%`,
      top: topPx,
      height: 14,
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '50%',
        height: 3, transform: 'translateY(-50%)',
        background: c,
        borderRadius: 2,
        boxShadow: picked ? `0 0 8px ${color}80` : 'none',
      }} />
      <div style={{
        position: 'absolute', left: -3, top: '50%',
        width: 7, height: 7, borderRadius: '50%',
        background: c, transform: 'translateY(-50%)',
      }} />
      <div style={{
        position: 'absolute', right: -3, top: '50%',
        width: 7, height: 7, borderRadius: '50%',
        background: c, transform: 'translateY(-50%)',
      }} />
      <div style={{
        position: 'absolute',
        ...anchor,
        top: -14,
        fontFamily: '"DM Sans", sans-serif',
        fontSize: picked ? 11 : 10,
        fontWeight: picked ? 600 : 400,
        color: ink,
        whiteSpace: 'nowrap',
        lineHeight: 1.1,
      }}>
        {label}
        {sub && (
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 8.5, opacity: 0.55,
            marginLeft: 5, letterSpacing: 0.5,
          }}>· {sub}</span>
        )}
      </div>
    </div>
  );
}

function LaneRow({ title, sub, count, children, height = LANE_H }) {
  return (
    <div style={{
      position: 'relative',
      height,
      borderTop: '1px dashed rgba(245,243,237,0.07)',
      display: 'flex',
    }}>
      <div style={{
        flex: '0 0 160px',
        padding: '12px 18px 0 0',
        textAlign: 'right',
        borderRight: '1px solid rgba(245,243,237,0.08)',
      }}>
        <div style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 18, fontWeight: 700, color: TL_INK,
          lineHeight: 1,
        }}>{title}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'rgba(245,243,237,0.4)',
          marginTop: 6,
        }}>{sub}{count != null ? ` · ${count}` : ''}</div>
      </div>
      <div style={{
        position: 'relative', flex: 1,
        overflow: 'visible',
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────

function UnfoldedTimeline({ epoch, onClose }) {
  const accent = EPOCHS[epoch].colors[0];
  const colorFor = (id) => EPOCHS[id]?.colors[0] || accent;

  // Year ticks for the bottom ruler
  const tlTicks = [-3000, -1000, 0, 500, 1000, 1500, 1700, 1850, 1950, 2000, TL_NOW, TL_END];

  const youX0 = tlYearToFrac(TL_DATA.you.born);
  const youXNow = tlYearToFrac(TL_DATA.you.now);
  const youXEnd = tlYearToFrac(TL_DATA.you.end);

  // Resolve label collisions ─ pre-compute a row index per item so labels in
  // the dense 1900→now band don't stack on top of each other.
  const MARKER_GAP = 0.105;  // ~ widest label width / canvas width
  const RANGE_GAP  = 0.006;  // ranges are already separated by their length
  const ideasRows      = packRows(TL_DATA.ideas,          d => tlYearToFrac(d.y),  null,                       MARKER_GAP);
  const inventionsRows = packRows(TL_DATA.inventions,     d => tlYearToFrac(d.y),  null,                       MARKER_GAP);
  const artRows        = packRows(TL_DATA.art,            d => tlYearToFrac(d.y),  null,                       MARKER_GAP);
  const contempRows    = packRows(TL_DATA.contemporaries, d => tlYearToFrac(d.y0), d => tlYearToFrac(d.y1),    RANGE_GAP);
  const placesRows     = packRows(TL_DATA.places,         d => tlYearToFrac(d.y0), d => tlYearToFrac(d.y1),    RANGE_GAP);

  // Lane heights scale with packed row count.
  const markerLaneH = (rows) => 72 + Math.ceil(rows / 2) * 76; // both sides of dot
  const rangeLaneH  = (rows) => 28 + rows * 28;

  return (
    <div style={{
      position: 'relative',
      width: '100%', minHeight: '100vh',
      background: HIFI_BG_DEEP,
      color: HIFI_INK,
      overflow: 'hidden',
      fontFamily: '"DM Sans", sans-serif',
      padding: '0 0 60px',
    }}>
      {/* atmospheric BG */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 75% 40%, ${accent}18 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, #2d4a8a14 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <header style={{
        position: 'relative', zIndex: 5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        padding: '40px 60px 28px',
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            letterSpacing: 3, color: HIFI_INK_FNT,
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            <span style={{ color: accent }}>●</span>&nbsp;&nbsp;развёртка · {tlFmtYear(TL_YEAR_MIN)} → {tlFmtYear(TL_YEAR_MAX)}
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 56, fontWeight: 800, lineHeight: 0.95,
            letterSpacing: -1.8, margin: 0,
          }}>
            твоя&nbsp;линия&nbsp;жизни <em style={{
              fontStyle: 'italic', fontWeight: 400, color: accent,
            }}>в&nbsp;истории</em>
          </h1>
          <div style={{
            marginTop: 14, fontSize: 14, color: HIFI_INK_DIM,
            display: 'flex', gap: 22,
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: 1,
          }}>
            <span>16·05·1994 → 2074</span>
            <span>·</span>
            <span>80 лет из 5 074</span>
            <span>·</span>
            <span>{((TL_NOW - TL_BIRTH) / 80 * 100).toFixed(0)}% прожито</span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            padding: '10px 18px',
            background: 'rgba(245,243,237,0.06)',
            color: TL_INK,
            border: '1px solid rgba(245,243,237,0.18)',
            borderRadius: 999,
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: 0.3,
          }}
        >← к кубику</button>
      </header>

      {/* Timeline canvas */}
      <div style={{
        position: 'relative', zIndex: 4,
        margin: '0 60px',
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(245,243,237,0.06)',
        borderRadius: 12,
      }}>
        {/* Epoch background bands */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          marginLeft: 160, // align with lane content area
          overflow: 'hidden',
          borderTopRightRadius: 12,
        }}>
          {TL_EPOCHS_BG.map((e, i) => {
            const x0 = tlYearToFrac(e.y0);
            const x1 = tlYearToFrac(e.y1);
            const col = EPOCHS[e.id].colors[0];
            return (
              <React.Fragment key={e.id}>
                <div style={{
                  position: 'absolute',
                  left: `${x0 * 100}%`, width: `${(x1 - x0) * 100}%`,
                  top: 0, bottom: 0,
                  background: `linear-gradient(180deg, ${col}10 0%, ${col}06 100%)`,
                }} />
                {i > 0 && (
                  <div style={{
                    position: 'absolute',
                    left: `${x0 * 100}%`, top: 0, bottom: 0, width: 1,
                    background: 'rgba(245,243,237,0.06)',
                  }} />
                )}
                {/* epoch caption */}
                <div style={{
                  position: 'absolute',
                  left: `${x0 * 100}%`,
                  maxWidth: `${(x1 - x0) * 100}%`,
                  top: 8,
                  paddingLeft: 8,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
                  color: col,
                  opacity: 0.55,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>{EPOCHS[e.id].ru}</div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Lane: Идеи */}
        <LaneRow title="Идеи" sub="теории · открытия" count={TL_DATA.ideas.filter(d => d.picked).length + '/' + TL_DATA.ideas.length} height={markerLaneH(ideasRows)}>
          {TL_DATA.ideas.map((d, i) => (
            <MarkerDot key={i} x={tlYearToFrac(d.y)} label={d.label} sub={d.sub}
              picked={d.picked} color={colorFor(d.e)} row={d._row || 0} />
          ))}
        </LaneRow>

        {/* Lane: Изобретения */}
        <LaneRow title="Изобретения" sub="вещи · технологии" count={TL_DATA.inventions.filter(d => d.picked).length + '/' + TL_DATA.inventions.length} height={markerLaneH(inventionsRows)}>
          {TL_DATA.inventions.map((d, i) => (
            <MarkerDot key={i} x={tlYearToFrac(d.y)} label={d.label} sub={d.sub}
              picked={d.picked} color={colorFor(d.e)} row={d._row || 0} />
          ))}
        </LaneRow>

        {/* Lane: Искусство */}
        <LaneRow title="Искусство" sub="картины · музыка · текст" count={TL_DATA.art.filter(d => d.picked).length + '/' + TL_DATA.art.length} height={markerLaneH(artRows)}>
          {TL_DATA.art.map((d, i) => (
            <MarkerDot key={i} x={tlYearToFrac(d.y)} label={d.label} sub={d.sub}
              picked={d.picked} color={colorFor(d.e)} row={d._row || 0} />
          ))}
        </LaneRow>

        {/* Lane: ТЫ (главная — выделенная, выше, ярче) */}
        <LaneRow title="ТЫ" sub="это твоя жизнь" height={LANE_H + 56}>
          {/* Жизнь — главная линия */}
          <div style={{
            position: 'absolute',
            left: `${youX0 * 100}%`, width: `${(youXNow - youX0) * 100}%`,
            top: '50%', height: 7, transform: 'translateY(-50%)',
            background: accent,
            borderRadius: 4,
            boxShadow: `0 0 24px ${accent}99, 0 0 4px ${accent}`,
          }} />
          {/* Будущее — пунктир до конца */}
          <div style={{
            position: 'absolute',
            left: `${youXNow * 100}%`, width: `${(youXEnd - youXNow) * 100}%`,
            top: '50%', height: 7, transform: 'translateY(-50%)',
            background: `repeating-linear-gradient(90deg, ${accent}aa 0 8px, transparent 8px 14px)`,
            borderRadius: 4,
            opacity: 0.7,
          }} />
          {/* Маркеры рождения / сейчас / конца */}
          {[
            { x: youX0,   label: 'рождение', y: TL_BIRTH, big: true },
            { x: youXNow, label: 'сейчас',   y: TL_NOW,   big: true, marker: true },
            { x: youXEnd, label: 'конец',    y: TL_END,   big: true, dashed: true },
          ].map((m, i) => (
            <div key={i} style={{
              position: 'absolute', left: `${m.x * 100}%`, top: 0, bottom: 0, width: 1,
            }}>
              <div style={{
                position: 'absolute',
                left: -7, top: '50%', transform: 'translateY(-50%)',
                width: 14, height: 14, borderRadius: '50%',
                background: m.marker ? '#fff' : accent,
                border: `2px solid ${m.dashed ? 'transparent' : '#04040a'}`,
                outline: m.dashed ? `2px dashed ${accent}` : 'none',
                boxShadow: `0 0 14px ${accent}cc`,
              }} />
              <div style={{
                position: 'absolute', left: -30, top: -6,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10, letterSpacing: 1.5,
                color: 'rgba(245,243,237,0.85)',
                whiteSpace: 'nowrap', textTransform: 'uppercase',
              }}>{m.y}</div>
              <div style={{
                position: 'absolute', left: -30, bottom: -2,
                fontFamily: '"Playfair Display", serif',
                fontStyle: 'italic', fontSize: 14,
                color: TL_INK,
                whiteSpace: 'nowrap',
              }}>{m.label}</div>
            </div>
          ))}
          {/* Личные события */}
          {TL_DATA.you.events.map((ev, i) => {
            const x = tlYearToFrac(ev.y);
            return (
              <div key={'e' + i} style={{
                position: 'absolute', left: `${x * 100}%`, top: 0, bottom: 0, width: 1,
              }}>
                <div style={{
                  position: 'absolute', left: -1, top: '50%',
                  width: 2, height: 22, transform: 'translateY(-50%)',
                  background: '#fff', opacity: 0.8,
                }} />
                <div style={{
                  position: 'absolute',
                  left: 4, top: 'calc(50% + 14px)',
                  transform: 'rotate(35deg)',
                  transformOrigin: 'left top',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 11, color: 'rgba(245,243,237,0.78)',
                  whiteSpace: 'nowrap',
                  letterSpacing: 0.2,
                }}>{ev.label} <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 9, opacity: 0.55, marginLeft: 4,
                }}>{ev.y}</span></div>
              </div>
            );
          })}
        </LaneRow>

        {/* Lane: Современники */}
        <LaneRow title="Современники" sub="кто жил рядом" count={TL_DATA.contemporaries.filter(d => d.picked).length + '/' + TL_DATA.contemporaries.length} height={rangeLaneH(contempRows)}>
          {TL_DATA.contemporaries.map((d, i) => (
            <LifelineBar key={i}
              x0={tlYearToFrac(d.y0)} x1={tlYearToFrac(d.y1)}
              label={d.label} sub={d.sub}
              picked={d.picked} color={colorFor(d.e)}
              row={d._row || 0}
            />
          ))}
        </LaneRow>

        {/* Lane: Места */}
        <LaneRow title="Места" sub="до сих пор стоят" count={TL_DATA.places.filter(d => d.picked).length + '/' + TL_DATA.places.length} height={rangeLaneH(placesRows)}>
          {TL_DATA.places.map((d, i) => (
            <LifelineBar key={i}
              x0={tlYearToFrac(d.y0)} x1={tlYearToFrac(d.y1)}
              label={d.label} sub={d.sub}
              picked={d.picked} color={colorFor(d.e)}
              row={d._row || 0}
            />
          ))}
        </LaneRow>

        {/* Ruler */}
        <div style={{
          position: 'relative',
          height: 36,
          borderTop: '1px solid rgba(245,243,237,0.12)',
          display: 'flex',
        }}>
          <div style={{ flex: '0 0 160px' }} />
          <div style={{ position: 'relative', flex: 1 }}>
            {tlTicks.map((y, i) => {
              const x = tlYearToFrac(y);
              return (
                <div key={i} style={{
                  position: 'absolute', left: `${x * 100}%`, top: 0,
                  transform: 'translateX(-50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 4,
                }}>
                  <div style={{
                    width: 1, height: 8,
                    background: 'rgba(245,243,237,0.3)',
                  }} />
                  <div style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 9, letterSpacing: 1,
                    color: y === TL_NOW ? accent : 'rgba(245,243,237,0.55)',
                    fontWeight: y === TL_NOW ? 600 : 400,
                  }}>{tlFmtYear(y)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend / hint */}
      <div style={{
        position: 'relative', zIndex: 4,
        margin: '28px 60px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 24,
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 12, color: 'rgba(245,243,237,0.5)',
      }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: accent, boxShadow: `0 0 8px ${accent}`,
            }} />
            выбрано на грани
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%', background: TL_GRAY,
            }} />
            база (не выбрано)
          </span>
        </div>
        <div style={{
          fontStyle: 'italic',
          color: 'rgba(245,243,237,0.4)',
        }}>
          шкала нелинейная — последние 200 лет растянуты, иначе твоя жизнь — точка
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { UnfoldedTimeline });
