import React, { useState, useEffect, useLayoutEffect, Suspense, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../Navbar";
import IntroAnimation from "../IntroAnimation";
import Cursor from "../Cursor";
import ErrorBoundary from "../ErrorBoundary"; 

// Pages - Lazy loaded for code splitting
import Home from "../pages/Home";
const PhotographyPage = React.lazy(() => import("../pages/PhotographyPage"));
const AlbumDisplay = React.lazy(() => import("../pages/AlbumDisplay"));
const NotFound = React.lazy(() => import("../pages/NotFound"));

// Disable browser's native scroll restoration IMMEDIATELY (before any navigation)
if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Store Lenis instance globally so components can access it
let lenisInstance = null;
export const getLenis = () => lenisInstance;
export const setLenis = (lenis) => { lenisInstance = lenis; };

// ScrollToTop component with scroll position memory for Photography page
// Uses useLayoutEffect for synchronous pre-paint scroll reset
// FIX: Properly clears ScrollTrigger memory and syncs Lenis internal state
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const previousPathRef = useRef(sessionStorage.getItem('previousPath') || '');
  
  // SYNCHRONOUS scroll reset - runs before paint
  useLayoutEffect(() => {
    const previousPath = previousPathRef.current;
    const lenis = getLenis();
    
    // 1. CLEAR all scroll memory FIRST - prevents stale position bugs
    ScrollTrigger.clearScrollMemory();
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    // 2. Check for /photography return navigation (restore saved position)
    if (pathname === '/photography' && previousPath.startsWith('/photography/')) {
      const savedPosition = sessionStorage.getItem('photographyScrollPosition');
      if (savedPosition) {
        const position = parseInt(savedPosition, 10);
        
        if (lenis) {
          lenis.stop();
          // Reset browser scroll first, then let Lenis sync
          window.scrollTo(0, position);
          document.documentElement.scrollTop = position;
          document.body.scrollTop = position;
          lenis.scrollTo(position, { immediate: true, force: true });
          lenis.start();
        } else {
          window.scrollTo(0, position);
        }
        
        // Update refs and storage
        previousPathRef.current = pathname;
        sessionStorage.setItem('previousPath', pathname);
        
        // Refresh ScrollTrigger after layout settles (safe mode)
        requestAnimationFrame(() => ScrollTrigger.refresh(true));
        return;
      }
    }
    
    // 3. For ALL other navigations: scroll to TOP
    if (lenis) {
      lenis.stop();
      // Reset browser scroll first, then let Lenis sync via scrollTo
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.start();
    } else {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    
    // Update refs and storage
    previousPathRef.current = pathname;
    sessionStorage.setItem('previousPath', pathname);
    
    // Refresh ScrollTrigger after layout settles (safe mode)
    requestAnimationFrame(() => ScrollTrigger.refresh(true));
  }, [pathname]);
  
  return null;
}

// Wrapper to force remount AlbumDisplay when albumId changes
// ScrollToTop now handles scroll reset, this just forces component remount
const AlbumDisplayWrapper = () => {
  const { albumId } = useParams();
  
  // The key prop forces a complete remount when albumId changes
  // Scroll reset is handled by ScrollToTop's useLayoutEffect
  return <AlbumDisplay key={albumId} />;
}

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Note: scrollRestoration is set at module scope for immediate effect
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Register Lenis instance globally
    setLenis(lenis);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <ErrorBoundary>
      <Router>
        {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
        
        {/* Main Application Content - Rendered immediately but covered by Intro */}
        <ScrollToTop />
        <div className="bg-[#070707] min-h-screen cursor-none">
          <Cursor />
          <Navbar />
          
          <Suspense fallback={<div className="min-h-screen bg-[#070707]" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/photography" element={<PhotographyPage />} />
              <Route path="/photography/:albumId" element={<AlbumDisplayWrapper />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
