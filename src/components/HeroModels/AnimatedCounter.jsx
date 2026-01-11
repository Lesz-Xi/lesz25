import { counterItems } from "../../constants/index.js";
import { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import CountUp from "react-countup";

const AnimatedCounter = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const animationDuration = 1.5;
  const pauseBetweenAnimations = 0.5;
  const blurAmount = 3;
  const borderColor = "#929292";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % counterItems.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!itemRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = itemRefs.current[currentIndex].getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex]);

  return (
    <div id="counter" className="padding-x-lg xl:mt-0 mt-32 mb-1.5">
      <div className="mx-auto max-w-7xl">
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8 relative"
          ref={containerRef}
        >
          {counterItems.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={`counter-${index}`}
                ref={(el) => (itemRefs.current[index] = el)}
                className="bg-[#000000] rounded-lg p-6 md:p-8 xl:p-10 flex flex-col justify-center items-center text-center"
                style={{
                  filter: isActive ? `blur(0px)` : `blur(${blurAmount}px)`,
                  transition: `filter ${animationDuration}s ease`,
                }}
              >
                <div className="counter-number text-[#FFFCE1] text-4xl md:text-5xl font-bold mb-2">
                  <CountUp suffix={item.suffix} end={item.value} />
                </div>
                <div className="text-[#FFFCE1] text-base md:text-lg">
                  {item.label}
                </div>
              </div>
            );
          })}

          <motion.div
            className="absolute top-0 left-0 pointer-events-none box-border border-0 z-10"
            animate={{
              x: focusRect.x,
              y: focusRect.y,
              width: focusRect.width,
              height: focusRect.height,
              opacity: 1,
            }}
            transition={{
              duration: animationDuration,
              ease: "easeInOut",
            }}
          >
            <span
              className="absolute w-3 h-3 border-[2px] rounded-[2px] top-[-4px] left-[-4px] border-r-0 border-b-0"
              style={{
                borderColor: borderColor,
                filter: `drop-shadow(0 0 3px ${borderColor})`,
              }}
            />
            <span
              className="absolute w-3 h-3 border-[2px] rounded-[2px] top-[-4px] right-[-4px] border-l-0 border-b-0"
              style={{
                borderColor: borderColor,
                filter: `drop-shadow(0 0 3px ${borderColor})`,
              }}
            />
            <span
              className="absolute w-3 h-3 border-[2px] rounded-[2px] bottom-[-4px] left-[-4px] border-r-0 border-t-0"
              style={{
                borderColor: borderColor,
                filter: `drop-shadow(0 0 3px ${borderColor})`,
              }}
            />
            <span
              className="absolute w-3 h-3 border-[2px] rounded-[2px] bottom-[-4px] right-[-4px] border-l-0 border-t-0"
              style={{
                borderColor: borderColor,
                filter: `drop-shadow(0 0 3px ${borderColor})`,
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedCounter;
