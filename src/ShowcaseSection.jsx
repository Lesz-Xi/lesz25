import React from "react";

const ShowcaseSection = () => {
  return (
    <section id="work" className="relative bg-[#F5F2EB] text-[#0D0C1D] py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT: IMAGE / PORTRAIT (Style of the reference) */}
        <div className="relative group">
          {/* Gold Outline Frame (Offset) */}
          <div className="absolute top-4 -left-4 w-full h-full border border-[#DBD5B5] rounded-sm z-0"></div>
          
          {/* Main Image Container */}
          <div className="relative z-10 w-full aspect-[4/5] bg-gray-200 overflow-hidden shadow-2xl">
             <img 
               src="/images/leszport.jpg" 
               alt="Rhine Tague Portrait" 
               className="w-full h-full object-cover grayscale contrast-110"
             />
          </div>
        </div>

        {/* RIGHT: TEXT CONTENT */}
        <div className="flex flex-col space-y-10">
          
          {/* HEADINGS */}
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#0D0C1D]/40 uppercase mb-6 block">
              Biography
            </span>
            <h2 className="text-5xl md:text-7xl font-display tracking-tight text-[#0D0C1D] mb-2">
              Rhine Tague
            </h2>
            <p className="text-2xl md:text-5xl font-display italic text-[#C7B580] whitespace-nowrap">
              Developer & Photographer
            </p>
          </div>

          {/* MAIN TEXT */}
          <div className="space-y-6 text-[#0D0C1D]/80 text-lg leading-relaxed font-light max-w-lg">
            <p>
              I love the process of building simple, meaningful things. For me, great design is about 
              making sure every detail feels natural and easy to use.
            </p>
            <p>
              Whether I'm writing code or capturing a moment through my lens, I focus on creating 
              work that is clean, effective, and tells a real story.
            </p>
          </div>

          {/* STATS / DETAILS (Gold Columns) */}
          <div className="flex gap-12 border-l border-[#DBD5B5] pl-6">
            <div>
              <span className="block text-[#C7B580] font-display text-xl">100%</span>
              <span className="text-xs uppercase tracking-widest text-[#0D0C1D]/60 mt-1">User Centric</span>
            </div>
            <div>
              <span className="block text-[#C7B580] font-display text-xl">Philippines</span>
              <span className="text-xs uppercase tracking-widest text-[#0D0C1D]/60 mt-1">Based</span>
            </div>
          </div>

          {/* BUTTON / LINK */}
          <div className="pt-4">
            <a href="#about" className="inline-flex items-center gap-3 text-[#0D0C1D] text-xs font-bold tracking-[0.2em] uppercase hover:text-[#C7B580] transition-colors">
              More about the process 
              <span className="text-lg">→</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ShowcaseSection;
