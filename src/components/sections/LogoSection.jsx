import { logoIconsList } from "../../constants/index.js";

const LogoIcon = ({ icon }) => {
  return (
    <div className="flex-none flex-center px-8 md:px-12 group">
      <div
        className="w-12 h-12 md:w-12 md:h-12 flex items-center justify-center"
      >
        <img
          src={icon.imgPath}
          alt={icon.name}
          className="w-full h-full object-contain filter grayscale-0 brightness-100 md:grayscale md:brightness-75 md:hover:grayscale-0 md:hover:brightness-100 transition-all duration-300"
        />
      </div>
    </div>
  );
};

const LogoSection = () => {
  return (
    <div className="relative pt-24 pb-20 md:pt-32 md:pb-24" style={{ backgroundColor: "#070707" }}>
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-6 block">
          Stack
        </span>
        <h2 className="text-5xl md:text-6xl font-bold font-accent leading-tight text-[#8B7E66]">
          Technologies
        </h2>
      </div>

      {/* Container to center and Limit width */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Gradient edges for the contained area */}
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#070707] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#070707] to-transparent z-20 pointer-events-none" />

        {/* Marquee container */}
        <div className="relative h-20 md:h-24 overflow-hidden">
          <div className="absolute flex items-center animate-logo-scroll">
            {/* First set of logos */}
            {logoIconsList.map((icon, index) => (
              <LogoIcon key={`${icon.name}-${index}`} icon={icon} />
            ))}
            {/* Duplicate for seamless loop */}
            {logoIconsList.map((icon, index) => (
              <LogoIcon key={`${icon.name}-duplicate-${index}`} icon={icon} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoSection;
