// Preset storage: localStorage + JSON export/import.
// A preset is a document template: background + elements (text / zones).
// An instance is a filled preset: presetId + field values.

const PRESETS_KEY = 'preset-doc.presets.v1'
const INSTANCES_KEY = 'preset-doc.instances.v1'

export function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota errors in demo
  }
}

export function listPresets() {
  return read(PRESETS_KEY)
}

export function getPreset(id) {
  return listPresets().find((p) => p.id === id) || null
}

export function savePreset(preset) {
  const all = listPresets()
  const idx = all.findIndex((p) => p.id === preset.id)
  if (idx >= 0) all[idx] = preset
  else all.push(preset)
  write(PRESETS_KEY, all)
  return preset
}

export function deletePreset(id) {
  write(
    PRESETS_KEY,
    listPresets().filter((p) => p.id !== id),
  )
}

export function listInstances() {
  return read(INSTANCES_KEY)
}

export function saveInstance(instance) {
  const all = listInstances()
  const idx = all.findIndex((i) => i.id === instance.id)
  if (idx >= 0) all[idx] = instance
  else all.push(instance)
  write(INSTANCES_KEY, all)
  return instance
}

export function deleteInstance(id) {
  write(
    INSTANCES_KEY,
    listInstances().filter((i) => i.id !== id),
  )
}

export function exportJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
