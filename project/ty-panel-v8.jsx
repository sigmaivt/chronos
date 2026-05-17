// «Хронос» — Hi-fi V8 «Ты» panel (fully interactive).
// State lives in the parent's tweaks (key: `ty`) — every change persists.
//
//   ty = {
//     birth: { y: 1994, m: 5, d: 16 },
//     place: '',
//     lifespan: 80,
//     events: [ { label: 'школа', year: 2001 }, ... ],
//   }

const TY_DEFAULT = {
  birth: { y: 1994, m: 5, d: 16 },
  place: '',
  lifespan: 80,
  events: [
    { label: 'школа',          year: 2001 },
    { label: 'выпуск',         year: 2011 },
    { label: 'первая работа',  year: 2016 },
    { label: 'переезд',        year: 2020 },
  ],
};

const TY_NOW_YEAR = 2026;

// ── primitives ──────────────────────────────────────────────────────────

function TyFieldLabel({ children, hint }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        letterSpacing: 2, textTransform: 'uppercase',
        color: 'rgba(245,243,237,0.5)',
      }}>{children}</div>
      {hint && (
        <div style={{
          fontFamily: '"DM Sans", sans-serif', fontSize: 11,
          color: 'rgba(245,243,237,0.35)', marginTop: 3,
          fontStyle: 'italic',
        }}>{hint}</div>
      )}
    </div>
  );
}

// Bounded integer stepper rendered inline.
function NumStepper({ value, min, max, onChange, width = 50, pad = 0 }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(String(value));
  React.useEffect(() => { setDraft(String(value)); }, [value]);
  const commit = () => {
    let v = parseInt(draft, 10);
    if (isNaN(v)) v = value;
    v = Math.min(max, Math.max(min, v));
    onChange(v);
    setEditing(false);
  };
  const str = pad ? String(value).padStart(pad, '0') : String(value);
  return (
    <input
      type="text"
      inputMode="numeric"
      value={editing ? draft : str}
      onFocus={() => { setEditing(true); setDraft(String(value)); }}
      onBlur={commit}
      onChange={(e) => setDraft(e.target.value.replace(/[^0-9-]/g, ''))}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { e.target.blur(); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); onChange(Math.min(max, value + 1)); }
        if (e.key === 'ArrowDown') { e.preventDefault(); onChange(Math.max(min, value - 1)); }
      }}
      style={{
        appearance: 'none',
        width,
        padding: '0 4px',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        textAlign: 'center',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 22, color: '#fff',
        letterSpacing: 0.5,
      }}
    />
  );
}

// ── Date ─────────────────────────────────────────────────────────────────

function TyDate({ value, onChange, color }) {
  // value: { y, m, d }
  const daysInMonth = (y, m) => new Date(y, m, 0).getDate();
  const maxD = daysInMonth(value.y, value.m);
  const setField = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div>
      <TyFieldLabel hint="день · месяц · год">Дата рождения</TyFieldLabel>
      <div style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '8px 10px',
        background: 'rgba(245,243,237,0.04)',
        border: '1px solid rgba(245,243,237,0.18)',
        borderRadius: 14,
        gap: 4,
      }}>
        <NumStepper value={value.d} min={1} max={maxD} pad={2} width={40} onChange={(v) => setField('d', v)} />
        <span style={{ opacity: 0.25, fontFamily: '"JetBrains Mono", monospace', fontSize: 22 }}>·</span>
        <NumStepper value={value.m} min={1} max={12} pad={2} width={40} onChange={(v) => {
          // adjust day if needed
          const md = daysInMonth(value.y, v);
          onChange({ ...value, m: v, d: Math.min(value.d, md) });
        }} />
        <span style={{ opacity: 0.25, fontFamily: '"JetBrains Mono", monospace', fontSize: 22 }}>·</span>
        <NumStepper value={value.y} min={1900} max={TY_NOW_YEAR} pad={4} width={60} onChange={(v) => {
          const md = daysInMonth(v, value.m);
          onChange({ ...value, y: v, d: Math.min(value.d, md) });
        }} />
        <div style={{
          marginLeft: 12, paddingLeft: 12,
          borderLeft: '1px solid rgba(245,243,237,0.12)',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10, color,
          textTransform: 'uppercase', letterSpacing: 1.5,
        }}>{TY_NOW_YEAR - value.y} лет</div>
      </div>
    </div>
  );
}

