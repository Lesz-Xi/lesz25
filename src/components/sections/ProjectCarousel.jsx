import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Order: Wu-Weism (0), ThesisLens (1), Universe Splitter (2), SkillShift (3)
const projects = [
  {
    id: 4,
    title: "Wu-Weism / MASA",
    category: "AI Research Platform",
    image: "/images/projects/wu-weism.png",
    imagePosition: "left top",
    link: "https://wuweism.com",
    description: "Causal AI research workbench built on Pearl's do-calculus. Closes the loop between hypothesis, intervention, and counterfactual reasoning with a 47-route API and sovereign memory."
  },
  {
    id: 1,
    title: "ThesisLens",
    category: "Academic Integrity",
    image: "/images/projects/thesislens-v2.webp",
    imagePosition: "center top",
    link: "https://thesislens.space/",
    description: "Academic integrity platform tackling AI false positives. Built forensic audit logging and defense algorithms to shield student work from erroneous AI detection at scale."
  },
  {
    id: 3,
    title: "Universe Splitter",
    category: "Quantum Experiment",
    image: "/images/projects/universe-splitter.webp",
    imagePosition: "center top",
    link: "https://univ-spitter.vercel.app/",
    description: "Interactive visualization of the many-worlds interpretation of quantum mechanics. Renders quantum branching events as a navigable visual system."
  },
  {
    id: 2,
    title: "SkillShift AI",
    category: "Coaching Platform",
    image: "/images/projects/skillshift-v3.webp",
    imagePosition: "center top",
    link: null,
    description: "Professional-grade AI coaching platform for MLBB. Simulates Mythic-rank logic to deliver role-specific, actionable feedback and adaptive training modules."
  }
];

const ProjectCarousel = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    // Add right-padding buffer (10vw) so the last card is fully visible at scroll end
    const rightPadding = window.innerWidth * 0.1;
    const totalScrollWidth = track.scrollWidth - window.innerWidth + rightPadding;

    // Main horizontal scroll — keep reference for containerAnimation
    const hScrollAnim = gsap.to(track, {
      x: -totalScrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalScrollWidth}`,
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    const hST = hScrollAnim.scrollTrigger;

    // Per-card content reveals driven by horizontal scroll progress
    const cards = gsap.utils.toArray(".h-project-card");
    cards.forEach((card, i) => {

      // Initial vertical entrance when section first hits viewport
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Image scale reveal as card scrolls in
      const img = card.querySelector(".card-img");
      if (img && hST) {
        gsap.fromTo(img,
          { scale: 1.08 },
          {
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: hST,
              start: "left 90%",
              end: "left 30%",
              scrub: 0.8,
            },
          }
        );
      }

      // Category label — slides down from above
      const category = card.querySelector(".card-category");
      if (category && hST) {
        gsap.fromTo(category,
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: hST,
              start: "left 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Title — slides up with slight delay after category
      const title = card.querySelector(".card-title");
      if (title && hST) {
        gsap.fromTo(title,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: hST,
              start: "left 72%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Description — slides up after title
      const desc = card.querySelector(".card-desc");
      if (desc && hST) {
        gsap.fromTo(desc,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.16,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: hST,
              start: "left 68%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Action button — fades in last
      const action = card.querySelector(".card-action");
      if (action && hST) {
        gsap.fromTo(action,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            delay: 0.24,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: card,
              containerAnimation: hST,
              start: "left 65%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });
  }, { scope: sectionRef });

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-[#F5F2EB]"
      style={{ height: "calc(100vh + 1600px)" }}
    >
      {/* Noise Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-noise-pattern z-0" />

      {/* Sticky viewport wrapper */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

        {/* Header */}
        <div className="text-center w-full px-4 mb-12 relative z-10 flex-none">
          <span className="text-xs font-bold tracking-[0.25em] text-[#8B7E66] uppercase mb-3 block">
            Selected Work
          </span>
          <h2 className="text-4xl md:text-6xl font-bold font-accent text-[#8B7E66]">
            Featured Projects
          </h2>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="flex gap-6 items-center will-change-transform flex-none"
          style={{ paddingLeft: "10vw", paddingRight: "10vw" }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="h-project-card flex-none w-[340px] md:w-[400px] bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
              style={{ height: "65vh", minHeight: "420px", maxHeight: "600px" }}
            >
              {/* Image (top ~60%) */}
              <div className="relative overflow-hidden bg-black/50" style={{ height: "60%" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]/70 z-10" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="card-img w-full h-full object-cover"
                  style={{ objectPosition: project.imagePosition || "center" }}
                  loading="lazy"
                />
              </div>

              {/* Content (bottom ~40%) */}
              <div
                className="flex flex-col justify-between p-7 bg-[#111] border-t border-white/5 relative z-20"
                style={{ height: "40%" }}
              >
                <div>
                  <span className="card-category text-[10px] font-bold tracking-[0.25em] text-[#8B7E66] uppercase block mb-2">
                    {project.category}
                  </span>
                  <h3 className="card-title text-xl md:text-2xl font-serif font-bold text-[#DBD5B5] leading-tight mb-3">
                    {project.title}
                  </h3>
                  <p className="card-desc text-neutral-400 text-xs md:text-sm leading-relaxed font-geist-mono line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="card-action flex justify-end mt-auto pt-3">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-[#DBD5B5]/30 flex items-center justify-center hover:bg-[#DBD5B5] hover:border-[#DBD5B5] transition-all group/btn"
                      aria-label={`View ${project.title}`}
                    >
                      <svg
                        className="w-4 h-4 text-[#DBD5B5] group-hover/btn:text-[#0A0A0A] transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-white/30 text-xs font-medium uppercase tracking-widest py-2">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <p className="text-center text-[#8B7E66]/50 text-xs tracking-[0.2em] uppercase mt-8 flex-none">
          Scroll to explore →
        </p>
      </div>
    </section>
  );
};

export default ProjectCarousel;
