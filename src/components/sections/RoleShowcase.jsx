import React, { useRef, useState } from "react";
import { useAuralisMotion } from "../hooks/useAuralisMotion.js";

const roles = [
  {
    index: "01",
    role: "Photographer",
    title: "See first.",
    copy: "Light, distance, proportion.",
    tag: "Aperture · Frame",
    position: "left",
  },
  {
    index: "02",
    role: "Developer",
    title: "Make it work.",
    copy: "State, motion, trust.",
    tag: "System · Interface",
    position: "center",
  },
  {
    index: "03",
    role: "Researcher",
    title: "Ask why.",
    copy: "Evidence, mechanism, revision.",
    tag: "Cause · Trace",
    position: "right",
  },
];

const RoleShowcase = () => {
  const sectionRef = useRef(null);
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  useAuralisMotion(sectionRef);

  const goToPreviousRole = () => {
    setActiveRoleIndex((currentIndex) => (currentIndex - 1 + roles.length) % roles.length);
  };

  const goToNextRole = () => {
    setActiveRoleIndex((currentIndex) => (currentIndex + 1) % roles.length);
  };

  return (
    <section ref={sectionRef} className="auralis-section" data-theme="dark">
      <div className="auralis-shell">
        <div className="auralis-section-head">
          <div data-auralis-reveal>
            <div className="auralis-rule" data-auralis-rule />
            <span className="auralis-mark">Principle 02 — Shibui</span>
            <span className="auralis-submark">Three roles, held quietly</span>
          </div>

          <div className="auralis-head-main" data-auralis-reveal>
            <h2 className="auralis-title">
              <span className="block">the role is quiet.</span>
              <span className="block auralis-serif">the work remains.</span>
            </h2>
            <p className="auralis-copy">
              I keep the practice quiet: seeing before shaping, building with
              restraint, and explaining only what the work has earned. Each role
              leaves space for the others to breathe.
            </p>
          </div>
        </div>

        <div className="role-eye-field" data-role-eye>
          <svg className="role-eye-geometry" viewBox="0 0 1200 420" aria-hidden="true">
            <path className="role-eye-line role-eye-outline" pathLength="1" d="M72 214 C246 72 438 54 600 54 C762 54 954 72 1128 214 C954 356 762 374 600 374 C438 374 246 356 72 214" />
            <g className="role-eye-core">
              <circle className="role-eye-cornea" pathLength="1" cx="600" cy="214" r="74" />
              <circle className="role-eye-iris" pathLength="1" cx="600" cy="214" r="44" />
              <path className="role-eye-iris-mark role-eye-iris-mark--upper" pathLength="1" d="M584 179 C607 168 637 180 649 205" />
              <circle className="role-eye-pupil" cx="600" cy="214" r="7" />
              <path className="role-eye-highlight" pathLength="1" d="M582 191 C592 184 608 183 620 190" />
            </g>
          </svg>

          {roles.map((role, index) => (
            <article
              className={`role-eye-node role-eye-node--${role.position}${index === activeRoleIndex ? " is-mobile-active" : ""}`}
              data-role-eye-node
              key={role.index}
            >
              <div className="role-eye-node-label">
                <span>{role.index}</span>
                <span>{role.role}</span>
              </div>
              <h3>{role.title}</h3>
              <p>{role.copy}</p>
              <span className="role-eye-tag"><span aria-hidden="true" />{role.tag}</span>
            </article>
          ))}
        </div>

        <div className="role-mobile-controls" aria-label="Principle role navigation">
          <button type="button" className="role-mobile-button" onClick={goToPreviousRole} aria-label="Previous principle role">
            &lt;
          </button>
          <span className="role-mobile-count">
            {String(activeRoleIndex + 1).padStart(2, "0")} / {String(roles.length).padStart(2, "0")}
          </span>
          <button type="button" className="role-mobile-button" onClick={goToNextRole} aria-label="Next principle role">
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoleShowcase;
