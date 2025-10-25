import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: "./",
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@server": resolve(__dirname, "server"),
      "@data": resolve(__dirname, "data")
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
});
