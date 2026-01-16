import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UplinkCookie = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if uplink is already established (cookie consent given)
    const consent = localStorage.getItem("uplink_status");
    if (!consent) {
        // Small delay to let intro animation finish
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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.5 } }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] max-w-[300px] w-full"
        >
          {/* Container with Glassmorphism & Tech Borders */}
          <div className="relative bg-[#070707]/90 backdrop-blur-md border border-[#C7B580]/20 p-6 overflow-hidden group">
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#C7B580]/50"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#C7B580]/50"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#C7B580]/50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#C7B580]/50"></div>

            {/* Scanning Line Animation */}
            <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] bg-[#C7B580]/10 w-full pointer-events-none"
            />

            {/* Content */}
            <div className="flex flex-col gap-4 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#C7B580] rounded-full animate-pulse"></div>
                    <span className="font-pixel text-[10px] tracking-widest text-[#C7B580]/80 uppercase">
                        Incoming Transmission
                    </span>
                </div>

                {/* Text */}
                <p className="font-mono text-xs text-neutral-400 leading-relaxed">
                    Requesting permission to establish secure telemetry uplink for experience diagnostics.
                </p>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={handleInitialize}
                        className="flex-1 bg-[#C7B580]/10 hover:bg-[#C7B580]/20 border border-[#C7B580]/30 text-[#C7B580] font-mono text-[10px] py-2 px-3 uppercase tracking-wider transition-all duration-300 hover:tracking-widest"
                    >
                        [ Initialize ]
                    </button>
                    <button 
                        onClick={handleAbort}
                        className="bg-transparent hover:bg-white/5 border border-white/10 text-neutral-500 hover:text-neutral-300 font-mono text-[10px] py-2 px-3 uppercase tracking-wider transition-colors duration-300"
                    >
                        Abort
                    </button>
                </div>

                {/* Decorative ID */}
                <span className="absolute -bottom-2 -right-2 text-[8px] text-[#C7B580]/10 font-mono">
                    ID: CK-992
                </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UplinkCookie;
