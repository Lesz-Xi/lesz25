---
name: responsive-mobile
description: Mobile-first responsive design patterns. Use when implementing touch interactions, mobile-specific animations, or ensuring cross-device compatibility.
---

## 🎯 Mobile-First Philosophy

This portfolio follows a **mobile-first** approach with Tailwind breakpoints:
- Default styles: Mobile
- `md:` prefix: Tablet and up (768px+)
- `lg:` prefix: Desktop (1024px+)

---

## 📱 Touch Device Detection

Always check for touch devices before mouse-dependent interactions:

```jsx
const handleMouseMove = (e) => {
  // Disable 3D tilt on touch devices
  if (window.matchMedia("(hover: none)").matches) return;
  
  // Mouse interaction code
  gsap.to(e.currentTarget, {
    rotationX: tiltX,
    rotationY: tiltY,
    transformPerspective: 1000
  });
};
```

---

## 🎨 Responsive Patterns

### Layout Classes (from codebase)
```jsx
// Mobile card → Desktop horizontal layout
className="w-full md:w-[600px] h-[55vh] md:h-auto md:aspect-[16/10]"

// Mobile stacked → Desktop side-by-side
className="flex flex-col md:flex-row"

// Conditional spacing
className="p-4 md:p-8"

// Mobile centered, desktop offset
className="md:col-span-1 md:mt-32"
```

### Typography Scaling
```jsx
// Headings scale up on desktop
className="text-2xl md:text-6xl"
className="text-lg md:text-3xl"

// Tracking stays consistent
className="tracking-[0.2em]"
```

---

## ⚠️ Mobile Animation Adjustments

| Desktop | Mobile | Reason |
|---------|--------|--------|
| 3D tilt on hover | Disabled | No hover on touch |
| Complex parallax | Simplified | Performance |
| Large pinned sections | Shorter pins | Thumb scrolling |
| Mouse-follow effects | Disabled | No cursor |

### Conditional Animation Example
```jsx
useLayoutEffect(() => {
  const isMobile = window.innerWidth < 768;
  
  gsap.to('.element', {
    y: isMobile ? -50 : -120,  // Reduced motion on mobile
    scrollTrigger: {
      scrub: isMobile ? 0.5 : 1  // Snappier on mobile
    }
  });
}, []);
```

---

## 🛡️ Error Boundary

Wrap critical sections with `ErrorBoundary` for mobile resilience:

```jsx
import ErrorBoundary from '../ErrorBoundary';

<ErrorBoundary>
  <HeroExperience />  {/* 3D content */}
</ErrorBoundary>
```

---

## 📁 Reference Files

| File | Pattern |
|------|---------|
| `src/components/sections/ProjectCarousel.jsx` | Responsive card layout |
| `src/components/sections/PhotographySection.jsx` | Touch detection |
| `src/components/ErrorBoundary.jsx` | Fallback component |
