import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(__dirname, "src/app"),
  plugins: [react()],

  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      store: path.resolve(__dirname, "src/store"),
      pages: path.resolve(__dirname, "src/pages"),
      layout: path.resolve(__dirname, "src/layout"),
      ui: path.resolve(__dirname, "src/ui"),
      styles: path.resolve(__dirname, "src/styles"),
      app: path.resolve(__dirname, "src/app"),
    },
  },
});