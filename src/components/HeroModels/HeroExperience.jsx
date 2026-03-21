import React from "react";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import Scene from "./Scene";

const HeroExperience = React.memo(() => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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
