import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Dev-only reverse proxy: the browser only ever talks to :5173 (this server),
    // which forwards anything under /api to the backend server-side. This makes the
    // browser's requests same-origin, so there's no CORS involved and no separate
    // backend port to keep in sync with src/api/client.js — one port, one command.
    // Target must match server/.env's PORT (server/.env.example documents 5001,
    // chosen specifically to dodge macOS's AirPlay Receiver on port 5000).
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
})
