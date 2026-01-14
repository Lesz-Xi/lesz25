/**
 * Wireframe Model Example
 * 
 * A procedural wireframe 3D model using primitive geometries.
 * No external model files required - fast loading.
 */
import React from "react";
import { DoubleSide } from "three";

export default function WireframeModel() {
  // Reusable wireframe material
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
      {/* Main Body - Box */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 1.4, 0.8]} />
        {wireframeMaterial}
      </mesh>
      
      {/* Detail Elements - Cylinders */}
      <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.6, 32]} />
        {wireframeMaterial}
      </mesh>

      {/* Top Element - Low-poly Prism */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.3, 0.7, 0.5, 4]} />
        {wireframeMaterial}
      </mesh>

      {/* Small Accents */}
      <mesh position={[0.9, 0.75, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        {wireframeMaterial}
      </mesh>
    </group>
  );
}
