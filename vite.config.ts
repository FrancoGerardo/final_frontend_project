import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(() => {
  // Base '/' para Railway (Railway sirve desde raíz)
  const base = "/";
  return {
    plugins: [react()],
    base,
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    server: {
      port: 5173,
      strictPort: false,
    },
    preview: {
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: [
        "finalfrontendproject-production.up.railway.app",
        ".railway.app",
      ],
    },
  };
});
