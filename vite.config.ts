import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["express", "class-variance-authority"],
    },
  },
  server: {
    port: 5173,
  },
});
