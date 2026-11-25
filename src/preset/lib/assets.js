// Asset library: a palette of reusable images (signatures, seals, stamps…).
// Built-in assets live in /public and are seeded on first launch. The user
// can add their own via the sidebar — they are stored as data URLs in
// localStorage alongside the catalog.

const ASSETS_KEY = 'preset-doc.assets.v1'

const BUILT_IN = [
  {
    id: 'builtin-signature-alice',
    name: 'Signature — Alice Hecalys',
    category: 'signature',
    src: '/asset-signature-alice.png',
    builtin: true,
  },
]

function read() {
  try {
    const raw = localStorage.getItem(ASSETS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(arr) {
  try {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(arr))
  } catch {
    // quota
  }
}

export function listAssets() {
  const user = read()
  return [...BUILT_IN, ...user]
}

export function addUserAsset({ name, src, category = 'autre' }) {
  const user = read()
  const asset = {
    id: `user-${Math.random().toString(36).slice(2, 10)}`,
    name,
    category,
    src,
    builtin: false,
    createdAt: Date.now(),
  }
  user.push(asset)
  write(user)
  return asset
}

export function deleteUserAsset(id) {
  const user = read().filter((a) => a.id !== id)
  write(user)
}

export function renameUserAsset(id, name) {
  const user = read().map((a) => (a.id === id ? { ...a, name } : a))
  write(user)
}
