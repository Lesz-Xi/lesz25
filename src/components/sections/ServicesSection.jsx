import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    id: "01",
    title: "Digital Architecture",
    description:
      "Interfaces, systems, and web experiences built with structure first and atmosphere second.",
    specs: ["React / Vite", "Three.js / WebGL", "System architecture"],
  },
  {
    id: "02",
    title: "Visual Narrative",
    description:
      "Photography, motion, and composition used as a way of thinking, not decoration.",
    specs: ["Photography", "Art direction", "Motion language"],
  },
  {
    id: "03",
    title: "AI Synthesis",
    description:
      "Agentic workflows, causal reasoning, and research systems shaped into usable instruments.",
    specs: ["Agentic engineering", "Causal systems", "RAG / orchestration"],
  },
  {
    id: "04",
    title: "Research Craft",
    description:
      "Long-form inquiry across scientific, technical, and philosophical systems with causal rigor.",
    specs: ["White papers", "Technical analysis", "Knowledge synthesis"],
  },
];

const ServicesSection = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".capability-card");
      const rules = gsap.utils.toArray(".capability-rule");

      gsap.fromTo(
        ".capability-kicker, .capability-title, .capability-copy",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        rules,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.2,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".capability-grid",
            start: "top 84%",
            once: true,
          },
        }
      );

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 54, clipPath: "inset(12% 0 0 0)" },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1,
            delay: index * 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 86%",
              once: true,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden border-t border-[#0D0C1D]/10 bg-[#F5F2EB] py-28 text-[#0D0C1D] md:py-36"
      data-theme="light"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-20 grid gap-10 md:mb-24 md:grid-cols-[0.95fr_1.05fr] md:items-end">
          <div>
            <span className="capability-kicker mb-7 block font-geist-mono text-[11px] uppercase tracking-[0.34em] text-[#0D0C1D]/38">
              Capabilities
            </span>
            <h2 className="capability-title max-w-[9ch] font-display text-[clamp(4rem,8vw,8rem)] font-semibold leading-[0.86] tracking-[-0.07em] text-[#0D0C1D]">
              The Discipline
            </h2>
          </div>

          <p className="capability-copy max-w-[34rem] font-general-sans text-xl leading-[1.65] tracking-[-0.03em] text-[#0D0C1D]/58 md:justify-self-end md:text-2xl">
            A small set of abilities, held with restraint. Each one has to make
            the work more understandable, more useful, or more alive.
          </p>
        </div>

        <div className="capability-rule mb-0 h-px w-full bg-[#0D0C1D]/12" />

        <div className="capability-grid grid grid-cols-1 md:grid-cols-2">
          {capabilities.map((capability, index) => (
            <article
              key={capability.id}
              className={`capability-card group relative min-h-[25rem] overflow-hidden border-b border-[#0D0C1D]/12 p-7 transition-colors duration-500 hover:bg-white/45 md:p-10 ${
                index % 2 === 0 ? "md:border-r" : ""
              }`}
              data-hover
            >
              <div className="capability-rule absolute left-0 top-0 h-px w-full bg-[#0D0C1D]/10" />
              <div className="flex h-full flex-col justify-between gap-14">
                <div className="flex items-start justify-between gap-8">
                  <span className="font-geist-mono text-[12px] tracking-[0.24em] text-[#8B7E66]/75">
                    {capability.id}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#8B7E66]/45 transition-transform duration-500 group-hover:scale-[1.8]" />
                </div>

                <div>
                  <h3 className="max-w-[12ch] font-display text-[clamp(2rem,4vw,4.6rem)] leading-[0.92] tracking-[-0.06em] text-[#0D0C1D]">
                    {capability.title}
                  </h3>
                  <p className="mt-7 max-w-[29rem] font-general-sans text-[15px] leading-[1.8] text-[#0D0C1D]/58 md:text-base">
                    {capability.description}
                  </p>
                </div>

                <ul className="grid gap-0 border-t border-[#0D0C1D]/8 pt-2">
                  {capability.specs.map((spec) => (
                    <li
                      key={spec}
                      className="flex items-center justify-between border-b border-[#0D0C1D]/6 py-3 font-geist-mono text-[11px] uppercase tracking-[0.18em] text-[#0D0C1D]/62"
                    >
                      <span>{spec}</span>
                      <span className="text-[#8B7E66]/45">/</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
