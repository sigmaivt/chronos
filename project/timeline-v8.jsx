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

// Per-lane palette — each lane gets its own dedicated colour, picked items
// glow in their lane's colour. ТЫ is the special one — its colour comes from
// the user's birth epoch.
const TL_LANE_COLORS = {
  ideas:          '#22d3ee', // cyan
  inventions:     '#fbbf24', // amber
  art:            '#f472b6', // pink
  contemporaries: '#4ade80', // green
  places:         '#f59e8a', // coral
  // you → derived from epoch (passed in as prop)
};

const TL_LANE_DEFS = [
  { id: 'ideas',          title: 'Идеи',         sub: 'теории · открытия',         type: 'markers',  dataKey: 'ideas' },
  { id: 'inventions',     title: 'Изобретения',  sub: 'вещи · технологии',         type: 'markers',  dataKey: 'inventions' },
  { id: 'art',            title: 'Искусство',    sub: 'картины · музыка · текст',  type: 'markers',  dataKey: 'art' },
  { id: 'you',            title: 'ТЫ',           sub: 'это твоя жизнь',            type: 'self' },
  { id: 'contemporaries', title: 'Современники', sub: 'кто жил рядом',             type: 'ranges',   dataKey: 'contemporaries' },
  { id: 'places',         title: 'Места',        sub: 'до сих пор стоят',          type: 'ranges',   dataKey: 'places' },
];

const TL_LANE_BY_ID = Object.fromEntries(TL_LANE_DEFS.map((d) => [d.id, d]));

function tlFmtFullYear(y) {
  if (y < 0) return `${-y} до н.э.`;
  return String(y);
}

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

// Generic floating tooltip — sibling of the marker; revealed via CSS when
// the .tl-marker / .tl-lifeline parent is hovered.
function Tooltip({ x, children }) {
  // Flip horizontally near canvas edges so it doesn't get clipped.
  let transform;
  if (x > 0.85) transform = 'translate(-100%, calc(-100% - 14px))';
  else if (x < 0.08) transform = 'translate(0, calc(-100% - 14px))';
  else transform = 'translate(-50%, calc(-100% - 14px))';
  return (
    <div className="tl-tip" style={{
      position: 'absolute',
      left: 0, top: '50%',
      transform,
      padding: '10px 14px',
      background: 'rgba(10,10,20,0.96)',
      border: '1px solid rgba(255,255,255,0.16)',
      borderRadius: 8,
      minWidth: 140, maxWidth: 260,
      pointerEvents: 'none',
      opacity: 0,
      transition: 'opacity 180ms ease',
      zIndex: 50,
      boxShadow: '0 14px 36px rgba(0,0,0,0.7)',
      whiteSpace: 'normal',
    }}>
      {children}
    </div>
  );
}

function MarkerDot({ x, label, sub, picked, color, row = 0, year, onHoverChange }) {
  // All markers wear their lane's colour now; picked ones just have stronger
  // presence (full opacity + glow + bold label).
  const c = color;
  const dotOpacity = picked ? 1 : 0.5;
  const ink = picked ? '#fff' : 'rgba(220,220,230,0.65)';
  // Alternate rows above/below the dot. Row 0 = just above, row 1 = just
  // below, row 2 = higher, row 3 = lower, etc.
  const dir = row % 2 === 0 ? -1 : 1;
  const tier = Math.floor(row / 2);
  const labelOffsetY = dir * (20 + tier * 38);
  const anchor = labelAnchor(x);
  return (
    <div className="tl-marker" style={{
      position: 'absolute',
      left: `${x * 100}%`,
      top: 0, bottom: 0,
      width: 1,
      pointerEvents: 'auto',
    }}
      onMouseEnter={() => onHoverChange && onHoverChange({ x, year, color, label, sub })}
      onMouseLeave={() => onHoverChange && onHoverChange(null)}
    >
      {/* hit area (invisible) for hover detection */}
      <div style={{
        position: 'absolute',
        left: -12, top: '50%', transform: 'translateY(-50%)',
        width: 24, height: 24,
        cursor: 'help',
      }} />
      {/* dot */}
      <div style={{
        position: 'absolute',
        left: -4, top: '50%', transform: 'translateY(-50%)',
        width: 8, height: 8, borderRadius: '50%',
        background: c,
        opacity: dotOpacity,
        boxShadow: picked ? `0 0 12px ${color}aa, 0 0 3px ${color}` : 'none',
        pointerEvents: 'none',
      }} />
      {/* leader line from dot to label */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: dir > 0 ? 'calc(50% + 4px)' : `calc(50% - ${Math.abs(labelOffsetY)}px)`,
        width: 1, height: Math.abs(labelOffsetY) - 4,
        background: picked ? `${color}55` : `${color}22`,
        pointerEvents: 'none',
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
        pointerEvents: 'none',
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
      {/* tooltip */}
      <Tooltip x={x}>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{sub}</div>}
        <div style={{
          marginTop: 6, paddingTop: 6,
          borderTop: '1px solid rgba(255,255,255,0.12)',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11, color, letterSpacing: 0.5,
        }}>{tlFmtFullYear(year)}</div>
      </Tooltip>
    </div>
  );
}

