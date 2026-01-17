import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const RoleShowcase = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    // Reset any previous animations
    const roles = gsap.utils.toArray(".role-item");
    const svgContainer = containerRef.current.querySelector(".designer-svg-container");
    
    gsap.set(roles, { clearProps: "all" });
    // Performance optimization: Hints for browser
    gsap.set([...roles, svgContainer], { willChange: "transform, opacity, filter" });
    // Ensure SVG container is visible globally (children manage their own opacity)
    gsap.set(svgContainer, { opacity: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=500%", // Pin for 5 screen heights to accommodate 4 roles
        scrub: 0.5,    // Reduced from 1.5 for snappier response
        pin: true,
      }
    });

    // --- ANIMATION TIMELINE ---
    // Select Elements for all 3 roles
    const devSvg = containerRef.current.querySelector("#dev-svg");
    const photoSvg = containerRef.current.querySelector("#photo-svg");
    const designerSvg = containerRef.current.querySelector("#designer-svg");
    const researcherSvg = containerRef.current.querySelector("#researcher-svg");
    const curlyLine = containerRef.current.querySelector("#curly-line");
    const star = containerRef.current.querySelector(".designer-star");

    // Total Duration: +=500% (Implied 0s to ~10s scrub time, but we control relative time)
    // Structure:
    // Act 1 (Dev): 0.0s -> 1.5s
    // Act 2 (Photo): 2.0s -> 3.5s
    // Act 3 (Designer): 4.0s -> 6.0s
    // Act 4 (Researcher): 6.5s -> 8.5s
    
    // --- ACT 1: DEVELOPER --- 
    // Initial State: Dev Text is Visible (Static), SVG Hidden
    // 0.0->0.5: Brackets Enter
    const devTl = gsap.timeline();
    tl.add(devTl, 0);

    devTl.fromTo(devSvg, 
        { autoAlpha: 0, scale: 1.2 }, 
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }, 
        0
    );

    // Light up DEVELOPER text from edges inwards (matching brackets)
    const devChars = containerRef.current.querySelectorAll(".developer-char");
    if (devChars.length > 0) {
        devTl.to(devChars, {
            opacity: 1,
            duration: 0.1,
            stagger: {
                from: "edges",
                amount: 0.3
            }
        }, 0.1); // Start slightly after brackets appear
    }
    
    // 1.0->1.5: Dev Exit (Text + SVG together)
    // Use autoAlpha: 0 to ensure display:none after fade
    tl.to(roles[0], { scale: 2, autoAlpha: 0, filter: "blur(10px)", ease: "power2.in", duration: 0.5 }, 1.0);
    tl.to(devSvg, { scale: 0.8, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 1.0);


    // --- ACT 2: PHOTOGRAPHER ---
    // Gap 1.5s -> 2.0s (Clean Slate)
    
    // 2.0->2.5: Photo Enter (Text + Viewfinder)
    tl.fromTo(roles[1], 
        { scale: 0.5, autoAlpha: 0, filter: "blur(10px)", pointerEvents: "none" },
        { scale: 1, autoAlpha: 1, filter: "blur(0px)", pointerEvents: "auto", ease: "power2.out", duration: 0.5 },
        2.0 
    );
    tl.fromTo(photoSvg,
        { scale: 1.5, autoAlpha: 0 }, 
        { scale: 1, autoAlpha: 1, duration: 0.5, ease: "power4.out" }, 
        2.0
    );
    
    // 3.0->3.5: Photo Exit
    tl.to(roles[1], { scale: 2, autoAlpha: 0, filter: "blur(10px)", ease: "power2.in", duration: 0.5 }, 3.0); 
    tl.to(photoSvg, { scale: 1.1, autoAlpha: 0, duration: 0.5 }, 3.0);


    // --- ACT 3: DESIGNER ---
    // Gap 3.5s -> 4.0s (Clean Slate)

    // 4.0->4.5: Designer Enter (Text + Flower)
    tl.fromTo(roles[2], 
        { scale: 0.5, autoAlpha: 0, filter: "blur(10px)", pointerEvents: "none" },
        { scale: 1, autoAlpha: 1, filter: "blur(0px)", pointerEvents: "auto", ease: "power2.out", duration: 0.5 },
        4.0 
    );
    const designerTl = gsap.timeline();
    tl.add(designerTl, 4.0); // Sync SVG start with Text Start
    
    designerTl.fromTo(designerSvg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0);

    // 4.0->5.5: Drawing Line & Flower
    if (curlyLine && star) {
        // Draw the line
        designerTl.fromTo(curlyLine, 
            { strokeDashoffset: 1 }, 
            { strokeDashoffset: 0, duration: 1.5, ease: "power3.inOut" }, 
            0
        );
        
        // Get character elements for position-based lighting
        const chars = containerRef.current.querySelectorAll(".designer-char");
        const litChars = new Set(); // Track which chars have been lit
        
        // Star Motion with onUpdate for position-based lighting
        designerTl.to(star, {
            motionPath: {
                path: "#curly-line",
                align: "#curly-line",
                alignOrigin: [0.5, 0.5],
                autoRotate: true,
                start: 0,
                end: 1
            },
            duration: 1.5, 
            ease: "power3.inOut",
            onUpdate: function() {
                // Get flower's current X position (screen coordinates)
                const flowerRect = star.getBoundingClientRect();
                const flowerCenterX = flowerRect.left + flowerRect.width / 2;
                
                // Check each character's horizontal position
                chars.forEach((char) => {
                    const charRect = char.getBoundingClientRect();
                    const charCenterX = charRect.left + charRect.width / 2;
                    
                    // Logic: If flower is to the right of the character (with small threshold), it is "lit"
                    // -20px threshold means it lights up slightly before the flower center hits the char center
                    const isPassed = flowerCenterX > (charCenterX - 20);
                    
                    if (isPassed && !char._isLit) {
                        char._isLit = true;
                        gsap.to(char, { opacity: 1, duration: 0.3, ease: "power2.out", overwrite: true });
                    } else if (!isPassed && char._isLit) {
                        char._isLit = false;
                        gsap.to(char, { opacity: 0.3, duration: 0.3, ease: "power2.out", overwrite: true });
                    }
                });
            }
        }, 0); 
    }
    
    // 5.5->6.0: Designer Exit
    tl.to(roles[2], { scale: 10, autoAlpha: 0, filter: "blur(20px)", ease: "power2.in", duration: 0.5 }, 5.5);
    tl.to(designerSvg, { scale: 10, autoAlpha: 0, filter: "blur(20px)", ease: "power2.in", duration: 0.5 }, 5.5);


    // --- ACT 4: RESEARCHER ---
    // Gap 6.0s -> 6.5s (Clean Slate)

    // 6.5->7.0: Researcher Enter (Text + Initial Nodes)
    tl.fromTo(roles[3], 
        { scale: 0.5, autoAlpha: 0, filter: "blur(10px)", pointerEvents: "none" },
        { scale: 1, autoAlpha: 1, filter: "blur(0px)", pointerEvents: "auto", ease: "power2.out", duration: 0.5 },
        6.5
    );

    const researcherTl = gsap.timeline();
    tl.add(researcherTl, 6.5);

    // Fade in SVG container
    researcherTl.fromTo(researcherSvg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0);

    // 6.5->7.5: Molecular Network Assembly
    if (researcherSvg) {
        const nodes = researcherSvg.querySelectorAll(".node");
        const connections = researcherSvg.querySelectorAll("[id^='conn-']");
        const researcherChars = containerRef.current.querySelectorAll(".researcher-char");

        // Appear nodes sequentially with slight stagger
        researcherTl.to(nodes, {
            opacity: 1,
            duration: 0.1,
            stagger: 0.08,
            ease: "power2.out"
        }, 0.2);

        // Draw connection lines with stagger
        researcherTl.to(connections, {
            opacity: 0.8,
            strokeDashoffset: 0,
            duration: 0.15,
            stagger: 0.1,
            ease: "power2.inOut"
        }, 0.5);

        // Add pulsing effect to nodes (discovery feel)
        researcherTl.to(nodes, {
            opacity: 0.6,
            yoyo: true,
            repeat: 2,
            duration: 0.3,
            stagger: 0.05,
            ease: "power1.inOut"
        }, 1.2);

        // Light up characters as network assembles
        if (researcherChars.length > 0) {
            researcherTl.to(researcherChars, {
                opacity: 1,
                duration: 0.1,
                stagger: {
                    amount: 0.6,
                    from: "center"
                },
                ease: "power2.out"
            }, 1.0);
        }
    }

    // 8.0->8.5: Researcher Exit
    tl.to(roles[3], { scale: 2, autoAlpha: 0, filter: "blur(10px)", ease: "power2.in", duration: 0.5 }, 8.0);
    tl.to(researcherSvg, { scale: 1.5, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 8.0);
    
    tl.to(contentRef.current, { autoAlpha: 0, duration: 0.5 }, 8.5); // End scene

  }, { scope: containerRef });


  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center z-20"
    >
        {/* Centered SVG Overlay - Independent of Text */}
        <div className="designer-svg-container absolute w-[140%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-0 mix-blend-screen flex items-center justify-center">
             <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="flower-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F4BFDB" /> {/* Soft Pink */}
                        <stop offset="100%" stopColor="#F68F55" /> {/* Vibrant Orange */}
                    </linearGradient>
                </defs>

                {/* --- DEVELOPER: Code Brackets { } --- */}
                <g id="dev-svg" className="opacity-0">
                    <path d="M 120,60  C 100,60 100,80 80,100 C 100,120 100,140 120,140" fill="none" stroke="#DBD5B5" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 280,60  C 300,60 300,80 320,100 C 300,120 300,140 280,140" fill="none" stroke="#DBD5B5" strokeWidth="2" strokeLinecap="round" />
                    {/* Clean look: No cursor to avoid distraction */}
                </g>

                {/* --- PHOTOGRAPHER: Viewfinder [ ] --- */}
                <g id="photo-svg" className="opacity-0">
                    {/* Corners */}
                    {/* TL */} <path d="M 80,80 L 80,50 L 110,50" fill="none" stroke="#DBD5B5" strokeWidth="2" /> 
                    {/* TR */} <path d="M 290,50 L 320,50 L 320,80" fill="none" stroke="#DBD5B5" strokeWidth="2" />
                    {/* BL */} <path d="M 80,120 L 80,150 L 110,150" fill="none" stroke="#DBD5B5" strokeWidth="2" />
                    {/* BR */} <path d="M 320,120 L 320,150 L 290,150" fill="none" stroke="#DBD5B5" strokeWidth="2" />
                    {/* Clean look: No red REC dot */}
                </g>

                <g id="designer-svg" className="opacity-0">
                     {/* Refined Curly Line: Restored S-Curve shape, shifted down (y=150) to avoid text */}
                    <path 
                        id="curly-line"
                        d="M 50,150 C 100,150 80,130 120,130 S 180,170 220,150 S 300,130 350,150" 
                        fill="none" 
                        stroke="#C7B580" 
                        strokeWidth="2"
                        className="opacity-60"
                        pathLength="1"
                        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                    />
                    
                    {/* 8-Petal Flower Shape */}
                    <g className="designer-star" style={{ transformOrigin: "center center" }}>
                        <path 
                            d="M0,0 
                               C2,-8 6,-12 0,-20 C-6,-12 -2,-8 0,0 
                               C8,-2 12,-6 20,0 C12,6 8,2 0,0 
                               C2,8 6,12 0,20 C-6,12 -2,8 0,0 
                               C-8,2 -12,6 -20,0 C-12,-6 -8,-2 0,0 
                               C6,-6 10,-10 14,-14 C10,-14 6,-10 0,0
                               C6,6 10,10 14,14 C10,14 6,10 0,0
                               C-6,6 -10,10 -14,14 C-10,14 -6,10 0,0
                               C-6,-6 -10,-10 -14,-14 C-10,-14 -6,-10 0,0 Z"
                            fill="url(#flower-gradient)"
                            transform="scale(1.2)" 
                        />
                        <circle cx="0" cy="0" r="4" fill="#F68F55" />
                    </g>
                </g>

                {/* --- RESEARCHER: Molecular Network --- */}
                <g id="researcher-svg" className="opacity-0">
                    <defs>
                        <linearGradient id="molecule-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B7E66" />
                            <stop offset="100%" stopColor="#DBD5B5" />
                        </linearGradient>
                    </defs>
                    
                    {/* Connection Lines (will animate in) */}
                    <g className="molecule-connections">
                        <line id="conn-1" x1="200" y1="60" x2="250" y2="80" stroke="url(#molecule-gradient)" strokeWidth="1.5" opacity="0" pathLength="1" style={{strokeDasharray: 1, strokeDashoffset: 1}} />
                        <line id="conn-2" x1="250" y1="80" x2="300" y2="60" stroke="url(#molecule-gradient)" strokeWidth="1.5" opacity="0" pathLength="1" style={{strokeDasharray: 1, strokeDashoffset: 1}} />
                        <line id="conn-3" x1="200" y1="60" x2="180" y2="100" stroke="url(#molecule-gradient)" strokeWidth="1.5" opacity="0" pathLength="1" style={{strokeDasharray: 1, strokeDashoffset: 1}} />
                        <line id="conn-4" x1="300" y1="60" x2="320" y2="100" stroke="url(#molecule-gradient)" strokeWidth="1.5" opacity="0" pathLength="1" style={{strokeDasharray: 1, strokeDashoffset: 1}} />
                        <line id="conn-5" x1="180" y1="100" x2="220" y2="130" stroke="url(#molecule-gradient)" strokeWidth="1.5" opacity="0" pathLength="1" style={{strokeDasharray: 1, strokeDashoffset: 1}} />
                        <line id="conn-6" x1="320" y1="100" x2="280" y2="130" stroke="url(#molecule-gradient)" strokeWidth="1.5" opacity="0" pathLength="1" style={{strokeDasharray: 1, strokeDashoffset: 1}} />
                        <line id="conn-7" x1="220" y1="130" x2="280" y2="130" stroke="url(#molecule-gradient)" strokeWidth="1.5" opacity="0" pathLength="1" style={{strokeDasharray: 1, strokeDashoffset: 1}} />
                        <line id="conn-8" x1="250" y1="80" x2="250" y2="130" stroke="url(#molecule-gradient)" strokeWidth="1.5" opacity="0" pathLength="1" style={{strokeDasharray: 1, strokeDashoffset: 1}} />
                    </g>
                    
                    {/* Nodes (atoms) */}
                    <g className="molecule-nodes">
                        <circle className="node" cx="200" cy="60" r="4" fill="#8B7E66" opacity="0" />
                        <circle className="node" cx="250" cy="80" r="5" fill="#9d8f75" opacity="0" />
                        <circle className="node" cx="300" cy="60" r="4" fill="#8B7E66" opacity="0" />
                        <circle className="node" cx="180" cy="100" r="3.5" fill="#DBD5B5" opacity="0" />
                        <circle className="node" cx="320" cy="100" r="3.5" fill="#DBD5B5" opacity="0" />
                        <circle className="node" cx="220" cy="130" r="4" fill="#8B7E66" opacity="0" />
                        <circle className="node" cx="280" cy="130" r="4" fill="#8B7E66" opacity="0" />
                        <circle className="node" cx="250" cy="130" r="5" fill="#9d8f75" opacity="0" />
                    </g>
                </g>
             </svg>
        </div>

      <div ref={contentRef} className="relative z-10 w-full h-full flex items-center justify-center transform-gpu will-change-transform">
        
        {/* Roles positioned absolutely in center */}
        {/* Role 1 */}
        {/* Role 1 */}
        <div className="role-item absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-[10vw] md:text-[12vw] leading-none font-bold font-pixel tracking-tighter uppercase text-[#DBD5B5] whitespace-nowrap">
                {"DEVELOPER".split("").map((char, index) => (
                    <span key={index} className="developer-char inline-block opacity-30">
                        {char}
                    </span>
                ))}
            </h2>
        </div>

        {/* Role 2 */}
        <div className="role-item absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-0">
            <h2 className="text-[8vw] md:text-[12vw] leading-none font-bold font-pixel tracking-tighter uppercase text-[#DBD5B5] whitespace-nowrap">
                Photographer
            </h2>
        </div>

        {/* Role 3 */}
        <div className="role-item absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-0 flex flex-col items-center justify-center">
            <h2 className="text-[11vw] md:text-[12vw] leading-none font-bold font-pixel tracking-tighter uppercase text-[#C7B580] whitespace-nowrap z-10 relative">
                {"DESIGNER".split("").map((char, index) => (
                    <span key={index} className="designer-char inline-block opacity-30">
                        {char}
                    </span>
                ))}
            </h2>
        </div>

        {/* Role 4: Researcher */}
        <div className="role-item absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-0">
            <h2 className="text-[9vw] md:text-[12vw] leading-none font-bold font-pixel tracking-tighter uppercase text-[#8B7E66] whitespace-nowrap z-10 relative">
                {"RESEARCHER".split("").map((char, index) => (
                    <span key={index} className="researcher-char inline-block opacity-30">
                        {char}
                    </span>
                ))}
            </h2>
        </div>
      </div>

      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-noise-pattern"></div>
    </section>
  );
};

export default RoleShowcase;
