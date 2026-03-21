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
          // @use-gesture/react is used internally by @react-three/fiber v9 —
          // keeping it in the same chunk prevents a dual-instance "bind of undefined" crash
          'three-vendor': [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            '@use-gesture/react',
            '@react-spring/web',
          ],
          'animation-vendor': ['gsap', '@gsap/react', 'framer-motion'],
        }
      }
    }
  }
});
