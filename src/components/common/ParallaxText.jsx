import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ParallaxText = ({ 
  text, 
  variant = "onyx", // "onyx", "bronze", "gold"
  className = "",
  fontSize = "text-6xl md:text-8xl lg:text-9xl"
}) => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  const variants = {
    onyx: { x: "0%", brightness: "brightness(1)" },
    bronze: { x: "50%", brightness: "brightness(1)" },
    gold: { x: "100%", brightness: "brightness(1)" }
  };

  const currentVariant = variants[variant] || variants.onyx;

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      <motion.span 
        className={`block text-transparent bg-clip-text font-bold font-heading tracking-[-0.02em] ${fontSize}`}
        style={{ 
          backgroundImage: "url('/images/role-multitone.png')",
          backgroundSize: "300% auto",
          backgroundPositionX: currentVariant.x,
          backgroundPositionY: backgroundY,
          WebkitBackgroundClip: "text",
          filter: currentVariant.brightness
        }}
      >
        {text}
      </motion.span>
    </div>
  );
};

export default ParallaxText;
