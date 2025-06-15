import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    proxy: {
      '/lehrer': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/benutzer': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/anrechnungen': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/logout': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/status': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    }
  },
  base: '/start',
  build: {
    outDir: '../start',
    emptyOutDir: true
  }
});