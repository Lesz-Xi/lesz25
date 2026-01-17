import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProjectCarousel = () => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  
  const projects = [
    {
      id: 1,
      title: "ThesisLens",
      category: "Academic Integrity",
      image: "/images/projects/thesislens-v2.webp",
      color: "#F4F1EA",
      link: "https://thesislens.space/",
      fit: "contain"
    },
    {
      id: 2,
      title: "SkillShift",
      category: "Coaching Platform",
      image: "/images/projects/skillshift-v3.webp",
      color: "#111111",
      link: "https://skillshift.vercel.app/",
      fit: "contain"
    },
    {
      id: 3,
      title: "Universe Splitter",
      category: "Quantum Experiment",
      image: "/images/projects/universe-splitter.webp",
      color: "#000000",
      link: "https://univ-spitter.vercel.app/",
      fit: "contain"
    }
  ];

  useGSAP(() => {
    // Only run on desktop/larger screens where sticky effects make sense
    // On mobile, native scrolling is usually better UX
    let mm = gsap.matchMedia();
    
    // DESKTOP: Fan Deck Interaction (Symmetric Glass Fan)
    mm.add("(min-width: 769px)", () => {
      const cards = gsap.utils.toArray(".project-card");
      
      // 1. Initial State - "Symmetric Fan" with Glass Style
      // Layout: \ | / (Victory Fan)
      // Left: Rotated Left (-12deg)
      // Center: Straight (0deg)
      // Right: Rotated Right (12deg)
      
      const layouts = [
        { rotation: 0, xPercent: -100, yPercent: -50, zIndex: 1 },   // Left (Floating Slab)
        { rotation: 0, xPercent: -50, yPercent: -50, zIndex: 2 },   // Center
        { rotation: 0, xPercent: 0, yPercent: -50, zIndex: 1 }      // Right
      ];

      gsap.set(cards, {
        position: "absolute",
        top: "40%", // Moved up from 50% to fix "way at bottom" issue
        left: "50%",
        transformOrigin: "center center"
      });

      cards.forEach((card, i) => {
        const layout = layouts[i];
        
        // Apply Initial Layout
        gsap.to(card, {
          rotation: layout.rotation,
          xPercent: layout.xPercent,
          yPercent: layout.yPercent,
          scale: 0.9,
          zIndex: layout.zIndex,
          filter: "brightness(0.5) contrast(1.1)", // High contrast for glass look
          duration: 1.2,
          ease: "power3.out"
        });

        // Hover Interaction - Lift & Highlight (No Rotation)
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.05,            // Lift
            zIndex: 100,            // Bring to front
            filter: "brightness(1) contrast(1)", // Full visibility
            duration: 0.5,
            ease: "back.out(1.2)",
            overwrite: "auto"
          });

          // Siblings: Fade background
          cards.filter(c => c !== card).forEach(sibling => {
            gsap.to(sibling, {
              scale: 0.85,
              filter: "brightness(0.3) blur(2px)", // Blur siblings
              duration: 0.4,
              overwrite: "auto"
            });
          });
        });

        card.addEventListener("mouseleave", (e) => {
          // Smart Logic: If moving to another card, don't reset!
          // This fixes the "glitch" where moving from Center -> Side resets everything.
          if (e.relatedTarget && e.relatedTarget.closest(".project-card")) return;

          // Reset to Main Layout
          cards.forEach((c, index) => {
             const l = layouts[index];
             
             gsap.to(c, {
                rotation: l.rotation, 
                xPercent: l.xPercent, // Ensure X returns (though it shouldn't change)
                scale: 0.9,
                zIndex: l.zIndex,
                filter: "brightness(0.5) contrast(1.1)", 
                duration: 0.8,
                ease: "power3.out",
                overwrite: "auto"
             });
          });
        });
      });
    });
    
  }, { scope: containerRef });

  return (
    <section 
      id="projects" 
      ref={containerRef} 
      className="relative w-full bg-[#070707] py-12 md:py-20"
    >
      {/* Header */}
      <div className="text-center w-full px-4 mb-20 md:mb-32">
         <span className="text-xs font-bold tracking-[0.2em] text-[#DBD5B5]/40 uppercase mb-2 block">
            Selected Work
          </span>
          <h2 className="text-2xl md:text-6xl font-bold font-accent text-[#8B7E66]">
            Featured Projects
          </h2>
      </div>

      {/* Cards Scroll Container */}
      <div ref={wrapperRef} className="w-full flex flex-col items-center gap-8 md:gap-0 pb-0 md:pb-20">
        {projects.map((project, index) => (
          <div 
            key={project.id}
            className="w-full md:min-h-[90vh] last:md:min-h-0 flex items-center md:items-start justify-center"
          >
            <div
              className="project-card w-full md:w-[55vw] md:max-w-[800px] aspect-[4/5] md:aspect-video flex flex-col md:flex-row rounded-2xl md:rounded-3xl overflow-hidden border-2 border-white/5 hover:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(139,126,102,0.1)] transition-shadow duration-500 bg-transparent backdrop-blur-sm"
              style={{ 
                zIndex: index + 1, 
              }}
            >
              <div 
                className="w-full md:w-2/3 aspect-[4/3] md:aspect-auto md:h-full relative overflow-hidden"
                style={{ backgroundColor: project.color }}
              >
                 <img 
                   src={project.image} 
                   srcSet={`${project.image.replace('.webp', '-mobile.webp')} 600w, ${project.image} 1200w`}
                   sizes="(max-width: 768px) 100vw, 800px"
                   alt={project.title}
                   className="w-full h-full object-center transition-transform duration-700 hover:scale-105"
                   style={{ objectFit: project.fit || "contain" }}
                   decoding="async"
                   loading="lazy"
                 />
              </div>

              {/* Content Section (Glassmorphic) */}
              <div 
                className="w-full md:w-1/3 h-1/2 md:h-full p-6 md:p-10 flex flex-col justify-between border-l border-white/5 relative z-20 bg-white/5 backdrop-blur-2xl"
              >
                 <div className="flex flex-col gap-2">
                   <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#8B7E66] uppercase">
                      {project.category}
                   </span>
                   <h3 className="text-2xl md:text-4xl font-serif font-bold text-[#DBD5B5] leading-tight">
                      {project.title}
                   </h3>
                   <p className="text-white/60 text-sm md:text-base mt-2 line-clamp-3">
                     A premium digital experience crafted with precision and attention to detail.
                   </p>
                 </div>
                 
                 <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                   <a 
                     href={project.link} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="group/btn inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#8B7E66] to-[#9d8f75] text-white text-sm font-display tracking-wide hover:shadow-lg hover:shadow-[#8B7E66]/20 hover:scale-[1.02] transition-all duration-300 transform origin-left"
                   >
                      <span>View Project</span>
                      <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                   </a>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectCarousel;