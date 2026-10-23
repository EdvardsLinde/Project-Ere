import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  // The artifact build is one self-contained HTML file (external images are blocked there),
  // so images are embedded as data URIs instead of separate files.
  build: mode === 'artifact' ? { assetsInlineLimit: () => true } : undefined,
}))
