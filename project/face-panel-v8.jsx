// «Хронос» — Hi-fi V7 face panel.
// Per-face slide-over panel that opens when a satellite is clicked.
// Each face has its own (skeletal) form. Hitting «готово» marks the face
// ready; «отмена» closes without changing anything.

// Face id (cube face name) → ui content.
const FACE_PANEL_DEFS = {
  front: {
    label: 'Ты',
    sub: 'дата · место · вехи · длина жизни',
    color: null,        // takes user's epoch color
    intro: 'Главная грань. С неё начинается вся лента: дата рождения задаёт твою эпоху и масштаб, личные события превратятся в тики на твоей жизни.',
    fields: [
      { type: 'date',  label: 'Дата рождения',  placeholder: '16 · 05 · 1994' },
      { type: 'text',  label: 'Место рождения', placeholder: 'опционально · меняет локальный контекст' },
      { type: 'slider', label: 'Ожидаемая длина жизни', value: 80, min: 50, max: 110, unit: 'лет' },
      { type: 'events', label: 'Личные вехи', items: ['Школа · 2001', 'Выпуск · 2011', 'Первая работа · 2016', '+ добавить'] },
    ],
  },
  top: {
    label: 'Идеи',
    sub: 'теории · открытия · законы',
    color: '#22d3ee',
    intro: 'Не вещи (это в «Изобретениях»), а мысли. Чем человечество объяснило мир: законы природы, философские системы, научные теории.',
    fields: [
      { type: 'multi', key: 'categories', label: 'Области интереса', items: ['Физика', 'Биология', 'Философия', 'Математика', 'Медицина', 'Психология'], defaultValue: ['Физика', 'Биология'] },
      { type: 'count', key: 'count', label: 'Сколько ключевых идей показать', defaultValue: 7, min: 3, max: 20 },
      { type: 'anchor', key: 'anchor', label: 'Перевернувшие твою картину мира', placeholder: 'напр. эволюция', defaultValue: ['Эволюция'], max: 3 },
    ],
  },
  right: {
    label: 'Современники',
    sub: 'кто жил в твою эпоху',
    color: '#4ade80',
    intro: 'Люди, чьи жизни хотя бы на секунду пересекались с твоей. Можно отфильтровать по областям или закрепить «бенчмарки» — людей, рядом с которыми хочешь видеть свою линию.',
    fields: [
      { type: 'multi', key: 'categories', label: 'Области', items: ['Наука', 'Искусство', 'Политика', 'Спорт', 'Музыка', 'Технологии'], defaultValue: ['Наука', 'Музыка', 'Технологии'] },
      { type: 'count', key: 'count', label: 'Сколько показать', defaultValue: 8, min: 0, max: 20 },
      { type: 'anchor', key: 'anchor', label: 'Бенчмарки рядом с твоей линией', placeholder: 'имя · напр. Эйнштейн', defaultValue: ['С. Хокинг', 'Д. Боуи', 'С. Джобс'], max: 5 },
    ],
  },
  left: {
    label: 'Искусство',
    sub: 'картины · музыка · литература',
    color: '#f472b6',
    intro: 'Произведения, изменившие культурный код: от «Илиады» до Pink Floyd. Каждая веха видна на ленте — сравни, что появилось до и после тебя.',
    fields: [
      { type: 'multi', key: 'categories', label: 'Медиумы', items: ['Живопись', 'Музыка', 'Литература', 'Архитектура', 'Кино', 'Театр'], defaultValue: ['Живопись', 'Музыка', 'Литература'] },
      { type: 'count', key: 'count', label: 'Сколько произведений показать', defaultValue: 8, min: 3, max: 20 },
      { type: 'anchor', key: 'anchor', label: 'Твоя личная полка', placeholder: 'книга · альбом · фильм', defaultValue: ['Dark Side · Pink Floyd', '«Мастер и Маргарита»'], max: 3 },
    ],
  },
  back: {
    label: 'Места',
    sub: 'до сих пор стоят',
    color: '#f59e8a',
    intro: 'Постройки, до которых можно дотронуться сегодня. Колизей старше тебя на ~2000 лет — он всё ещё здесь. Эмоциональный мостик между эпохами.',
    fields: [
      { type: 'multi', key: 'categories', label: 'Тип', items: ['Храмы', 'Дворцы', 'Памятники', 'Города', 'Природные'], defaultValue: ['Храмы', 'Памятники'] },
      { type: 'count', key: 'count', label: 'Сколько мест на ленте', defaultValue: 7, min: 3, max: 15 },
      { type: 'anchor', key: 'anchor', label: 'Где был лично', placeholder: 'памятное место', defaultValue: ['Колизей', 'Эйфелева башня'], max: 5 },
    ],
  },
  bottom: {
    label: 'Изобретения',
    sub: 'что уже было',
    color: '#fbbf24',
    intro: 'Вещи и технологии. Колесо появилось 5500 лет назад, iPhone — 19 лет. Поделим на «было до тебя» и «появилось при тебе».',
    fields: [
      { type: 'multi', key: 'categories', label: 'Категории', items: ['Транспорт', 'Связь', 'Медицина', 'Быт', 'Энергия', 'Цифровые'], defaultValue: ['Связь', 'Цифровые'] },
      { type: 'count', key: 'count', label: 'Сколько изобретений показать', defaultValue: 10, min: 3, max: 25 },
      { type: 'anchor', key: 'anchor', label: 'Без чего не можешь жить', placeholder: 'напр. интернет · кофемашина', defaultValue: ['Интернет'], max: 3 },
    ],
  },
};

