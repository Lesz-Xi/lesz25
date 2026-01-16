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
      fit: "cover"
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
      className="relative w-full bg-[#070707] py-20"
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
      <div ref={wrapperRef} className="w-full flex flex-col items-center gap-10 md:gap-0 pb-40">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="project-card relative md:sticky md:top-32 w-[90vw] md:w-[1000px] h-auto md:h-[600px] flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl origin-top will-change-transform"
            style={{ 
              zIndex: index + 1, 
            }}
          >
            {/* Image Section */}
            <div 
              className="w-full md:w-2/3 h-[50%] md:h-full relative overflow-hidden"
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

            {/* Content Section */}
            <div className="w-full md:w-1/3 h-[50%] md:h-full p-6 md:p-12 flex flex-col justify-between bg-[#1C1C21] border-l border-white/5">
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
                   className="group/btn inline-flex items-center gap-3 text-sm font-display font-medium text-white hover:text-[#DBD5B5] transition-colors"
                 >
                    <span className="uppercase tracking-widest">View Project</span>
                    <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-[#DBD5B5] group-hover/btn:bg-[#DBD5B5]/10 transition-all">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
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