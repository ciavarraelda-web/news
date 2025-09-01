import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./client", // cartella del front-end
  base: "./", // per deploy statico su Vercel
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "dist/client"), // build in dist/client
    emptyOutDir: true, // svuota la cartella ad ogni build
    rollupOptions: {
      input: path.resolve(__dirname, "client/index.html")
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src") // alias @ per import
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
