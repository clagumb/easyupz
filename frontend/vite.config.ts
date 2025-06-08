import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: '/start', // ← falls eingebettet wird
  build: {
    outDir: '../start', // ← relativ zu deinem frontend-Ordner
    emptyOutDir: true  // ← löscht alten Inhalt vorher
  }
});