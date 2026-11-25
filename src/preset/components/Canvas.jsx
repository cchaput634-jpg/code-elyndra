import { useEffect, useRef, useState } from 'react'
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
  onAddElement,
  canvasRef,
  scale = 0.65,
}) {
  const bg = doc.background

  const stageStyle = {
    width: PAGE_W * scale,
    height: PAGE_H * scale,
  }

  const handleDragOver = (e) => {
    if (mode !== 'design') return
    const types = e.dataTransfer.types
    if (
      types.includes('application/x-preset-asset') ||
      types.includes('Files') ||
      types.includes('text/plain')
    ) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
  }

  const placeAssetFromSrc = (src, name, dropX, dropY) => {
    const img = new Image()
    img.onload = () => {
      const maxW = 400
      const ratio = img.height / img.width
      const w = Math.min(img.width, maxW)
      const h = w * ratio
      onAddElement?.({
        kind: 'image',
        name: name || 'Image',
        src,
        x: Math.max(0, Math.min(PAGE_W - w, dropX - w / 2)),
        y: Math.max(0, Math.min(PAGE_H - h, dropY - h / 2)),
        w,
        h,
        opacity: 1,
        fit: 'contain',
      })
    }
    img.src = src
  }

  const handleDrop = (e) => {
    if (mode !== 'design') return
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    // Canvas is scaled; convert client coords to canvas coords.
    const dropX = (e.clientX - rect.left) / scale
    const dropY = (e.clientY - rect.top) / scale

    const payload = e.dataTransfer.getData('application/x-preset-asset')
    if (payload) {
      try {
        const { src, name } = JSON.parse(payload)
        placeAssetFromSrc(src, name, dropX, dropY)
        return
      } catch {
        /* fall through */
      }
    }
    const files = Array.from(e.dataTransfer.files || []).filter((f) =>
      f.type.startsWith('image/'),
    )
    if (files.length > 0) {
      const f = files[0]
      const reader = new FileReader()
      reader.onload = () => placeAssetFromSrc(String(reader.result), f.name, dropX, dropY)
      reader.readAsDataURL(f)
      return
    }
    const textSrc = e.dataTransfer.getData('text/plain')
    if (textSrc && (textSrc.startsWith('http') || textSrc.startsWith('data:'))) {
      placeAssetFromSrc(textSrc, 'Image', dropX, dropY)
    }
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
        onDragOver={handleDragOver}
        onDrop={handleDrop}
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
  const isImageZone = el.kind === 'image-zone'
  const isImage = el.kind === 'image'
  const isText = el.kind === 'text'
  const [editing, setEditing] = useState(false)
  const textRef = useRef(null)
  const imageZoneInputRef = useRef(null)

  useEffect(() => {
    if (editing && textRef.current) {
      textRef.current.focus()
      textRef.current.select()
    }
  }, [editing])

  // Exit edit mode when the element is deselected.
  useEffect(() => {
    if (!selected) setEditing(false)
  }, [selected])

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
    if (isImage) {
      return (
        <img
          className="el-image"
          src={el.src}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: el.fit || 'contain',
            opacity: el.opacity ?? 1,
            pointerEvents: 'none',
          }}
        />
      )
    }
    if (isImageZone) {
      const filled = typeof value === 'string' && value.length > 0
      if (mode === 'fill') {
        return (
          <div className="image-zone-fill">
            {filled ? (
              <img
                src={value}
                alt=""
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: el.fit || 'contain' }}
              />
            ) : (
              <span className="zone-label">{el.label || 'Image à importer'}</span>
            )}
            <input
              ref={imageZoneInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const reader = new FileReader()
                reader.onload = () => onFill(String(reader.result))
                reader.readAsDataURL(f)
                e.target.value = ''
              }}
            />
            <button
              type="button"
              className="image-zone-btn"
              onClick={(e) => {
                e.stopPropagation()
                imageZoneInputRef.current?.click()
              }}
            >
              {filled ? 'Changer' : 'Importer'}
            </button>
            {filled ? (
              <button
                type="button"
                className="image-zone-btn secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  onFill('')
                }}
              >
                Retirer
              </button>
            ) : null}
          </div>
        )
      }
      return (
        <div className="zone-chrome image-zone-chrome">
          <span className="zone-label">{el.label || 'Zone image'}</span>
        </div>
      )
    }
    if (isText) {
      if (editing) {
        return (
          <textarea
            ref={textRef}
            className="text-edit"
            style={bodyStyle}
            value={el.text}
            onChange={(e) => onChange({ text: e.target.value })}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setEditing(false)
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
          />
        )
      }
      return (
        <div
          className="text-body"
          style={bodyStyle}
          onDoubleClick={(e) => {
            e.stopPropagation()
            if (mode === 'design') setEditing(true)
          }}
        >
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
  const dragLocked = disabled || editing

  return (
    <Rnd
      className={[
        'rnd-el',
        selected ? 'is-selected' : '',
        isZone ? 'is-zone' : '',
        isImageZone ? 'is-image-zone' : '',
        isImage ? 'is-image' : '',
        isText ? 'is-text' : '',
        editing ? 'is-editing' : '',
        disabled ? 'is-disabled' : '',
      ].join(' ')}
      size={{ width: el.w, height: el.h }}
      position={{ x: el.x, y: el.y }}
      bounds="parent"
      disableDragging={dragLocked}
      enableResizing={!dragLocked}
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
