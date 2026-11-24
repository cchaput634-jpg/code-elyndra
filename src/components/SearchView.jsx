import { useMemo, useState } from 'react'
import { ALL_ARTICLES, AMENDES_UNIQUES, SECTIONS } from '../data/articles.js'
import { expandQuery } from '../data/synonyms.js'
import { normalize } from '../utils/normalize.js'

const AMENDE_FILTERS = [
  { id: 'all', label: 'Toutes amendes', test: () => true },
  { id: 'none', label: 'Sans amende', test: (a) => a.amende == null },
  { id: 'lt200', label: '< 200 £', test: (a) => a.amende != null && a.amende < 200 },
  { id: '200-650', label: '200 – 650 £', test: (a) => a.amende >= 200 && a.amende <= 650 },
  { id: '650-1500', label: '650 – 1 500 £', test: (a) => a.amende > 650 && a.amende <= 1500 },
  { id: 'gt1500', label: '> 1 500 £', test: (a) => a.amende != null && a.amende > 1500 },
]

export default function SearchView() {
  const [q, setQ] = useState('')
  const [section, setSection] = useState('all')
  const [amendeFilter, setAmendeFilter] = useState('all')
  const [exactAmende, setExactAmende] = useState('')
  const [codeQuery, setCodeQuery] = useState('')

  const matchedTerms = useMemo(() => expandQuery(q), [q])

  const results = useMemo(() => {
    const nCode = normalize(codeQuery.trim())
    const exact = exactAmende === '' ? null : Number(exactAmende)
    const aFilter = AMENDE_FILTERS.find((f) => f.id === amendeFilter)

    return ALL_ARTICLES.filter((a) => {
      if (section !== 'all' && a.sectionId !== section) return false
      if (nCode && !normalize(a.code).includes(nCode)) return false
      if (aFilter && !aFilter.test(a)) return false
      if (exact != null && a.amende !== exact) return false
      if (matchedTerms.size > 0) {
        const hay = normalize(`${a.code} ${a.titre} ${a.description} ${a.section}`)
        let hit = false
        for (const term of matchedTerms) {
          if (term && hay.includes(term)) {
            hit = true
            break
          }
        }
        if (!hit) return false
      }
      return true
    })
  }, [section, amendeFilter, exactAmende, codeQuery, matchedTerms])

  const reset = () => {
    setQ('')
    setSection('all')
    setAmendeFilter('all')
    setExactAmende('')
    setCodeQuery('')
  }

  const highlight = (text) => {
    if (matchedTerms.size === 0) return text
    const escapes = Array.from(matchedTerms)
      .filter((t) => t && t.length >= 2)
      .sort((a, b) => b.length - a.length)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    if (escapes.length === 0) return text
    try {
      const re = new RegExp(`(${escapes.join('|')})`, 'gi')
      // Accent-insensitive matching: walk the original text, test each slice
      // against the normalized version.
      const nText = normalize(text)
      const out = []
      let last = 0
      let m
      const reN = new RegExp(`(${escapes.join('|')})`, 'gi')
      while ((m = reN.exec(nText)) !== null) {
        const start = m.index
        const end = start + m[0].length
        if (start > last) out.push(text.slice(last, start))
        out.push(<mark key={`${start}-${end}`}>{text.slice(start, end)}</mark>)
        last = end
        if (reN.lastIndex === start) reN.lastIndex++
      }
      if (last < text.length) out.push(text.slice(last))
      return out.length ? out : text
    } catch {
      return text
    }
  }

  const synonymPills = useMemo(() => {
    if (matchedTerms.size <= 1) return []
    const nq = normalize(q.trim())
    return Array.from(matchedTerms).filter((t) => t && t !== nq).slice(0, 8)
  }, [matchedTerms, q])

  return (
    <div className="search">
      <div className="search-controls">
        <div className="field grow">
          <label htmlFor="kw">Mot‑clé</label>
          <input
            id="kw"
            type="text"
            placeholder="Ex. meurtre, racket, kidnapping, bruit…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="code">Code de loi</label>
          <input
            id="code"
            type="text"
            placeholder="T01, P05, DEC03…"
            value={codeQuery}
            onChange={(e) => setCodeQuery(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="section">Livre</label>
          <select
            id="section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          >
            <option value="all">Tous</option>
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="range">Tranche d'amende</label>
          <select
            id="range"
            value={amendeFilter}
            onChange={(e) => setAmendeFilter(e.target.value)}
          >
            {AMENDE_FILTERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="exact">Montant exact (£)</label>
          <select
            id="exact"
            value={exactAmende}
            onChange={(e) => setExactAmende(e.target.value)}
          >
            <option value="">—</option>
            {AMENDES_UNIQUES.map((v) => (
              <option key={v} value={v}>
                {v.toLocaleString('fr-FR')} £
              </option>
            ))}
          </select>
        </div>

        <button className="reset" onClick={reset} type="button">
          Réinitialiser
        </button>
      </div>

      {synonymPills.length > 0 ? (
        <div className="syn-row">
          <span className="syn-label">Recherche étendue aux synonymes&nbsp;:</span>
          {synonymPills.map((s) => (
            <span key={s} className="syn-chip">
              {s}
            </span>
          ))}
        </div>
      ) : null}

      <div className="search-meta">
        <span>
          <strong>{results.length}</strong> article{results.length > 1 ? 's' : ''} trouvé
          {results.length > 1 ? 's' : ''}
        </span>
      </div>

      <ul className="results">
        {results.length === 0 ? (
          <li className="empty">
            Aucun article ne correspond à ces critères. Essayez d'élargir la recherche.
          </li>
        ) : (
          results.map((a) => (
            <li key={`${a.sectionId}-${a.code}`} className="result">
              <div className="result-top">
                <span className={`pill pill-${a.sectionId}`}>{a.section}</span>
                <span className="result-code">Art. {highlight(a.code)}</span>
                {a.amende != null && (
                  <span className="result-amende">
                    {a.amende.toLocaleString('fr-FR')} £
                  </span>
                )}
              </div>
              <h4 className="result-titre">{highlight(a.titre)}</h4>
              <p className="result-desc">{highlight(a.description)}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
