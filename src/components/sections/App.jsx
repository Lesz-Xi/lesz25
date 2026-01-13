import React, { useState, useEffect } from "react";
import Lenis from "lenis";
import Hero from "./Hero";
import ShowcaseSection from "../../ShowcaseSection";
import LogoSection from "./LogoSection";
import CareerSection from "./CareerSection";
import ContactSection from "./ContactSection";
import RoleShowcase from "./RoleShowcase";
import ProjectCarousel from "./ProjectCarousel";
import PhotographySection from "./PhotographySection";
import ServicesSection from "./ServicesSection";
import Navbar from "../Navbar";
import Footer from "../Footer";
import IntroAnimation from "../IntroAnimation";
import Cursor from "../Cursor";

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

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      {!showIntro && (
        <div className="bg-[#070707] min-h-screen cursor-none">
          <Cursor />
          <Navbar />
          <Hero />
          
          <div id="work">
             <ShowcaseSection />
          </div>

          <div id="roles">
             <RoleShowcase />
          </div>

          <ProjectCarousel />

          <PhotographySection />
          
          <ServicesSection />

          <div id="about">
             <CareerSection />
          </div>

          <LogoSection />

          <div id="contact">
             <ContactSection />
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

export default App;
