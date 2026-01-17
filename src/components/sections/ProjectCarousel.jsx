import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const ProjectCarousel = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1); // Start with center project (Universe Splitter)

  // Order: ThesisLens (0), Universe Splitter (1), SkillShift (2)
  const projects = [
    {
      id: 1,
      title: "ThesisLens",
      category: "Academic Integrity",
      image: "/images/projects/thesislens-v2.webp",
      link: "https://thesislens.space/",
      description: "AI-powered academic integrity detection system."
    },
    {
      id: 3,
      title: "Universe Splitter",
      category: "Quantum Experiment",
      image: "/images/projects/universe-splitter.webp",
      link: "https://univ-spitter.vercel.app/",
      description: "Quantum mechanics visualization & interactive experiment."
    },
    {
      id: 2,
      title: "SkillShift",
      category: "Coaching Platform",
      image: "/images/projects/skillshift-v3.webp",
      link: "https://skillshift.vercel.app/",
      description: "Professional coaching marketplace and scheduling platform."
    }
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  useGSAP(() => {
    const cards = gsap.utils.toArray(".project-card");
    
    cards.forEach((card, index) => {
      // Calculate specific properties based on position relative to active index
      // ... (logic remains same, just ensure filter is explicit)
      
      let xPos = "0%";
      let scale = 1;
      let opacity = 1;
      let zIndex = 10;
      let filter = "blur(0px)"; // Explicitly no blur for center
      let brightness = 1;

      if (index !== activeIndex) {
        const diff = index - activeIndex;
        xPos = `${diff * 65}%`; 
        scale = 0.85;
        opacity = 0.6;
        zIndex = 5;
        filter = "blur(3px)"; // Slightly increased blur for depth
        brightness = 0.4;
      }

      gsap.to(card, {
        x: xPos,
        scale: scale,
        opacity: opacity,
        zIndex: zIndex,
        filter: `${filter} brightness(${brightness})`,
        duration: 0.6,
        ease: "power3.out"
      });
    });

  }, { scope: containerRef, dependencies: [activeIndex] });

  return (
    <section 
      id="projects" 
      ref={containerRef} 
      className="relative w-full bg-[#070707] py-24 overflow-hidden min-h-[100vh] flex flex-col justify-center"
    >
      {/* Noise Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-noise-pattern z-0"></div>

      {/* Header */}
      <div className="text-center w-full px-4 mb-12 relative z-10">
        <span className="text-xs font-bold tracking-[0.25em] text-[#DBD5B5]/40 uppercase mb-3 block">
           Selected Work
         </span>
         <h2 className="text-4xl md:text-6xl font-bold font-accent text-[#8B7E66]">
           Featured Projects
         </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex justify-center items-center perspective-[1000px]">
        {projects.map((project, index) => (
          <div
            key={project.id}
            onClick={() => handleProjectClick(index)} // Allow clicking any card to center it
            className={`project-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] md:w-[460px] aspect-[3/4.2] flex flex-col rounded-3xl overflow-hidden shadow-2xl cursor-pointer will-change-transform border border-white/10 bg-[#0A0A0A]`}
          >
            {/* Image (Top 65%) */}
            <div className="h-[65%] w-full relative overflow-hidden bg-black/50">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]/80 z-10" />
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Content (Bottom 35%) */}
            <div className={`h-[35%] w-full p-8 flex flex-col justify-between bg-[#111] border-t border-white/5 relative z-20`}>
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#8B7E66] uppercase block mb-3">
                  {project.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#DBD5B5] leading-none mb-2">
                  {project.title}
                </h3>
              </div>

              <div className="flex justify-between items-end">
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-white/60 hover:text-[#8B7E66] transition-colors text-sm font-medium"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <span>View Case Study</span>
                </a>
                
                <div className="w-10 h-10 rounded-full bg-[#1C1C21] border border-white/10 flex items-center justify-center group-hover:border-[#8B7E66]/50 group-hover:bg-[#2A2A30] transition-all">
                  <svg className="w-4 h-4 text-white group-hover:text-[#8B7E66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation & Pagination */}
      <div className="relative z-10 flex items-center justify-center gap-8 mt-12">
        {/* Prev Button */}
        <button 
          onClick={handlePrev}
          className="p-4 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-[#8B7E66] hover:border-[#8B7E66]/30 hover:bg-white/10 transition-all active:scale-95"
          aria-label="Previous project"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex gap-4">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex 
                  ? "bg-[#8B7E66] scale-125 shadow-[0_0_10px_#8B7E66]" 
                  : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button 
          onClick={handleNext}
          className="p-4 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-[#8B7E66] hover:border-[#8B7E66]/30 hover:bg-white/10 transition-all active:scale-95"
          aria-label="Next project"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
  );
};

export default ProjectCarousel;