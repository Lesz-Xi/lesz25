import CameraModel from "./CameraModel";

export default function Scene() {
  return (
    <group rotation={[-0.15, 0.2, 0.05]}>
      <CameraModel />
    </group>
  );
}

