import React, { useRef } from "react";
import { useAuralisMotion } from "../hooks/useAuralisMotion.js";

const projects = [
  {
    id: "masa",
    number: "01",
    principle: "Ma",
    principleLine: "Space before structure.",
    title: "Frame before consensus.",
    name: "Wu-Weism / MASA",
    link: "https://wuweism.com",
    image: "/images/projects/wu-weism-display.png",
    mobileImage: "/images/projects/wu-weism-display.png",
    imagePosition: "62% center",
    copy: "A causal AI workbench for hypothesis, intervention, and counterfactual reasoning — built so scientific reasoning has a place to become inspectable.",
    tag: "Question · Scope · Owner",
  },
  {
    id: "thesislens",
    number: "02",
    principle: "Shibui",
    principleLine: "Refinement without noise.",
    title: "Expose fragile assumptions.",
    name: "ThesisLens",
    link: "https://thesislens.space/",
    image: "/images/projects/thesislens-v2.webp",
    mobileImage: "/images/projects/thesislens-v2-mobile.webp",
    imagePosition: "center top",
    copy: "A forensic academic-integrity surface for reducing AI false positives and defending student work through clearer evidence trails.",
    tag: "Claims · Proof · Objections",
  },
  {
    id: "universe-splitter",
    number: "03",
    principle: "Wabi-sabi",
    principleLine: "Evidence of becoming.",
    title: "Reopen the branch.",
    name: "Universe Splitter",
    link: "https://univ-spitter.vercel.app/",
    image: "/images/projects/universe-splitter.webp",
    mobileImage: "/images/projects/universe-splitter-mobile.webp",
    imagePosition: "center top",
    copy: "A many-worlds interaction model for branching decisions, probability, and the strange clarity of speculative play.",
    tag: "History · Review · Branch",
  },
  {
    id: "skillshift",
    number: "04",
    principle: "Shibui",
    principleLine: "Refinement through feedback.",
    title: "Bind feedback to action.",
    name: "SkillShift AI",
    link: null,
    image: "/images/projects/skillshift-v3.webp",
    mobileImage: "/images/projects/skillshift-v3-mobile.webp",
    imagePosition: "center top",
    copy: "A private coaching system translating game-state reads into adaptive feedback loops and role-specific tactical learning.",
    tag: "Training · Signals · Adaptation",
  },
];

const ProjectCarousel = () => {
  const sectionRef = useRef(null);
  useAuralisMotion(sectionRef);

  return (
    <section id="projects" ref={sectionRef} className="auralis-section" data-theme="dark">
      <div className="auralis-shell">
        <div className="auralis-section-head">
          <div data-auralis-reveal>
            <div className="auralis-rule" data-auralis-rule />
            <span className="auralis-mark">Architecture</span>
            <span className="auralis-submark">Scroll sequence · selected records</span>
          </div>

          <div className="auralis-head-main" data-auralis-reveal>
            <h2 className="auralis-title">
              <span className="block">selected records.</span>
              <span className="block auralis-serif">one trace.</span>
            </h2>
            <p className="auralis-copy">
              These records are not displayed as proof of noise. They are traces of
              decisions made slowly: space protected, structure refined, and the
              unfinished path allowed to remain visible.
            </p>
          </div>
        </div>

        <div className="archive-records" data-archive-records aria-label="Selected project records">
          {projects.map((project) => (
            <article className="archive-record" key={project.id} data-archive-record>
              <div className="archive-record-header">
                <span className="archive-bar-index">{project.number}</span>
                <span className="archive-record-principle">{project.principle}</span>
                <span className="archive-record-rule" aria-hidden="true" />
              </div>

              <div className="archive-panel-layout archive-record-layout">
                <div className="archive-panel-image archive-record-image">
                  <picture>
                    <source srcSet={project.mobileImage} media="(max-width: 720px)" />
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-full w-full object-cover opacity-85 saturate-[0.9]"
                      style={{ objectPosition: project.imagePosition }}
                      loading="lazy"
                      data-auralis-image
                    />
                  </picture>
                </div>

                <div className="archive-panel-content archive-record-content">
                  <span className="archive-record-kicker">{project.principleLine}</span>
                  <h3 className="archive-record-name">{project.name}</h3>
                  <p className="archive-panel-title">{project.title}</p>
                  <p className="archive-panel-copy">{project.copy}</p>
                  <span className="archive-panel-tag">{project.tag}</span>
                  <div className="archive-panel-action">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="archive-panel-button"
                      >
                        View record <span aria-hidden="true">→</span>
                      </a>
                    ) : (
                      <span className="archive-panel-button archive-panel-button--muted">
                        Private build
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectCarousel;
