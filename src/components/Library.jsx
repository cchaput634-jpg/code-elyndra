export default function Library({
  presets,
  instances,
  onNew,
  onOpenPreset,
  onFillPreset,
  onDeletePreset,
  onOpenInstance,
  onDeleteInstance,
}) {
  return (
    <div className="library">
      <div className="lib-head">
        <h2>Vos presets</h2>
        <button type="button" className="btn primary" onClick={onNew}>
          + Nouveau preset
        </button>
      </div>

      {presets.length === 0 ? (
        <p className="subtle">Aucun preset pour le moment.</p>
      ) : (
        <ul className="lib-grid">
          {presets.map((p) => (
            <li key={p.id} className="lib-card">
              <h3>{p.name || '(sans nom)'}</h3>
              <p className="subtle">
                {p.elements.length} élément{p.elements.length > 1 ? 's' : ''}
              </p>
              <div className="row">
                <button type="button" className="btn" onClick={() => onFillPreset(p.id)}>
                  Remplir
                </button>
                <button type="button" className="btn" onClick={() => onOpenPreset(p.id)}>
                  Modifier
                </button>
                <button
                  type="button"
                  className="link danger"
                  onClick={() => onDeletePreset(p.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="lib-head">
        <h2>Instances enregistrées</h2>
      </div>
      {instances.length === 0 ? (
        <p className="subtle">Aucune instance remplie.</p>
      ) : (
        <ul className="lib-grid">
          {instances.map((i) => (
            <li key={i.id} className="lib-card">
              <h3>{i.name || '(sans nom)'}</h3>
              <p className="subtle">Preset : {i.presetName || i.presetId}</p>
              <div className="row">
                <button type="button" className="btn" onClick={() => onOpenInstance(i.id)}>
                  Rouvrir
                </button>
                <button
                  type="button"
                  className="link danger"
                  onClick={() => onDeleteInstance(i.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
