import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Portfolio design tokens (mirroring the rest of the site) ─── */
// #070707  section bg
// #0A0A0A  card bg
// #111     inner panel bg
// #8B7E66  primary accent (taupe-gold) — used across CareerSection, ProjectCarousel
// #C7B580  secondary accent (brighter gold) — used for "Still in Progress" badge
// #DBD5B5  primary text (warm cream)
// #5F5749  muted accent

/* ─── Decorative SVGs ─── */

const DNADecoration = () => (
  <svg viewBox="0 0 100 320" className="w-full h-full" fill="none"
    stroke="#8B7E66" strokeWidth="0.7" aria-hidden="true">
    <path d="M25 0 Q75 40 25 80 Q-25 120 25 160 Q75 200 25 240 Q-25 280 25 320" opacity="0.45" />
    <path d="M75 0 Q25 40 75 80 Q125 120 75 160 Q25 200 75 240 Q125 280 75 320" opacity="0.45" />
    {[0,1,2,3,4,5,6,7].map(i => (
      <line key={i} x1="25" y1={i*40+20} x2="75" y2={i*40+20} strokeWidth="0.5" opacity="0.3" />
    ))}
  </svg>
);

const CausalGraph = () => (
  <svg viewBox="0 0 140 180" className="w-full h-full" fill="none" aria-hidden="true">
    {/* edges */}
    <line x1="70" y1="26" x2="35" y2="70"  stroke="#C7B580" strokeWidth="0.6" strokeDasharray="4 3" opacity="0.35" />
    <line x1="70" y1="26" x2="105" y2="70" stroke="#C7B580" strokeWidth="0.6" strokeDasharray="4 3" opacity="0.35" />
    <line x1="35"  y1="82" x2="20"  y2="132" stroke="#C7B580" strokeWidth="0.6" strokeDasharray="4 3" opacity="0.28" />
    <line x1="35"  y1="82" x2="70"  y2="132" stroke="#C7B580" strokeWidth="0.6" strokeDasharray="4 3" opacity="0.28" />
    <line x1="105" y1="82" x2="70"  y2="132" stroke="#C7B580" strokeWidth="0.6" strokeDasharray="4 3" opacity="0.28" />
    <line x1="105" y1="82" x2="120" y2="132" stroke="#C7B580" strokeWidth="0.6" strokeDasharray="4 3" opacity="0.28" />
    {/* nodes */}
    <circle cx="70"  cy="20"  r="8"  stroke="#C7B580" strokeWidth="0.7" opacity="0.55" />
    <circle cx="35"  cy="76"  r="6"  stroke="#C7B580" strokeWidth="0.7" opacity="0.45" />
    <circle cx="105" cy="76"  r="6"  stroke="#C7B580" strokeWidth="0.7" opacity="0.45" />
    <circle cx="20"  cy="138" r="5"  stroke="#C7B580" strokeWidth="0.7" opacity="0.35" />
    <circle cx="70"  cy="138" r="5"  stroke="#C7B580" strokeWidth="0.7" opacity="0.35" />
    <circle cx="120" cy="138" r="5"  stroke="#C7B580" strokeWidth="0.7" opacity="0.35" />
    {/* labels */}
    <text x="67"  y="24"  fill="#C7B580" fontSize="5" fontFamily="monospace" opacity="0.7">H</text>
    <text x="32"  y="80"  fill="#C7B580" fontSize="4.5" fontFamily="monospace" opacity="0.6">G</text>
    <text x="102" y="80"  fill="#C7B580" fontSize="4.5" fontFamily="monospace" opacity="0.6">E</text>
    <text x="15"  y="142" fill="#C7B580" fontSize="4" fontFamily="monospace" opacity="0.5">M₁</text>
    <text x="67"  y="142" fill="#C7B580" fontSize="4" fontFamily="monospace" opacity="0.5">M₂</text>
    <text x="116" y="142" fill="#C7B580" fontSize="4" fontFamily="monospace" opacity="0.5">V</text>
  </svg>
);

/* ─── Data ─── */
const research = [
  {
    id: "01",
    accent: "#8B7E66",       // primary taupe-gold — published paper
    status: "Preprint",
    category: "Computational Virology",
    shortTitle: "The Entropic Vise",
    title: "The Entropic Vise: A Physics-Based Framework for HIV-1 Eradication Through Thermodynamic Targeting, Adversarial Prediction, and Real-Time Latency Detection",
    author: "Rhine Lesther Tague",
    date: "January 5, 2026",
    doi: "10.5281/zenodo.18287138",
    stats: [{ val: "103", label: "Views" }, { val: "62", label: "Downloads" }],
    abstract: "A physics-based framework exploiting high-barrier thermodynamic constraints — regions where mutations impose severe fitness costs on the virus. Three integrated components: the Entropic Vise targeting the gp41 HR1 domain; Thermodynamically Constrained Generative Models that predict future variants; and Sentinel Cells with humanised reporters for real-time latency detection.",
    keywords: ["HIV-1", "Thermodynamics", "Shannon Entropy", "Generative AI", "TC-GAN", "Sentinel Cells", "Computational Virology"],
    indexed: "OpenAIRE",
    primaryCta: { label: "Read on Zenodo", url: "https://zenodo.org/records/18287138", icon: "arrow" },
    secondaryCta: { label: "View Repository", url: "https://github.com/Lesz-Xi/hiv-entropic-vise", icon: "github" },
    Decoration: DNADecoration,
    flip: false,
  },
  {
    id: "02",
    accent: "#C7B580",       // lighter gold — matches the "Still in Progress" badge in ProjectCarousel
    status: "White Paper · v1.2",
    category: "Causal AI Architecture",
    shortTitle: "MASA",
    title: "Methods of Automated Scientific Analysis — A Trust-First AI Architecture for Scientific Discovery, Causal Governance, and Auditable Reasoning",
    author: "Rhine Lesther Tague",
    date: "March 2026",
    pillars: [
      { key: "Generator", desc: "Novel Idea Engine — Hong Recombination synthesises hypotheses from multi-source contradictions." },
      { key: "Evaluator", desc: "MASA Auditor — Epistemologist, Skeptic & Architect agents run Popperian critique." },
      { key: "Memory",    desc: "Sovereign Memory — rejection-aware RAG with pgvector + causal lattice events." },
    ],
    abstract: "A proprietary AI architecture for causally disciplined scientific discovery. MASA runs a closed loop: hypothesis generation from heterogeneous evidence, multi-agent critique under explicit causal constraints, durable memory of evaluations, and governance protocols that force claims to match implementation reality.",
    keywords: ["Causal AI", "Do-Calculus", "Sovereign Memory", "RAG", "pgvector", "Pyodide", "Judea Pearl"],
    primaryCta: { label: "Read White Paper", url: "/MASA_White_Paper.html", icon: "doc" },
    secondaryCta: { label: "View Project", url: "https://github.com/Lesz-Xi", icon: "github" },
    Decoration: CausalGraph,
    flip: true,
  },
];

/* ─── Icon helpers ─── */
const ArrowIcon = () => (
  <svg className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-0.5" fill="none"
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);
const GitHubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);
const DocIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const CtaIcon = ({ type }) => {
  if (type === "github") return <GitHubIcon />;
  if (type === "doc")    return <DocIcon />;
  return <ArrowIcon />;
};

