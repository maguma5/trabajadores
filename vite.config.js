// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Divide dependencias pesadas en chunks separados
          react: ["react", "react-dom"],
          firebase: ["firebase/app", "firebase/firestore"],
          ocr: ["tesseract.js"], // si lo usas
        },
      },
    },
    chunkSizeWarningLimit: 600, // opcional: sube el límite de advertencia
  },
});
