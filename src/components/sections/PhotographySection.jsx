import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

const PhotographySection = () => {
  const containerRef = useRef(null);
  
  const photos = [
    {
      id: 1,
      url: "/images/switz-new-feat.jpg",
      title: "Alps",
      location: "ZUG, SWITZERLAND",
      year: "2022",
      category: "LANDSCAPE",
      className: "md:col-span-1 md:mt-0",
      speed: 1 // Baseline
    },
    {
      id: 2,
      url: "/images/feat-paris.jpg",
      title: "City of Lights",
      location: "PARIS, FRANCE",
      year: "2022",
      category: "ARCHITECTURE",
      className: "md:col-span-1 md:mt-32",
      speed: 1.5 // Moves faster
    },
    {
      id: 3,
      url: "/images/nature-feat.jpg",
      title: "Nature",
      location: "COLLECTIONS",
      year: "2022",
      category: "NATURE",
      className: "md:col-span-1 md:-mt-32",
      speed: 0.8 // Moves slower (drag)
    },
    {
      id: 4,
      url: "/images/sunset-feat.jpg",
      title: "Sunrise & Sunset",
      location: "COLLECTIONS",
      year: "2025",
      category: "STREET",
      className: "md:col-span-1 md:mt-0",
      speed: 1.2
    },
    {
      id: 5,
      url: "/images/ph-feat.jpg",
      title: "Philippines",
      location: "DAVAO CITY",
      year: "2025",
      category: "CULTURE",
      className: "md:col-span-1 md:mt-32",
      speed: 1.1
    },
    {
      id: 7,
      url: "/images/flowers-feat.jpg",
      title: "Flowers",
      location: "COLLECTIONS",
      year: "2025",
      category: "NATURE",
      className: "md:col-span-1 md:-mt-32",
      speed: 0.8
    }
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const photoCards = gsap.utils.toArray(".photo-card");
      photoCards.forEach((card) => {
        const speed = parseFloat(card.dataset.speed);
        gsap.to(card, {
          y: -120 * speed, // Increased for deeper parallax
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    // Disable on touch devices or screens that don't support hover
    if (window.matchMedia("(hover: none)").matches) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const relativeX = (e.clientX - left) / width;
    const relativeY = (e.clientY - top) / height;
    
    // Map 0-1 to -1 to 1 range (center is 0)
    const tiltX = (relativeY - 0.5) * 20; // Tilt range -10 to 10 approx (inverted for natural feel)
    const tiltY = (relativeX - 0.5) * -20; // Tilt range -10 to 10 (inverted)

    gsap.to(e.currentTarget, {
      rotationX: -tiltX, // Invert X for natural tilt (mouse up -> tilt up)
      rotationY: -tiltY, // Invert Y for natural tilt
      scale: 1.05,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.4
    });
  };

  const handleMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      ease: "power2.out",
      duration: 0.5
    });
  };

  return (
    <section id="photography" ref={containerRef} className="py-32 text-[#DBD5B5]" style={{ backgroundColor: "#070707" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-24 max-w-xl">
          <span className="text-xs font-bold tracking-[0.2em] text-[#DBD5B5]/40 uppercase mb-6 block">
            Visuals
          </span>
          <h2 className="text-5xl md:text-7xl font-bold font-accent mb-6 tracking-normal text-[#8B7E66]">
            Photography
          </h2>
          <p className="text-[#DBD5B5]/80 text-sm md:text-[15px] leading-relaxed max-w-sm font-geist-mono">
            Capturing moments, light, and composition. A visual journal of my perspective on the world.
          </p>
        </div>

        {/* Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {photos.map((photo) => (
            <div key={photo.id} className={`photo-card group ${photo.className}`} data-speed={photo.speed} data-hover>
              
              {/* Image Container with Tilt */}
              <div 
                className="relative mb-6 overflow-hidden rounded-lg cursor-pointer transform-gpu border border-white/5"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >


                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    style={{ willChange: "transform" }}
                  />
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"></div>
              </div>

              {/* Info Below */}
              <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#DBD5B5] mb-1">
                    {photo.title}
                  </h3>
                  <p className="text-[10px] tracking-widest uppercase text-[#DBD5B5]/50 font-medium">
                    {photo.location}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#DBD5B5]/40">
                  {photo.year}
                </span>
              </div>

            </div>
          ))}
        </div>

      {/* Bottom Actions */}
        <div className="mt-16 flex justify-center items-center border-t border-white/10 pt-10 relative z-30">
          
          <Link to="/photography" className="group relative px-12 py-4 overflow-hidden rounded-full border border-[#8B7E66]/40 transition-all duration-500 hover:border-[#8B7E66]">
            {/* Animated Background Overlay */}
            <div className="absolute inset-0 bg-[#8B7E66] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            
            {/* Button Text */}
            <span className="relative z-10 text-xs font-bold tracking-[0.3em] uppercase text-[#8B7E66] group-hover:text-white transition-colors duration-500">
              See All
            </span>
          </Link>

        </div>


      </div>
    </section>
  );
};

export default PhotographySection;
