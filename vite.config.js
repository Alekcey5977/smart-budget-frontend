import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  root: path.resolve(__dirname, "src/app"),
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@layout": path.resolve(__dirname, "src/layout"),
      "@ui": path.resolve(__dirname, "src/ui"),
      "@store": path.resolve(__dirname, "src/store"),
      styles: path.resolve(__dirname, "src/styles"),
      "@theme": path.resolve(__dirname, "src/app/theme"),
    },
  },

  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
