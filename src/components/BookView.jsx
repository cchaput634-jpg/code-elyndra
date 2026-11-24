import { useEffect, useMemo, useRef, useState, forwardRef } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { AnimatePresence, motion } from 'motion/react'
import { PREAMBULE, SECTIONS } from '../data/articles.js'

const Page = forwardRef(function Page({ children, className = '' }, ref) {
  return (
    <div className={`page ${className}`} ref={ref} data-density="soft">
      <div className="page-inner">{children}</div>
    </div>
  )
})

function renderBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}

function chunkArticles(articles, perPage = 2) {
  const chunks = []
  for (let i = 0; i < articles.length; i += perPage) {
    chunks.push(articles.slice(i, i + perPage))
  }
  return chunks
}

export default function BookView() {
  const flipRef = useRef(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [state, setState] = useState('closed') // 'closed' | 'open'

  const pages = useMemo(() => {
    const list = []
    list.push({ kind: 'endpaper' })
    list.push({ kind: 'preface' })

    SECTIONS.forEach((section) => {
      list.push({ kind: 'section-cover', section })
      const chunks = chunkArticles(section.articles, 2)
      chunks.forEach((chunk) => {
        list.push({ kind: 'articles', section, articles: chunk })
      })
      if (section.notes?.length) {
        list.push({ kind: 'notes', section })
      }
    })

    if (list.length % 2 !== 0) list.push({ kind: 'endpaper' })
    return list
  }, [])

  const totalPages = pages.length
  // Spreads are (0,1), (2,3), ... Final spread starts at totalPages-2.
  const atStart = pageIndex <= 0
  const atEnd = pageIndex >= totalPages - 2

  // Reset the book to the first spread shortly after it closes, so the
  // next opening always starts fresh. Delay matches the cover-close
  // animation so the user never sees the pages flipping back.
  useEffect(() => {
    if (state !== 'closed') return
    const t = setTimeout(() => {
      const api = flipRef.current?.pageFlip?.()
      if (api && typeof api.turnToPage === 'function') {
        api.turnToPage(0)
        setPageIndex(0)
      }
    }, 450)
    return () => clearTimeout(t)
  }, [state])

  const go = (dir) => {
    const api = flipRef.current?.pageFlip?.()
    if (!api) return
    if (dir === 'next' && !atEnd) api.flipNext()
    else if (dir === 'prev' && !atStart) api.flipPrev()
  }

  return (
    <div className="book-wrapper">
      {state === 'open' ? (
        <div className="book-controls">
          <button
            className="ctrl"
            onClick={() => go('prev')}
            disabled={atStart}
            aria-label="Page précédente"
          >
            ◀ Précédente
          </button>
          <span className="page-count">
            Pages {Math.min(pageIndex + 1, totalPages)}–{Math.min(pageIndex + 2, totalPages)} / {totalPages}
          </span>
          <button
            className="ctrl"
            onClick={() => go('next')}
            disabled={atEnd}
            aria-label="Page suivante"
          >
            Suivante ▶
          </button>
          <button className="ctrl close" onClick={() => setState('closed')}>
            Fermer le livre
          </button>
        </div>
      ) : (
        <div className="book-controls placeholder" />
      )}

      <div className="book-stage">
        {/* Book is always mounted, sits behind the cover. Fades in as the
            cover rotates away so there is no blank gap between them. */}
        <motion.div
          className="book-mount"
          initial={false}
          animate={{
            opacity: state === 'open' ? 1 : 0,
          }}
          transition={{ duration: 0.4, delay: state === 'open' ? 0.05 : 0.3 }}
          style={{ pointerEvents: state === 'open' ? 'auto' : 'none' }}
        >
          <HTMLFlipBook
            ref={flipRef}
            width={460}
            height={640}
            size="stretch"
            minWidth={280}
            maxWidth={560}
            minHeight={420}
            maxHeight={780}
            drawShadow
            flippingTime={900}
            showCover={false}
            usePortrait={false}
            mobileScrollSupport={true}
            maxShadowOpacity={0.45}
            startZIndex={0}
            autoSize={true}
            useMouseEvents={true}
            clickEventForward={true}
            className="flipbook"
            onFlip={(e) => setPageIndex(e.data)}
          >
            {pages.map((p, i) => (
              <Page key={i} className={p.kind}>
                {renderPage(p)}
              </Page>
            ))}
          </HTMLFlipBook>
        </motion.div>

        <AnimatePresence>
          {state === 'closed' && (
            <motion.button
              key="cover"
              type="button"
              className="standalone-cover"
              onClick={() => setState('open')}
              aria-label="Ouvrir le livre"
              initial={{ opacity: 0, rotateY: -30 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ rotateY: -165 }}
              transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <div className="standalone-cover-inner">
                <div className="cover-ornament">❖</div>
                <h2 className="cover-title">Code pénal</h2>
                <h3 className="cover-nation">d'Elyndra</h3>
                <span className="open-hint">— ouvrir —</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function renderPage(p) {
  switch (p.kind) {
    case 'endpaper':
      return <div className="endpaper" />
    case 'preface':
      return (
        <div className="preface">
          <p className="drop-cap">{PREAMBULE}</p>
        </div>
      )
    case 'section-cover': {
      const s = p.section
      return (
        <div className="section-cover">
          <div className="section-glyph">❖</div>
          <h2 className="chapter-title">{s.title}</h2>
          {s.subtitle ? <p className="section-sub">{s.subtitle}</p> : null}
          {s.intro ? <p className="section-intro">{s.intro}</p> : null}
        </div>
      )
    }
    case 'articles': {
      const s = p.section
      return (
        <div className="articles-page">
          <div className="running-head">
            <span>{s.title}</span>
          </div>
          {p.articles.map((a) => (
            <article key={a.code} className="article">
              <header className="article-head">
                <span className="article-code">Art. {a.code}</span>
                <h4 className="article-titre">{a.titre}</h4>
                {a.amende != null ? (
                  <span className="article-amende">{a.amende.toLocaleString('fr-FR')} £</span>
                ) : null}
              </header>
              <p className="article-desc">{a.description}</p>
            </article>
          ))}
        </div>
      )
    }
    case 'notes': {
      const s = p.section
      return (
        <div className="notes-page">
          <div className="running-head">
            <span>{s.title}</span>
          </div>
          <ul className="notes-list">
            {s.notes.map((n, i) => (
              <li key={i}>{renderBold(n)}</li>
            ))}
          </ul>
        </div>
      )
    }
    default:
      return <div />
  }
}
