import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const TrueFocusCounter = ({
  value,
  suffix = "",
  label,
  manualMode = false,
  blurAmount = 3,
  borderColor = "#10b981",
  glowColor = "rgba(16, 185, 129, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
}) => {
  const [currentFocus, setCurrentFocus] = useState("value");
  const [lastActiveFocus, setLastActiveFocus] = useState(null);
  const containerRef = useRef(null);
  const valueRef = useRef(null);
  const labelRef = useRef(null);
  const [focusRect, setFocusRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(() => {
        setCurrentFocus((prev) => (prev === "value" ? "label" : "value"));
      }, (animationDuration + pauseBetweenAnimations) * 1000);

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations]);

  useEffect(() => {
    if (!containerRef.current) return;

    const targetRef =
      currentFocus === "value" ? valueRef.current : labelRef.current;
    if (!targetRef) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = targetRef.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentFocus]);

  const handleMouseEnter = (focus) => {
    if (manualMode) {
      setLastActiveFocus(focus);
      setCurrentFocus(focus);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentFocus(lastActiveFocus);
    }
  };

  return (
    <div
      className="relative bg-zinc-900 rounded-lg p-10 flex flex-col justify-center"
      ref={containerRef}
    >
      <div
        ref={valueRef}
        className="counter-number text-white text-5xl font-bold mb-2 cursor-pointer inline-block"
        style={{
          filter:
            currentFocus === "value" ? `blur(0px)` : `blur(${blurAmount}px)`,
          transition: `filter ${animationDuration}s ease`,
        }}
        onMouseEnter={() => handleMouseEnter("value")}
        onMouseLeave={handleMouseLeave}
      >
        <CountUp suffix={suffix} end={value} />
      </div>

      <div
        ref={labelRef}
        className="text-white-50 text-lg cursor-pointer inline-block"
        style={{
          filter:
            currentFocus === "label" ? `blur(0px)` : `blur(${blurAmount}px)`,
          transition: `filter ${animationDuration}s ease`,
        }}
        onMouseEnter={() => handleMouseEnter("label")}
        onMouseLeave={handleMouseLeave}
      >
        {label}
      </div>

      <motion.div
        className="absolute top-0 left-0 pointer-events-none box-border border-0"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: 1,
        }}
        transition={{
          duration: animationDuration,
        }}
        style={{
          "--border-color": borderColor,
          "--glow-color": glowColor,
        }}
      >
        <span
          className="absolute w-2 h-2 border-[2px] rounded-[2px] top-[-8px] left-[-8px] border-r-0 border-b-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        />
        <span
          className="absolute w-3 h-3 border-[2px] rounded-[2px] top-[-8px] right-[-8px] border-l-0 border-b-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        />
        <span
          className="absolute w-3 h-3 border-[2px] rounded-[2px] bottom-[-8px] left-[-8px] border-r-0 border-t-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        />
        <span
          className="absolute w-3 h-3 border-[2px] rounded-[2px] bottom-[-8px] right-[-8px] border-l-0 border-t-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        />
      </motion.div>
    </div>
  );
};

export default TrueFocusCounter;
