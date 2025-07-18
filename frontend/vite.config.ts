import {defineConfig} from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [preact()],
    server: {
        proxy: {
            '/gesamtansicht': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
            },
            '/lehrerverwaltung': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
            },
            '/einzelansicht': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
            },
            '/benutzer': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
            },
            '/schuljahre': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
            },
            '/schuljahre/aktiv': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
            },
            '/anrechnung': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
            },
            '/ermaessigung': {
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