import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";

const NotFound = () => {
  const containerRef = useRef(null);
  const particleRef = useRef(null);
  const textRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Particle Interaction (Lost Star)
    const handleMouseMove = (e) => {
      // Calculate normalized position (-1 to 1) for parallax
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      
      setMousePosition({ x, y });
      
      // Move the particle slightly towards mouse but with lag
      gsap.to(particleRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 1.5,
        ease: "power3.out"
      });

      // Tilt text based on mouse
      gsap.to(textRef.current, {
        rotationX: -y * 10,
        rotationY: x * 10,
        x: x * 20,
        y: y * 20,
        duration: 2,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center cursor-none perspective-1000"
    >
        {/* Floating Particle (The Guide) */}
        <div 
            ref={particleRef} 
            className="fixed top-0 left-0 w-3 h-3 bg-[#F68F55] rounded-full blur-[2px] pointer-events-none z-50 mix-blend-screen shadow-[0_0_20px_#F68F55]"
            style={{ transform: "translate(-50%, -50%)" }}
        />

        {/* Glitchy Text Container */}
        <div ref={textRef} className="relative z-10 text-center select-none transform-style-3d">
            <h1 className="text-[15vw] md:text-[20vw] leading-none font-bold font-pixel tracking-tighter text-[#DBD5B5] opacity-20 glitch-text">
                404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                <p className="text-xl md:text-3xl font-display text-[#C7B580] tracking-widest uppercase mb-8">
                    Signal Lost
                </p>
                <div className="h-px w-24 bg-[#C7B580]/50 mx-auto mb-8"></div>
                <Link 
                    to="/" 
                    className="inline-block relative group"
                >
                    <span className="relative z-10 px-8 py-3 bg-[#DBD5B5] text-black font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-white transition-colors duration-300">
                        Return to Signal
                    </span>
                    <span className="absolute inset-0 border border-[#DBD5B5] translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></span>
                </Link>
            </div>
        </div>

        {/* Scanlines / Noise Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] z-20"></div>
        <div className="absolute inset-0 pointer-events-none z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat pointer-events-none"></div>

        {/* Code Snippets (Ghostly) */}
        <div className="absolute bottom-10 left-10 md:left-20 font-mono text-[10px] text-[#DBD5B5]/20 text-left space-y-1 hidden md:block">
            <p>{`> locating_target(User) ... failed`}</p>
            <p>{`> recalibrating_matrix ... failed`}</p>
            <p>{`> dimensional_rift_detected: TRUE`}</p>
        </div>
    </div>
  );
};

export default NotFound;
