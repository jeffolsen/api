import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "@tanstack/react-router"],
          "vendor-motion": ["motion"],
          "vendor-swiper": ["swiper"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-ui": ["@headlessui/react", "lucide-react"],
        },
      },
    },
  },
});
