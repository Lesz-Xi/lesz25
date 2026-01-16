import React from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useMediaQuery } from "react-responsive";
import Scene from "./Scene";

const HeroExperience = React.memo(() => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Skip 3D rendering entirely on mobile for better performance
  // This saves ~1-2MB of JS and eliminates WebGL overhead
  if (isMobile) return null;

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <OrbitControls
        enablePan={true}
        enableZoom={false}
        maxDistance={20}
        minDistance={5} 
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
      />

      <group
        scale={isMobile ? 0.9 : 1.3}
        position={[1.1, 0, 0]}
        rotation={[0, -Math.PI / 4, 0]}
      >
        <Physics gravity={[0, -9.81, 0]}>
          <Scene />
        </Physics>
      </group>
    </Canvas>
  );
});

export default HeroExperience;
