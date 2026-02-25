import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    root: "src/app",

    publicDir: "../../public",

    build: {
      outDir: "../../dist",
      emptyOutDir: true,
    },

    server: {
      proxy: {
        "/auth": {
          target: env.VITE_API_URL || "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/users": {
          target: env.VITE_API_URL || "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    resolve: {
      alias: {
        src: path.resolve(__dirname, "./src"),
        components: path.resolve(__dirname, "./src/components"),
        pages: path.resolve(__dirname, "./src/pages"),
        layout: path.resolve(__dirname, "./src/layout"),
        store: path.resolve(__dirname, "./src/store"),
        ui: path.resolve(__dirname, "./src/ui"),
        styles: path.resolve(__dirname, "./src/styles"),
        app: path.resolve(__dirname, "./src/app"),
        services: path.resolve(__dirname, "./src/services"),
        utils: path.resolve(__dirname, "./src/utils"),
      },
    },
  };
});
