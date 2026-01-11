import { RigidBody } from "@react-three/rapier";

export default function Ball({ position, color }) {
  return (
    <RigidBody
      colliders="ball"
      restitution={1}
      friction={0.25}
      position={position}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>
    </RigidBody>
  );
}
