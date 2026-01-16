import React, { useState, Suspense, useEffect, lazy, useCallback } from "react";
import Button from "../Button";

// Lazy load components
const HeroExperience = lazy(() => import("../HeroModels/HeroExperience"));
const Threads = lazy(() => import("../Threads"));

import AnimatedGreeting from "../AnimatedGreeting";
import ScrollIndicator from "../ScrollIndicator";

import {
  FaHome,
  FaProjectDiagram,
  FaBriefcase,
  FaEnvelope,
} from "react-icons/fa";

// Define constant outside component to prevent re-renders
const threadsColor = [0.96, 0.949, 0.921];

const Hero = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Check for desktop viewport - prevents 3D model from loading on mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);
    
    const handler = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  
  const navItems = [
    {
      icon: <FaHome size={18} />,
      label: "Home",
      onClick: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    },
    {
      icon: <FaProjectDiagram size={18} />,
      label: "Projects",
      onClick: () => {
        const projectsSection = document.getElementById("work");
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
    {
      icon: <FaBriefcase size={18} />,
      label: "Journey",
      onClick: () => {
        const careerSection = document.getElementById("career");
        if (careerSection) {
          careerSection.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
    {
      icon: <FaEnvelope size={18} />,
      label: "Contact",
      onClick: () => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
  ];

  return (
    <section id="hero" className="relative overflow-hidden min-h-screen flex items-start">


      <div className="absolute top-0 left-0 z-10"></div>

      <div className="hero-layout w-full">
        {/*LEFT: HERO CONTENT */}
        <header
          className="flex flex-col md:w-full w-screen
          md:px-20
          px-5 pt-10 md:pt-48 pb-16"
        >
          <div className="flex flex-col gap-5">
            <div className="hero-text min-h-[320px] md:min-h-[400px]"> {/* Reduced min-height on mobile */}
              <h1 className="hero-line text-3xl md:text-5xl lg:text-6xl font-medium mb-6">
                <span className="text-[#929292] font-medium tracking-[0.05em] leading-[2]">
                  <span className="text-[#FFFCE1]"><AnimatedGreeting /></span>
                  <br />
                  I'm
                </span>{" "}
                <span className="text-[#FFFCE1] font-display tracking-[0.02em] leading-[1.2]">
                  Rhine Tague.
                </span>
              </h1>

              <p className="hero-line font-heading text-[#929292] text-lg md:text-xl lg:text-2xl mb-10 md:mb-20 max-w-3xl tracking-[0.05em] leading-[2]">
                I'm a <span className="text-[#FFFCE1]">developer</span> and <span className="text-[#FFFCE1]">photographer</span> based in the <span className="text-[#FFFCE1]">Philippines</span>. I focus on building clean, user-friendly experiences that make complex ideas simple, effective, and meaningful.
              </p>
            </div>

            {/* Threads component - fixed height prevents CLS, deferred load */}
            <div className="w-screen h-[400px] min-h-[400px] -mt-12 -ml-5 md:-ml-20 relative mix-blend-screen pointer-events-none">
              {isDesktop && (
                <Suspense fallback={null}>
                  <Threads
                    amplitude={2.5}
                    distance={1}
                    enableMouseInteraction={false}
                    color={threadsColor}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </header>

        {/* Scroll Indicator - Absolute Bottom Center */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <ScrollIndicator onClick={() => {
            const workSection = document.getElementById("work");
            if (workSection) {
              workSection.scrollIntoView({ behavior: "smooth" });
            }
          }} />
        </div>
        {/*RIGHT: 3D MODEL */}
        {isDesktop && (
          <figure className="hidden md:block">
            <div className="hero-3d-layout">
              <Suspense fallback={null}>
                <HeroExperience />
              </Suspense>
            </div>
          </figure>
        )}
      </div>
    </section>
  );
};

export default Hero;
