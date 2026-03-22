import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

const HeroExperience = React.memo(() => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Skip 3D rendering entirely on mobile for better performance
  if (isMobile) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      frameloop="always"
      dpr={[1, 1.5]}
    >
      <group
        scale={1.3}
        position={[1.1, 0, 0]}
        rotation={[0, -Math.PI / 4, 0]}
      >
        <Scene />
      </group>
    </Canvas>
  );
});

export default HeroExperience;
