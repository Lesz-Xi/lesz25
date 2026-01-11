"use client";

import {
  motion, // eslint-disable-line no-unused-vars
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Children, cloneElement, useEffect, useRef, useState } from "react";
import { playHoverSound } from "../utils/soundUtils";

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => {
        isHovered.set(1);
        playHoverSound();
      }}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-[#060014] border-neutral-700 border-1 shadow-md transition-colors ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) => cloneElement(child, { isHovered }))}
    </motion.div>
  );
}

function DockLabel({ children, className = "", ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -bottom-6 left-1/2 w-fit whitespace-pre rounded-md border border-neutral-700  bg-[#060010] px-2 py-0.5 text-xs text-[#FFFCE1]`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "", isHovered }) {
  const [isHoveredState, setIsHoveredState] = useState(false);

  useEffect(() => {
    if (isHovered) {
      const unsubscribe = isHovered.on("change", (latest) => {
        setIsHoveredState(latest === 1);
      });
      return () => unsubscribe();
    }
  }, [isHovered]);

  return (
    <div
      className={`flex items-center justify-center transition-colors duration-200 ${
        isHoveredState ? "text-[#FFFCE1]" : "text-gray-200"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.0, stiffness: 150, damping: 12 },
  magnification = 50,
  distance = 200,
  panelHeight = 68,
  baseItemSize = 10,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  // const { scrollY } = useScroll();
  const dockOpacity = useSpring(1, { stiffness: 300, damping: 30 });
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Check if user is at bottom
  useEffect(() => {
    const checkScrollPosition = () => {
      // Check if user has scrolled to the bottom
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Consider "bottom" when within 100px of actual bottom
      const threshold = 100;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - threshold);
    };

    window.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition();

    return () => window.removeEventListener("scroll", checkScrollPosition);
  }, []);

  // Update opacity based on scroll state
  useEffect(() => {
    if (isAtBottom) {
      dockOpacity.set(0.1); // Very transparent at bottom
    } else {
      dockOpacity.set(0.8); // Consistent opacity for all other sections
    }
  }, [isAtBottom, dockOpacity]);

  return (
    <motion.div
      style={{
        height: panelHeight,
        scrollbarWidth: "none",
        opacity: dockOpacity,
      }}
      className="mx-2 flex max-w-full items-center justify-center fixed top-2 left-0 right-0 z-20 transition-opacity duration-400"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`${className} flex items-center w-fit gap-5 rounded-2xl border-neutral-700 border-1 px-2 backdrop-blur-md bg-[#060010]/80`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
