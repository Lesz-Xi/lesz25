import React from "react";
import { DoubleSide } from "three";

export default function CameraModel() {
  const wireframeMaterial = (
    <meshBasicMaterial 
      color="white" 
      wireframe 
      transparent 
      opacity={0.8} 
      side={DoubleSide} 
    />
  );

  return (
    <group dispose={null}>
      {/* --- CAMERA BODY --- */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 1.4, 0.8]} />
        {wireframeMaterial}
      </mesh>
      
      {/* Internal "Cross Bracing" (Logo Style) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
         <boxGeometry args={[1.8, 0.02, 0.78]} />
         {wireframeMaterial}
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
         <boxGeometry args={[1.8, 0.02, 0.78]} />
         {wireframeMaterial}
      </mesh>

      {/* --- LENS COMPLEX (Multi-Ring) --- */}
      {/* Outer Barrel */}
      <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.6, 32]} />
        {wireframeMaterial}
      </mesh>
      
      {/* Mid Ring (Detail) */}
      <mesh position={[0, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.65, 32]} />
        {wireframeMaterial}
      </mesh>
      
      {/* Inner Lens Element */}
      <mesh position={[0, 0, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 24]} />
        {wireframeMaterial}
      </mesh>

      {/* --- TOP PENTAPRISM (Viewfinder) --- */}
      <mesh position={[0, 0.85, 0]}>
        {/* Using a 4-sided cylinder (rotated) to make a trapezoidal prism shape */}
        <cylinderGeometry args={[0.3, 0.7, 0.5, 4]} rotation={[0, Math.PI / 4, 0]} />
        {wireframeMaterial}
      </mesh>

      {/* Flash / Hotshoe Base */}
      <mesh position={[0, 0.7, 0]}>
         <boxGeometry args={[1.2, 0.1, 0.8]} />
         {wireframeMaterial}
      </mesh>

      {/* --- DETAILS --- */}
      {/* Shutter Button */}
      <mesh position={[0.9, 0.75, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        {wireframeMaterial}
      </mesh>

      {/* Mode Dial */}
      <mesh position={[-0.8, 0.75, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        {wireframeMaterial}
      </mesh>
    </group>
  );
}
