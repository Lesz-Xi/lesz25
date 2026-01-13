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
      image: "/images/projects/thesislens-v2.png",
      color: "#F4F1EA",
      link: "https://thesislens.space/",
      fit: "contain"
    },
    {
      id: 2,
      title: "SkillShift",
      category: "Coaching Platform",
      image: "/images/projects/skillshift-v3.png",
      color: "#111111",
      link: "#",
      fit: "contain"
    },
    {
      id: 3,
      title: "Universe Splitter",
      category: "Quantum Experiment",
      image: "/images/projects/universe-splitter.png",
      color: "#000000",
      link: "https://univ-spitter.vercel.app/",
      fit: "cover"
    }
  ];

  useGSAP(() => {
    const cards = gsap.utils.toArray(".project-card");
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${projects.length * 100}%`, 
        scrub: 1,
        pin: true,
      }
    });

    cards.forEach((card, i) => {
      if (i > 0) {
        // Card slides up from bottom
        tl.fromTo(card, 
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, ease: "power2.out", duration: 1 }
        );

        // Previous cards scale down and move up to create stack
        for (let j = 0; j < i; j++) {
            const depth = i - j;
            const scale = 1 - (depth * 0.03); // Subtle scale
            const yOffset = -depth * 60; // Large offset for visible strips
            
            tl.to(cards[j], { 
              scale: scale, 
              y: yOffset,
              duration: 1 
            }, "<"); 
        }
      }
    });

  }, { scope: containerRef });

  return (
    <section 
      id="projects" 
      ref={containerRef} 
      className="h-screen w-full relative overflow-hidden flex flex-col items-center justify-center bg-[#070707]"
    >
      {/* Header */}
      <div className="absolute top-6 md:top-24 z-10 text-center w-full px-4">
         <span className="text-xs font-bold tracking-[0.2em] text-[#DBD5B5]/40 uppercase mb-2 block">
            Selected Work
          </span>
          <h2 className="text-2xl md:text-6xl font-bold font-accent text-[#8B7E66]">
            Featured Projects
          </h2>
      </div>

      {/* Cards Container */}
      <div className="relative w-full h-[65vh] md:h-[80vh] flex items-center justify-center max-w-[90vw] md:max-w-5xl mt-16 md:mt-20">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="project-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[600px] h-[520px] md:h-auto md:aspect-[16/10] rounded-2xl md:rounded-3xl shadow-2xl flex flex-col md:flex-row bg-[#1C1C21] origin-top"
            style={{ zIndex: index + 1 }}
          >
            {/* Image Section */}
            <div 
              className="w-full md:w-2/3 h-[40%] md:h-full relative overflow-hidden rounded-t-2xl md:rounded-l-3xl md:rounded-tr-none px-4 py-4 md:px-0 md:py-0"
              style={{ backgroundColor: project.color }}
            >
               <img 
                 src={project.image} 
                 alt={project.title}
                 className="w-full h-full"
                 style={{ objectFit: project.fit || "contain" }}
               />
               {/* Removed dark overlay to keep image bright and clear */}
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/3 h-[60%] md:h-full p-4 md:p-8 flex flex-col justify-between bg-[#1C1C21] border-t md:border-t-0 md:border-l border-neutral-800 rounded-b-2xl md:rounded-r-3xl md:rounded-bl-none">
               <div>
                 <span className="text-[10px] font-bold tracking-widest text-[#8B7E66] uppercase mb-1 block">
                    {project.category}
                 </span>
                 <h3 className="text-lg md:text-3xl font-serif font-bold text-[#DBD5B5] leading-tight">
                    {project.title}
                 </h3>
               </div>
               <a 
                 href={project.link} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="group/btn inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-3 font-display font-medium text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-[#DBD5B5]/30 transition-all duration-300"
               >
                  <span className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-[#DBD5B5] group-hover/btn:text-white transition-colors">
                    View Live Project
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
               </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectCarousel;