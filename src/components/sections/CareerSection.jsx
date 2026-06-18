import React, { useRef } from "react";
import { useAuralisMotion } from "../hooks/useAuralisMotion.js";

const careerData = [
  {
    step: "Step 01 — Frame",
    title: "Wu-Weism / MASA",
    period: "2025 — 2026",
    concept: "Ma",
    description:
      "Architecting MASA as a causal AI research platform grounded in do-calculus, sovereign memory, multi-agent critique, and formal research infrastructure.",
  },
  {
    step: "Step 02 — Continuity",
    title: "Twin-Sparrow",
    period: "2026 — In development",
    concept: "Shinkei",
    description:
      "Building a companion-agent runtime where Solaris and Atoman preserve continuity, route attention, and turn explanation into a living operating surface.",
  },
  {
    step: "Step 03 — Runtime",
    title: "Aurelian",
    period: "2026 — In development",
    concept: "Kanso",
    description:
      "Developing a terminal-native AI workspace for structured execution, memory-aware routing, and companion-grade software work inside the command line.",
  },
  {
    step: "Step 04 — Observe",
    title: "Seismic Observation / TSRA",
    period: "2026 — Active observation",
    concept: "Kiroku",
    description:
      "Built an observational seismic surface for separating confirmed events, local felt reports, elapsed no-shake windows, and generated watch cycles without turning correlation into proof.",
  },
  {
    step: "Step 05 — Bind",
    title: "ThesisLens",
    period: "2025",
    concept: "Shibui",
    description:
      "Built an academic integrity platform focused on AI false-positive defense, forensic audit logging, and student protection.",
  },
  {
    step: "Step 06 — Practice",
    title: "SkillShift AI",
    period: "In Progress",
    concept: "Wabi-sabi",
    description:
      "Designing an MLBB coaching system that converts game sense into adaptive, role-specific feedback and tactical learning loops.",
  },
  {
    step: "Step 07 — Branch",
    title: "Universe Splitter",
    period: "2025",
    concept: "Ma",
    description:
      "A quantum-mechanics experiment shaped into a visual system for representing branching decisions and many-worlds interpretation.",
  },
  {
    step: "Step 08 — Publish",
    title: "HIV Research Publication",
    period: "2025",
    concept: "Shibui",
    description:
      "Published The Entropic Vise on Zenodo, exploring HIV/AIDS through thermodynamic and information-theoretic frames.",
  },
  {
    step: "Step 09 — Correct",
    title: "Continuous Valence Research",
    period: "2026 — Research record",
    concept: "Shinkei",
    description:
      "Developed a source-grounded research frame for intelligence as situated correction, where valence regulates attention, action, memory, and adaptive self-world alignment.",
  },
  {
    step: "Step 10 — Revisit",
    title: "Independent Practice",
    period: "Present",
    concept: "Wabi-sabi",
    description:
      "A continuing practice across causal AI, computational research, photography, and crafted digital experiences.",
  },
];

const CareerSection = () => {
  const sectionRef = useRef(null);
  useAuralisMotion(sectionRef);

  return (
    <section id="career" ref={sectionRef} className="auralis-section" data-theme="dark">
      <div className="auralis-shell">
        <div className="auralis-section-head">
          <div data-auralis-reveal>
            <div className="auralis-rule" data-auralis-rule />
            <span className="auralis-mark">Lifecycle</span>
            <span className="auralis-submark">Work that can be revisited</span>
          </div>

          <div className="auralis-head-main" data-auralis-reveal>
            <h2 className="auralis-title">
              <span className="block">the making stays</span>
              <span className="block auralis-serif">visible.</span>
            </h2>
            <p className="auralis-copy">
              The chronology is not a résumé ladder. It is a record of questions,
              tools, papers, experiments, and revisions — the trace of a practice
              becoming more exact over time.
            </p>
          </div>
        </div>

        <div className="lifecycle-register" data-auralis-timeline aria-label="Lifecycle register">
          <ol className="lifecycle-rows">
            {careerData.map((item, index) => {
              const [phaseRaw, ...phaseTail] = item.step.split("—");
              const stepLabel = phaseRaw.trim();
              const phaseLabel = phaseTail.join("—").trim() || stepLabel;

              return (
                <li className="lifecycle-row" data-auralis-step data-auralis-reveal key={item.title}>
                  <span className="lifecycle-seam-marker" aria-hidden="true" />

                  <div className="lifecycle-meta">
                    <span className="lifecycle-period">{item.period}</span>
                    <span className="lifecycle-phase">
                      <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      {phaseLabel}
                    </span>
                  </div>

                  <div className="lifecycle-body">
                    <span className="lifecycle-concept">{item.concept}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default CareerSection;