function LifelineBar({ x0, x1, label, sub, picked, color, row = 0, y0, y1, onHoverChange }) {
  const c = color;
  const barOpacity = picked ? 1 : 0.45;
  const ink = picked ? '#fff' : 'rgba(220,220,230,0.65)';
  // Each row stacks vertically. Bar centered on its row; label sits above.
  const rowStep = 28;
  const topPx = 18 + row * rowStep;
  const anchor = labelAnchor(x0);
  // Year range string for tooltip.
  const isAlive = y1 >= TL_NOW;
  const rangeStr = `${tlFmtFullYear(y0)} – ${isAlive ? 'сейчас' : tlFmtFullYear(y1)}`;
  const lifespanYears = (isAlive ? TL_NOW : y1) - y0;
  return (
    <div className="tl-lifeline" style={{
      position: 'absolute',
      left: `${x0 * 100}%`,
      width: `${(x1 - x0) * 100}%`,
      top: topPx,
      height: 14,
      pointerEvents: 'auto',
      cursor: 'help',
    }}
      onMouseEnter={() => onHoverChange && onHoverChange({ x: (x0 + x1) / 2, year: y0, color, label, sub, range: [y0, y1] })}
      onMouseLeave={() => onHoverChange && onHoverChange(null)}
    >
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '50%',
        height: 3, transform: 'translateY(-50%)',
        background: c,
        opacity: barOpacity,
        borderRadius: 2,
        boxShadow: picked ? `0 0 8px ${color}80` : 'none',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', left: -3, top: '50%',
        width: 7, height: 7, borderRadius: '50%',
        background: c, opacity: barOpacity,
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: -3, top: '50%',
        width: 7, height: 7, borderRadius: '50%',
        background: c, opacity: barOpacity,
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
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
        pointerEvents: 'none',
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
      <Tooltip x={(x0 + x1) / 2}>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{sub}</div>}
        <div style={{
          marginTop: 6, paddingTop: 6,
          borderTop: '1px solid rgba(255,255,255,0.12)',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11, color, letterSpacing: 0.4,
        }}>{rangeStr}</div>
        <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3,
        }}>{lifespanYears} лет {isAlive ? '(жив)' : ''}</div>
      </Tooltip>
    </div>
  );
}

