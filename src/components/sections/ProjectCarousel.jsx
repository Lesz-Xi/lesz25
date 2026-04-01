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
    image: "/images/projects/wu-weism-display.png",
    imagePosition: "62% center",
    mobileImagePosition: "58% center",
    mobileImageFit: "contain",
    inProgress: true,
    link: "https://wuweism.com",
    description: "Causal AI workbench for hypothesis, intervention, and counterfactual reasoning."
  },
  {
    id: 1,
    title: "ThesisLens",
    category: "Academic Integrity",
    image: "/images/projects/thesislens-v2.webp",
    imagePosition: "center top",
    link: "https://thesislens.space/",
    description: "Academic integrity platform built to reduce AI false positives with forensic defenses."
  },
  {
    id: 3,
    title: "Universe Splitter",
    category: "Quantum Experiment",
    image: "/images/projects/universe-splitter.webp",
    imagePosition: "center top",
    link: "https://univ-spitter.vercel.app/",
    description: "Interactive many-worlds visualization for exploring quantum branching events."
  },
  {
    id: 2,
    title: "SkillShift AI",
    category: "Coaching Platform",
    image: "/images/projects/skillshift-v3.webp",
    imagePosition: "center top",
    link: null,
    description: "AI coaching platform for MLBB with role-specific feedback and adaptive training."
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
  const renderCard = (project, index) => (
    <div
      key={project.id}
      className={`h-project-card group relative flex-none overflow-hidden rounded-[1.85rem] border border-[#3A342A]/16 bg-[#11100E] flex flex-col ${
        isMobile ? "w-[80vw] snap-center" : "w-[clamp(360px,30vw,420px)]"
      }`}
      style={{
        height: isMobile ? "65vh" : "62vh",
        minHeight: isMobile ? "400px" : "430px",
        maxHeight: "640px",
        boxShadow: "0 22px 72px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.025)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#DBD5B5]/14 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(219,213,181,0.045),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.015),transparent_22%,transparent_76%,rgba(0,0,0,0.08))]" />

      {/* Image (top ~60%) */}
      <div className="relative overflow-hidden bg-[#0D0D0C]" style={{ height: isMobile ? "57%" : "53%" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#11100E]/84 z-10" />
        {project.inProgress && (
          <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-[#C7B580]/18 bg-[#141311]/82 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C7B580]" />
            <span className="text-[9px] font-geist-mono font-medium tracking-[0.18em] text-[#C7B580]/90 uppercase">
              Still in Progress
            </span>
          </div>
        )}
        <img
          src={project.image}
          alt={project.title}
          className={`card-img w-full h-full ${isMobile && project.mobileImageFit === "contain" ? "object-contain" : "object-cover"}`}
          style={{ objectPosition: (isMobile ? project.mobileImagePosition : project.imagePosition) || project.imagePosition || "center" }}
          loading="lazy"
        />
      </div>

      {/* Content (bottom ~40%) */}
      <div
        className="relative z-20 flex min-h-0 flex-col border-t border-white/5 bg-[#11100E]/98 p-6 md:p-7"
        style={{ height: isMobile ? "43%" : "47%" }}
      >
        <div className="flex items-center justify-between gap-4 pb-4">
          <div className="min-w-0">
            <span className="card-category block text-[10px] md:text-[10.5px] font-semibold tracking-[0.24em] text-[#8B7E66]/82 uppercase">
              {project.category}
            </span>
          </div>
          <span className="shrink-0 text-[10px] font-geist-mono tracking-[0.22em] text-[#DBD5B5]/28">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="mb-4 h-px bg-gradient-to-r from-[#DBD5B5]/10 via-[#8B7E66]/10 to-transparent" />

        <div className="flex-1 min-h-0 overflow-hidden">
          <h3 className="card-title max-w-[14ch] text-[1.55rem] md:text-[1.85rem] font-heading font-semibold tracking-[-0.04em] text-[#F1ECD9] leading-[0.96]">
            {project.title}
          </h3>
          <p
            className={`card-desc mt-4 max-w-[30ch] text-[0.9rem] md:text-[0.96rem] leading-[1.6] text-[#B8B1A2] ${
              isMobile ? "line-clamp-3" : "line-clamp-4"
            }`}
          >
            {project.description}
          </p>
        </div>

        <div className="card-action mt-5 flex shrink-0 items-center justify-between gap-3 border-t border-white/6 pt-4">
          <span className="min-w-0 truncate text-[10px] md:text-[10.5px] uppercase tracking-[0.18em] text-[#8B7E66]/62 font-geist-mono">
            {project.link ? "Protocol Online" : "In Private Build"}
          </span>
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex shrink-0 items-center gap-2 rounded-full border border-[#DBD5B5]/14 px-3.5 py-2 text-[10px] md:text-[10.5px] font-medium uppercase tracking-[0.18em] text-[#E7E0C6] transition-all duration-300 hover:border-[#DBD5B5]/28 hover:bg-[#DBD5B5]/6"
              aria-label={`View ${project.title}`}
            >
              <span>View</span>
              <svg
                className="h-3.5 w-3.5 text-[#DBD5B5] transition-transform duration-300 group-hover/btn:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          ) : (
            <span className="rounded-full border border-[#C7B580]/14 px-3.5 py-2 text-[10px] font-geist-mono uppercase tracking-[0.18em] text-[#C7B580]/72">
              Private Build
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
