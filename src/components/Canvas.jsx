import { Rnd } from 'react-rnd'
import { PAGE_W, PAGE_H, fontStackOf } from '../lib/constants.js'

export default function Canvas({
  doc,
  mode,
  values,
  selectedId,
  onSelect,
  onChange,
  onFillChange,
  canvasRef,
  scale = 0.65,
}) {
  const bg = doc.background

  const stageStyle = {
    width: PAGE_W * scale,
    height: PAGE_H * scale,
  }

  return (
    <div className="canvas-shell" style={stageStyle}>
      <div
        ref={canvasRef}
        className="canvas-page"
        style={{
          width: PAGE_W,
          height: PAGE_H,
          transform: `scale(${scale})`,
        }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget && mode === 'design') onSelect(null)
        }}
      >
        {bg ? (
          <img className="canvas-bg" src={bg} alt="" draggable={false} />
        ) : (
          <div className="canvas-bg canvas-bg-placeholder">
            Importez un fond (image) pour commencer
          </div>
        )}

        {doc.elements.map((el) => (
          <ElementView
            key={el.id}
            el={el}
            mode={mode}
            selected={selectedId === el.id}
            value={values?.[el.id] ?? ''}
            onSelect={() => onSelect(el.id)}
            onChange={(patch) => onChange(el.id, patch)}
            onFill={(v) => onFillChange(el.id, v)}
          />
        ))}
      </div>
    </div>
  )
}

function ElementView({ el, mode, selected, value, onSelect, onChange, onFill }) {
  const isZone = el.kind === 'zone'
  const isText = el.kind === 'text'

  const bodyStyle = {
    fontFamily: fontStackOf(el.font),
    fontSize: el.fontSize,
    color: el.color,
    textAlign: el.align || 'left',
    fontWeight: el.bold ? 700 : 400,
    fontStyle: el.italic ? 'italic' : 'normal',
    lineHeight: 1.25,
  }

  const content = (() => {
    if (mode === 'fill' && isZone) {
      return (
        <textarea
          className="zone-input"
          style={bodyStyle}
          value={value}
          placeholder={el.label || 'Remplir…'}
          onChange={(e) => onFill(e.target.value)}
        />
      )
    }
    if (isText) {
      return (
        <div className="text-body" style={bodyStyle}>
          {el.text || ' '}
        </div>
      )
    }
    // Zone in design mode: show label
    return (
      <div className="zone-chrome" style={bodyStyle}>
        <span className="zone-label">{el.label || 'Zone à remplir'}</span>
      </div>
    )
  })()

  const disabled = mode === 'fill'

  return (
    <Rnd
      className={[
        'rnd-el',
        selected ? 'is-selected' : '',
        isZone ? 'is-zone' : '',
        isText ? 'is-text' : '',
        disabled ? 'is-disabled' : '',
      ].join(' ')}
      size={{ width: el.w, height: el.h }}
      position={{ x: el.x, y: el.y }}
      bounds="parent"
      disableDragging={disabled}
      enableResizing={!disabled}
      onDragStop={(_, d) => onChange({ x: d.x, y: d.y })}
      onResizeStop={(_, __, ref, ___, pos) =>
        onChange({
          w: parseFloat(ref.style.width),
          h: parseFloat(ref.style.height),
          x: pos.x,
          y: pos.y,
        })
      }
      onMouseDown={(e) => {
        if (mode === 'design') {
          e.stopPropagation()
          onSelect()
        }
      }}
    >
      {content}
    </Rnd>
  )
}
