---
name: threejs-react
description: Three.js integration with React Three Fiber (R3F). Use when creating 3D models, scenes, or interactive 3D elements in the portfolio.
---

## 🎯 Overview

This portfolio uses **React Three Fiber** (@react-three/fiber) with **drei** helpers for 3D content. The primary 3D element is a custom wireframe camera model.

---

## 🏗️ R3F Component Patterns

### Canvas Setup
```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

<Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} />
  <MyModel />
  <OrbitControls enableZoom={false} />
</Canvas>
```

### Model Component Structure
```jsx
export default function MyModel() {
  return (
    <group dispose={null}>
      {/* Group multiple meshes for organization */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="white" wireframe />
      </mesh>
    </group>
  );
}
```

---

## 📦 Wireframe Model Pattern

The portfolio's signature camera model uses pure geometric primitives:

### Key Techniques
| Element | Geometry | Props |
|---------|----------|-------|
| Body | `boxGeometry` | `args={[width, height, depth]}` |
| Lens | `cylinderGeometry` | `args={[topRadius, bottomRadius, height, segments]}` |
| Prism | `cylinderGeometry` with 4 segments | Creates trapezoidal shape |

### Wireframe Material
```jsx
const wireframeMaterial = (
  <meshBasicMaterial 
    color="white" 
    wireframe 
    transparent 
    opacity={0.8} 
    side={DoubleSide}  // Import from 'three'
  />
);
```

### Rotation for Orientation
```jsx
// Rotate cylinder to face camera (lens pointing out)
<mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
  <cylinderGeometry args={[0.65, 0.65, 0.6, 32]} />
  {wireframeMaterial}
</mesh>
```

---

## ⚡ Performance Guidelines

| Guideline | Implementation |
|-----------|---------------|
| **Dispose null** | Always use `<group dispose={null}>` |
| **Low poly** | Use minimal `segments` for wireframes |
| **No external models** | Use primitives for fast loading |
| **Conditional render** | Hide 3D on mobile if needed |

---

## 📁 Reference Files

| File | Description |
|------|-------------|
| `src/components/HeroModels/CameraModel.jsx` | Wireframe DSLR camera |
| `src/components/HeroModels/HeroExperience.jsx` | Canvas wrapper |
| `src/components/HeroModels/Scene.jsx` | Lighting setup |
