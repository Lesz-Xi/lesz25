import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import CameraModel from "./CameraModel";

export default function Scene({ isPaused }) {
  const groupRef = useRef(null);

  useFrame((_, delta) => {
    if (groupRef.current && !isPaused) {
      // Simple rotation animation - no physics needed
      groupRef.current.rotation.x += delta * 0.5;
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <CameraModel />
    </group>
  );
}
