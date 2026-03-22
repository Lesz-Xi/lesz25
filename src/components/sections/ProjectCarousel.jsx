import React, { useRef, useState, useEffect } from "react";
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
    inProgress: true,
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
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useGSAP(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section || isMobile) return; // mobile uses CSS scroll

    const cards = gsap.utils.toArray(".h-project-card", track);
    const firstCard = cards[0];
    const lastCard = cards[cards.length - 1];

    if (!firstCard || !lastCard) return;

    // Travel just enough so the last card occupies the first card's starting lane.
    const totalTravel = lastCard.offsetLeft - firstCard.offsetLeft;
    const scrollDistance = totalTravel + window.innerHeight * 0.35;

    // Main horizontal scroll — keep reference for containerAnimation
    const hScrollAnim = gsap.to(track, {
      x: -totalTravel,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    // Per-card content reveals driven by horizontal scroll progress
    cards.forEach((card, i) => {
      // Initial vertical entrance when section first hits viewport
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
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
      if (img) {
        gsap.fromTo(img,
          { scale: 1.08 },
          {
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: hScrollAnim,
              start: "left 90%",
              end: "left 30%",
              scrub: 0.8,
            },
          }
        );
      }

      // Category label — slides down from above
      const category = card.querySelector(".card-category");
      if (category) {
        gsap.fromTo(
          category,
          { opacity: 0.18, y: -12 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: hScrollAnim,
              start: "left 94%",
              end: "left 72%",
              scrub: true,
            },
          }
        );
      }

      // Title — slides up with slight delay
      const title = card.querySelector(".card-title");
      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0.24, y: 18 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: hScrollAnim,
              start: "left 92%",
              end: "left 66%",
              scrub: true,
            },
          }
        );
      }

      // Description — slides up after title
      const desc = card.querySelector(".card-desc");
      if (desc) {
        gsap.fromTo(
          desc,
          { opacity: 0.16, y: 24 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: hScrollAnim,
              start: "left 90%",
              end: "left 60%",
              scrub: true,
            },
          }
        );
      }

      // Action button — pops in last
      const action = card.querySelector(".card-action");
      if (action) {
        gsap.fromTo(
          action,
          { opacity: 0.18, scale: 0.88 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: hScrollAnim,
              start: "left 86%",
              end: "left 58%",
              scrub: true,
            },
          }
        );
      }
    });
  }, { scope: sectionRef, dependencies: [isMobile], revertOnUpdate: true });

  // Shared card content — rendered identically on both mobile and desktop
  const renderCard = (project) => (
    <div
      key={project.id}
      className={`h-project-card flex-none bg-[#0A0A0A] rounded-[2rem] overflow-hidden shadow-2xl border border-black/15 flex flex-col ${
        isMobile ? "w-[80vw] snap-center" : "w-[clamp(360px,30vw,420px)]"
      }`}
      style={{ height: isMobile ? "65vh" : "60vh", minHeight: "400px", maxHeight: "620px" }}
    >
      {/* Image (top ~60%) */}
      <div className="relative overflow-hidden bg-black/50" style={{ height: isMobile ? "60%" : "54%" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A]/78 z-10" />
        {project.inProgress && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-[#8B7E66]/40 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7B580] animate-pulse" />
            <span className="text-[10px] font-mono font-semibold tracking-[0.15em] text-[#C7B580] uppercase">
              Still in Progress
            </span>
          </div>
        )}
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
        className="flex flex-col justify-between p-7 md:p-8 bg-[#111] border-t border-white/5 relative z-20"
        style={{ height: isMobile ? "40%" : "46%" }}
      >
        <div className="space-y-3">
          <span className="card-category text-[10px] md:text-[11px] font-bold tracking-[0.25em] text-[#8B7E66] uppercase block">
            {project.category}
          </span>
          <h3 className="card-title text-xl md:text-[2rem] font-serif font-bold text-[#DBD5B5] leading-[0.95]">
            {project.title}
          </h3>
          <p
            className={`card-desc text-neutral-400 text-xs md:text-[0.92rem] leading-[1.65] font-geist-mono ${
              isMobile ? "line-clamp-3" : ""
            }`}
          >
            {project.description}
          </p>
        </div>

        <div className="card-action flex justify-between items-center mt-auto pt-4 border-t border-white/6">
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-[#8B7E66]/70 font-mono">
            {project.link ? "Protocol Online" : "In Private Build"}
          </span>
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
  );

  // ─── MOBILE LAYOUT — CSS-only horizontal snap scroll ─────────────────────
  if (isMobile) {
    return (
      <section id="projects" className="relative bg-[#F5F2EB] py-20">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-noise-pattern z-0" />

        <div className="text-center w-full px-4 mb-10 relative z-10">
          <span className="text-xs font-bold tracking-[0.25em] text-[#8B7E66] uppercase mb-3 block">
            Selected Work
          </span>
          <h2 className="text-4xl font-bold font-accent text-[#8B7E66]">
            Featured Projects
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-sm leading-relaxed text-[#5F5749] font-geist-mono">
            Active instruments, deployed studies, and in-progress systems. Swipe through the portfolio stream to inspect each protocol without losing the working description.
          </p>
        </div>

        {/* Horizontally scrollable snap container */}
        <div
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 relative z-10"
          style={{
            paddingLeft: "5vw",
            paddingRight: "5vw",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {projects.map(renderCard)}
        </div>

        <p className="text-center text-[#8B7E66]/50 text-xs tracking-[0.2em] uppercase mt-6 relative z-10">
          Swipe to explore →
        </p>
      </section>
    );
  }

  // ─── DESKTOP LAYOUT — GSAP sticky horizontal scroll ───────────────────────
  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-[#F5F2EB]"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-noise-pattern z-0" />

      <div className="min-h-screen overflow-hidden flex flex-col pt-20 pb-8">
        <div className="projects-intro relative z-20 w-full px-8 md:px-12 lg:px-16 flex-none">
          <div className="max-w-6xl mx-auto text-center">
            <span className="text-xs font-bold tracking-[0.25em] text-[#8B7E66] uppercase mb-4 block">
              Selected Work
            </span>
            <h2 className="text-4xl md:text-6xl font-bold font-accent text-[#8B7E66] leading-none">
              Featured Projects
            </h2>
          </div>
        </div>

        <div className="w-full px-8 md:px-12 lg:px-16 flex-1 flex items-end mt-10">
          <div className="max-w-7xl mx-auto">
            <div
              ref={trackRef}
              className="flex gap-8 items-stretch will-change-transform"
              style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
            >
              {projects.map(renderCard)}
            </div>
          </div>
        </div>

        <div className="w-full px-8 md:px-12 lg:px-16 pt-8 flex-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[#8B7E66]/60 text-xs tracking-[0.2em] uppercase font-mono">
            <span>Scroll to inspect</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCarousel;
