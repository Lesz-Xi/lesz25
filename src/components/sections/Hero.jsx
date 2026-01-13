import React, { useState } from "react";
import Button from "../Button";
import HeroExperience from "../HeroModels/HeroExperience";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Typewriter from "../Typewriter";
import AnimatedGreeting from "../AnimatedGreeting";

import {
  FaHome,
  FaProjectDiagram,
  FaBriefcase,
  FaEnvelope,
} from "react-icons/fa";
import Threads from "../Threads";

// Define constant outside component to prevent re-renders
const threadsColor = [0.96, 0.949, 0.921];

const Hero = () => {
  const [typingStep, setTypingStep] = useState(0);
  
  // Removed GSAP text animation to let Typewriter handle entry

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
          className="flex flex-col justify-center md:w-full w-screen
          md:px-20
          className="flex flex-col justify-center md:w-full w-screen
          md:px-20
          px-5 pt-32 md:pt-48 pb-20"
        >
          <div className="flex flex-col gap-7">
            <div className="hero-text min-h-[400px]"> {/* Min-height to prevent layout shift */}
              <h1 className="hero-line text-3xl md:text-5xl lg:text-6xl font-medium mb-6">
                <span className="text-[#929292] font-medium tracking-[0.05em] leading-[2]">
                  <AnimatedGreeting />
                  <br />
                  <Typewriter 
                    text="I'm" 
                    delay={1000} 
                    speed={100} 
                    cursor={false} 
                    onComplete={() => setTypingStep(1)}
                  />
                </span>{" "}
                {typingStep >= 1 && (
                  <span className="text-[#FFFCE1] font-display tracking-[0.02em] leading-[1.2]">
                    <Typewriter 
                      text="Rhine Tague." 
                      speed={100} 
                      cursor={true}
                      hideCursorOnComplete={true}
                      onComplete={() => setTypingStep(2)}
                    />
                  </span>
                )}
              </h1>

              {typingStep >= 2 && (
                <p className="hero-line font-heading text-[#929292] text-lg md:text-xl lg:text-2xl mb-20 max-w-3xl tracking-[0.05em] leading-[2]">
                  <Typewriter text="I'm a " speed={50} cursor={false} onComplete={() => setTypingStep(3)} />
                  
                  {typingStep >= 3 && (
                    <span className="text-[#FFFCE1]">
                      <Typewriter text="developer" speed={50} cursor={false} onComplete={() => setTypingStep(4)} />
                    </span>
                  )}
                  
                  {typingStep >= 4 && (
                    <Typewriter text=" and " speed={50} cursor={false} onComplete={() => setTypingStep(5)} />
                  )}

                  {typingStep >= 5 && (
                    <span className="text-[#FFFCE1]">
                      <Typewriter text="photographer" speed={50} cursor={false} onComplete={() => setTypingStep(6)} />
                    </span>
                  )}
                  
                  {typingStep >= 6 && (
                    <Typewriter text=" based in the " speed={50} cursor={false} onComplete={() => setTypingStep(7)} />
                  )}

                  {typingStep >= 7 && (
                    <span className="text-[#FFFCE1]">
                      <Typewriter text="Philippines" speed={50} cursor={false} onComplete={() => setTypingStep(8)} />
                    </span>
                  )}
                  
                  {typingStep >= 8 && (
                    <Typewriter 
                      text=". I focus on building clean, user-friendly experiences that make complex ideas simple, effective, and meaningful." 
                      speed={30} 
                      cursor={true}
                      hideCursorOnComplete={true}
                    />
                  )}
                </p>
              )}
            </div>

            <Button
              className="md:w-80 md:h-16 w-60 h-12 mt-8"
              id="button"
              text="See my Work"
            />

            {/* Threads component below the button */}
            <div className="w-full h-[400px] -mt-12 relative opacity-100 mix-blend-screen pointer-events-none">
              <Threads
                amplitude={2.5}
                distance={1}
                enableMouseInteraction={false}
                color={threadsColor}
              />
            </div>
          </div>
        </header>
        {/*RIGHT: 3D MODEL */}
        <figure>
          <div className="hero-3d-layout">
            <HeroExperience />
          </div>
        </figure>
      </div>
    </section>
  );
};

export default Hero;
