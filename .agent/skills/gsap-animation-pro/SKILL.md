---
name: gsap-animation-pro
description: Expert skill for high-end GSAP animations in React. Use when implementing cinematic transitions, scroll-triggered motion, parallax effects, or premium interactive components.
---

## 🧠 Phase 0: Mandatory Analysis

Before any animation implementation, perform these checks:

| Check | Action | Risk if Skipped |
|-------|--------|-----------------|
| **Dependency Audit** | Verify `gsap` and `@gsap/react` in `package.json` | Runtime errors |
| **Architecture Review** | Confirm functional components with `useRef` | Memory leaks |
| **Performance Check** | Identify jank sources (unoptimized images, layout reflows) | 30fps animations |

---

## 🛠️ The Professional Standard: React + GSAP

Always use `@gsap/react` hooks for automatic cleanup.

### Implementation Checklist
- [ ] **Scoping**: Use `useRef` + `scope` property in `useGSAP`
- [ ] **Plugin Registration**: Register `ScrollTrigger` outside component
- [ ] **GPU Properties**: Animate only `transform` (x, y, scale) and `opacity`
- [ ] **Cleanup**: Let `useGSAP` handle revert on unmount

### Critical Pattern
```jsx
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger); // OUTSIDE component

const MyComponent = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // All GSAP code here
    gsap.to('.element', { y: -100, opacity: 0 });
  }, { scope: containerRef }); // MANDATORY scoping

  return <div ref={containerRef}>...</div>;
};
```

---

## 🎬 Premium Animation Patterns

| Effect | Technique | Use Case |
|--------|-----------|----------|
| **Card Stacking** | `yPercent: 100` → `0`, scale previous cards | Project carousel |
| **Differential Parallax** | Varying `speed` data attributes, `scrub: 1` | Photography grid |
| **Cinematic Reveal** | `clip-path` + `scale` + `filter: brightness()` | Hero sections |
| **3D Tilt on Hover** | `gsap.to()` with `rotationX/Y`, `transformPerspective` | Interactive cards |

### Parallax with Speed Control
```jsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    gsap.utils.toArray('.parallax-item').forEach((item) => {
      const speed = parseFloat(item.dataset.speed) || 1;
      gsap.to(item, {
        y: -120 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }, containerRef);
  return () => ctx.revert();
}, []);
```

### ScrollTrigger Pin with Card Stack
```jsx
useGSAP(() => {
  const cards = gsap.utils.toArray('.card');
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${cards.length * 100}%`,
      scrub: 1,
      pin: true
    }
  });

  cards.forEach((card, i) => {
    if (i > 0) {
      tl.fromTo(card,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1 }
      );
      // Scale down previous cards
      for (let j = 0; j < i; j++) {
        tl.to(cards[j], { scale: 1 - (i - j) * 0.03, y: -(i - j) * 60 }, '<');
      }
    }
  });
}, { scope: containerRef });
```

---

## ⚠️ Common Pitfalls

| Mistake | Fix |
|---------|-----|
| Animating `left`/`top` | Use `x`/`y` transforms |
| Missing `scope` | Always pass `{ scope: containerRef }` |
| Plugin not registered | Call `gsap.registerPlugin()` at module level |
| No touch device check | Use `window.matchMedia("(hover: none)")` |

---

## 📁 Examples

See `examples/` folder for reference implementations:
- `cinematic-hero.jsx` - Zoom + brightness reveal
- `scroll-parallax.jsx` - Multi-speed parallax grid
