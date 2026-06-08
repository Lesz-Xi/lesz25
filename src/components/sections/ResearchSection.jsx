import React, { useRef } from "react";
import { useAuralisMotion } from "../hooks/useAuralisMotion.js";

const research = [
  {
    number: "01",
    type: "Preprint",
    title: "The Entropic Vise",
    label: "Computational Virology",
    copy: "A physics-based framework for HIV-1 eradication through thermodynamic targeting, adversarial prediction, and real-time latency detection.",
    meta: "HIV-1 · Thermodynamics · TC-GAN",
    href: "https://zenodo.org/records/18287138",
  },
  {
    number: "02",
    type: "Preprint",
    title: "Continuous Valence-Corrected Intelligence",
    label: "Affective Intelligence",
    copy: "A source-grounded framework for intelligence as situated correction, where valence functions as a continuous regulatory signal for attention, action, memory, and adaptive self-world alignment.",
    meta: "Valence · Emotion · Adaptive systems · Self-correction",
    href: "https://zenodo.org/records/20579513",
    relicHref: "/relics/brittle-ai-podcast.html",
  },
  {
    number: "03",
    type: "White Paper",
    title: "MASA",
    label: "Causal AI Architecture",
    copy: "Methods of Automated Scientific Analysis — a trust-first AI architecture for causal governance, scientific discovery, and auditable reasoning.",
    meta: "Do-calculus · Sovereign memory · Critique",
    href: "/MASA_White_Paper.html",
  },
  {
    number: "04",
    type: "Boundary",
    title: "Claim discipline",
    label: "Research posture",
    copy: "Research objects stay bounded by source, mechanism, uncertainty, counter-position, and what would weaken the claim.",
    meta: "Evidence · Counter-position · Revision",
    href: null,
  },
];

const ResearchSection = () => {
  const sectionRef = useRef(null);
  useAuralisMotion(sectionRef);

  return (
    <section id="research" ref={sectionRef} className="auralis-section" data-theme="dark">
      <div className="auralis-shell">
        <div className="auralis-section-head">
          <div data-auralis-reveal>
            <div className="auralis-rule" data-auralis-rule />
            <span className="auralis-mark">Principle 03 — Wabi-sabi</span>
            <span className="auralis-submark">Research that holds uncertainty</span>
          </div>

          <div className="auralis-head-main" data-auralis-reveal>
            <h2 className="auralis-title">
              <span className="block">the future can</span>
              <span className="block auralis-serif">interrogate the claim.</span>
            </h2>
            <p className="auralis-copy">
              Research is not decoration for the portfolio. It is the discipline of
              preserving question, assumption, evidence, pressure, and revision in a
              form that remains answerable after time passes.
            </p>
          </div>
        </div>

        <div className="research-ledger" aria-label="Research ledger">
          {research.map((item) => (
            <article
              id={item.relicHref ? "continuous-valence-corrected-intelligence" : undefined}
              className="research-ledger-row"
              data-auralis-reveal
              key={`${item.number}-${item.title}`}
            >
              <div className="research-ledger-index">
                <span>{item.number}</span>
                <span>{item.type}</span>
              </div>

              <div className="research-ledger-main">
                <p className="research-ledger-label">{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>

              <div className="research-ledger-proof">
                <span>{item.meta}</span>
                <div className="research-ledger-actions">
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      Read record <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <span className="research-ledger-boundary">Held as posture</span>
                  )}
                  {item.relicHref ? (
                    <a href={item.relicHref} className="research-ledger-relic">
                      Relics <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
