import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const target = env.VITE_API_URL || "http://localhost:8000";

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
        "/auth": { target, changeOrigin: true, secure: false },
        "/users": { target, changeOrigin: true, secure: false },
        "/history": { target, changeOrigin: true, secure: false },
        "/notifications": {
          target: env.VITE_API_URL || "http://127.0.0.1:8000", // Заменили localhost на 127.0.0.1
          changeOrigin: true,
          ws: true,
          bypass: (req) => {
            // Если это запрос на апгрейд до сокета, не трогаем его
            if (req.headers.upgrade === "websocket") return null;
            // Только если это обычный GET запрос за страницей, отдаем index.html
            if (req.method === "GET" && req.headers.accept?.includes("html")) {
              return "/index.html";
            }
            return null;
          },
        },
        "/users": {
          target: env.VITE_API_URL || "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/purposes": {
          target: env.VITE_API_URL || "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/images": {
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
        hooks: path.resolve(__dirname, "./src/hooks"),
      },
    },
  };
});
