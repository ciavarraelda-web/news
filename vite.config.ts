import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("./client/src"),
      "@assets": path.resolve("./client/attached_assets")
    },
  },
  root: path.resolve("./client"),
  build: {
    outDir: path.resolve("./dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["lucide-react"] // se vuoi esternalizzare lucide
    }
  }
});
