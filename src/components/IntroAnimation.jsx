import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroAnimation = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsExiting(true), 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isExiting) {
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000); // Wait for the exit animation to complete
    }
  }, [isExiting, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } // Cinematic easeInOutQuart-like curve
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F5F2EB]"
        >
          {/* Main Logo / Name */}
          <div className="relative overflow-hidden mb-12">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="text-3xl md:text-6xl font-bold font-pixel tracking-[0.2em] md:tracking-[0.5em] text-[#0D0C1D] uppercase text-center"
            >
              RHINE TAGUE
            </motion.h1>
            
            {/* Subtitle - Synced with name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-6 flex justify-between items-center w-full px-1"
            >
              <div className="relative h-4 overflow-hidden flex-1">
                <AnimatePresence mode="wait">
                  {progress < 50 ? (
                    <motion.span
                      key="dev"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                      className="absolute left-0 text-[10px] font-bold tracking-[0.3em] font-heading uppercase text-[#0D0C1D]/40"
                    >
                      Developer
                    </motion.span>
                  ) : (
                    <motion.span
                      key="photo"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                      className="absolute left-0 text-[10px] font-bold tracking-[0.3em] font-heading uppercase text-[#0D0C1D]/40"
                    >
                      Photographer
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-[10px] font-bold font-heading text-[#8B7E66] ml-4">
                {progress}%
              </span>
            </motion.div>
          </div>

          {/* Minimalist Progress Bar */}
          <div className="w-48 md:w-64 h-[1px] bg-[#0D0C1D]/10 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
              className="absolute left-0 top-0 h-full bg-[#8B7E66]"
            />
          </div>

          {/* Architectural Decorative Element */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
            className="absolute top-[15%] left-0 w-full flex justify-center opacity-[0.05] pointer-events-none"
          >
            <div className="text-[15rem] font-bold font-pixel select-none">
              RT
            </div>
          </motion.div>

          {/* Background Texture Overlay */}
          {/* CSS-only noise texture - no external request */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-noise-pattern z-10"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
