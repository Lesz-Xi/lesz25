import React, { useState, useEffect, Suspense } from "react";
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
        return; // Don't scroll to top
      }
    }
    
    // For album pages, save the photography scroll position before navigating
    if (pathname.startsWith('/photography/') && previousPath === '/photography') {
      // Position was already saved by PhotographyPage
    }
    
    // For other navigations, scroll to top
    if (!pathname.startsWith('/photography/') || previousPath !== '/photography') {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
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
  
  // Force scroll to top using Lenis
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, [albumId]);
  
  // The key prop forces a complete remount when albumId changes
  return <AlbumDisplay key={albumId} />;
}

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
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
