import { useEffect, useMemo, useRef, useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Canvas from './components/Canvas.jsx'
import DesignSidebar from './components/DesignSidebar.jsx'
import FillSidebar from './components/FillSidebar.jsx'
import Library from './components/Library.jsx'
import { PAGE_W, PAGE_H, DEFAULT_BG } from './lib/constants.js'
import {
  deleteInstance,
  deletePreset,
  exportJSON,
  getPreset,
  listInstances,
  listPresets,
  saveInstance,
  savePreset,
  uid,
} from './lib/presets.js'

function emptyDoc() {
  return {
    id: uid(),
    name: 'Nouveau preset',
    background: DEFAULT_BG,
    elements: [],
    createdAt: Date.now(),
  }
}

export default function App() {
  const [view, setView] = useState('library') // 'library' | 'design' | 'fill'
  const [doc, setDoc] = useState(emptyDoc())
  const [selectedId, setSelectedId] = useState(null)
  const [values, setValues] = useState({}) // fill mode values
  const [presets, setPresets] = useState(() => listPresets())
  const [instances, setInstances] = useState(() => listInstances())
  const [instanceName, setInstanceName] = useState('')
  const [currentInstanceId, setCurrentInstanceId] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    setPresets(listPresets())
    setInstances(listInstances())
  }, [view])

  const openNewPreset = () => {
    setDoc(emptyDoc())
    setSelectedId(null)
    setView('design')
  }

  const openPresetForEdit = (id) => {
    const p = getPreset(id)
    if (!p) return
    setDoc(structuredClone(p))
    setSelectedId(null)
    setView('design')
  }

  const openPresetForFill = (id) => {
    const p = getPreset(id)
    if (!p) return
    setDoc(p)
    setValues({})
    setInstanceName('')
    setCurrentInstanceId(null)
    setView('fill')
  }

  const openInstance = (id) => {
    const inst = instances.find((i) => i.id === id)
    if (!inst) return
    const p = getPreset(inst.presetId)
    if (!p) {
      alert('Preset parent introuvable.')
      return
    }
    setDoc(p)
    setValues(inst.values || {})
    setInstanceName(inst.name || '')
    setCurrentInstanceId(inst.id)
    setView('fill')
  }

  const handleSavePreset = () => {
    savePreset({ ...doc, updatedAt: Date.now() })
    setPresets(listPresets())
    alert(`Preset "${doc.name}" enregistré.`)
  }

  const handleExportPreset = () => {
    exportJSON(doc, `${(doc.name || 'preset').replace(/\s+/g, '-')}.json`)
  }

  const handleSaveInstance = () => {
    const name = instanceName.trim() || `${doc.name} — ${new Date().toLocaleString('fr-FR')}`
    const inst = saveInstance({
      id: currentInstanceId || uid(),
      presetId: doc.id,
      presetName: doc.name,
      name,
      values,
      updatedAt: Date.now(),
    })
    setCurrentInstanceId(inst.id)
    setInstances(listInstances())
    alert(`Instance "${name}" enregistrée.`)
  }

  const handleDownloadPdf = async () => {
    if (!canvasRef.current) return
    const node = canvasRef.current
    // Temporarily remove CSS transform so html2canvas captures at native size.
    const prevTransform = node.style.transform
    node.style.transform = 'scale(1)'
    try {
      const canvas = await html2canvas(node, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        width: PAGE_W,
        height: PAGE_H,
        windowWidth: PAGE_W,
        windowHeight: PAGE_H,
      })
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
      const pageWpt = pdf.internal.pageSize.getWidth()
      const pageHpt = pdf.internal.pageSize.getHeight()
      pdf.addImage(img, 'PNG', 0, 0, pageWpt, pageHpt)
      const fname = (instanceName || doc.name || 'document').replace(/\s+/g, '-')
      pdf.save(`${fname}.pdf`)
    } finally {
      node.style.transform = prevTransform
    }
  }

  const handleDeletePreset = (id) => {
    if (!confirm('Supprimer ce preset ?')) return
    deletePreset(id)
    setPresets(listPresets())
  }

  const handleDeleteInstance = (id) => {
    if (!confirm('Supprimer cette instance ?')) return
    deleteInstance(id)
    setInstances(listInstances())
  }

  const patchElement = (id, patch) => {
    setDoc({
      ...doc,
      elements: doc.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })
  }

  const header = (
    <header className="app-header">
      <h1>Preset Doc</h1>
      <nav className="tabs">
        <button
          className={`tab ${view === 'library' ? 'active' : ''}`}
          onClick={() => setView('library')}
        >
          Bibliothèque
        </button>
        {view !== 'library' ? (
          <span className="crumb">
            {view === 'design' ? 'Édition' : 'Remplissage'} — {doc.name}
          </span>
        ) : null}
      </nav>
    </header>
  )

  return (
    <div className="app">
      {header}
      {view === 'library' ? (
        <Library
          presets={presets}
          instances={instances}
          onNew={openNewPreset}
          onOpenPreset={openPresetForEdit}
          onFillPreset={openPresetForFill}
          onDeletePreset={handleDeletePreset}
          onOpenInstance={openInstance}
          onDeleteInstance={handleDeleteInstance}
        />
      ) : (
        <main className="editor">
          <div className="stage-area">
            <Canvas
              doc={doc}
              mode={view === 'design' ? 'design' : 'fill'}
              values={values}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onChange={patchElement}
              onFillChange={(id, v) => setValues({ ...values, [id]: v })}
              canvasRef={canvasRef}
            />
          </div>
          {view === 'design' ? (
            <DesignSidebar
              doc={doc}
              setDoc={setDoc}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onSavePreset={handleSavePreset}
              onExportPreset={handleExportPreset}
            />
          ) : (
            <FillSidebar
              doc={doc}
              values={values}
              onFill={(id, v) => setValues({ ...values, [id]: v })}
              onSaveInstance={handleSaveInstance}
              onDownloadPdf={handleDownloadPdf}
              instanceName={instanceName}
              setInstanceName={setInstanceName}
            />
          )}
        </main>
      )}
    </div>
  )
}
