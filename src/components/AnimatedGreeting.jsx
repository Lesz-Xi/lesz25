import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const greetings = ["Hi", "Hallo", "Bonjour", "Annyeong", "Kumusta"];

const AnimatedGreeting = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 2) % greetings.length);
    }, 3000); // Change greeting every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={greetings[currentIndex]}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        style={{ display: "inline-block" }}
      >
        {greetings[currentIndex]},
      </motion.span>
    </AnimatePresence>
  );
};

export default AnimatedGreeting;
