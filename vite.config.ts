import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      // Se vuoi puoi aggiungere qui le librerie esterne
      external: [
        "@radix-ui/react-tabs",
        "react-icons",
        "react-hook-form",
        "tailwind-merge",
        "class-variance-authority"
      ],
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});

