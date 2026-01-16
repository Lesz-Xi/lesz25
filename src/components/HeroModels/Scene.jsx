import CameraModel from "./CameraModel";

export default function Scene() {
  // Static camera position - angled as if "taking a picture" of the Introduction text
  // No animation for better performance and visual clarity
  return (
    <group rotation={[-0.15, 0.2, 0.05]}>
      <CameraModel />
    </group> 
  );
}

