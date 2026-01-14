---
name: 3d-portfolio-master
description: Master skill for the 3D Portfolio project. Use for understanding project architecture, component patterns, styling conventions, and development workflow.
---

## 🎯 Project Overview

This is a **high-end 3D portfolio** built with React 19, Vite, Three.js, and GSAP. The design philosophy prioritizes:
- **Cinematic scrolling experiences** with pinned sections
- **Premium visual aesthetics** (dark theme, gold accents, typography)
- **Immersive 3D elements** integrated seamlessly with 2D content

---

## 🏗️ Architecture

### Technology Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | React 19 + Vite | Fast HMR, ESM modules |
| 3D Engine | Three.js + R3F | 3D models and scenes |
| Animation | GSAP + ScrollTrigger | Scroll-driven animations |
| Styling | Tailwind CSS 4 | Utility-first styling |
| Routing | React Router 7 | SPA navigation |
| Smooth Scroll | Lenis | Buttery scroll physics |

### Directory Structure
```
src/
├── components/
│   ├── sections/           # Page sections (Hero, Projects, etc.)
│   ├── HeroModels/         # 3D models (CameraModel, Scene)
│   ├── pages/              # Full page components
│   └── common/             # Shared UI components
├── design-system/          # Design tokens and utilities
├── hooks/                  # Custom React hooks
├── utils/                  # Helper functions
├── constants/              # Static data (navLinks, etc.)
└── assets/                 # Images, fonts, icons
```

---

## 🎨 Design System

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-dark` | `#070707` | Primary background |
| `--text-cream` | `#DBD5B5` | Body text |
| `--accent-gold` | `#8B7E66` | Headings, CTAs, accents |

### Typography
- **Headings**: `font-accent` (serif, elegant)
- **Body**: `font-geist-mono` (monospace, technical)
- **Tracking**: Wide letter-spacing for elegance (`tracking-[0.2em]`)

### Component Conventions
1. **Section Structure**: Full viewport height sections with `id` for navigation
2. **Ref Patterns**: Use `useRef` for GSAP animations, always scope with `useGSAP`
3. **Responsive**: Mobile-first with `md:` breakpoints for desktop

---

## ⚡ Development Workflow

### Commands
```bash
npm run dev      # Start development server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

### Key Files
| File | Purpose |
|------|---------|
| `src/components/sections/App.jsx` | Main app shell with all sections |
| `src/components/Navbar.jsx` | Navigation with scroll-aware behavior |
| `src/index.css` | Global styles and Tailwind imports |
| `vite.config.js` | Vite configuration |

---

## 🔗 Related Skills

For specialized tasks, refer to:
- **gsap-animation-pro** - Complex scroll animations
- **threejs-react** - 3D model creation and optimization
- **responsive-mobile** - Mobile-specific patterns
