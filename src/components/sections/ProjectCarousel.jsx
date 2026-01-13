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
      color: "#DFDFF2" // Soft Indigo
    },
    {
      id: 2,
      title: "SkillShift AI",
      category: "Coaching Platform",
      image: "/images/projects/skillshift-v3.png",
      color: "#E2E2D3" // Soft Sage/Beige
    },
    {
      id: 3,
      title: "Universe Splitter",
      category: "Quantum Experiment",
      image: "/images/projects/universe-splitter.png",
      color: "#D6D6D6" // Soft Grey
    }
  ];

  useGSAP(() => {
    const cards = gsap.utils.toArray(".project-card");
    
    // Create a timeline that pins the section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${projects.length * 100}%`, // Pin for length * viewport height
        scrub: 1,
        pin: true,
      }
    });

    // Animate cards
    cards.forEach((card, i) => {
      // First card is already visible, we animate subsequent cards coming in
      if (i > 0) {
        tl.fromTo(card, 
          { yPercent: 100, opacity: 0 }, // Start below and invisible
          { yPercent: 0, opacity: 1, ease: "power2.out", duration: 1 } // Slide up to cover
        );
      }
      
      // Optional: Scale down the PREVIOUS card slightly as the new one enters to create depth
      if (i > 0) {
         tl.to(cards[i-1], { scale: 0.95, filter: "blur(2px)", duration: 1 }, "<");
      }
    });

  }, { scope: containerRef });

  return (
    <section 
      id="projects" 
      ref={containerRef} 
      className="h-screen w-full relative overflow-hidden flex flex-col items-center justify-center bg-[#070707]"
    >
        
      {/* Header - Absolute at top so it stays while cards scroll over/under if preferred, 
          OR we can let cards cover it. Let's keep it visible at top. */}
      <div className="absolute top-12 md:top-24 z-10 text-center w-full">
         <span className="text-xs font-bold tracking-[0.2em] text-[#DBD5B5]/40 uppercase mb-4 block">
            Selected Work
          </span>
          <h2 className="text-4xl md:text-6xl font-bold font-accent text-[#8B7E66]">
            Featured Projects
          </h2>
      </div>

      {/* Cards Container */}
      <div className="relative w-full h-full flex items-center justify-center max-w-[90vw] md:max-w-4xl mt-20">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="project-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[600px] aspect-[4/5] md:aspect-[16/10] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row bg-[#1C1C21] origin-center"
            style={{ zIndex: index + 1 }}
          >
            {/* Image Section */}
            <div className="w-full md:w-2/3 h-[55%] md:h-full relative overflow-hidden">
               <img 
                 src={project.image} 
                 alt={project.title}
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/3 h-[45%] md:h-full p-5 md:p-8 flex flex-col justify-center bg-[#1C1C21] border-l border-neutral-800">
               <span className="text-xs font-bold tracking-widest text-[#8B7E66] uppercase mb-2">
                  {project.category}
               </span>
               <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#DBD5B5] mb-4 leading-tight">
                  {project.title}
               </h3>
                <a href="#" className="mt-auto md:mt-0 group/btn relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-display font-medium tracking-wide text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-[#DBD5B5]/30 hover:scale-[1.02] focus:outline-none ring-offset-2 focus:ring-2 ring-[#DBD5B5]">
                   <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 ease-out pointer-events-none"></span>
                   <span className="relative flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#DBD5B5] group-hover/btn:text-white transition-colors duration-300">
                     View Live Project
                     <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
