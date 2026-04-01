import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
const biographyParagraphs = [
  "I architect systems at the boundary of code and inquiry. My primary work is MASA — a causal AI research platform built on Pearl's do-calculus, designed to close the loop between hypothesis, intervention, and counterfactual reasoning.",
  "Critical thinking is the method underneath how I research, build, and refine systems. Long before formal systems design, MLBB trained me to read timing, roles, tradeoffs, and shifting states with precision.",
  "That discipline now carries into SkillShift AI, my still-in-progress MLBB project, and into the interfaces I design. Photography continues to train my eye, so every system aims to feel as decisive in use as it is rigorous in structure.",
];

function scrambleReveal(el, finalText, duration = 1.4) {
  const chars = finalText.split("");
  let frame = 0;
  const totalFrames = Math.round(duration * 60);

  const tick = () => {
    el.textContent = chars
      .map((char, i) => {
        if (char === " ") return " ";
        if (frame / totalFrames > i / chars.length) return char;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join("");

    if (frame++ < totalFrames) requestAnimationFrame(tick);
    else el.textContent = finalText;
  };

  tick();
}

const ShowcaseSection = () => {
  const bioRefs = useRef([]);

  useEffect(() => {
    bioRefs.current.forEach((el, i) => {
      if (!el) return;
      const finalText = el.dataset.text;
      ScrollTrigger.create({
        trigger: el,
        start: "top 82%",
        once: true,
        onEnter: () => scrambleReveal(el, finalText, 1.3 + i * 0.25),
      });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section id="work" className="relative bg-[#F5F2EB] text-[#0D0C1D] py-24 md:py-32 overflow-hidden" data-theme="light">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT: IMAGE / PORTRAIT (Style of the reference) */}
        <div className="relative group">
          {/* Gold Outline Frame (Offset) */}
          <div className="absolute top-4 -left-4 w-full h-full border border-[#DBD5B5] rounded-sm z-0"></div>
          
          {/* Main Image Container */}
          <div className="relative z-10 w-full aspect-[4/5] bg-gray-200 overflow-hidden shadow-2xl">
             <img 
               src="/images/leszport.webp"
               srcSet="/images/leszport-mobile.webp 600w, /images/leszport.webp 1200w"
               sizes="(max-width: 768px) 100vw, 50vw"
               alt="Rhine Tague Portrait" 
               className="w-full h-full object-cover grayscale contrast-110"
               width="800"
               height="1000"
               loading="eager"
               fetchPriority="high"
             />
          </div>
        </div>

        {/* RIGHT: TEXT CONTENT */}
        <div className="flex flex-col space-y-10">
          
          {/* HEADINGS */}
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#0D0C1D]/40 uppercase mb-6 block transition-colors duration-300 hover:text-black cursor-default">
              Biography
            </span>
            <h2 className="text-5xl md:text-7xl font-display tracking-tight text-[#0D0C1D] mb-2">
              Rhine Tague
            </h2>
            <p className="text-2xl md:text-4xl font-display font-medium italic text-[#C7B580] transition-colors duration-300 hover:text-black cursor-default">
              Developer, Researcher & Photographer
            </p>
          </div>

          {/* MAIN TEXT */}
          <div className="space-y-6 text-[#0D0C1D]/80 text-[15px] md:text-lg leading-relaxed font-geist-mono max-w-lg">
            {biographyParagraphs.map((paragraph, index) => (
              <p
                key={index}
                ref={el => bioRefs.current[index] = el}
                data-text={paragraph}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* STATS / DETAILS (Gold Columns) */}
          <div className="flex gap-12 border-l border-[#DBD5B5] pl-6">
            <div>
              <span className="block text-[#C7B580] font-display text-xl transition-colors duration-300 hover:text-black cursor-default">Philippines</span>
              <span className="text-xs uppercase tracking-widest text-[#0D0C1D]/60 mt-1">Based</span>
            </div>
            <div>
              <span className="block text-[#C7B580] font-display text-xl transition-colors duration-300 hover:text-black cursor-default">1</span>
              <span className="text-xs uppercase tracking-widest text-[#0D0C1D]/60 mt-1">White Paper</span>
            </div>
            <div>
              <span className="block text-[#C7B580] font-display text-xl transition-colors duration-300 hover:text-black cursor-default">47+</span>
              <span className="text-xs uppercase tracking-widest text-[#0D0C1D]/60 mt-1">API Routes</span>
            </div>
          </div>

          {/* BUTTON / LINK */}


        </div>

      </div>
    </section>
  );
};

export default ShowcaseSection;
