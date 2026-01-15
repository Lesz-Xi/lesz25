import React from "react";
import { motion } from "framer-motion";

const ScrollIndicator = ({ onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className="flex flex-col items-center justify-center cursor-pointer mt-8 group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
    >
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Outer glowing circle - subtle */}
        <div className="absolute inset-0 rounded-full border border-[#DBD5B5]/20 group-hover:border-[#DBD5B5]/50 transition-colors duration-500" />
        
        {/* Animated Arrow */}
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[#DBD5B5]/80 group-hover:text-[#DBD5B5] transition-colors duration-300"
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d="M12 5V19M12 19L5 12M12 19L19 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </div>
      
      {/* Label - optional, kept minimal */}
      <motion.span 
        className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#DBD5B5]/60 group-hover:text-[#DBD5B5] transition-colors duration-300 ml-1"
        style={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        Scroll
      </motion.span>
    </motion.div>
  );
};

export default ScrollIndicator;
