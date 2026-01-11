import { DoubleSide } from "three";

export default function Sphere() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#f8f9fa" wireframe side={DoubleSide} />
      </mesh>
    </group>
  );
}
