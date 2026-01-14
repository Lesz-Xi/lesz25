import React, { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PhotographySection = () => {
  const containerRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  const photos = [
    {
      id: 1,
      url: "/images/project1.png",
      title: "Alps",
      location: "ZUG, SWITZERLAND",
      year: "2023",
      category: "LANDSCAPE",
      className: "md:col-span-1 md:mt-0",
      speed: 1 // Baseline
    },
    {
      id: 2,
      url: "/images/project2.png",
      title: "City of Lights",
      location: "PARIS, FRANCE",
      year: "2024",
      category: "ARCHITECTURE",
      className: "md:col-span-1 md:mt-32",
      speed: 1.5 // Moves faster
    },
    {
      id: 3,
      url: "/images/project3.png",
      title: "Nature",
      location: "JAS, PHILIPPINES",
      year: "2023",
      category: "NATURE",
      className: "md:col-span-1 md:-mt-32",
      speed: 0.8 // Moves slower (drag)
    },
    {
      id: 4,
      url: "/images/projects/thesislens-v2.png",
      title: "Beach",
      location: "PHILIPPINES",
      year: "2024",
      category: "STREET",
      className: "md:col-span-1 md:mt-0",
      speed: 1.2
    },
    {
      id: 5,
      url: "/images/projects/universe-splitter.png",
      title: "Streets",
      location: "URBAN & CITY",
      year: "2023",
      category: "TRAVEL",
      className: "md:col-span-1 md:-mt-32",
      speed: 0.8
    },
    {
      id: 6,
      url: "/images/project1.png", // Placeholder
      title: "Lights",
      location: "Urban Geometry",
      year: "2024",
      category: "NIGHT",
      className: "md:col-span-1 md:mt-0",
      speed: 1.2
    },
    {
      id: 7,
      url: "/images/project2.png", // Placeholder
      title: "Flowers",
      location: "Botanical Garden",
      year: "2023",
      category: "NATURE",
      className: "md:col-span-1 md:-mt-32",
      speed: 0.8
    },
    {
      id: 8,
      url: "/images/project3.png", // Placeholder
      title: "Surfing",
      location: "La Union, Philippines", // Example location, user can update
      year: "2024",
      category: "ACTION",
      className: "md:col-span-1 md:mt-0",
      speed: 1.2
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
                onClick={() => setSelectedPhoto(photo)}
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

      {/* Fullscreen Image Modal - AnimatePresence ensures exit animations play */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 md:top-8 md:right-8 z-[110] group p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
            >
              <div className="relative w-8 h-8 md:w-10 md:h-10 flex justify-center items-center opacity-70 group-hover:opacity-100 transition-opacity">
                <span className="absolute w-full h-[1.5px] bg-[#DBD5B5] rotate-45" />
                <span className="absolute w-full h-[1.5px] bg-[#DBD5B5] -rotate-45" />
              </div>
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[85vh] md:max-h-[90vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-4 text-center">
                 <h3 className="text-2xl font-bold text-[#DBD5B5] tracking-tight">{selectedPhoto.title}</h3>
                 <p className="text-sm text-[#DBD5B5]/60 tracking-widest uppercase mt-1">{selectedPhoto.location}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PhotographySection;
