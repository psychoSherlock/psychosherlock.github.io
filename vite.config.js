// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // Changed from "/" to "./" for GitHub Pages deployment
  plugins: [react()],
});
