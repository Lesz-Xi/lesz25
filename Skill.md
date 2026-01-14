---
name: frontend-ui-ux-gsap-pro
description: Expert skill for high-end UI/UX design and complex GSAP animations in React. Use when implementing cinematic transitions, scroll-triggered motion, or premium interactive components.
---

## 🧠 Phase 0: Mandatory Analysis
Before implementation, the agent must perform these checks to ensure consistency and minimize lags:

* **Dependency Audit**: Confirm `gsap` and `@gsap/react` are present in `package.json`.
* **Architecture Review**: Ensure the component structure is functional and ready for `useRef` scoping.
* **Performance Check**: Identify potential "jank" sources like high-res unoptimized images or complex layout reflows.

---

## 🛠️ The Professional Standard: React + GSAP
Always use the `@gsap/react` hook to handle automatic cleanup and prevent memory leaks.

### 1. Implementation Checklist
- [ ] **Scoping**: Use `useRef` and the `scope` property in `useGSAP` to prevent global selector pollution.
- [ ] **Plugins**: Register `ScrollTrigger` or `Observer` outside the component scope.
- [ ] **Properties**: Animate only `transform` (x, y, scale) and `opacity` for 60FPS performance.
- [ ] **Revert**: Ensure all animations are cleaned up on component unmount (handled by `useGSAP`).

### 2. Premium Design Patterns
| Effect | Technical Strategy | Aesthetic |
| :--- | :--- | :--- |
| **Cinematic Reveal** | `clip-path` + subtle `scale` reduction | Apple / High-End Portfolio |
| **Differential Parallax** | `scrub: 1.5` + varying speed ratios for layers | Depth & Immersion |
| **Magnetic Interaction** | `gsap.quickTo()` for mouse-following elements | Playful / Interactive |

---

## 🚀 "Eiffel Gold" Cinematic Hero Implementation
This component follows the "Phase 0" analysis and uses the best-in-class `useGSAP` patterns.

```jsx
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export const CinematicHero = () => {
  const container = useRef(null);
  const image = useRef(null);
  const content = useRef(null);

  useGSAP(() => {
    // Master Timeline for Scroll-Triggered Sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom center",
        scrub: 1.5, // High-end "heavy" scroll feel
        pin: true
      }
    });

    // 1. Zoom-out Effect: Focus to Solitude
    tl.fromTo(image.current, 
      { scale: 1.3, filter: "brightness(0.6)" }, 
      { scale: 1, filter: "brightness(1)", ease: "none" }, 0
    );

    // 2. Parallax Text Reveal
    tl.to(content.current, { y: -100, opacity: 0, ease: "none" }, 0);

  }, { scope: container }); // Mandatory Scoping

  return (
    <section ref={container} className="relative h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 w-full h-full">
        <img 
          ref={image} 
          src="/eiffel-gold.jpg" 
          className="w-full h-full object-cover will-change-transform" // Performance optimization
          alt="Eiffel Tower at Gold Hour"
        />
      </div>
      
      <div ref={content} className="relative z-10 text-center text-white">
        <p className="uppercase tracking-[0.3em] text-xs mb-4 opacity-70">Cityscape</p>
        <h1 className="text-7xl font-light font-serif">Eiffel Gold</h1>
      </div>
    </section>
  );
};