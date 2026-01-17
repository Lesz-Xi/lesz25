import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProjectCarousel = () => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  
  // Reordered: ThesisLens (1), Universe Splitter (CENTER), SkillShift (3)
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
    // Only run on desktop/larger screens where sticky effects make sense
    // On mobile, native scrolling is usually better UX
    let mm = gsap.matchMedia();
    
    mm.add("(min-width: 769px)", () => {
      const cards = gsap.utils.toArray(".project-card");
      
      // We don't strictly need a timeline for basic sticky stacking, 
      // but if we want the "scaling down" effect, we link it to scroll.
      
      cards.forEach((card, i) => {
        // The scale logic:
        // When Card (i+1) enters view, Card (i) should scale down.
        if (i !== cards.length - 1) {
          const nextCard = cards[i + 1];
          
          ScrollTrigger.create({
            trigger: nextCard,
            start: "top bottom", // When top of next card hits bottom of viewport
            end: "top top",      // When top of next card hits top of viewport
            scrub: true,
            animation: gsap.to(card, {
              scale: 0.9,
              filter: "brightness(0.5)",
              ease: "none",
              duration: 1
            })
          });
        }
      });
    });
    
  }, { scope: containerRef });

  return (
    <section 
      id="projects" 
      ref={containerRef} 
      className="relative w-full bg-[#070707] py-16 md:py-24"
    >
      {/* Noise Texture Overlay - Matches Biography */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-noise-pattern z-0"></div>
      
      {/* Header */}
      <div className="text-center w-full px-4 mb-16 md:mb-24 relative z-10">
         <span className="text-xs font-bold tracking-[0.25em] text-[#DBD5B5]/40 uppercase mb-3 block">
            Selected Work
          </span>
          <h2 className="text-3xl md:text-6xl font-bold font-accent text-[#8B7E66]">
            Featured Projects
          </h2>
      </div>

      {/* Cards Scroll Container */}
      <div ref={wrapperRef} className="w-full flex flex-col items-center gap-8 md:gap-0 pb-0 md:pb-20 relative z-10">
        {projects.map((project, index) => (
          <div 
            key={project.id}
            className="w-full md:min-h-[90vh] last:md:min-h-0 flex items-center md:items-start justify-center"
          >
            <div
              className="project-card relative md:sticky md:top-32 w-[85vw] md:w-[1000px] h-auto md:h-[600px] flex flex-col md:flex-row rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(139,126,102,0.1)] origin-top will-change-transform border-2 border-white/5 hover:border-white/10 transition-colors duration-300"
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

              {/* Content Section - Glassmorphic */}
              <div className="w-full md:w-1/3 md:h-full p-6 md:p-10 flex flex-col justify-between bg-white/5 backdrop-blur-xl border-l border-white/5">
                 <div className="flex flex-col gap-2">
                   <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-[#8B7E66] uppercase">
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