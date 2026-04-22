import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { Unhead } from "@unhead/react/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), Unhead()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router"],
          "vendor-motion": ["motion"],
          "vendor-swiper": ["swiper"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-ui": ["@headlessui/react", "lucide-react"],
        },
      },
    },
  },
});