function LaneRow({ title, sub, count, color, children, height = LANE_H, draggable, dragging, dropTarget, onDragStart, onDragOver, onDragEnd, onDrop }) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      style={{
        position: 'relative',
        height,
        borderTop: '1px dashed rgba(245,243,237,0.07)',
        display: 'flex',
        opacity: dragging ? 0.4 : 1,
        background: dropTarget ? 'rgba(245,243,237,0.04)' : 'transparent',
        transition: 'opacity 200ms, background 160ms',
      }}>
      <div style={{
        flex: '0 0 160px',
        padding: '12px 18px 0 12px',
        textAlign: 'right',
        borderRight: '1px solid rgba(245,243,237,0.08)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        position: 'relative',
      }}>
        {/* drag handle */}
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 14, lineHeight: 1,
          color: 'rgba(245,243,237,0.25)',
          paddingTop: 4,
          cursor: 'grab',
          userSelect: 'none',
        }} title="перетащить полосу">⋮⋮</div>
        {/* accent color chip */}
        {color && (
          <div style={{
            width: 3, alignSelf: 'stretch',
            background: color,
            borderRadius: 2,
            boxShadow: `0 0 6px ${color}66`,
          }} />
        )}
        <div style={{ flex: 1, textAlign: 'right' }}>
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

