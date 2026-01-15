import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Cursor = () => {
    // ... existing refs and state ...
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isLightTheme, setIsLightTheme] = useState(false);
    
    // Track the last played target to prevent spamming
    const lastPlayedTarget = useRef(null);

    useGSAP(() => {
        // ... (existing GSAP setup code unchanged) ...
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        if (!cursor || !follower) return;

        // Center the cursor elements initially (off-screen to avoid flash)
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        gsap.set(follower, { xPercent: -50, yPercent: -50 });

        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const mouse = { x: pos.x, y: pos.y }; // Renamed from mouse to avoid confusion in this scope if needed, but keeping local var is fine.
        const speed = 0.15; 

        let hoverTarget = null;

        const xSet = gsap.quickSetter(cursor, "x", "px");
        const ySet = gsap.quickSetter(cursor, "y", "px");
        const xSetFollower = gsap.quickSetter(follower, "x", "px");
        const ySetFollower = gsap.quickSetter(follower, "y", "px");

        const moveCursor = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            xSet(mouse.x);
            ySet(mouse.y);
        };

        const tick = () => {
             // ... (existing tick code unchanged) ...
            let targetX = mouse.x;
            let targetY = mouse.y;

            if (isHovering && hoverTarget) {
                const rect = hoverTarget.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const strength = 0.3; 
                targetX = mouse.x + (centerX - mouse.x) * strength;
                targetY = mouse.y + (centerY - mouse.y) * strength;
            }

            pos.x += (targetX - pos.x) * speed;
            pos.y += (targetY - pos.y) * speed;
            xSetFollower(pos.x);
            ySetFollower(pos.y);
        };



    
    // ... existing refs ...

    // ... inside useGSAP ...
    
    const handleMouseOver = (e) => {
      const target = e.target;
      const tagName = target.tagName;
      
      // Check for light theme context
      const lightThemeSection = target.closest('[data-theme="light"]');
      setIsLightTheme(!!lightThemeSection);

      const textTags = ["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "A", "BUTTON", "LABEL", "INPUT", "TEXTAREA", "STRONG", "EM", "B", "I", "BLOCKQUOTE", "TH", "TD"];
      const isTextTag = textTags.includes(tagName);
      const isInteractive = target.closest("[data-hover]") || tagName === "BUTTON" || tagName === "A" || tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "ACRONYM"; 
      
      // Check for plain text divs
      const isTextDiv = tagName === 'DIV' && target.childNodes.length === 1 && target.childNodes[0].nodeType === 3 && target.textContent.trim().length > 0;

      if (isTextTag || isInteractive || isTextDiv) {
        setIsHovering(true);
        hoverTarget = isInteractive || target; 
      } else {
        setIsHovering(false);
        hoverTarget = null;
        lastPlayedTarget.current = null;
      }
    };

    window.addEventListener("mousemove", moveCursor);
    gsap.ticker.add(tick);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      gsap.ticker.remove(tick);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className={`hidden md:block fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] transition-colors duration-300 ${
            isLightTheme ? "bg-[#0D0C1D]" : "bg-[#DBD5B5]"
        }`}
      />
      <div
        ref={followerRef}
        className={`hidden md:block fixed top-0 left-0 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out 
        shadow-[0_4px_30px_rgba(0,0,0,0.1)]
        ${
          isLightTheme 
            ? "border-[#0D0C1D]/20 bg-[#0D0C1D]/5" // Light Theme Styles: Dark faint circle matching brand color
            : "backdrop-brightness-150 border-white/[0.05] bg-white/[0.01]" // Dark Theme Styles: Brightness boost
        }
        ${
          isHovering
            ? "w-20 h-20 " + (isLightTheme ? "bg-[#0D0C1D]/10" : "bg-white/[0.08]")
            : "w-8 h-8"
        }`}
      />
    </>
  );
};

export default Cursor;
