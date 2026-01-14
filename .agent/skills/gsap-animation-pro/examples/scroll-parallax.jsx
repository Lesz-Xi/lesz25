/**
 * Scroll Parallax Grid
 * 
 * Multi-speed parallax effect for photo grids.
 * Each item has a different scroll speed creating depth.
 */
import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollParallax = () => {
  const containerRef = useRef(null);
  
  const items = [
    { id: 1, title: "Item 1", speed: 1 },      // Baseline
    { id: 2, title: "Item 2", speed: 1.5 },    // Moves faster
    { id: 3, title: "Item 3", speed: 0.8 },    // Moves slower (drag)
    { id: 4, title: "Item 4", speed: 1.2 },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const parallaxItems = gsap.utils.toArray(".parallax-item");
      
      parallaxItems.forEach((item) => {
        const speed = parseFloat(item.dataset.speed);
        
        gsap.to(item, {
          y: -120 * speed, // Negative = moves up as you scroll down
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-black">
      <div className="grid grid-cols-2 gap-12 max-w-6xl mx-auto">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`parallax-item ${index % 2 === 1 ? 'mt-32' : ''}`}
            data-speed={item.speed}
          >
            <div className="aspect-[4/3] bg-gray-800 rounded-lg">
              <h3 className="text-white p-4">{item.title}</h3>
              <p className="text-gray-400 px-4">Speed: {item.speed}x</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScrollParallax;
