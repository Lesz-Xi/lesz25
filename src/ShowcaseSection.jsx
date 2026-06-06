import React, { useRef } from "react";
import { useAuralisMotion } from "./components/hooks/useAuralisMotion.js";

const ShowcaseSection = () => {
  const sectionRef = useRef(null);
  useAuralisMotion(sectionRef);

  return (
    <section id="work" ref={sectionRef} className="auralis-section" data-theme="dark">
      <div className="auralis-shell">
        <div className="auralis-section-head">
          <div data-auralis-reveal>
            <div className="auralis-rule" data-auralis-rule />
            <span className="auralis-mark">Principle 01 — Ma</span>
            <span className="auralis-submark">Identity with room around it</span>
          </div>

          <div className="auralis-head-main" data-auralis-reveal>
            <h2 className="auralis-title">
              <span className="block">space before</span>
              <span className="block auralis-serif">the person.</span>
            </h2>
            <p className="auralis-copy">
              Most portfolio pages preserve a résumé shape. This one preserves a practice:
              causal systems, research discipline, and photography as the field that keeps the
              eye honest.
            </p>
          </div>
        </div>

        <div className="portrait-stand-layout">
          <div className="auralis-image-panel portrait-only-card" data-portrait-stand>
            <span className="auralis-water-seam" aria-hidden="true" />
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/images/leszport.webp"
                srcSet="/images/leszport-mobile.webp 600w, /images/leszport.webp 1200w"
                sizes="(max-width: 768px) 100vw, 48vw"
                alt="Rhine Tague Portrait"
                className="h-[104%] w-full object-cover grayscale-[0.28] contrast-[1.04]"
                width="800"
                height="1000"
                loading="eager"
                fetchPriority="high"
                data-auralis-image
              />
            </div>
          </div>

          <aside className="portrait-mantra" aria-label="Wake up. Think Different. Build.">
            <span className="mantra-wake" data-mantra-word="wake">Wake up</span>
            <span className="mantra-think" data-mantra-word="think">Think Different</span>
            <span className="mantra-build" data-mantra-word="build">Build</span>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