// ── Place ────────────────────────────────────────────────────────────────

function TyPlace({ value, onChange }) {
  return (
    <div>
      <TyFieldLabel hint="опционально · для локального контекста">Место рождения</TyFieldLabel>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="напр. Москва, Россия"
        style={{
          appearance: 'none',
          width: '100%',
          padding: '11px 16px',
          background: 'rgba(245,243,237,0.04)',
          border: '1px solid rgba(245,243,237,0.18)',
          borderRadius: 10,
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 14, color: '#fff',
          outline: 'none',
          transition: 'border-color 200ms',
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(245,243,237,0.4)'}
        onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(245,243,237,0.18)'}
      />
    </div>
  );
}

// ── Lifespan ─────────────────────────────────────────────────────────────

function TyLifespan({ value, onChange, color, birthYear }) {
  const min = 50, max = 110;
  const frac = (value - min) / (max - min);
  const trackRef = React.useRef(null);
  const setFromClientX = (clientX) => {
    const el = trackRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    onChange(Math.round(min + f * (max - min)));
  };
  const onPointerDown = (e) => {
    e.preventDefault();
    setFromClientX(e.clientX);
    const move = (ev) => setFromClientX(ev.clientX);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  const ageNow = TY_NOW_YEAR - birthYear;
  const yearsLeft = value - ageNow;
  return (
    <div>
      <TyFieldLabel hint="используется для пунктирной части линии «будущего»">Ожидаемая длина жизни</TyFieldLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 4 }}>
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          style={{
            flex: 1, position: 'relative',
            height: 22, padding: '8px 0',
            cursor: 'pointer',
            touchAction: 'none',
          }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: '50%',
            height: 6, transform: 'translateY(-50%)',
            background: 'rgba(245,243,237,0.08)',
            borderRadius: 3,
          }} />
          <div style={{
            position: 'absolute', left: 0, top: '50%',
            width: `${frac * 100}%`, height: 6, transform: 'translateY(-50%)',
            background: color, borderRadius: 3,
            boxShadow: `0 0 12px ${color}88`,
          }} />
          <div style={{
            position: 'absolute', left: `${frac * 100}%`, top: '50%',
            width: 18, height: 18, borderRadius: '50%',
            background: '#fff', transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 14px ${color}, 0 0 0 2px ${color}`,
            cursor: 'grab',
          }} />
        </div>
        <div style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 32, fontWeight: 700, color: '#fff',
          minWidth: 90, textAlign: 'right',
          lineHeight: 1,
        }}>{value}<span style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10, fontWeight: 400, marginLeft: 5,
          color: 'rgba(245,243,237,0.5)',
        }}>лет</span></div>
      </div>
      <div style={{
        marginTop: 10,
        fontFamily: '"DM Sans", sans-serif', fontSize: 12,
        color: 'rgba(245,243,237,0.55)',
      }}>
        прожито <span style={{ color: '#fff', fontWeight: 600 }}>{ageNow}</span>,
        впереди <span style={{ color, fontWeight: 600 }}>{Math.max(0, yearsLeft)}</span> лет
      </div>
    </div>
  );
}

// ── Events ───────────────────────────────────────────────────────────────

function TyEvents({ events, onChange, birthYear, color }) {
  const [adding, setAdding] = React.useState(false);
  const [draftLabel, setDraftLabel] = React.useState('');
  const [draftYear, setDraftYear]   = React.useState(TY_NOW_YEAR);

  const updateEvent = (i, patch) => {
    const next = events.map((e, j) => j === i ? { ...e, ...patch } : e);
    onChange(next);
  };
  const removeEvent = (i) => {
    onChange(events.filter((_, j) => j !== i));
  };
  const commitNew = () => {
    const label = draftLabel.trim();
    if (!label) { setAdding(false); return; }
    onChange([...events, { label, year: draftYear }].sort((a, b) => a.year - b.year));
    setDraftLabel(''); setDraftYear(TY_NOW_YEAR); setAdding(false);
  };

  return (
    <div>
      <TyFieldLabel hint="ключевые моменты твоей жизни · отметятся на главной линии">
        Личные вехи
      </TyFieldLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {events.map((ev, i) => {
          const age = ev.year - birthYear;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px',
              background: 'rgba(245,243,237,0.04)',
              border: '1px solid rgba(245,243,237,0.10)',
              borderRadius: 10,
            }}>
              <input
                type="text"
                value={ev.label}
                onChange={(e) => updateEvent(i, { label: e.target.value })}
                style={{
                  appearance: 'none', flex: 1,
                  background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 13, color: '#fff',
                  padding: 0,
                }}
              />
              <NumStepper value={ev.year} min={birthYear} max={birthYear + 110} pad={4} width={60}
                onChange={(v) => updateEvent(i, { year: v })} />
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: 'rgba(245,243,237,0.4)', letterSpacing: 1,
                minWidth: 36, textAlign: 'right',
              }}>{age >= 0 ? `+${age}` : age} лет</div>
              <button onClick={() => removeEvent(i)} style={{
                appearance: 'none', background: 'transparent',
                border: 'none', cursor: 'pointer',
                color: 'rgba(245,243,237,0.35)', fontSize: 16,
                padding: '0 4px', lineHeight: 0.8,
              }} title="удалить">×</button>
            </div>
          );
        })}

        {adding ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px',
            background: `${color}14`,
            border: `1px solid ${color}`,
            borderRadius: 10,
          }}>
            <input
              autoFocus
              type="text"
              value={draftLabel}
              placeholder="что произошло"
              onChange={(e) => setDraftLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitNew(); if (e.key === 'Escape') setAdding(false); }}
              style={{
                appearance: 'none', flex: 1,
                background: 'transparent', border: 'none', outline: 'none',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13, color: '#fff',
                padding: 0,
              }}
            />
            <NumStepper value={draftYear} min={birthYear} max={birthYear + 110} pad={4} width={60}
              onChange={setDraftYear} />
            <button onClick={commitNew} style={{
              appearance: 'none', cursor: 'pointer',
              padding: '4px 10px', borderRadius: 8,
              border: 'none', background: color, color: '#04040a',
              fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700,
              letterSpacing: 0.3,
            }}>+</button>
            <button onClick={() => setAdding(false)} style={{
              appearance: 'none', background: 'transparent',
              border: 'none', cursor: 'pointer',
              color: 'rgba(245,243,237,0.5)', fontSize: 16,
              padding: '0 4px', lineHeight: 0.8,
            }}>×</button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} style={{
            appearance: 'none', cursor: 'pointer',
            padding: '10px 12px',
            background: 'transparent',
            border: '1px dashed rgba(245,243,237,0.22)',
            borderRadius: 10,
            color: 'rgba(245,243,237,0.55)',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13, fontStyle: 'italic',
            textAlign: 'left',
          }}>+ добавить веху</button>
        )}
      </div>
    </div>
  );
}

// ── Composite ────────────────────────────────────────────────────────────

function TyFields({ value, onChange, color }) {
  const v = { ...TY_DEFAULT, ...(value || {}) };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <TyDate     value={v.birth}    color={color}
        onChange={(birth) => onChange({ ...v, birth })} />
      <TyPlace    value={v.place}
        onChange={(place) => onChange({ ...v, place })} />
      <TyLifespan value={v.lifespan} color={color} birthYear={v.birth.y}
        onChange={(lifespan) => onChange({ ...v, lifespan })} />
      <TyEvents   events={v.events}  color={color} birthYear={v.birth.y}
        onChange={(events) => onChange({ ...v, events })} />
    </div>
  );
}

Object.assign(window, { TyFields, TY_DEFAULT, TY_NOW_YEAR });
