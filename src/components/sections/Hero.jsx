import React, { useRef } from "react";
import { useAuralisMotion } from "../hooks/useAuralisMotion.js";

const Hero = () => {
  const sectionRef = useRef(null);
  useAuralisMotion(sectionRef);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero-manifesto auralis-section"
      data-theme="dark"
      aria-label="Introduction"
    >
      <div className="hero-manifesto-shell auralis-shell">
        <div className="hero-manifesto-left">
          <div className="hero-manifesto-identity" data-auralis-reveal>
            <h1 className="hero-manifesto-title" aria-label="Hi, I'm Rhine.">
              <span className="hero-manifesto-greeting" data-hero-particle-title data-particle-text="Hi," aria-hidden="true">
                <span className="hero-manifesto-greeting-fallback">Hi,</span>
                <canvas className="hero-manifesto-particle-canvas" aria-hidden="true" />
              </span>
              <span className="hero-manifesto-name-stack" aria-hidden="true">
                <span className="hero-manifesto-im">
                  <span className="hero-manifesto-im-i">I</span>
                  <span className="hero-manifesto-im-rest">&rsquo;m</span>
                </span>
                <span className="hero-manifesto-rhine">
                  Rh<span className="hero-manifesto-rhine-i">i</span>ne.
                </span>
              </span>
            </h1>
          </div>
        </div>

        <div className="hero-manifesto-right">
          <p className="hero-manifesto-statement" data-auralis-reveal>
            From the Philippines, I work <span className="hero-shimmer-word">quietly</span> — <em>seeing first</em>,
            building carefully, and keeping each claim <em>answerable</em>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
