export default function FillSidebar({
  doc,
  values,
  onFill,
  onSaveInstance,
  onDownloadPdf,
  instanceName,
  setInstanceName,
}) {
  const zones = doc.elements.filter((e) => e.kind === 'zone')

  return (
    <aside className="sidebar">
      <section className="side-block">
        <h3>Preset</h3>
        <p className="subtle">{doc.name || '(sans nom)'}</p>
      </section>

      <section className="side-block">
        <h3>Champs</h3>
        {zones.length === 0 ? (
          <p className="subtle">Ce preset ne contient aucune zone à remplir.</p>
        ) : (
          zones.map((z) => (
            <label key={z.id} className="field">
              <span>{z.label || 'Zone'}</span>
              <textarea
                rows={2}
                value={values[z.id] || ''}
                onChange={(e) => onFill(z.id, e.target.value)}
              />
            </label>
          ))
        )}
      </section>

      <section className="side-block">
        <h3>Enregistrer / Télécharger</h3>
        <label className="field">
          <span>Nom de l'instance</span>
          <input
            type="text"
            value={instanceName}
            onChange={(e) => setInstanceName(e.target.value)}
            placeholder="Ex. Convocation Alice"
          />
        </label>
        <div className="col">
          <button type="button" className="btn primary" onClick={onSaveInstance}>
            Enregistrer l'instance
          </button>
          <button type="button" className="btn" onClick={onDownloadPdf}>
            Télécharger en PDF
          </button>
        </div>
      </section>
    </aside>
  )
}
