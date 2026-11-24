import { BG_PRESETS, FONTS } from '../lib/constants.js'
import { uid } from '../lib/presets.js'

export default function DesignSidebar({
  doc,
  setDoc,
  selectedId,
  setSelectedId,
  onSavePreset,
  onExportPreset,
}) {
  const selected = doc.elements.find((e) => e.id === selectedId) || null

  const onBgFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setDoc({ ...doc, background: String(reader.result) })
    reader.readAsDataURL(f)
    e.target.value = ''
  }

  const addText = () => {
    const el = {
      id: uid(),
      kind: 'text',
      text: 'Titre',
      x: 120,
      y: 120,
      w: 500,
      h: 80,
      font: 'cinzel',
      fontSize: 42,
      color: '#1a1206',
      align: 'center',
      bold: false,
      italic: false,
    }
    setDoc({ ...doc, elements: [...doc.elements, el] })
    setSelectedId(el.id)
  }

  const addZone = () => {
    const el = {
      id: uid(),
      kind: 'zone',
      label: 'Nom',
      x: 120,
      y: 250,
      w: 500,
      h: 60,
      font: 'eb-garamond',
      fontSize: 22,
      color: '#1a1206',
      align: 'left',
    }
    setDoc({ ...doc, elements: [...doc.elements, el] })
    setSelectedId(el.id)
  }

  const patchSelected = (patch) => {
    setDoc({
      ...doc,
      elements: doc.elements.map((e) => (e.id === selectedId ? { ...e, ...patch } : e)),
    })
  }

  const removeSelected = () => {
    setDoc({ ...doc, elements: doc.elements.filter((e) => e.id !== selectedId) })
    setSelectedId(null)
  }

  return (
    <aside className="sidebar">
      <section className="side-block">
        <h3>Document</h3>
        <label className="field">
          <span>Nom du preset</span>
          <input
            type="text"
            value={doc.name}
            onChange={(e) => setDoc({ ...doc, name: e.target.value })}
          />
        </label>
        <div className="bg-presets">
          {BG_PRESETS.map((bg) => (
            <button
              key={bg.id}
              type="button"
              className={`bg-thumb ${doc.background === bg.url ? 'on' : ''}`}
              style={{ backgroundImage: `url(${bg.url})` }}
              onClick={() => setDoc({ ...doc, background: bg.url })}
              title={bg.label}
            >
              <span>{bg.label}</span>
            </button>
          ))}
        </div>
        <label className="file-btn">
          <input type="file" accept="image/*" onChange={onBgFile} hidden />
          <span>Importer un autre fond</span>
        </label>
        {doc.background ? (
          <button
            type="button"
            className="link"
            onClick={() => setDoc({ ...doc, background: null })}
          >
            Retirer le fond
          </button>
        ) : null}
      </section>

      <section className="side-block">
        <h3>Ajouter</h3>
        <div className="row">
          <button type="button" className="btn" onClick={addText}>
            + Texte
          </button>
          <button type="button" className="btn" onClick={addZone}>
            + Zone à remplir
          </button>
        </div>
      </section>

      {selected ? (
        <section className="side-block">
          <h3>Élément sélectionné</h3>
          {selected.kind === 'text' ? (
            <label className="field">
              <span>Texte</span>
              <textarea
                rows={3}
                value={selected.text}
                onChange={(e) => patchSelected({ text: e.target.value })}
              />
            </label>
          ) : (
            <label className="field">
              <span>Libellé de la zone</span>
              <input
                type="text"
                value={selected.label}
                onChange={(e) => patchSelected({ label: e.target.value })}
              />
            </label>
          )}

          <label className="field">
            <span>Police</span>
            <select
              value={selected.font}
              onChange={(e) => patchSelected({ font: e.target.value })}
            >
              {FONTS.map((f) => (
                <option key={f.id} value={f.id} style={{ fontFamily: f.stack }}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>

          <div className="row">
            <label className="field grow">
              <span>Taille</span>
              <input
                type="number"
                min={8}
                max={200}
                value={selected.fontSize}
                onChange={(e) => patchSelected({ fontSize: Number(e.target.value) })}
              />
            </label>
            <label className="field">
              <span>Couleur</span>
              <input
                type="color"
                value={selected.color}
                onChange={(e) => patchSelected({ color: e.target.value })}
              />
            </label>
          </div>

          <div className="row">
            <label className="field grow">
              <span>Alignement</span>
              <select
                value={selected.align || 'left'}
                onChange={(e) => patchSelected({ align: e.target.value })}
              >
                <option value="left">Gauche</option>
                <option value="center">Centre</option>
                <option value="right">Droite</option>
              </select>
            </label>
            {selected.kind === 'text' ? (
              <div className="toggles">
                <button
                  type="button"
                  className={`chip ${selected.bold ? 'on' : ''}`}
                  onClick={() => patchSelected({ bold: !selected.bold })}
                >
                  B
                </button>
                <button
                  type="button"
                  className={`chip ${selected.italic ? 'on' : ''}`}
                  onClick={() => patchSelected({ italic: !selected.italic })}
                >
                  I
                </button>
              </div>
            ) : null}
          </div>

          <button type="button" className="danger" onClick={removeSelected}>
            Supprimer
          </button>
        </section>
      ) : (
        <section className="side-block hint">
          Cliquez sur un élément pour l'éditer.
        </section>
      )}

      <section className="side-block">
        <h3>Preset</h3>
        <div className="col">
          <button type="button" className="btn primary" onClick={onSavePreset}>
            Enregistrer le preset
          </button>
          <button type="button" className="btn" onClick={onExportPreset}>
            Exporter JSON
          </button>
        </div>
      </section>
    </aside>
  )
}
