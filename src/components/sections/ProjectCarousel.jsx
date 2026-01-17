import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProjectCarousel = () => {
  const containerRef = useRef(null);
  
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
      id: 3,
      title: "Universe Splitter",
      category: "Quantum Experiment",
      image: "/images/projects/universe-splitter.webp",
      color: "#000000",
      link: "https://univ-spitter.vercel.app/",
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
    }
  ];

  useGSAP(() => {
    let mm = gsap.matchMedia();
    
    // DESKTOP: Fan Deck Interaction
    mm.add("(min-width: 769px)", () => {
      const cards = gsap.utils.toArray(".project-card");
      const spacer = 15; // overlap percentage

      // 1. Initial Fan State
      gsap.set(cards, {
        position: "absolute",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "center bottom"
      });

      // Distribution: -15deg, 0, 15deg (for 3 cards)
      // X Offset: -20%, 0, 20%
      cards.forEach((card, i) => {
        const rotation = (i - 1) * 10; // -10, 0, 10
        const xOffset = (i - 1) * 15; // -15%, 0, 15%
        
        gsap.to(card, {
          rotation: rotation,
          xPercent: -50 + xOffset,
          scale: 0.9,
          zIndex: i + 1,
          filter: "brightness(0.6)",
          duration: 0.8,
          ease: "power2.out"
        });

        // Hover Interaction
        card.addEventListener("mouseenter", () => {
          // Active Card: Pop up, Brighten, Center rotation
          gsap.to(card, {
            scale: 1.1,
            rotation: 0,
            zIndex: 100,
            filter: "brightness(1)",
            duration: 0.4,
            ease: "back.out(1.7)"
          });

          // Siblings: Dim, Scale down
          cards.filter(c => c !== card).forEach(sibling => {
            gsap.to(sibling, {
              scale: 0.85,
              filter: "brightness(0.3)",
              duration: 0.4
            });
          });
        });

        card.addEventListener("mouseleave", () => {
          // Reset All to Fan State
          cards.forEach((c, index) => {
             const r = (index - 1) * 10;
             const x = (index - 1) * 15;
             
             gsap.to(c, {
                rotation: r,
                xPercent: -50 + x,
                scale: 0.9,
                zIndex: index + 1,
                filter: "brightness(0.6)",
                duration: 0.6,
                ease: "power2.out"
             });
          });
        });
      });
    });

    // MOBILE: Reset to standard flow
    mm.add("(max-width: 768px)", () => {
      gsap.set(".project-card", {
        position: "relative",
        top: "auto",
        left: "auto",
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        scale: 1,
        filter: "brightness(1)",
        zIndex: "auto",
        transformOrigin: "center center"
      });
    });
    
  }, { scope: containerRef });

  return (
    <section 
      id="projects" 
      ref={containerRef} 
      className="relative w-full py-12 md:py-20 md:h-screen md:overflow-hidden flex flex-col"
      style={{ backgroundColor: "#070707" }}
    >
      {/* Noise Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-noise-pattern z-0"></div>

      {/* Header */}
      <div className="text-center w-full px-4 mb-16 md:mb-12 z-10 relative">
         <span className="text-xs font-bold tracking-[0.25em] text-[#DBD5B5]/40 uppercase mb-2 block">
            Selected Work
          </span>
          <h2 className="text-2xl md:text-6xl font-bold font-accent text-[#8B7E66]">
            Featured Projects
          </h2>
      </div>

      {/* Cards Container */}
      {/* Mobile: Vertical Flex | Desktop: Center Stage */}
      <div className="w-full flex-1 flex flex-col md:block relative px-4 md:px-0 gap-8 md:gap-0">
        {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card w-full md:w-[60vw] md:max-w-[900px] aspect-[4/5] md:aspect-video flex flex-col md:flex-row rounded-2xl md:rounded-3xl overflow-hidden border-2 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(139,126,102,0.1)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_40px_rgba(139,126,102,0.3)] transition-shadow duration-500 bg-[#1C1C21]"
            >
              {/* Image Section */}
              <div 
                className="w-full md:w-2/3 h-1/2 md:h-full relative overflow-hidden bg-black"
                style={{ backgroundColor: project.color }}
              >
                 <img 
                   src={project.image} 
                   srcSet={`${project.image.replace('.webp', '-mobile.webp')} 600w, ${project.image} 1200w`}
                   sizes="(max-width: 768px) 100vw, 800px"
                   alt={project.title}
                   className="w-full h-full object-center transition-transform duration-700 md:group-hover:scale-105"
                   style={{ objectFit: project.fit || "contain" }}
                   decoding="async"
                   loading="lazy"
                 />
              </div>

              {/* Content Section */}
              <div 
                className="w-full md:w-1/3 h-1/2 md:h-full p-6 md:p-10 flex flex-col justify-between border-l border-white/5 relative z-20"
                style={{ background: "linear-gradient(135deg, #1C1C21 0%, #151519 100%)" }}
              >
                 <div className="flex flex-col gap-3">
                   <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-[#8B7E66] uppercase">
                      {project.category}
                   </span>
                   <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#DBD5B5] leading-tight" style={{ letterSpacing: "-0.02em" }}>
                      {project.title}
                   </h3>
                   <p className="text-white/60 text-sm mt-2 leading-loose">
                     A premium digital experience crafted with precision and attention to detail.
                   </p>
                 </div>
                 
                 <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                   <a 
                     href={project.link} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="group/btn inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#8B7E66] to-[#9d8f75] text-white text-xs md:text-sm font-display tracking-wide hover:shadow-lg hover:shadow-[#8B7E66]/30 hover:scale-[1.02] transition-all duration-300 transform origin-left pointer-events-auto"
                   >
                      <span>View Project</span>
                      <svg className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                   </a>
                 </div>
              </div>
            </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectCarousel;