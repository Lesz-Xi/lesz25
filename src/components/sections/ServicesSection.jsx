import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSpring, animated, to } from "@react-spring/web";

gsap.registerPlugin(ScrollTrigger);

// 3D tilt card — tracks mouse position within the card bounds
// Uses native onMouseMove instead of @use-gesture/react to avoid the
// dual-instance bundling conflict with @react-three/fiber's internal gesture dep
function TiltCard({ children, className }) {
  const [{ rx, ry }, api] = useSpring(() => ({ rx: 0, ry: 0 }));

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    api.start({ rx: -y * 10, ry: x * 10 });
  };

  const handleLeave = () => api.start({ rx: 0, ry: 0 });

  return (
    <animated.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{
        transform: to([rx, ry], (x, y) =>
          `perspective(900px) rotateX(${x}deg) rotateY(${y}deg)`
        ),
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </animated.div>
  );
}

const services = [
  {
    id: "01",
    title: "Digital Architecture",
    description: "Building immersive, high-performance web applications that bridge functionality and art.",
    specs: ["React / Vite / Next.js", "WebGL / Three.js / OGL", "System Architecture", "Performance Optimization"],
  },
  {
    id: "02",
    title: "Visual Narrative",
    description: "Crafting compelling visual stories through photography, motion, and art direction.",
    specs: ["Art Direction", "Photography & Editing", "Motion Design", "Visual Identity"],
  },
  {
    id: "03",
    title: "Brand Sovereignty",
    description: "Defining and elevating brand presence with strategic design and cohesive systems.",
    specs: ["UI/UX Design", "Design Systems", "Brand Strategy", "Technical Direction"],
  },
  {
    id: "04",
    title: "AI Synthesis",
    description: "Transcending syntax to craft via intuition. Synthesizing art, code, and innovation into novel solutions.",
    specs: ["Agentic Engineering", "Generative Intuition", "Concept Synthesis", "Rapid Prototyping"],
  },
  {
    id: "05",
    title: "Research",
    description: "Driven by obsession. Deconstructing systems and exploring the unknown to master their core mechanics.",
    specs: ["Academic Papers", "Technical Analysis", "R&D Strategy", "Knowledge Synthesis"],
  }
];

const ServicesSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray(".service-card");

    gsap.fromTo(cards, 
      {
        y: 100,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse" 
        }
      }
    );

    // Hover scale removed — TiltCard handles hover interaction via react-spring

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 border-t border-[#0D0C1D]/10" style={{ backgroundColor: "#F5F2EB" }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-12 gap-y-8 gap-x-12 items-end">
          <div className="md:col-span-8">
            <span className="text-xs font-bold tracking-[0.2em] text-[#0D0C1D]/40 uppercase mb-6 block">
              Capabilities
            </span>
            <h2 className="text-5xl md:text-[5rem] font-bold font-accent mb-8 tracking-normal leading-tight text-[#8B7E66] whitespace-nowrap">
              The Discipline
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-[#0D0C1D]/60 text-lg leading-relaxed font-general-sans">
              A convergence of technical precision and artistic intuition. Every project is approached as a bespoke architectural endeavor.
            </p>
          </div>
        </div>

        {/* Swiss Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border-t border-[#0D0C1D]/10">
          {services.map((service, index) => (
            <TiltCard
              key={service.id}
              className={`
                service-card group relative p-8 md:p-12 lg:p-8 border-b border-[#0D0C1D]/10
                ${service.colSpan || ""}
                ${index !== services.length - 1 ? 'md:border-r' : ''}
                hover:bg-white transition-colors duration-500 ease-in-out
              `}
              data-hover
            >
              {/* ID Number */}
              <span className="text-xs font-mono text-[#0D0C1D]/40 mb-12 block group-hover:text-[#C7B580] transition-colors">
                {service.id}
              </span>

              {/* Title */}
              <h3 className="text-2xl lg:text-xl font-heading font-bold mb-6 group-hover:translate-x-2 transition-transform duration-500 text-[#0D0C1D]">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-[#0D0C1D]/60 mb-10 leading-relaxed min-h-[80px] font-general-sans">
                {service.description}
              </p>

              {/* Specs List */}
              <ul className="space-y-3">
                {service.specs.map((spec, idx) => (
                  <li key={idx} className="flex items-center text-sm font-mono text-[#0D0C1D]/80 border-t border-[#0D0C1D]/5 pt-3">
                    <span className="w-1.5 h-1.5 bg-[#C7B580] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[${idx * 50}ms]"></span>
                    {spec}
                  </li>
                ))}
              </ul>

              {/* Hover Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-[#C7B580] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </TiltCard>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
