import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CareerSection = () => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  
  const careerData = [
    {
      title: "ThesisLens",
      period: "2025",
      description:
        "Founded an academic integrity platform tackling AI false positives. Developed forensic audit logging and defense algorithms to protect student work from erroneous AI detection.",
      showDot: true,
    },
    {
      title: "SkillShift AI",
      period: "In Progress",
      description:
        "Architecting a professional-grade AI coaching platform for MLBB. Simulating Mythic-rank logic to provide role-specific, actionable feedback and adaptive training modules.",
      showDot: true,
    },
    {
      title: "Universe Splitter",
      period: "2025",
      description:
        "Developed a quantum mechanics experiment interacting with the many-worlds interpretation. Created a visual system to represent quantum branching events.",
      showDot: true,
    },
    {
      title: "Independent Practice",
      period: "Present",
      description:
        "Synthesizing creative technology and visual arts. Building bespoke digital experiences and curating a premium print collection, bridging the gap between functional code and aesthetic narrative.",
      showDot: true,
    },
  ];

  useGSAP(() => {
    // Animate the vertical line drawing down
    gsap.fromTo(lineRef.current, 
      { scaleY: 0, transformOrigin: "top" },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        }
      }
    );

    // Animate list items
    const items = gsap.utils.toArray(".timeline-item");
    items.forEach((item, i) => {
      // Fade in Content
      gsap.fromTo(item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Pop the Dot
      const dot = item.querySelector(".timeline-dot");
      if (dot) {
         gsap.fromTo(dot,
            { scale: 0, opacity: 0 },
            {
               scale: 1,
               opacity: 1,
               duration: 0.4,
               ease: "back.out(1.7)", // Bouncy pop
               scrollTrigger: {
                  trigger: item,
                  start: "top 60%", // Activate when the item is well into view (approx where the line hits)
                  toggleActions: "play none none reverse"
               }
            }
         );
      }
    });

  }, { scope: containerRef });

  return (
    <section id="career" ref={containerRef} className="py-20 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#070707" }}>
        
        {/* Background Decorative Line for Timeline */}
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-neutral-200 transform md:-translate-x-1/2 h-full z-0"></div>
        <div ref={lineRef} className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-[#8B7E66] transform md:-translate-x-1/2 h-full z-0 origin-top"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-20 text-center md:text-left md:pl-8">
          <span className="text-xs font-bold tracking-[0.2em] text-[#DBD5B5]/40 uppercase mb-6 block">
            Timeline
          </span>
          <h2 className="text-5xl md:text-7xl font-bold font-accent text-[#8B7E66] mb-4">
            The Journey
          </h2>
        </div>

        {/* Career Timeline */}
        <div className="space-y-16 md:space-y-32 relative">
          {careerData.map((item, index) => (
            <div key={index} className={`timeline-item relative flex flex-col md:flex-row gap-8 md:gap-0 items-center md:items-start w-full ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                 {/* Half WIdth Container 1 */}
                 <div className={`w-full md:w-1/2 pl-16 md:pl-0 text-left ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                    {/* Content Logic: Even = Title/Date, Odd = Description */}
                    {index % 2 === 0 ? (
                        <div className="space-y-2">
                             <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#DBD5B5] group-hover:text-white transition-colors duration-300">
                                {item.title}
                              </h3>
                              <p className="text-[#8B7E66] font-mono text-sm tracking-widest uppercase">
                                {item.period}
                              </p>
                        </div>
                    ) : (
                        <p className="leading-relaxed text-sm md:text-[15px] text-neutral-400 font-geist-mono hidden md:block">
                             {item.description}
                        </p>
                    )}
                 </div>

                 {/* Center Dot */}
                 <div className="absolute left-[20px] md:left-1/2 -ml-[6px] top-0 md:top-2 w-3 h-3 bg-[#070707] border border-[#8B7E66] rounded-full z-10 timeline-dot transform scale-0 md:scale-100 md:opacity-0"></div>

                 {/* Half Width Container 2 */}
                 <div className={`w-full pl-16 md:pl-0 md:w-1/2 text-left ${index % 2 === 0 ? 'md:pl-12 md:text-left' : 'md:pr-12 md:text-right'}`}>
                      {/* Content Logic: Even = Description, Odd = Title/Date */}
                      {index % 2 === 0 ? (
                           <p className="leading-relaxed text-sm md:text-[15px] text-neutral-400 font-geist-mono hidden md:block">
                               {item.description}
                           </p>
                      ) : (
                          <div className="space-y-2 hidden md:block">
                               <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#DBD5B5] group-hover:text-white transition-colors duration-300">
                                  {item.title}
                                </h3>
                                <p className="text-[#8B7E66] font-mono text-sm tracking-widest uppercase">
                                  {item.period}
                                </p>
                          </div>
                      )}
                       
                       {/* Mobile Only Fallback for the "Other" side content */}
                       {/* If index % 2 === 0, we showed Description on Desktop (Right). On Mobile, we need to show it below title (which was on Left/Top). 
                           Actually, for mobile, we usually want: Title, Date, Description stacked.
                           The Zig Zag is confusing on mobile. Let's simplify mobile: Always Title -> Description.
                           This means the conditional logic above is mostly for DESKTOP.
                       */}
                       <div className="md:hidden block">
                           {index % 2 === 0 ? (
                               <p className="leading-relaxed text-sm text-neutral-400 font-geist-mono mt-2">
                                   {item.description}
                               </p>
                           ) : (
                               <div className="space-y-2">
                                   <h3 className="text-2xl font-serif font-bold text-[#DBD5B5]">
                                       {item.title}
                                   </h3>
                                   <p className="text-[#8B7E66] font-mono text-sm tracking-widest uppercase">
                                       {item.period}
                                   </p>
                                   <p className="leading-relaxed text-sm text-neutral-400 font-geist-mono mt-2">
                                       {item.description}
                                   </p>
                               </div>
                           )}
                       </div>
                 </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerSection;