/* ─── ResearchSection ─── */
const ResearchSection = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const card0Ref   = useRef(null);
  const card1Ref   = useRef(null);

  useGSAP(() => {
    /* 1. Heading words slide up */
    const words = headingRef.current?.querySelectorAll(".word");
    if (words?.length) {
      gsap.fromTo(words,
        { y: 56, opacity: 0, rotateX: -35 },
        {
          y: 0, opacity: 1, rotateX: 0,
          duration: 0.95, stagger: 0.09, ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    /* 2. Per-card reveal helper */
    const animCard = (el, slideDir) => {
      if (!el) return;

      // Clip-path wipe
      gsap.fromTo(el,
        { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)", opacity: 1,
          duration: 1.05, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none reverse" },
        }
      );

      // Ghost number slides in from the side
      const ghost = el.querySelector(".ghost-num");
      if (ghost) {
        gsap.fromTo(ghost,
          { x: slideDir * 70, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1.1, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" },
          }
        );
      }

      // Content children stagger
      const children = el.querySelectorAll(".rc");
      if (children.length) {
        gsap.fromTo(children,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.7, stagger: 0.07, ease: "power2.out", delay: 0.18,
            scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none reverse" },
          }
        );
      }

      // Keywords bounce
      const tags = el.querySelectorAll(".kw");
      if (tags.length) {
        gsap.fromTo(tags,
          { scale: 0.65, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.38, stagger: 0.04, ease: "back.out(1.7)", delay: 0.32,
            scrollTrigger: { trigger: el, start: "top 72%", toggleActions: "play none none reverse" },
          }
        );
      }
    };

    animCard(card0Ref.current, -1);
    animCard(card1Ref.current,  1);
  }, { scope: sectionRef });

  return (
    <section
      id="research"
      ref={sectionRef}
      className="py-20 md:py-36 relative overflow-hidden"
      style={{ backgroundColor: "#070707" }}
    >
      {/* Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-noise-pattern z-0" />

      <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10">

        {/* ── Header ── */}
        <div className="mb-20 md:mb-28">
          <span className="text-xs font-bold tracking-[0.22em] text-[#DBD5B5]/30 uppercase mb-5 block font-geist-mono">
            Academic Work
          </span>
          <div ref={headingRef} className="overflow-hidden" style={{ perspective: "700px" }}>
            <h2 className="text-5xl md:text-7xl font-bold font-accent text-[#8B7E66] leading-none flex flex-wrap gap-x-4">
              {["Research", "&", "Publications"].map(w => (
                <span key={w} className="word inline-block">{w}</span>
              ))}
            </h2>
          </div>
          <p className="text-[#DBD5B5]/45 text-sm md:text-base max-w-lg font-geist-mono mt-5 leading-relaxed">
            Exploring causally disciplined AI, physics-based biomedical frameworks,
            and the intersection where they converge.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="flex flex-col gap-8 md:gap-12">
          {research.map((item, idx) => {
            const cardRef = idx === 0 ? card0Ref : card1Ref;

            return (
              <div key={item.id} ref={cardRef} className="relative">

                {/* Ghost index number */}
                <div
                  className="ghost-num absolute pointer-events-none select-none z-0 opacity-0"
                  style={{
                    fontSize: "clamp(100px, 16vw, 200px)",
                    fontFamily: "'Clash Display', sans-serif",
                    fontWeight: 700,
                    color: "transparent",
                    WebkitTextStroke: `1px ${item.accent}09`,
                    lineHeight: 1,
                    top: "-0.1em",
                    [item.flip ? "right" : "left"]: "-0.04em",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {item.id}
                </div>

                {/* ── Card shell — matches ProjectCarousel aesthetic ── */}
                <div className="relative rounded-[2rem] overflow-hidden border border-white/[0.06] bg-[#0A0A0A] group
                                transition-all duration-500 hover:border-white/[0.11] hover:shadow-2xl"
                  style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.6)" }}
                >
                  {/* Top shimmer line using the card's accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
                    style={{ background: `linear-gradient(90deg, transparent 0%, ${item.accent}50 40%, ${item.accent}50 60%, transparent 100%)` }}
                  />

                  {/* ── Two-column layout ── */}
                  <div className={`flex flex-col lg:flex-row ${item.flip ? "lg:flex-row-reverse" : ""}`}>

                    {/* ── Side panel (decoration + meta) ── */}
                    <div
                      className={`lg:w-[38%] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden
                                  border-b lg:border-b-0
                                  ${item.flip
                                    ? "lg:border-l border-white/[0.04]"
                                    : "lg:border-r border-white/[0.04]"}`}
                      style={{ background: "linear-gradient(160deg,#0D0D0D 0%,#111 60%,#0D0D0D 100%)" }}
                    >
                      {/* Decoration */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-36 h-48 opacity-[0.07]">
                          <item.Decoration />
                        </div>
                      </div>

                      {/* Number + category */}
                      <div className="relative z-10 rc">
                        <div className="flex items-center gap-3 mb-6">
                          <span
                            className="text-[10px] font-bold tracking-[0.25em] uppercase font-geist-mono px-2.5 py-1
                                       rounded border"
                            style={{ color: item.accent, borderColor: `${item.accent}30`, background: `${item.accent}0d` }}
                          >
                            N° {item.id}
                          </span>
                          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,${item.accent}30,transparent)` }} />
                          {/* Status badge — same pill style as "Still in Progress" in ProjectCarousel */}
                          <span
                            className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.15em] uppercase
                                       font-geist-mono px-2.5 py-1 rounded-full border"
                            style={{ color: item.accent, borderColor: `${item.accent}35`, background: `${item.accent}0d` }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full animate-pulse"
                              style={{ background: item.accent }}
                            />
                            {item.status}
                          </span>
                        </div>

                        <p className="text-[10px] font-bold tracking-[0.22em] uppercase font-geist-mono text-[#DBD5B5]/25 mb-2">
                          {item.category}
                        </p>
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#DBD5B5] leading-tight mb-1">
                          {item.shortTitle}
                        </h3>
                        <p className="text-sm font-geist-mono mt-2" style={{ color: `${item.accent}99` }}>
                          {item.author} · {item.date}
                        </p>
                      </div>

                      {/* Stats or Pillars */}
                      <div className="relative z-10 mt-8 rc">
                        {item.pillars ? (
                          <div className="space-y-2.5">
                            {item.pillars.map(p => (
                              <div
                                key={p.key}
                                className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]
                                           hover:border-white/[0.09] transition-colors"
                              >
                                <p className="text-[9px] font-bold tracking-[0.18em] uppercase font-geist-mono mb-1"
                                  style={{ color: item.accent }}>
                                  {p.key}
                                </p>
                                <p className="text-[11px] font-geist-mono text-[#DBD5B5]/50 leading-relaxed">
                                  {p.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {item.stats.map(s => (
                              <div
                                key={s.label}
                                className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.02]
                                           hover:border-white/[0.09] transition-colors"
                              >
                                <p className="text-2xl md:text-3xl font-bold font-display text-[#DBD5B5]">{s.val}</p>
                                <p className="text-[10px] font-geist-mono text-[#DBD5B5]/35 uppercase tracking-widest mt-1">{s.label}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── Content panel ── */}
                    <div className="lg:w-[62%] p-8 md:p-10 flex flex-col justify-between bg-[#0A0A0A]">

                      {/* DOI / meta row */}
                      <div className="flex flex-wrap items-center gap-3 mb-6 rc">
                        {item.doi ? (
                          <a
                            href={`https://doi.org/${item.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md
                                       border border-[#8B7E66]/25 bg-[#8B7E66]/08
                                       hover:bg-[#8B7E66]/15 transition-colors"
                          >
                            <span className="text-xs font-bold text-[#8B7E66]">DOI</span>
                            <span className="text-xs text-[#DBD5B5] font-mono">{item.doi}</span>
                          </a>
                        ) : (
                          <span className="text-[11px] font-bold font-geist-mono px-3 py-1.5 rounded-md
                                          border text-[#C7B580] border-[#C7B580]/30 bg-[#C7B580]/08">
                            Wu-Weism Research · March 2026
                          </span>
                        )}
                        {item.indexed && (
                          <span className="flex items-center gap-1.5 text-[11px] font-geist-mono text-[#DBD5B5]/30">
                            <svg className="w-3.5 h-3.5 text-[#8B7E66]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            Indexed · {item.indexed}
                          </span>
                        )}
                      </div>

                      {/* Full title */}
                      <h4 className="text-base md:text-[17px] font-serif font-medium text-[#DBD5B5]/85 leading-relaxed mb-4 rc">
                        {item.title}
                      </h4>

                      {/* Abstract */}
                      <p className="text-sm text-[#DBD5B5]/40 leading-relaxed font-geist-mono mb-6 rc">
                        {item.abstract}
                      </p>

                      {/* Keywords — same pill style as CareerSection / rest of portfolio */}
                      <div className="flex flex-wrap gap-2 mb-8 rc">
                        {item.keywords.map(kw => (
                          <span
                            key={kw}
                            className="kw px-3 py-1 rounded-full text-[11px] font-medium font-geist-mono
                                       border border-white/[0.07] bg-white/[0.02] text-[#DBD5B5]/50
                                       hover:border-[#8B7E66]/40 hover:text-[#DBD5B5] transition-all cursor-default"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      {/* Divider */}
                      <div className="h-px mb-7 rc bg-white/[0.04]" />

                      {/* CTAs — rounded-full, matching ProjectCarousel button style */}
                      <div className="flex flex-wrap gap-3 rc">
                        <a
                          href={item.primaryCta.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/cta inline-flex items-center gap-2.5 px-6 py-3 rounded-full
                                     text-sm font-display tracking-wide text-[#070707]
                                     transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
                          style={{ background: `linear-gradient(135deg,${item.accent},${item.accent}cc)` }}
                        >
                          <span>{item.primaryCta.label}</span>
                          <CtaIcon type={item.primaryCta.icon} />
                        </a>

                        <a
                          href={item.secondaryCta.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/cta inline-flex items-center gap-2.5 px-6 py-3 rounded-full
                                     text-sm font-display tracking-wide
                                     border border-white/[0.1] text-[#8B7E66]
                                     hover:border-[#DBD5B5]/40 hover:text-[#DBD5B5]
                                     transition-all duration-300"
                        >
                          <CtaIcon type={item.secondaryCta.icon} />
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

        {/* ── Footer rule ── */}
        <div className="mt-20 md:mt-28 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/[0.04]" />
          <p className="text-[11px] text-[#DBD5B5]/20 font-geist-mono tracking-wider whitespace-nowrap">
            Wu-Weism · Ongoing Research · 2026
          </p>
          <div className="flex-1 h-px bg-white/[0.04]" />
        </div>

      </div>
    </section>
  );
};

export default ResearchSection;
