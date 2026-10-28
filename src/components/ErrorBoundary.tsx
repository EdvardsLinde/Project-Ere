import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

/**
 * Last line of defence: if rendering crashes, show what happened and a way out
 * instead of a blank white page. Plain styles only, in case the crash is in the theme.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  reset = () => {
    try {
      localStorage.removeItem('seer:v2')
    } catch {
      /* storage blocked: nothing to clear */
    }
    location.hash = '#/'
    location.reload()
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div style={{ minHeight: '100dvh', padding: 24, background: '#0b0a09', color: '#f7f5f3', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: 560, margin: '10vh auto 0' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Kaut kas nogāja greizi / Something went wrong</h1>
          <p style={{ marginTop: 12, opacity: 0.8 }}>
            Lapa nevarēja ielādēties. Nosūti šo ziņu izstrādātājam vai sāc no jauna (dzēsīs šajā pārlūkā saglabātos datus).
          </p>
          <pre style={{ marginTop: 16, padding: 12, borderRadius: 8, background: '#24201d', whiteSpace: 'pre-wrap', fontSize: 13 }}>
            {error.name}: {error.message}
          </pre>
          <button
            type="button"
            onClick={this.reset}
            style={{ marginTop: 16, padding: '10px 16px', borderRadius: 10, background: '#a38443', color: '#231f1e', fontWeight: 700, border: 0, cursor: 'pointer' }}
          >
            Sākt no jauna / Start again
          </button>
        </div>
      </div>
    )
  }
}
