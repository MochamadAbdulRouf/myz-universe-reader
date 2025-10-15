import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // sangat beresiko, gunakan hanya pada mode development atau staging jangan gunakan di production dalam jangka waktu yang lama
   // allowedHosts: ['.'], // mengizinkan semua host yang memiliki domain untuk terhubung ke server pengembangan
  },
   plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
