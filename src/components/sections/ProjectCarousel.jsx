import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProjectCarousel = () => {
  const containerRef = useRef(null);
  
  // Reordered: ThesisLens (left), Universe Splitter (center), SkillShift (right)
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

  // Simple entrance animation only
  useGSAP(() => {
    gsap.from(".project-card", {
      scrollTrigger: {
        trigger: "#projects",
        start: "top 80%",
      },
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 1.2,
      ease: "power3.out"
    });
  }, { scope: containerRef });

  return (
    <section 
      id="projects" 
      ref={containerRef} 
      className="relative w-full bg-[#070707] py-16 md:py-24"
    >
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-noise-pattern z-0"></div>
      
      {/* Header */}
      <div className="text-center w-full px-4 mb-16 md:mb-20 relative z-10">
        <span className="text-xs font-bold tracking-[0.25em] text-[#DBD5B5]/40 uppercase mb-3 block">
          Selected Work
        </span>
        <h2 className="text-3xl md:text-6xl font-bold font-accent text-[#8B7E66]">
          Featured Projects
        </h2>
      </div>

      {/* Desktop: Editorial Horizontal Layout */}
      <div className="hidden md:flex justify-center items-stretch gap-[3vw] px-[5vw] relative z-10">
        {projects.map((project) => (
          <article
            key={project.id}
            className="project-card group w-[28vw] max-w-[420px] flex flex-col rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-xl transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5),0_0_30px_rgba(139,126,102,0.15)]"
          >
            {/* Image Section */}
            <div 
              className="w-full aspect-[4/3] relative overflow-hidden"
              style={{ backgroundColor: project.color }}
            >
              <img 
                src={project.image} 
                srcSet={`${project.image.replace('.webp', '-mobile.webp')} 600w, ${project.image} 1200w`}
                sizes="(max-width: 768px) 100vw, 420px"
                alt={project.title}
                className="w-full h-full object-center transition-transform duration-700 group-hover:scale-105"
                style={{ objectFit: project.fit || "contain" }}
                decoding="async"
                loading="lazy"
              />
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 flex flex-col justify-between bg-gradient-to-b from-[#0A0A0A] to-[#080808]">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#8B7E66] uppercase">
                  {project.category}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#DBD5B5] leading-tight tracking-tight">
                  {project.title}
                </h3>
                <p className="text-white/50 text-sm mt-2 line-clamp-2 leading-relaxed">
                  A premium digital experience crafted with precision and attention to detail.
                </p>
              </div>
              
              <div className="mt-6 pt-5 border-t border-white/5">
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="view-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8B7E66] to-[#9d8f75] text-white text-sm font-display tracking-wide transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,126,102,0.4)] hover:scale-[1.02]"
                >
                  <span>View Project</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile: Vertical Stack */}
      <div className="flex md:hidden flex-col items-center gap-8 px-4 relative z-10">
        {projects.map((project) => (
          <article
            key={project.id}
            className="project-card w-full max-w-[360px] flex flex-col rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-xl"
          >
            {/* Image Section */}
            <div 
              className="w-full aspect-[4/3] relative overflow-hidden"
              style={{ backgroundColor: project.color }}
            >
              <img 
                src={project.image.replace('.webp', '-mobile.webp')} 
                alt={project.title}
                className="w-full h-full object-center"
                style={{ objectFit: project.fit || "contain" }}
                decoding="async"
                loading="lazy"
              />
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col gap-4 bg-gradient-to-b from-[#0A0A0A] to-[#080808]">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#8B7E66] uppercase">
                  {project.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#DBD5B5] leading-tight">
                  {project.title}
                </h3>
              </div>
              
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8B7E66] to-[#9d8f75] text-white text-sm font-display tracking-wide self-start"
              >
                <span>View Project</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProjectCarousel;