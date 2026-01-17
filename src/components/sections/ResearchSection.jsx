import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ResearchSection = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  const publication = {
    title: "The Entropic Vise: A Physics-Based Framework for HIV-1 Eradication Through Thermodynamic Targeting, Adversarial Prediction, and Real-Time Latency Detection",
    shortTitle: "The Entropic Vise",
    author: "Rhine Lesther Tague",
    affiliation: "Mapúa Malayan Colleges Mindanao",
    date: "January 5, 2026",
    doi: "10.5281/zenodo.18149245",
    views: "57",
    downloads: "33",
    abstract: "We propose a physics-based framework that exploits high-barrier thermodynamic constraints—regions where mutations impose severe fitness costs on the virus. Our approach comprises three integrated components: (1) The Entropic Vise targeting the gp41 HR1 domain; (2) Thermodynamically Constrained Generative Models that predict future variants; and (3) Sentinel Cells engineered with humanized reporters for real-time latency detection.",
    keywords: ["HIV-1", "Thermodynamics", "Shannon Entropy", "Generative AI", "TC-GAN", "Sentinel Cells", "Computational Virology"],
    zenodoUrl: "https://zenodo.org/records/18149245",
    githubUrl: "https://github.com/Lesz-Xi/hiv-entropic-vise",
    resourceType: "Preprint",
    license: "CC BY 4.0",
    indexed: "OpenAIRE"
  };

  useGSAP(() => {
    // Card entrance animation
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate stats on scroll
    const stats = gsap.utils.toArray(".stat-item");
    stats.forEach((stat, i) => {
      gsap.fromTo(stat,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Animate keywords
    const tags = gsap.utils.toArray(".keyword-tag");
    tags.forEach((tag, i) => {
      gsap.fromTo(tag,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          delay: 0.3 + i * 0.05,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section 
      id="research" 
      ref={containerRef} 
      className="py-16 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: "#070707" }}
    >
      {/* Noise Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-noise-pattern z-0"></div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <span className="text-xs font-bold tracking-[0.2em] text-[#DBD5B5]/40 uppercase mb-6 block">
            Academic Work
          </span>
          <h2 className="text-4xl md:text-7xl font-bold font-accent text-[#8B7E66] mb-4">
            Research & Publications
          </h2>
          <p className="text-[#DBD5B5]/60 text-sm md:text-base max-w-xl font-geist-mono">
            Exploring the intersection of computational science, generative AI, and biomedical research.
          </p>
        </div>

        {/* Publication Card */}
        <div 
          ref={cardRef}
          className="group relative rounded-2xl md:rounded-3xl overflow-visible"
        >
          {/* Orbiting Border Animation Container - Desktop Only */}
          <div className="hidden md:block absolute -inset-[1px] rounded-2xl md:rounded-3xl pointer-events-none overflow-visible z-10">
            <svg className="w-full h-full" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
               {/* 
                  Note: Using preserveAspectRatio="none" stretches the SVG to fit. 
                  However, rect rx/ry will stretch too. 
                  Better approach: Use exact pixel matching or a cleaner CSS mask. 
                  But for "Beam" effect on variable width, stretching a rect with percentage rx is hard.
                  
                  ACTUALLY: A simple rect with width="100%" height="100%" inside an SVG works, 
                  but 'rx' is in user units. 
                  If we use overflow-visible SVG with absolute positioning, we can just let it match container.
               */}
               <rect 
                  x="0" y="0" width="100%" height="100%" 
                  rx="24" ry="24"
                  fill="none" 
                  stroke="none"
               />
            </svg>
            
            {/* 
              SVG for the Beams - Placed absolutely to fill container 
              We use a trick: dashed stroke animation.
            */}
            <svg className="absolute inset-0 w-full h-full overflow-visible">
               <defs>
                  <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
                     <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                     <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                     </feMerge>
                  </filter>
                  <filter id="glow-creme" x="-50%" y="-50%" width="200%" height="200%">
                     <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                     <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                     </feMerge>
                  </filter>
               </defs>

               {/* Beam 1: Gold, Clockwise, Starts Top-Center */}
               {/* pathLength="100" makes math easy: 8 length beam, 92 gap */}
               <rect 
                  x="0" y="0" width="100%" height="100%" rx="24" ry="24"
                  fill="none" 
                  stroke="#8B7E66" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="8 92" 
                  strokeDashoffset="0"
                  pathLength="100"
                  className="opacity-60"
                  style={{
                    filter: 'url(#glow-gold)',
                    animation: 'beam-cw 8s linear infinite',
                    animationDelay: '-1.25s' // Offset to start at Top-Center (approx 12.5% into path)
                  }}
               />

               {/* Beam 2: Creme, Clockwise, Starts Bottom-Center */}
               <rect 
                  x="0" y="0" width="100%" height="100%" rx="24" ry="24"
                  fill="none" 
                  stroke="#DBD5B5" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="8 92"
                  strokeDashoffset="0"
                  pathLength="100"
                  className="opacity-60"
                  style={{
                    filter: 'url(#glow-creme)',
                    animation: 'beam-cw 8s linear infinite',
                    animationDelay: '-6.25s' // Offset to start at Bottom-Center (approx 62.5% into path)
                  }}
               />
            </svg>
          </div>
          
          {/* Keyframes for Orbiting Animation */}
          <style>{`
            @keyframes beam-cw {
              to { stroke-dashoffset: -100; }
            }
          `}</style>
          
          {/* Card Glassmorphism Container */}
          <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden hover:border-[#8B7E66]/30 transition-all duration-500">
            {/* Gradient Glow Effect on Hover */}
            <div className="absolute -inset-px bg-gradient-to-r from-[#8B7E66]/0 via-[#8B7E66]/10 to-[#8B7E66]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl"></div>
            
            <div className="relative flex flex-col lg:flex-row">
            
            {/* Left Side - Visual / Document Preview */}
            <div className="lg:w-2/5 p-6 md:p-10 flex flex-col justify-between bg-gradient-to-br from-[#0D0D0D] via-[#111] to-[#0D0D0D] border-b lg:border-b-0 lg:border-r border-white/5 relative overflow-hidden">
              
              {/* Decorative DNA Helix Pattern */}
              <div className="absolute top-0 right-0 w-32 h-full opacity-[0.03] pointer-events-none">
                <svg viewBox="0 0 100 400" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.5">
                  <path d="M20 0 Q80 50 20 100 Q-40 150 20 200 Q80 250 20 300 Q-40 350 20 400" className="text-[#8B7E66]" />
                  <path d="M80 0 Q20 50 80 100 Q140 150 80 200 Q20 250 80 300 Q140 350 80 400" className="text-[#8B7E66]" />
                  {[0,1,2,3,4,5,6,7].map(i => (
                    <line key={i} x1="20" y1={i*50+25} x2="80" y2={i*50+25} className="text-[#8B7E66]" strokeWidth="0.3" />
                  ))}
                </svg>
              </div>
              
              {/* Document Icon / Visual */}
              <div className="mb-8 relative z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#8B7E66]/20 to-[#8B7E66]/5 border border-[#8B7E66]/30 flex items-center justify-center mb-6 shadow-lg shadow-[#8B7E66]/5">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-[#8B7E66]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                
                {/* Resource Type Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B7E66]/10 border border-[#8B7E66]/20 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#8B7E66] animate-pulse"></span>
                  <span className="text-xs font-bold tracking-wider uppercase text-[#8B7E66]">
                    {publication.resourceType}
                  </span>
                </div>

                {/* Short Title */}
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#DBD5B5] leading-tight mb-2">
                  {publication.shortTitle}
                </h3>
                <p className="text-[#DBD5B5]/50 text-sm font-geist-mono">
                  {publication.author}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="stat-item p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-[#8B7E66]/20 transition-colors">
                  <p className="text-2xl md:text-3xl font-bold text-[#DBD5B5] font-display">{publication.views}</p>
                  <p className="text-[10px] text-[#DBD5B5]/40 uppercase tracking-widest font-medium mt-1">Views</p>
                </div>
                <div className="stat-item p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-[#8B7E66]/20 transition-colors">
                  <p className="text-2xl md:text-3xl font-bold text-[#DBD5B5] font-display">{publication.downloads}</p>
                  <p className="text-[10px] text-[#DBD5B5]/40 uppercase tracking-widest font-medium mt-1">Downloads</p>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="lg:w-3/5 p-6 md:p-10 flex flex-col justify-between">
              
              {/* DOI Badge & Date */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <a 
                  href={`https://doi.org/${publication.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#8B7E66]/10 border border-[#8B7E66]/30 hover:bg-[#8B7E66]/20 transition-colors"
                >
                  <span className="text-xs font-bold text-[#8B7E66]">DOI</span>
                  <span className="text-xs text-[#DBD5B5] font-mono">{publication.doi}</span>
                </a>
                <span className="text-xs text-[#DBD5B5]/40 font-geist-mono">
                  {publication.date}
                </span>
              </div>

              {/* Full Title */}
              <h4 className="text-lg md:text-xl font-medium text-[#DBD5B5]/90 leading-relaxed mb-4 font-serif">
                {publication.title}
              </h4>

              {/* Abstract */}
              <p className="text-sm text-[#DBD5B5]/50 leading-relaxed mb-6 font-geist-mono line-clamp-4">
                {publication.abstract}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2 mb-8">
                {publication.keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="keyword-tag px-3 py-1 rounded-full text-xs font-medium bg-white/[0.03] border border-white/10 text-[#DBD5B5]/60 hover:border-[#8B7E66]/30 hover:text-[#DBD5B5] transition-all cursor-default"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Indexed Badge */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
                <span className="text-xs text-[#DBD5B5]/40">Indexed in</span>
                <span className="text-xs font-bold text-[#8B7E66] flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" opacity="0.2"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  {publication.indexed}
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <a 
                  href={publication.zenodoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#8B7E66] to-[#9d8f75] text-white text-sm font-display tracking-wide hover:shadow-lg hover:shadow-[#8B7E66]/20 hover:scale-[1.02] transition-all duration-300"
                >
                  <span>Read on Zenodo</span>
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                
                <a 
                  href={publication.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-white/10 text-[#DBD5B5] text-sm font-display tracking-wide hover:border-[#8B7E66]/50 hover:bg-[#8B7E66]/5 hover:text-[#8B7E66] transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>View Repository</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>
    </section>
  );
};

export default ResearchSection;
