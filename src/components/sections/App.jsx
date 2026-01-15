import React, { useState, useEffect, useLayoutEffect, Suspense } from "react";
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

// Store Lenis instance globally so components can access it
let lenisInstance = null;
export const getLenis = () => lenisInstance;
export const setLenis = (lenis) => { lenisInstance = lenis; };

// ScrollToTop component with scroll position memory for Photography page
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    const lenis = getLenis();
    
    // Save scroll position when leaving photography page
    const previousPath = sessionStorage.getItem('previousPath') || '';
    
    // ALBUM PAGES: Let AlbumDisplayWrapper handle scroll reset
    if (pathname.startsWith('/photography/')) {
      sessionStorage.setItem('previousPath', pathname);
      return; // Exit early - AlbumDisplayWrapper handles this
    }
    
    // If coming BACK to /photography from an album, restore scroll position
    if (pathname === '/photography' && previousPath.startsWith('/photography/')) {
      const savedPosition = sessionStorage.getItem('photographyScrollPosition');
      if (savedPosition) {
        const position = parseInt(savedPosition, 10);
        // Small delay to ensure page is rendered
        setTimeout(() => {
          if (lenis) {
            lenis.scrollTo(position, { immediate: true });
          } else {
            window.scrollTo(0, position);
          }
          ScrollTrigger.refresh();
        }, 50);
        sessionStorage.setItem('previousPath', pathname);
        return; // Don't scroll to top
      }
    }
    
    // For other navigations, scroll to top
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    
    // Store current path for next navigation
    sessionStorage.setItem('previousPath', pathname);
    
    // Refresh ScrollTrigger after scroll
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [pathname]);
  
  return null;
}

// Wrapper to force remount AlbumDisplay when albumId changes
const AlbumDisplayWrapper = () => {
  const { albumId } = useParams();
  
  // Force scroll to top SYNCHRONOUSLY before paint
  useLayoutEffect(() => {
    // Kill all existing ScrollTriggers first
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Stop Lenis temporarily to prevent interference
    const lenis = getLenis();
    if (lenis) {
      lenis.stop();
    }
    
    // Force scroll to top using native scroll (most reliable)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // For Safari
    window.scrollTo(0, 0);
    
    // Resume Lenis and sync its internal state
    if (lenis) {
      lenis.start();
      // Reset Lenis internal scroll value
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    
    // Refresh ScrollTrigger after a small delay
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [albumId]);
  
  // The key prop forces a complete remount when albumId changes
  return <AlbumDisplay key={albumId} />;
}

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Disable browser's native scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
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
