import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "./client",
  base: "./",
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "dist/client"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "client/index.html"),
      // Aggiungi queste opzioni per risolvere i moduli correttamente
      external: [], // Assicurati che non ci siano moduli externalizzati
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      // Aggiungi un alias esplicito per wouter
      "wouter": path.resolve(__dirname, "node_modules/wouter")
    }
  },
  server: {
    port: 5173,
    open: true
  },
  // Aggiungi questa configurazione per ottimizzare la risoluzione dei moduli
  optimizeDeps: {
    include: ['wouter']
  }
});
