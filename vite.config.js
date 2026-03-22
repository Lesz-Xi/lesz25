import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.glb"],
  build: {
    rollupOptions: {
      output: {
        // Function form covers all subpath imports (e.g. gsap/ScrollTrigger)
        // and transitive deps — the array form only matches exact entry points.
        manualChunks(id) {
          // @use-gesture must co-locate with r3f — fiber v9 imports it internally
          // and two instances cause the "bind of undefined" crash.
          if (
            id.includes("node_modules/three") ||
            id.includes("node_modules/@react-three") ||
            id.includes("node_modules/@use-gesture")
          ) {
            return "three-vendor";
          }
          // All GSAP subpaths (gsap/ScrollTrigger, gsap/Observer, etc.),
          // @gsap/react, framer-motion, and @react-spring must share a chunk
          // so ScrollTrigger's internal Observer doesn't cross chunk boundaries.
          if (
            id.includes("node_modules/gsap") ||
            id.includes("node_modules/@gsap") ||
            id.includes("node_modules/framer-motion") ||
            id.includes("node_modules/@react-spring")
          ) {
            return "animation-vendor";
          }
        },
      },
    },
  },
});
