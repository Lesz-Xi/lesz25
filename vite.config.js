import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.glb"],
  build: {
    modulePreload: {
      resolveDependencies: (url, deps, context) => {
        return deps.filter((dep) => !dep.includes("three") && !dep.includes("three-vendor"));
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'animation-vendor': ['gsap', 'framer-motion'],
        }
      }
    }
  }
});
