import { useState } from 'react'
import BookView from './components/BookView.jsx'
import SearchView from './components/SearchView.jsx'

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
        </nav>
      </header>

      <main className="app-main">
        {tab === 'book' ? <BookView /> : <SearchView />}
      </main>
    </div>
  )
}
