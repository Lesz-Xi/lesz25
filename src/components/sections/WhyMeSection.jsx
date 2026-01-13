import React, { useRef } from "react";
import SpotlightCard from "../SpotlightCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WhyMeSection = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  const whyMeCards = [
    {
      icon: (
        <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      title: "Agile Development",
      description:
        "Streamlined design process for rapid delivery, meeting tight deadlines without compromising quality or detail.",
    },
    {
      icon: (
        <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      ),
      title: "Your Input Matters",
      description:
        "I work closely with you, integrating your feedback to create designs that exceed your expectations.",
    },
    {
      icon: (
        <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      ),
      title: "Pixel Perfect",
      description:
        "Meticulous attention to every element, ensuring a polished and cohesive final product that impresses.",
    },
  ];

  useGSAP(() => {
    // Pin the header section while scrolling the cards
    // Only on Desktop (md and up)
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Pin the header section while scrolling the cards
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: headerRef.current,
        pinSpacing: false, 
      });

      // Animate cards staggering in
      gsap.from(".why-card", {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
        }
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-[var(--color-background)] py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            {/* Header - Pinned on Desktop */}
            <div ref={headerRef} className="w-full md:w-1/3 md:h-screen md:flex md:flex-col md:justify-center md:sticky md:top-0">
                <div className="text-left">
                  <div className="inline-flex items-center px-4 py-2 bg-neutral-700 rounded-full text-sm text-white mb-8">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Why me?
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold text-[var(--color-primary)] mb-4 leading-tight">
                    I'll bring your vision to life
                  </h2>
                  <p className="text-[var(--color-primary)]/60 text-lg mt-6">
                     Combining technical expertise with artistic sensibility to deliver unique digital experiences.
                  </p>
                </div>
            </div>

            {/* Scrolling Cards */}
            <div ref={cardsRef} className="w-full md:w-2/3 flex flex-col gap-8 md:gap-12 pb-20 md:pb-0">
              {whyMeCards.map((card, index) => (
                <div key={index} className="why-card">
                    <SpotlightCard
                      className="h-full bg-white/5 backdrop-blur-sm border border-white/10"
                      spotlightColor="rgba(219, 213, 181, 0.2)"
                    >
                      <div className="relative z-10 p-2">
                        {card.icon}
                        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
                          {card.title}
                        </h3>
                        <p className="text-[var(--color-primary)]/60 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </SpotlightCard>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMeSection;
