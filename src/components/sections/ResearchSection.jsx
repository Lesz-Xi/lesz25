import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Decorative SVGs ─── */

// DNA helix for The Entropic Vise
const DNADecoration = () => (
  <svg
    viewBox="0 0 120 480"
    className="w-full h-full"
    fill="none"
    stroke="currentColor"
    strokeWidth="0.6"
    aria-hidden="true"
  >
    <path d="M30 0 Q90 60 30 120 Q-30 180 30 240 Q90 300 30 360 Q-30 420 30 480" />
    <path d="M90 0 Q30 60 90 120 Q150 180 90 240 Q30 300 90 360 Q150 420 90 480" />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
      <line
        key={i}
        x1="30"
        y1={i * 48 + 24}
        x2="90"
        y2={i * 48 + 24}
        strokeWidth="0.4"
        opacity="0.6"
      />
    ))}
  </svg>
);

// Causal DAG for MASA
const CausalGraph = () => (
  <svg
    viewBox="0 0 200 280"
    className="w-full h-full"
    fill="none"
    aria-hidden="true"
  >
    {/* Edges — dashed */}
    <line x1="100" y1="38" x2="50" y2="98" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.5" />
    <line x1="100" y1="38" x2="150" y2="98" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.5" />
    <line x1="50"  y1="112" x2="30"  y2="178" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.5" />
    <line x1="50"  y1="112" x2="100" y2="178" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.5" />
    <line x1="150" y1="112" x2="100" y2="178" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.5" />
    <line x1="150" y1="112" x2="170" y2="178" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.5" />
    <line x1="30"  y1="192" x2="100" y2="245" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.3" />
    <line x1="100" y1="192" x2="100" y2="245" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.3" />
    <line x1="170" y1="192" x2="100" y2="245" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.3" />
    {/* Nodes */}
    <circle cx="100" cy="28" r="10" stroke="currentColor" strokeWidth="0.6" opacity="0.7" />
    <circle cx="50"  cy="105" r="8"  stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
    <circle cx="150" cy="105" r="8"  stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
    <circle cx="30"  cy="185" r="7"  stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    <circle cx="100" cy="185" r="7"  stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    <circle cx="170" cy="185" r="7"  stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    <circle cx="100" cy="252" r="10" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
    {/* Node labels */}
    <text x="96"  y="32"  fill="currentColor" fontSize="6" fontFamily="monospace" opacity="0.8">H</text>
    <text x="46"  y="109" fill="currentColor" fontSize="5" fontFamily="monospace" opacity="0.7">G</text>
    <text x="146" y="109" fill="currentColor" fontSize="5" fontFamily="monospace" opacity="0.7">E</text>
    <text x="25"  y="189" fill="currentColor" fontSize="5" fontFamily="monospace" opacity="0.6">M₁</text>
    <text x="96"  y="189" fill="currentColor" fontSize="5" fontFamily="monospace" opacity="0.6">M₂</text>
    <text x="165" y="189" fill="currentColor" fontSize="5" fontFamily="monospace" opacity="0.6">V</text>
    <text x="96"  y="256" fill="currentColor" fontSize="6" fontFamily="monospace" opacity="0.5">Ω</text>
  </svg>
);

