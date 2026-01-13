import React from "react";

const Logo = ({ className = "w-12 h-12", onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`${className} flex items-center justify-center cursor-pointer`} 
      data-hover
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-white/80 group-hover:text-white transition-colors duration-300"
        style={{ filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.4))" }}
      >
        {/* Camera Body - Wireframe Mesh Style */}
        <path d="M15,35 L85,35 L95,45 L95,85 L5,85 L5,45 L15,35 Z" />
        <path d="M5,45 L95,45" /> {/* Top edge line */}
        <path d="M5,45 L85,35" strokeOpacity="0.5" /> {/* Cross bracing */}
        <path d="M15,35 L95,45" strokeOpacity="0.5" /> {/* Cross bracing */}
        
        {/* Pentaprism / Viewfinder Bump */}
        <path d="M30,35 L40,20 L60,20 L70,35" />
        <path d="M40,20 L40,35" strokeOpacity="0.5" />
        <path d="M60,20 L60,35" strokeOpacity="0.5" />
        <path d="M30,35 L60,20" strokeOpacity="0.3" /> {/* Internal geometric detail */}
        
        {/* Lens Complex - 3D Cylinder Effect */}
        <circle cx="50" cy="60" r="18" strokeWidth="1.5" />
        <circle cx="50" cy="60" r="14" strokeOpacity="0.7" />
        <circle cx="50" cy="60" r="8" strokeWidth="1.5" />
        
        {/* Lens Reflections / Aperture Blades hint */}
        <path d="M50,42 L50,52" strokeOpacity="0.6" />
        <path d="M50,78 L50,68" strokeOpacity="0.6" />
        <path d="M32,60 L42,60" strokeOpacity="0.6" />
        <path d="M68,60 L58,60" strokeOpacity="0.6" />
        
        {/* Decorative 'Wireframe' connection lines */}
        <path d="M5,85 L30,35" strokeOpacity="0.3" />
        <path d="M95,85 L70,35" strokeOpacity="0.3" />
        
        {/* Shutter Button area */}
        <rect x="18" y="28" width="8" height="4" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default Logo;