function UnfoldedTimeline({ epoch, onClose, laneOrder, setLaneOrder }) {
  const accent = EPOCHS[epoch].colors[0];
  const order = (laneOrder && laneOrder.length === TL_LANE_DEFS.length)
    ? laneOrder
    : TL_LANE_DEFS.map((d) => d.id);

  // Year ticks for the bottom ruler
  const tlTicks = [-3000, -1000, 0, 500, 1000, 1500, 1700, 1850, 1950, 2000, TL_NOW, TL_END];

  const youX0   = tlYearToFrac(TL_DATA.you.born);
  const youXNow = tlYearToFrac(TL_DATA.you.now);
  const youXEnd = tlYearToFrac(TL_DATA.you.end);

  // Per-lane colour — ТЫ uses the epoch accent, others use their dedicated hue.
  const laneColor = (id) => id === 'you' ? accent : TL_LANE_COLORS[id];

  // Pack rows per lane (resolve label collisions).
  const MARKER_GAP = 0.105;
  const RANGE_GAP  = 0.006;
  const packedRows = {
    ideas:          packRows(TL_DATA.ideas,          d => tlYearToFrac(d.y),  null,                       MARKER_GAP),
    inventions:     packRows(TL_DATA.inventions,     d => tlYearToFrac(d.y),  null,                       MARKER_GAP),
    art:            packRows(TL_DATA.art,            d => tlYearToFrac(d.y),  null,                       MARKER_GAP),
    contemporaries: packRows(TL_DATA.contemporaries, d => tlYearToFrac(d.y0), d => tlYearToFrac(d.y1),    RANGE_GAP),
    places:         packRows(TL_DATA.places,         d => tlYearToFrac(d.y0), d => tlYearToFrac(d.y1),    RANGE_GAP),
  };

  const markerLaneH = (rows) => 72 + Math.ceil(rows / 2) * 76;
  const rangeLaneH  = (rows) => 28 + rows * 28;

  // Drag-to-reorder state
  const [dragId, setDragId]   = React.useState(null);
  const [overId, setOverId]   = React.useState(null);

  // Hover guide — vertical line that follows the currently hovered
  // marker / lifeline / event across every lane.
  const [hoverInfo, setHoverInfo] = React.useState(null);
  // 3D hover for epoch bands
  const [hoveredEpoch, setHoveredEpoch] = React.useState(null);

  const onDragStart = (id) => (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setDragId(id);
  };
  const onDragOver = (id) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (overId !== id) setOverId(id);
  };
  const onDragEnd = () => { setDragId(null); setOverId(null); };
  const onDrop = (id) => (e) => {
    e.preventDefault();
    const fromId = dragId || e.dataTransfer.getData('text/plain');
    if (!fromId || fromId === id) { onDragEnd(); return; }
    const next = [...order];
    const fromIdx = next.indexOf(fromId);
    const toIdx = next.indexOf(id);
    if (fromIdx < 0 || toIdx < 0) { onDragEnd(); return; }
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, fromId);
    setLaneOrder && setLaneOrder(next);
    onDragEnd();
  };

  // Render a single lane based on its definition.
  const renderLane = (def) => {
    const col = laneColor(def.id);
    const isDragging = dragId === def.id;
    const isOver = overId === def.id && dragId && dragId !== def.id;
    const dragProps = {
      draggable: true,
      dragging: isDragging,
      dropTarget: isOver,
      onDragStart: onDragStart(def.id),
      onDragOver: onDragOver(def.id),
      onDragEnd,
      onDrop: onDrop(def.id),
    };

    if (def.type === 'markers') {
      const items = TL_DATA[def.dataKey];
      const pickedN = items.filter((d) => d.picked).length;
      return (
        <LaneRow
          key={def.id}
          title={def.title} sub={def.sub}
          count={`${pickedN}/${items.length}`}
          color={col}
          height={markerLaneH(packedRows[def.id])}
          {...dragProps}
        >
          {TL_DATA[def.dataKey].map((d, i) => (
            <MarkerDot key={i} x={tlYearToFrac(d.y)} year={d.y}
              label={d.label} sub={d.sub}
              picked={d.picked} color={col} row={d._row || 0}
              onHoverChange={setHoverInfo} />
          ))}
        </LaneRow>
      );
    }

    if (def.type === 'ranges') {
      const items = TL_DATA[def.dataKey];
      const pickedN = items.filter((d) => d.picked).length;
      return (
        <LaneRow
          key={def.id}
          title={def.title} sub={def.sub}
          count={`${pickedN}/${items.length}`}
          color={col}
          height={rangeLaneH(packedRows[def.id])}
          {...dragProps}
        >
          {TL_DATA[def.dataKey].map((d, i) => (
            <LifelineBar key={i}
              x0={tlYearToFrac(d.y0)} x1={tlYearToFrac(d.y1)}
              y0={d.y0} y1={d.y1}
              label={d.label} sub={d.sub}
              picked={d.picked} color={col}
              row={d._row || 0}
              onHoverChange={setHoverInfo}
            />
          ))}
        </LaneRow>
      );
    }

    if (def.type === 'self') {
      return (
        <LaneRow
          key={def.id}
          title={def.title} sub={def.sub}
          color={col}
          height={LANE_H + 56}
          {...dragProps}
        >
          {/* Жизнь — основная линия */}
          <div style={{
            position: 'absolute',
            left: `${youX0 * 100}%`, width: `${(youXNow - youX0) * 100}%`,
            top: '50%', height: 7, transform: 'translateY(-50%)',
            background: col,
            borderRadius: 4,
            boxShadow: `0 0 24px ${col}99, 0 0 4px ${col}`,
          }} />
          <div style={{
            position: 'absolute',
            left: `${youXNow * 100}%`, width: `${(youXEnd - youXNow) * 100}%`,
            top: '50%', height: 7, transform: 'translateY(-50%)',
            background: `repeating-linear-gradient(90deg, ${col}aa 0 8px, transparent 8px 14px)`,
            borderRadius: 4,
            opacity: 0.7,
          }} />
          {/* Маркеры рождения / сейчас / конца */}
          {[
            { x: youX0,   label: 'рождение', y: TL_BIRTH },
            { x: youXNow, label: 'сейчас',   y: TL_NOW,   marker: true },
            { x: youXEnd, label: 'конец',    y: TL_END,   dashed: true },
          ].map((m, i) => (
            <div key={i} className="tl-marker" style={{
              position: 'absolute', left: `${m.x * 100}%`, top: 0, bottom: 0, width: 1,
              pointerEvents: 'auto',
            }}
              onMouseEnter={() => setHoverInfo({ x: m.x, year: m.y, color: col, label: m.label })}
              onMouseLeave={() => setHoverInfo(null)}
            >
              <div style={{
                position: 'absolute',
                left: -7, top: '50%', transform: 'translateY(-50%)',
                width: 14, height: 14, borderRadius: '50%',
                background: m.marker ? '#fff' : col,
                border: `2px solid ${m.dashed ? 'transparent' : '#04040a'}`,
                outline: m.dashed ? `2px dashed ${col}` : 'none',
                boxShadow: `0 0 14px ${col}cc`,
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', left: -30, top: -6,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10, letterSpacing: 1.5,
                color: 'rgba(245,243,237,0.85)',
                whiteSpace: 'nowrap', textTransform: 'uppercase',
                pointerEvents: 'none',
              }}>{m.y}</div>
              <div style={{
                position: 'absolute', left: -30, bottom: -2,
                fontFamily: '"Playfair Display", serif',
                fontStyle: 'italic', fontSize: 14,
                color: TL_INK,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}>{m.label}</div>
              <Tooltip x={m.x}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{m.label}</div>
                <div style={{
                  marginTop: 6, paddingTop: 6,
                  borderTop: '1px solid rgba(255,255,255,0.12)',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11, color: col, letterSpacing: 0.4,
                }}>{m.y}</div>
              </Tooltip>
            </div>
          ))}
          {/* Личные события */}
          {TL_DATA.you.events.map((ev, i) => {
            const x = tlYearToFrac(ev.y);
            return (
              <div key={'e' + i} className="tl-marker" style={{
                position: 'absolute', left: `${x * 100}%`, top: 0, bottom: 0, width: 1,
                pointerEvents: 'auto',
              }}
                onMouseEnter={() => setHoverInfo({ x, year: ev.y, color: col, label: ev.label, sub: `+${ev.y - TL_BIRTH} лет` })}
                onMouseLeave={() => setHoverInfo(null)}
              >
                <div style={{
                  position: 'absolute', left: -1, top: '50%',
                  width: 2, height: 22, transform: 'translateY(-50%)',
                  background: '#fff', opacity: 0.8,
                  pointerEvents: 'none',
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
                  pointerEvents: 'none',
                }}>{ev.label} <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 9, opacity: 0.55, marginLeft: 4,
                }}>{ev.y}</span></div>
                <Tooltip x={x}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{ev.label}</div>
                  <div style={{
                    marginTop: 6, paddingTop: 6,
                    borderTop: '1px solid rgba(255,255,255,0.12)',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 11, color: col, letterSpacing: 0.4,
                  }}>{ev.y} · {ev.y - TL_BIRTH} лет</div>
                </Tooltip>
              </div>
            );
          })}
        </LaneRow>
      );
    }
    return null;
  };

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
      {/* CSS for hover tooltips */}
      <style>{`
        .tl-marker:hover .tl-tip,
        .tl-lifeline:hover .tl-tip {
          opacity: 1 !important;
        }
      `}</style>

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
        {/* Epoch background bands — interactive, lift on hover */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          marginLeft: 160,
          overflow: 'hidden',
          borderTopRightRadius: 12,
          perspective: 1600,
          zIndex: 1,
        }}>
          {TL_EPOCHS_BG.map((e, i) => {
            const x0 = tlYearToFrac(e.y0);
            const x1 = tlYearToFrac(e.y1);
            const col = EPOCHS[e.id].colors[0];
            const isHovered = hoveredEpoch === e.id;
            return (
              <div
                key={e.id}
                style={{
                  position: 'absolute',
                  left: `${x0 * 100}%`, width: `${(x1 - x0) * 100}%`,
                  top: 0, bottom: 0,
                  pointerEvents: 'none',   /* base — lets marker events through */
                  transformStyle: 'preserve-3d',
                  transform: isHovered ? 'translateZ(40px) scale(1.012)' : 'translateZ(0) scale(1)',
                  transition: 'transform 360ms cubic-bezier(.22,.85,.25,1), filter 320ms',
                  filter: hoveredEpoch && !isHovered ? 'brightness(0.7)' : 'brightness(1)',
                  zIndex: isHovered ? 4 : 1,
                }}>
                {/* base fill */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: isHovered
                    ? `linear-gradient(180deg, ${col}38 0%, ${col}18 100%)`
                    : `linear-gradient(180deg, ${col}1f 0%, ${col}0e 100%)`,
                  transition: 'background 280ms',
                  boxShadow: isHovered
                    ? `inset 0 0 0 1px ${col}66, 0 18px 60px ${col}55, 0 6px 22px rgba(0,0,0,0.55)`
                    : 'inset 0 0 0 1px rgba(245,243,237,0.05)',
                  borderRadius: 4,
                  pointerEvents: 'none',
                }} />
                {/* left dividing line */}
                {i > 0 && !isHovered && (
                  <div style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0, width: 1,
                    background: 'rgba(245,243,237,0.10)',
                    pointerEvents: 'none',
                  }} />
                )}
                {/* HOT-ZONE: a narrow strip up top is what catches the
                    hover. Below it markers can still be hovered. */}
                <div
                  onMouseEnter={() => setHoveredEpoch(e.id)}
                  onMouseLeave={() => setHoveredEpoch(null)}
                  style={{
                    position: 'absolute',
                    left: 0, right: 0, top: 0,
                    height: isHovered ? 30 : 20,
                    cursor: 'help',
                    pointerEvents: 'auto',
                  }} />
                {/* caption */}
                <div style={{
                  position: 'absolute',
                  left: 0, right: 0,
                  top: isHovered ? 5 : 7,
                  paddingLeft: 10, paddingRight: 10,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: isHovered ? 11 : 9,
                  letterSpacing: 2, textTransform: 'uppercase',
                  color: isHovered ? '#fff' : col,
                  opacity: isHovered ? 1 : 0.7,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textShadow: isHovered ? `0 0 14px ${col}, 0 0 4px ${col}` : 'none',
                  transition: 'all 280ms',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}>
                  {EPOCHS[e.id].ru}
                  {isHovered && (
                    <span style={{
                      marginLeft: 10, opacity: 0.75,
                      fontSize: 10, letterSpacing: 1.4,
                    }}>· {tlFmtYear(e.y0)} → {tlFmtYear(e.y1)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lanes (ordered + draggable) */}
        {order.map((id) => renderLane(TL_LANE_BY_ID[id])).filter(Boolean)}

        {/* Hover guide — vertical scrubber line aligning the focused event
            with every other lane. */}
        {hoverInfo && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            marginLeft: 160,
            zIndex: 10,
            overflow: 'visible',
          }}>
            <div style={{
              position: 'absolute',
              left: `${hoverInfo.x * 100}%`,
              top: 0, bottom: 36, // stop before the ruler
              width: 1,
              background: `linear-gradient(180deg, ${hoverInfo.color}00 0%, ${hoverInfo.color}cc 6%, ${hoverInfo.color}cc 94%, ${hoverInfo.color}00 100%)`,
              boxShadow: `0 0 12px ${hoverInfo.color}, 0 0 3px ${hoverInfo.color}`,
            }} />
            {/* tick & year badge at the top */}
            <div style={{
              position: 'absolute',
              left: `${hoverInfo.x * 100}%`,
              top: 0,
              transform: hoverInfo.x > 0.92
                ? 'translate(-100%, -50%)'
                : hoverInfo.x < 0.08
                  ? 'translate(0, -50%)'
                  : 'translate(-50%, -50%)',
              padding: '4px 10px',
              background: hoverInfo.color, color: '#04040a',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11, fontWeight: 700, letterSpacing: 1,
              borderRadius: 999,
              whiteSpace: 'nowrap',
              boxShadow: `0 6px 18px ${hoverInfo.color}55, 0 0 0 2px rgba(4,4,10,0.85)`,
            }}>
              {hoverInfo.range
                ? `${tlFmtYear(hoverInfo.range[0])} – ${hoverInfo.range[1] >= TL_NOW ? 'сейчас' : tlFmtYear(hoverInfo.range[1])}`
                : tlFmtYear(hoverInfo.year)}
            </div>
          </div>
        )}

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
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: accent, boxShadow: `0 0 8px ${accent}`,
            }} />
            выбрано на грани · цвет полосы
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%', background: TL_GRAY,
            }} />
            база (не выбрано)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
              color: 'rgba(245,243,237,0.6)',
            }}>⋮⋮</span>
            тяни за уголок, чтобы переставить полосу
          </span>
        </div>
        <div style={{
          fontStyle: 'italic',
          color: 'rgba(245,243,237,0.4)',
        }}>
          шкала нелинейная — последние 200 лет растянуты
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { UnfoldedTimeline });
