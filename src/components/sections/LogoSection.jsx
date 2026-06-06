import { useRef } from "react";
import { logoIconsList } from "../../constants/index.js";
import { useAuralisMotion } from "../hooks/useAuralisMotion.js";

const LogoIcon = ({ icon }) => {
  return (
    <div className="flex-none px-7 md:px-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#DBD5B5]/10 bg-[#11100E]/70 p-3 shadow-[inset_0_1px_0_rgba(245,242,235,0.04)] transition duration-500 hover:-translate-y-1 hover:border-[#C7B580]/30 hover:bg-[#161410]">
        <img
          src={icon.imgPath}
          alt={icon.name}
          className="h-full w-full object-contain opacity-65 grayscale saturate-[0.72] transition duration-500 hover:opacity-100 hover:grayscale-0 hover:saturate-100"
        />
      </div>
    </div>
  );
};

const LogoSection = () => {
  const sectionRef = useRef(null);
  useAuralisMotion(sectionRef);

  return (
    <section ref={sectionRef} className="auralis-section" data-theme="dark">
      <div className="auralis-shell">
        <div className="auralis-section-head">
          <div data-auralis-reveal>
            <div className="auralis-rule" data-auralis-rule />
            <span className="auralis-mark">Instrument stack</span>
            <span className="auralis-submark">Tools kept quiet</span>
          </div>

          <div className="auralis-head-main" data-auralis-reveal>
            <h2 className="auralis-title">
              <span className="block">capability without</span>
              <span className="block auralis-serif">display noise.</span>
            </h2>
            <p className="auralis-copy">
              The stack is present, but not dominant. Technology supports the work;
              it does not become the work’s visual identity.
            </p>
          </div>
        </div>

        <div className="auralis-record-panel py-10" data-auralis-card data-auralis-reveal>
          <span className="auralis-water-seam" aria-hidden="true" />
          <div className="auralis-record-head"><span>Technology record · moving index</span><span>RT-STACK</span></div>
          <div className="relative overflow-hidden py-8">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-28 bg-gradient-to-r from-[#070707] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-28 bg-gradient-to-l from-[#070707] to-transparent" />
            <div className="relative h-20 overflow-hidden">
              <div className="absolute flex items-center animate-logo-scroll">
                {logoIconsList.map((icon, index) => (
                  <LogoIcon key={`${icon.name}-${index}`} icon={icon} />
                ))}
                {logoIconsList.map((icon, index) => (
                  <LogoIcon key={`${icon.name}-duplicate-${index}`} icon={icon} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoSection;
