import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "redirect-root",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === "/") {
            req.url = "/showcase.html";
          }
          next();
        });
      },
    },
  ],
  root: ".",
  build: {
    outDir: "dist-showcase",
    rollupOptions: {
      input: "showcase.html",
    },
  },
  server: {
    port: 3200,
  },
  css: {
    postcss: "./postcss.config.mjs",
  },
});