// ── Field primitives ─────────────────────────────────────────────────────

function FieldShell({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        letterSpacing: 2, textTransform: 'uppercase',
        color: 'rgba(245,243,237,0.5)', marginBottom: 8,
      }}>{label}</div>
      {children}
    </div>
  );
}

function FieldDate({ label, placeholder }) {
  return (
    <FieldShell label={label}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        padding: '12px 18px',
        background: 'rgba(245,243,237,0.04)',
        border: '1px solid rgba(245,243,237,0.18)',
        borderRadius: 999,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 15, color: '#fff',
      }}>
        <span style={{ opacity: 0.55 }}>16</span>
        <span style={{ opacity: 0.25 }}>·</span>
        <span style={{ opacity: 0.55 }}>05</span>
        <span style={{ opacity: 0.25 }}>·</span>
        <span style={{ opacity: 0.55 }}>1994</span>
      </div>
    </FieldShell>
  );
}

function FieldText({ label, placeholder }) {
  return (
    <FieldShell label={label}>
      <div style={{
        padding: '11px 16px',
        background: 'rgba(245,243,237,0.04)',
        border: '1px solid rgba(245,243,237,0.18)',
        borderRadius: 8,
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 14, color: 'rgba(245,243,237,0.4)',
        fontStyle: 'italic',
      }}>{placeholder}</div>
    </FieldShell>
  );
}

function FieldSlider({ label, value, min, max, unit, color }) {
  const frac = (value - min) / (max - min);
  return (
    <FieldShell label={label}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          flex: 1, position: 'relative',
          height: 6, borderRadius: 3,
          background: 'rgba(245,243,237,0.08)',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${frac * 100}%`,
            background: color, borderRadius: 3,
            boxShadow: `0 0 10px ${color}88`,
          }} />
          <div style={{
            position: 'absolute', left: `${frac * 100}%`, top: '50%',
            width: 14, height: 14, borderRadius: '50%',
            background: '#fff', transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 12px ${color}cc, 0 0 0 2px ${color}`,
          }} />
        </div>
        <div style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 22, fontWeight: 700, color: '#fff',
          minWidth: 60, textAlign: 'right',
        }}>{value}<span style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10, fontWeight: 400, marginLeft: 5,
          color: 'rgba(245,243,237,0.5)',
        }}>{unit}</span></div>
      </div>
    </FieldShell>
  );
}

