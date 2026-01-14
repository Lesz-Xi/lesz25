/**
 * Cinematic Hero Component
 * 
 * A scroll-triggered hero section with zoom-out and brightness reveal.
 * Uses pinned scrolling for immersive effect.
 */
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
    <section 
      ref={container} 
      className="relative h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 w-full h-full">
        <img 
          ref={image} 
          src="/hero-image.jpg" 
          className="w-full h-full object-cover will-change-transform"
          alt="Hero background"
        />
      </div>
      
      <div ref={content} className="relative z-10 text-center text-white">
        <p className="uppercase tracking-[0.3em] text-xs mb-4 opacity-70">
          Portfolio
        </p>
        <h1 className="text-7xl font-light font-serif">
          Creative Developer
        </h1>
      </div>
    </section>
  );
};