/* ─── Data ─── */
const research = [
  {
    id: "01",
    status: "Preprint",
    statusHue: "#8B7E66",
    category: "Computational Virology",
    shortTitle: "The Entropic Vise",
    title:
      "The Entropic Vise: A Physics-Based Framework for HIV-1 Eradication Through Thermodynamic Targeting, Adversarial Prediction, and Real-Time Latency Detection",
    author: "Rhine Lesther Tague",
    date: "January 5, 2026",
    doi: "10.5281/zenodo.18287138",
    views: "89",
    downloads: "58",
    abstract:
      "A physics-based framework exploiting high-barrier thermodynamic constraints — regions where mutations impose severe fitness costs on the virus. Three integrated components: the Entropic Vise targeting the gp41 HR1 domain; Thermodynamically Constrained Generative Models predicting future variants; and Sentinel Cells with humanised reporters for real-time latency detection.",
    keywords: ["HIV-1", "Thermodynamics", "Shannon Entropy", "TC-GAN", "Sentinel Cells", "Computational Virology"],
    indexed: "OpenAIRE",
    primaryCta: { label: "Read on Zenodo", url: "https://zenodo.org/records/18287138" },
    secondaryCta: { label: "View Repository", url: "https://github.com/Lesz-Xi/hiv-entropic-vise" },
    Decoration: DNADecoration,
  },
  {
    id: "02",
    status: "White Paper · v1.2",
    statusHue: "#4CAF81",
    category: "Causal AI Architecture",
    shortTitle: "MASA",
    title: "Methods of Automated Scientific Analysis",
    subtitle: "A Trust-First AI Architecture for Scientific Discovery, Causal Governance, and Auditable Reasoning",
    author: "Rhine Lesther Tague",
    date: "March 2026",
    abstract:
      "MASA runs a closed loop: (1) hypothesis generation from heterogeneous evidence, (2) multi-agent critique under explicit causal and methodological constraints, (3) durable memory of evaluations and traces, and (4) governance protocols that force claims to match implementation reality. Core breakthroughs include a deterministic Causal Engine v1.0 for fully specified linear DAGs and a governance stack tracking drift between architectural claims and code reality.",
    pillars: [
      { key: "Generator", desc: "Novel Idea Engine — synthesises hypotheses from multi-source contradictions via Hong Recombination." },
      { key: "Evaluator", desc: "MASA Auditor — Epistemologist, Skeptic & Architect agents run Popperian critique." },
      { key: "Memory", desc: "Sovereign Memory — rejection-aware RAG with pgvector + causal lattice events." },
    ],
    keywords: ["Causal AI", "Do-Calculus", "Sovereign Memory", "RAG", "pgvector", "Pyodide", "Judea Pearl"],
    primaryCta: { label: "Read White Paper", url: "https://wuweism.com" },
    secondaryCta: { label: "View Project", url: "https://github.com/Lesz-Xi" },
    Decoration: CausalGraph,
  },
];

