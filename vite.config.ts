import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: 'client', // <-- punta alla cartella dove c'è index.html
  plugins: [react()],
  build: {
    outDir: '../dist/client',
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'), // percorso corretto
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
})
