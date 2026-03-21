import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";
import CameraModel from "./CameraModel";

export default function Scene() {
  const groupRef = useRef();
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      0.2 + pointer.x * 0.35,
      0.05
    );
    groupRef.current.rotation.x = MathUtils.lerp(
      groupRef.current.rotation.x,
      -0.15 + -pointer.y * 0.15,
      0.05
    );
  });

  return (
    <group ref={groupRef} rotation={[-0.15, 0.2, 0.05]}>
      <CameraModel />
    </group>
  );
}