/* ─── Component ─── */
const ResearchSection = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const card0Ref = useRef(null);
  const card1Ref = useRef(null);

  useGSAP(
    () => {
      // 1. Section heading words
      const words = headingRef.current?.querySelectorAll(".word");
      if (words?.length) {
        gsap.fromTo(
          words,
          { y: 60, opacity: 0, rotateX: -40 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 2. Timeline connector line
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1.4,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: lineRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 3. Helper to animate each card
      const animateCard = (cardEl, direction = 1) => {
        if (!cardEl) return;

        // Card wipe reveal
        gsap.fromTo(
          cardEl,
          { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardEl,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Ghost index number
        const ghost = cardEl.querySelector(".ghost-number");
        if (ghost) {
          gsap.fromTo(
            ghost,
            { x: direction * 80, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: cardEl,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Content children stagger
        const children = cardEl.querySelectorAll(
          ".reveal-child"
        );
        if (children.length) {
          gsap.fromTo(
            children,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.07,
              ease: "power2.out",
              delay: 0.2,
              scrollTrigger: {
                trigger: cardEl,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Keywords pop
        const tags = cardEl.querySelectorAll(".keyword-tag");
        if (tags.length) {
          gsap.fromTo(
            tags,
            { scale: 0.6, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              stagger: 0.04,
              ease: "back.out(1.7)",
              delay: 0.35,
              scrollTrigger: {
                trigger: cardEl,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      };

      animateCard(card0Ref.current, -1);
      animateCard(card1Ref.current, 1);
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="research"
      ref={sectionRef}
      className="py-20 md:py-36 relative overflow-hidden"
      style={{ backgroundColor: "#070707" }}
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-noise-pattern z-0" />

      <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10">

        {/* ── Section Header ── */}
        <div className="mb-20 md:mb-28">
          <span className="text-xs font-bold tracking-[0.22em] text-[#DBD5B5]/30 uppercase mb-5 block font-geist-mono">
            Academic Work
          </span>

          <div
            ref={headingRef}
            className="overflow-hidden"
            style={{ perspective: "800px" }}
          >
            <h2 className="text-5xl md:text-7xl font-bold font-accent text-[#8B7E66] leading-none flex flex-wrap gap-x-4">
              {["Research", "&", "Publications"].map((w) => (
                <span
                  key={w}
                  className="word inline-block"
                  style={{ display: "inline-block" }}
                >
                  {w}
                </span>
              ))}
            </h2>
          </div>

          <p className="text-[#DBD5B5]/50 text-sm md:text-base max-w-lg font-geist-mono mt-5 leading-relaxed">
            Exploring causally disciplined AI, physics-based biomedical
            frameworks, and the intersection where they converge.
          </p>
        </div>

        {/* ── Timeline stack ── */}
        <div className="relative flex flex-col gap-0">

          {/* Vertical connector line */}
          <div className="hidden md:block absolute left-[52px] top-0 bottom-0 z-0">
            <div
              ref={lineRef}
              className="w-px h-full"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, #8B7E66 15%, #8B7E66 85%, transparent 100%)",
                opacity: 0.18,
              }}
            />
          </div>

          {/* ── Cards ── */}
          {research.map((item, index) => {
            const isEven = index % 2 === 0;
            const cardRef = index === 0 ? card0Ref : card1Ref;

            return (
              <div
                key={item.id}
                ref={cardRef}
                className={`relative mb-6 md:mb-10 ${index > 0 ? "mt-12 md:mt-20" : ""}`}
              >
                {/* Ghost index number */}
                <div
                  className="ghost-number absolute pointer-events-none select-none z-0 opacity-0"
                  style={{
                    fontSize: "clamp(120px, 18vw, 220px)",
                    fontFamily: "'Clash Display', sans-serif",
                    fontWeight: 700,
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(139,126,102,0.07)",
                    lineHeight: 1,
                    top: "-0.15em",
                    right: isEven ? "auto" : "-0.05em",
                    left: isEven ? "-0.05em" : "auto",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {item.id}
                </div>

                {/* Card body */}
                <div
                  className="relative rounded-2xl md:rounded-3xl overflow-hidden border transition-all duration-500 group"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.018)",
                    borderColor: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(16px)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor =
                      `${item.statusHue}33`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)")
                  }
                >
                  {/* Top accent stripe */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${item.statusHue}55, transparent)`,
                    }}
                  />

                  <div
                    className={`flex flex-col lg:flex-row ${
                      !isEven ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* ── Left / Visual Panel ── */}
                    <div
                      className="lg:w-[42%] p-6 md:p-10 flex flex-col justify-between border-b lg:border-b-0 relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, #0D0D0D 0%, #111 50%, #0D0D0D 100%)",
                        borderColor: isEven
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(255,255,255,0.04)",
                        borderRightWidth: isEven ? "1px" : 0,
                        borderLeftWidth: !isEven ? "1px" : 0,
                        borderStyle: "solid",
                      }}
                    >
                      {/* Decorative pattern */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.055] pointer-events-none text-[#8B7E66]">
                        <div className="w-48 h-72">
                          <item.Decoration />
                        </div>
                      </div>

                      {/* Index dot */}
                      <div className="relative z-10 flex items-center gap-3 mb-6 md:mb-8 reveal-child">
                        <span
                          className="text-xs font-bold tracking-[0.18em] font-geist-mono"
                          style={{ color: item.statusHue }}
                        >
                          N° {item.id}
                        </span>
                        <div
                          className="flex-1 h-px"
                          style={{
                            background: `linear-gradient(90deg, ${item.statusHue}44, transparent)`,
                          }}
                        />
                        <span
                          className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase font-geist-mono px-2.5 py-1 rounded-full border"
                          style={{
                            color: item.statusHue,
                            borderColor: `${item.statusHue}33`,
                            backgroundColor: `${item.statusHue}10`,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: item.statusHue }}
                          />
                          {item.status}
                        </span>
                      </div>

                      {/* Short title */}
                      <div className="relative z-10 reveal-child">
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 font-geist-mono text-[#DBD5B5]/30">
                          {item.category}
                        </p>
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#DBD5B5] leading-tight mb-1">
                          {item.shortTitle}
                        </h3>
                        {item.subtitle && (
                          <p className="text-xs text-[#DBD5B5]/40 font-geist-mono leading-relaxed mt-2">
                            {item.subtitle}
                          </p>
                        )}
                        <p className="text-sm text-[#DBD5B5]/40 font-geist-mono mt-2">
                          {item.author} · {item.date}
                        </p>
                      </div>

                      {/* Stats or Pillars */}
                      <div className="relative z-10 mt-6 reveal-child">
                        {item.pillars ? (
                          <div className="flex flex-col gap-2">
                            {item.pillars.map((p) => (
                              <div
                                key={p.key}
                                className="p-3 rounded-xl border text-[#DBD5B5]/60 hover:text-[#DBD5B5] transition-colors"
                                style={{
                                  backgroundColor: "rgba(255,255,255,0.02)",
                                  borderColor: "rgba(255,255,255,0.05)",
                                }}
                              >
                                <p
                                  className="text-[9px] font-bold tracking-[0.15em] uppercase font-geist-mono mb-0.5"
                                  style={{ color: item.statusHue }}
                                >
                                  {p.key}
                                </p>
                                <p className="text-[11px] font-geist-mono leading-relaxed">
                                  {p.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { val: item.views, label: "Views" },
                              { val: item.downloads, label: "Downloads" },
                            ].map(({ val, label }) => (
                              <div
                                key={label}
                                className="stat-item p-4 rounded-xl border hover:border-[#8B7E66]/20 transition-colors"
                                style={{
                                  backgroundColor: "rgba(255,255,255,0.02)",
                                  borderColor: "rgba(255,255,255,0.05)",
                                }}
                              >
                                <p className="text-2xl md:text-3xl font-bold text-[#DBD5B5] font-display">
                                  {val}
                                </p>
                                <p className="text-[10px] text-[#DBD5B5]/40 uppercase tracking-widest font-geist-mono mt-1">
                                  {label}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── Right / Content Panel ── */}
                    <div className="lg:w-[58%] p-6 md:p-10 flex flex-col justify-between">

                      {/* DOI or version row */}
                      <div className="flex flex-wrap items-center gap-3 mb-6 reveal-child">
                        {item.doi ? (
                          <a
                            href={`https://doi.org/${item.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors"
                            style={{
                              backgroundColor: "rgba(139,126,102,0.08)",
                              border: "1px solid rgba(139,126,102,0.25)",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "rgba(139,126,102,0.15)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "rgba(139,126,102,0.08)")
                            }
                          >
                            <span className="text-xs font-bold text-[#8B7E66]">DOI</span>
                            <span className="text-xs text-[#DBD5B5] font-mono">{item.doi}</span>
                          </a>
                        ) : (
                          <span
                            className="text-xs font-bold font-geist-mono px-3 py-1.5 rounded-md"
                            style={{
                              color: item.statusHue,
                              backgroundColor: `${item.statusHue}12`,
                              border: `1px solid ${item.statusHue}33`,
                            }}
                          >
                            Wu-Weism Research · March 2026
                          </span>
                        )}
                        {item.indexed && (
                          <span className="text-xs text-[#DBD5B5]/35 font-geist-mono flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-[#8B7E66]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            Indexed · {item.indexed}
                          </span>
                        )}
                      </div>

                      {/* Full title */}
                      <div className="reveal-child mb-4">
                        <h4 className="text-base md:text-lg font-medium text-[#DBD5B5]/85 leading-relaxed font-serif">
                          {item.title}
                        </h4>
                      </div>

                      {/* Abstract */}
                      <p className="text-sm text-[#DBD5B5]/45 leading-relaxed font-geist-mono mb-6 reveal-child">
                        {item.abstract}
                      </p>

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-2 mb-8 reveal-child">
                        {item.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="keyword-tag px-2.5 py-1 rounded-full text-[11px] font-medium font-geist-mono cursor-default transition-all duration-200"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.025)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "rgba(219,213,181,0.55)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = `${item.statusHue}55`;
                              e.currentTarget.style.color = "#DBD5B5";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor =
                                "rgba(255,255,255,0.08)";
                              e.currentTarget.style.color =
                                "rgba(219,213,181,0.55)";
                            }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      {/* Divider */}
                      <div
                        className="h-px mb-7 reveal-child"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04) 80%, transparent)",
                        }}
                      />

                      {/* CTAs */}
                      <div className="flex flex-wrap gap-3 reveal-child">
                        <a
                          href={item.primaryCta.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-display tracking-wide text-white transition-all duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${item.statusHue}, ${item.statusHue}cc)`,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.boxShadow = `0 8px 24px ${item.statusHue}33`)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.boxShadow = "none")
                          }
                        >
                          <span>{item.primaryCta.label}</span>
                          <svg
                            className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>

                        <a
                          href={item.secondaryCta.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-display tracking-wide transition-all duration-300"
                          style={{
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: item.statusHue,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor =
                              "rgba(219,213,181,0.35)";
                            e.currentTarget.style.color = "#DBD5B5";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor =
                              "rgba(255,255,255,0.1)";
                            e.currentTarget.style.color = item.statusHue;
                          }}
                        >
                          {item.id === "02" ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" opacity="0.8" />
                              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="white" strokeWidth="1" fill="none" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span>{item.secondaryCta.label}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer note ── */}
        <div className="mt-16 md:mt-24 flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
          <p className="text-[11px] text-[#DBD5B5]/25 font-geist-mono tracking-wider whitespace-nowrap">
            Research ongoing · Wu-Weism · 2026
          </p>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
        </div>

      </div>
    </section>
  );
};

export default ResearchSection;
