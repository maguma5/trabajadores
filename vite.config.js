// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    // Solo para desarrollo
  },
  // 👇 Esto es clave para Vercel
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
