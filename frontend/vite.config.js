import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ← WITHOUT THIS, NOTHING WORKS
  ],
  resolve: {
    dedupe: ["react", "react-dom"], // ✅ CRITICAL
  },
  server: {
    port: 5174,
  },
});