import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UplinkCookie = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const fullText = "INCOMING SECURE TRANSMISSION // DAEMON_V4";

  // Text Scramble Effect
  useEffect(() => {
    if (!isVisible) return;
    
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        fullText
          .split("")
          .map((letter, index) => {
            if (index < iteration) return fullText[index];
            return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"[Math.floor(Math.random() * 26)];
          })
          .join("")
      );

      if (iteration >= fullText.length) clearInterval(interval);
      iteration += 1 / 2; // Scramble speed
    }, 30);

    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    const consent = localStorage.getItem("uplink_status");
    if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 3500);
        return () => clearTimeout(timer);
    }
  }, []);

  const handleInitialize = () => {
    localStorage.setItem("uplink_status", "established");
    setIsVisible(false);
  };

  const handleAbort = () => {
    localStorage.setItem("uplink_status", "aborted");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)", transition: { duration: 0.4 } }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // Custom cubic bezier
          className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-[100] max-w-[340px] w-full perspective-1000"
        >
          {/* Glass Panel 2041 Style - No strict borders, just light and glass */}
          <div className="relative bg-[#0A0A0A]/60 backdrop-blur-xl border-t border-l border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] p-8 overflow-hidden rounded-2xl group">
            
            {/* Holographic Gradient Blob */}
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_50%_50%,rgba(199,181,128,0.03),transparent_70%)] pointer-events-none"></div>

            {/* Asymmetric Tech Markers (Clean, thin) */}
            <div className="absolute top-4 left-4 w-[2px] h-2 bg-[#C7B580]/60"></div>
            <div className="absolute top-4 left-4 w-2 h-[2px] bg-[#C7B580]/60"></div>
            <div className="absolute bottom-4 right-4 w-[2px] h-2 bg-[#C7B580]/60"></div>
            <div className="absolute bottom-4 right-4 w-2 h-[2px] bg-[#C7B580]/60"></div>

            <div className="flex flex-col gap-5 relative z-10">
                {/* Header with Live Scramble */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C7B580] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C7B580]"></span>
                        </span>
                        <span className="font-geist-mono text-[9px] tracking-[0.2em] text-[#C7B580]/60 uppercase">
                            {displayText}
                        </span>
                    </div>
                    <h3 className="font-display font-medium text-xl text-white tracking-wide">
                        Establish Uplink?
                    </h3>
                </div>

                <p className="font-sans text-sm text-neutral-400 leading-relaxed font-light">
                    Initiate secure telemetry feedback loop. This data optimizes the neural interface for your session.
                </p>

                {/* 2041 Controls - Minimal, High Contrast */}
                <div className="flex items-center gap-4 pt-2">
                    <button 
                        onClick={handleInitialize}
                        className="flex-1 group relative px-4 py-3 bg-[#C7B580]/10 hover:bg-[#C7B580]/20 overflow-hidden transition-all duration-300"
                    >
                        <div className="absolute inset-0 w-full h-[1px] top-0 bg-gradient-to-r from-transparent via-[#C7B580]/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="font-geist-mono text-[10px] uppercase tracking-[0.2em] text-[#C7B580] group-hover:text-white transition-colors">
                            [ Initialize ]
                        </span>
                    </button>
                    
                    <button 
                        onClick={handleAbort}
                        className="px-4 py-3 text-neutral-500 hover:text-white transition-colors duration-300"
                    >
                        <span className="font-geist-mono text-[10px] uppercase tracking-widest relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-white/30 hover:after:w-full after:transition-all after:duration-300">
                            Deny
                        </span>
                    </button>
                </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UplinkCookie;
