import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router'
import './index.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'

// Normal builds use real URLs (/profile, /jobs…). The single-file preview build
// (`--mode artifact`) runs where only the hash can change, so it uses #/profile.
const Router = import.meta.env.MODE === 'artifact' ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  </StrictMode>,
)
