import { useState } from 'react'
import BookView from './components/BookView.jsx'
import SearchView from './components/SearchView.jsx'
import PresetView from './preset/PresetView.jsx'

export default function App() {
  const [tab, setTab] = useState('book')

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="sigil">❖</span>
          <h1>Code pénal d'Elyndra</h1>
        </div>
        <nav className="tabs">
          <button
            className={tab === 'book' ? 'tab active' : 'tab'}
            onClick={() => setTab('book')}
          >
            Code pénal
          </button>
          <button
            className={tab === 'search' ? 'tab active' : 'tab'}
            onClick={() => setTab('search')}
          >
            Recherche
          </button>
          <button
            className={tab === 'preset' ? 'tab active' : 'tab'}
            onClick={() => setTab('preset')}
          >
            Documents
          </button>
        </nav>
      </header>

      <main className="app-main">
        {tab === 'book' ? (
          <BookView />
        ) : tab === 'search' ? (
          <SearchView />
        ) : (
          <PresetView />
        )}
      </main>
    </div>
  )
}
