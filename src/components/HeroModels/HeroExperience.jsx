import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useMediaQuery } from "react-responsive";
import Scene from "./Scene";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 50 }}>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        maxDistance={20}
        minDistance={5}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
      />

      <group
        scale={isMobile ? 0.7 : 1}
        position={[0, -3.5, 0]}
        rotation={[0, -Math.PI / 4, 0]}
      ></group>

      <Physics gravity={[0, -9.81, 0]}>
        <Scene />
      </Physics>
    </Canvas>
  );
};

export default HeroExperience;
