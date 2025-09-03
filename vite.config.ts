import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "#ui": resolve(__dirname, "./src/ui/ind.ts"),
      "@": resolve(__dirname, "./src"),
    },
  },
});
