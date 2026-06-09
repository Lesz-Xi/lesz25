import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Cursor = () => {
    // ... existing refs and state ...
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isLightTheme, setIsLightTheme] = useState(false);
    const [hasPointerMoved, setHasPointerMoved] = useState(false);
    const hasPointerMovedRef = useRef(false);
    
    useGSAP(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        if (!cursor || !follower) return;

        // Center the cursor elements initially (off-screen to avoid flash)
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        gsap.set(follower, { xPercent: -50, yPercent: -50 });

        const xSet = gsap.quickSetter(cursor, "x", "px");
        const ySet = gsap.quickSetter(cursor, "y", "px");
        const xSetFollower = gsap.quickSetter(follower, "x", "px");
        const ySetFollower = gsap.quickSetter(follower, "y", "px");

        const moveCursor = (e) => {
            if (!hasPointerMovedRef.current) {
                hasPointerMovedRef.current = true;
                setHasPointerMoved(true);
            }

            xSet(e.clientX);
            ySet(e.clientY);
            xSetFollower(e.clientX);
            ySetFollower(e.clientY);
        };

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
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className={`hidden md:block fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] transition-opacity duration-200 ${
            hasPointerMoved ? "opacity-100" : "opacity-0"
        } ${
            isLightTheme ? "bg-[#FFFCE1]" : "bg-[#DBD5B5]"
        }`}
      />
      <div
        ref={followerRef}
        className={`hidden md:block fixed top-0 left-0 rounded-full pointer-events-none z-[9998] transition-[width,height,opacity,background-color,backdrop-filter,border-color] duration-200 ease-out 
        shadow-[0_4px_30px_rgba(0,0,0,0.1)]
        ${hasPointerMoved ? "opacity-100" : "opacity-0"}
        ${
          isLightTheme 
            ? "mix-blend-difference bg-[#FFFCE1]" // Light Theme: Difference mode inverts colors (Cream cursor -> Dark on BG, Light on Text)
            : "backdrop-brightness-150 border-white/[0.05] bg-white/[0.01]" // Dark Theme: Brightness
        }
        ${
          isHovering
            ? "w-20 h-20 " + (isLightTheme ? "" : "bg-white/[0.08]")
            : "w-8 h-8"
        }`}
      />
    </>
  );
};

export default Cursor;
