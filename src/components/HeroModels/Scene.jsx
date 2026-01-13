import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import CameraModel from "./CameraModel";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export default function Scene({ isPaused }) {
  const rigidBodyRef = useRef(null);

  let rotationX = 0;
  let rotationY = 0;

  useFrame((_, delta) => {
    if (rigidBodyRef.current && !isPaused) {
      const rotationEuler = new THREE.Euler(rotationX, rotationY, 0);
      const rotationQuaternion = new THREE.Quaternion().setFromEuler(
        rotationEuler
      );
      rigidBodyRef.current.setNextKinematicRotation(rotationQuaternion);
      rotationX += delta * 0.5;
      rotationY += delta * 0.3;
    }
  });

  return (
    <>
      <RigidBody
        colliders={false}
        ref={rigidBodyRef}
        type="kinematicPosition"
      >
        <CameraModel />
      </RigidBody>
    </>
  );
}