function FieldMulti({ label, items, value, onChange, color }) {
  const picked = value || [];
  const toggle = (item) => {
    if (picked.includes(item)) onChange(picked.filter((x) => x !== item));
    else onChange([...picked, item]);
  };
  return (
    <FieldShell label={label}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((item) => {
          const on = picked.includes(item);
          return (
            <button key={item} type="button" onClick={() => toggle(item)} style={{
              appearance: 'none', cursor: 'pointer',
              padding: '7px 14px',
              background: on ? `${color}26` : 'transparent',
              border: `1px solid ${on ? color : 'rgba(245,243,237,0.18)'}`,
              borderRadius: 999,
              color: on ? '#fff' : 'rgba(245,243,237,0.7)',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'all 180ms',
            }}>
              {on && <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: color, boxShadow: `0 0 6px ${color}`,
              }} />}
              {item}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

function FieldCount({ label, value, min, max, onChange, color }) {
  const v = value != null ? value : min;
  const dec = () => onChange(Math.max(min, v - 1));
  const inc = () => onChange(Math.min(max, v + 1));
  const frac = (v - min) / (max - min);
  const trackRef = React.useRef(null);
  const setFromClientX = (clientX) => {
    const el = trackRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    onChange(Math.round(min + f * (max - min)));
  };
  const onPointerDown = (e) => {
    e.preventDefault(); setFromClientX(e.clientX);
    const move = (ev) => setFromClientX(ev.clientX);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <FieldShell label={label}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button type="button" onClick={dec} disabled={v <= min} style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(245,243,237,0.06)',
          border: '1px solid rgba(245,243,237,0.18)',
          color: '#fff', fontSize: 18,
          cursor: v <= min ? 'not-allowed' : 'pointer',
          opacity: v <= min ? 0.4 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0,
        }}>−</button>
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          style={{
            flex: 1, position: 'relative', height: 18,
            cursor: 'pointer', touchAction: 'none',
          }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: '50%',
            height: 4, transform: 'translateY(-50%)',
            background: 'rgba(245,243,237,0.08)', borderRadius: 2,
          }} />
          <div style={{
            position: 'absolute', left: 0, top: '50%',
            width: `${frac * 100}%`, height: 4, transform: 'translateY(-50%)',
            background: color, borderRadius: 2,
            boxShadow: `0 0 8px ${color}66`,
          }} />
          <div style={{
            position: 'absolute', left: `${frac * 100}%`, top: '50%',
            width: 14, height: 14, borderRadius: '50%',
            background: '#fff', transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 10px ${color}, 0 0 0 2px ${color}`,
          }} />
        </div>
        <button type="button" onClick={inc} disabled={v >= max} style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(245,243,237,0.06)',
          border: '1px solid rgba(245,243,237,0.18)',
          color: '#fff', fontSize: 18,
          cursor: v >= max ? 'not-allowed' : 'pointer',
          opacity: v >= max ? 0.4 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0,
        }}>+</button>
        <div style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 26, fontWeight: 700, color,
          minWidth: 36, textAlign: 'right',
        }}>{v}</div>
      </div>
    </FieldShell>
  );
}

function FieldEvents({ label, items, color }) {
  return (
    <FieldShell label={label}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => {
          const isAdd = item.startsWith('+');
          return (
            <div key={i} style={{
              padding: '9px 14px',
              background: isAdd ? 'transparent' : 'rgba(245,243,237,0.04)',
              border: `1px ${isAdd ? 'dashed' : 'solid'} rgba(245,243,237,${isAdd ? '0.18' : '0.10'})`,
              borderRadius: 8,
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13, color: isAdd ? color : '#fff',
              fontWeight: isAdd ? 500 : 400,
              cursor: isAdd ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              {!isAdd && <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#fff', opacity: 0.6,
              }} />}
              {item}
            </div>
          );
        })}
      </div>
    </FieldShell>
  );
}

function FieldAnchor({ label, placeholder, value, max, onChange, color }) {
  const items = value || [];
  const isFull = items.length >= (max || 99);
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const remove = (i) => onChange(items.filter((_, j) => j !== i));
  const commit = () => {
    const t = draft.trim();
    if (!t) { setAdding(false); return; }
    if (items.includes(t)) { setDraft(''); setAdding(false); return; }
    onChange([...items, t]);
    setDraft(''); setAdding(false);
  };
  return (
    <div style={{
      marginBottom: 22,
      padding: '16px 18px',
      background: `linear-gradient(135deg, ${color}10 0%, rgba(245,243,237,0.02) 100%)`,
      border: `1px solid ${color}40`,
      borderRadius: 12,
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 14, right: 14,
        fontSize: 14, color, opacity: 0.7,
      }}>✦</div>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        letterSpacing: 2, textTransform: 'uppercase',
        color, marginBottom: 4,
      }}>якорь</div>
      <div style={{
        fontFamily: '"DM Sans", sans-serif', fontSize: 14,
        color: 'rgba(245,243,237,0.85)', marginBottom: 12,
        lineHeight: 1.3,
      }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '6px 6px 6px 12px',
            background: `${color}26`,
            border: `1px solid ${color}`,
            borderRadius: 999,
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13, fontWeight: 600, color: '#fff',
          }}>
            {item}
            <button onClick={() => remove(i)} style={{
              appearance: 'none', background: 'transparent', border: 'none',
              cursor: 'pointer', opacity: 0.6,
              padding: '0 4px', fontSize: 16, lineHeight: 0.7,
              color: '#fff',
            }} title="убрать">×</button>
          </div>
        ))}
        {adding && !isFull && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 6px 4px 10px',
            background: `${color}26`,
            border: `1px solid ${color}`,
            borderRadius: 999,
          }}>
            <input
              autoFocus
              type="text"
              value={draft}
              placeholder={placeholder}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(''); setAdding(false); } }}
              onBlur={commit}
              style={{
                appearance: 'none',
                background: 'transparent', border: 'none', outline: 'none',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13, fontWeight: 600, color: '#fff',
                padding: '2px 0', minWidth: 140,
              }}
            />
          </div>
        )}
        {!adding && !isFull && (
          <button onClick={() => setAdding(true)} type="button" style={{
            appearance: 'none',
            display: 'inline-flex', alignItems: 'center',
            padding: '7px 12px',
            background: 'transparent',
            border: '1px dashed rgba(245,243,237,0.25)',
            borderRadius: 999,
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13, color: 'rgba(245,243,237,0.55)',
            fontStyle: 'italic',
            cursor: 'pointer',
          }}>+ {placeholder}</button>
        )}
      </div>
      {max > 1 && (
        <div style={{
          marginTop: 10,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
          color: 'rgba(245,243,237,0.4)', letterSpacing: 1,
        }}>{items.length} · макс {max}</div>
      )}
    </div>
  );
}

function FieldRouter({ field, value, onChange, color }) {
  switch (field.type) {
    case 'date':   return <FieldDate label={field.label} placeholder={field.placeholder} />;
    case 'text':   return <FieldText label={field.label} placeholder={field.placeholder} />;
    case 'slider': return <FieldSlider label={field.label} value={field.value} min={field.min} max={field.max} unit={field.unit} color={color} />;
    case 'multi':  return <FieldMulti label={field.label} items={field.items} value={value} onChange={onChange} color={color} />;
    case 'count':  return <FieldCount label={field.label} value={value} min={field.min} max={field.max} onChange={onChange} color={color} />;
    case 'events': return <FieldEvents label={field.label} items={field.items} color={color} />;
    case 'anchor': return <FieldAnchor label={field.label} placeholder={field.placeholder} value={value} max={field.max} onChange={onChange} color={color} />;
    default: return null;
  }
}

// Compute initial value object per face from its field defaults.
const FACE_DEFAULTS = Object.fromEntries(
  Object.entries(FACE_PANEL_DEFS).map(([id, def]) => [
    id,
    Object.fromEntries((def.fields || [])
      .filter((f) => f.key != null)
      .map((f) => [f.key, f.defaultValue]))
  ])
);

// ── Panel ────────────────────────────────────────────────────────────────

function FacePanel({ faceId, epochColor, isReady, tyValue, onTyChange, faceValue, onFaceChange, onConfirm, onUnready, onCancel }) {
  if (!faceId || !FACE_PANEL_DEFS[faceId]) return null;
  const def = FACE_PANEL_DEFS[faceId];
  const color = def.color || epochColor;

  return (
    <div style={{
      position: 'relative',
      maxWidth: 560,
      background: 'rgba(10,10,20,0.66)',
      border: '1px solid rgba(245,243,237,0.14)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 18,
      padding: '30px 32px 24px',
      boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px ${color}22, 0 0 40px ${color}22`,
    }}>
      {/* Color stripe on the left */}
      <div style={{
        position: 'absolute', left: 0, top: 24, bottom: 24,
        width: 3, background: color, borderRadius: 2,
        boxShadow: `0 0 10px ${color}88`,
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: 16, marginBottom: 14,
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            letterSpacing: 2.5, color, textTransform: 'uppercase',
            marginBottom: 6,
          }}>грань · {faceId} {isReady ? '· готова' : ''}</div>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 42, fontWeight: 800, lineHeight: 1,
            letterSpacing: -1.2, margin: 0,
            color: '#fff',
          }}>{def.label}</h2>
          <div style={{
            fontSize: 13, color: 'rgba(245,243,237,0.55)',
            fontFamily: '"DM Sans", sans-serif',
            marginTop: 6,
          }}>{def.sub}</div>
        </div>
        <button onClick={onCancel} style={{
          appearance: 'none', cursor: 'pointer',
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(245,243,237,0.06)',
          border: '1px solid rgba(245,243,237,0.14)',
          color: 'rgba(245,243,237,0.7)',
          fontSize: 18, padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }} title="закрыть">×</button>
      </div>

      {/* Intro */}
      <p style={{
        fontSize: 14, lineHeight: 1.55,
        color: 'rgba(245,243,237,0.72)',
        margin: '0 0 24px',
      }}>{def.intro}</p>

      {/* Fields */}
      <div>
        {faceId === 'front' ? (
          <TyFields value={tyValue} onChange={onTyChange} color={color} />
        ) : (
          def.fields.map((field, i) => {
            const v = faceValue && field.key != null ? faceValue[field.key] : undefined;
            const setFieldVal = (next) => {
              if (!onFaceChange || field.key == null) return;
              onFaceChange({ ...(faceValue || {}), [field.key]: next });
            };
            return (
              <FieldRouter key={i} field={field} value={v} onChange={setFieldVal} color={color} />
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginTop: 26, paddingTop: 22,
        borderTop: '1px solid rgba(245,243,237,0.10)',
      }}>
        <button onClick={onConfirm} style={{
          padding: '12px 26px',
          background: color, color: '#04040a',
          border: 'none', borderRadius: 999,
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 14, fontWeight: 700,
          letterSpacing: 0.3, cursor: 'pointer',
          boxShadow: `0 0 0 1px ${color}, 0 10px 28px ${color}55`,
        }}>{isReady ? 'обновить →' : 'готово →'}</button>
        {isReady && (
          <button onClick={onUnready} style={{
            appearance: 'none', background: 'transparent', border: 'none',
            padding: '12px 6px', cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif', fontSize: 13,
            color: 'rgba(245,243,237,0.55)',
            textDecoration: 'underline', textUnderlineOffset: 4,
            textDecorationColor: 'rgba(245,243,237,0.25)',
          }}>снять отметку</button>
        )}
        <button onClick={onCancel} style={{
          appearance: 'none', background: 'transparent', border: 'none',
          marginLeft: 'auto',
          padding: '12px 6px', cursor: 'pointer',
          fontFamily: '"DM Sans", sans-serif', fontSize: 13,
          color: 'rgba(245,243,237,0.5)',
        }}>отмена</button>
      </div>
    </div>
  );
}

// Face id → its dedicated colour (front uses epoch colour).
const FACE_COLORS = {
  front:  null,        // dynamic — user's epoch
  top:    '#22d3ee',   // идеи
  right:  '#4ade80',   // современники
  left:   '#f472b6',   // искусство
  back:   '#f59e8a',   // места
  bottom: '#fbbf24',   // изобретения
};

Object.assign(window, { FacePanel, FACE_PANEL_DEFS, FACE_COLORS, FACE_DEFAULTS });
