import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const boardNodes = [
  {
    id: "observe",
    title: "Observe",
    detail: "map awareness",
    x: 88,
    y: 248,
    detailX: 40,
    detailY: 210,
  },
  {
    id: "predict",
    title: "Predict",
    detail: "situation",
    x: 220,
    y: 132,
    detailX: 170,
    detailY: 92,
  },
  {
    id: "decide",
    title: "Decide",
    detail: "trade-offs",
    x: 380,
    y: 216,
    detailX: 332,
    detailY: 274,
  },
  {
    id: "adapt",
    title: "Adapt",
    detail: "timing",
    x: 528,
    y: 118,
    detailX: 500,
    detailY: 148,
  },
];

const descriptionHighlights = [
  "formal systems design",
  "pressure, tempo, and trade-offs",
  "MLBB",
  "scanning the field",
  "predicting the next move",
  "committing with intent",
  "adapting without noise",
];

const highlightDescription = (text) => {
  const escapedHighlights = descriptionHighlights
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  const parts = text.split(new RegExp(`(${escapedHighlights})`, "g"));

  return parts.map((part, index) => {
    if (descriptionHighlights.includes(part)) {
      return (
        <span key={`${part}-${index}`} className="text-[#FFFCE1]">
          {part}
        </span>
      );
    }

    return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
  });
};

const CriticalThinkingSection = () => {
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const editorialRef = useRef(null);
  const frameRef = useRef(null);
  const pathRef = useRef(null);
  const tokenRef = useRef(null);
  const tokenHaloRef = useRef(null);
  const pulseRef = useRef(null);
  const boardGlowRef = useRef(null);
  const bridgeRef = useRef(null);
  const cardRef = useRef(null);
  const nodeRefs = useRef([]);
  const labelRefs = useRef([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = (event) => setPrefersReducedMotion(event.matches);

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion) return undefined;

      const editorialElements =
        editorialRef.current?.querySelectorAll("[data-copy]") ?? [];
      const nodeElements = nodeRefs.current.filter(Boolean);
      const labelElements = labelRefs.current.filter(Boolean);
      const pathLength = pathRef.current?.getTotalLength?.() ?? 0;

      const activateStage = (timeline, index, position, options = {}) => {
        const activeNode = nodeRefs.current[index];
        const activeLabel = labelRefs.current[index];
        const point = boardNodes[index];
        const {
          travelEase = "none",
          stageEase = "none",
        } = options;

        if (!activeNode || !activeLabel || !point) return;

        timeline.to(
          tokenRef.current,
          {
            attr: { cx: point.x, cy: point.y },
            duration: index === 0 ? 0.56 : 0.86,
            ease: travelEase,
          },
          position
        );

        timeline.to(
          tokenHaloRef.current,
          {
            attr: { cx: point.x, cy: point.y },
            duration: index === 0 ? 0.56 : 0.86,
            ease: travelEase,
          },
          position
        );

        timeline.to(
          nodeRefs.current.filter(Boolean),
          {
            opacity: (_, target) => (target === activeNode ? 1 : 0.18),
            scale: (_, target) => (target === activeNode ? 1.12 : 0.9),
            duration: 0.62,
            ease: stageEase,
            overwrite: "auto",
          },
          position
        );

        timeline.to(
          activeNode,
          {
            scale: 1.18,
            duration: 0.18,
            ease: "power1.out",
            transformOrigin: "50% 50%",
            transformBox: "fill-box",
            overwrite: "auto",
          },
          position + 0.05
        );

        timeline.to(
          activeNode,
          {
            scale: 1.12,
            duration: 0.24,
            ease: "power2.out",
            transformOrigin: "50% 50%",
            transformBox: "fill-box",
            overwrite: "auto",
          },
          position + 0.23
        );

        timeline.to(
          labelRefs.current.filter(Boolean),
          {
            autoAlpha: (_, target) => (target === activeLabel ? 1 : 0.12),
            y: (_, target) => (target === activeLabel ? 0 : 14),
            duration: 0.6,
            ease: stageEase,
            overwrite: "auto",
          },
          position
        );

        timeline.to(
          activeLabel,
          {
            y: -2,
            duration: 0.16,
            ease: "power1.out",
            overwrite: "auto",
          },
          position + 0.08
        );

        timeline.to(
          activeLabel,
          {
            y: 0,
            duration: 0.22,
            ease: "power2.out",
            overwrite: "auto",
          },
          position + 0.24
        );

        timeline.set(
          tokenHaloRef.current,
          {
            attr: { cx: point.x, cy: point.y, r: 18 },
            opacity: 0.06,
          },
          position
        );

        timeline.to(
          tokenHaloRef.current,
          {
            attr: { r: 24 },
            opacity: 0.12,
            duration: 0.18,
            ease: "power1.out",
          },
          position + 0.02
        );

        timeline.to(
          tokenHaloRef.current,
          {
            attr: { r: 20 },
            opacity: 0.05,
            duration: 0.32,
            ease: "power2.out",
          },
          position + 0.22
        );

        timeline.to(
          tokenRef.current,
          {
            attr: { r: 10.25 },
            strokeWidth: 2.4,
            duration: 0.18,
            ease: "power1.out",
          },
          position + 0.04
        );

        timeline.to(
          tokenRef.current,
          {
            attr: { r: 8.5 },
            strokeWidth: 2,
            duration: 0.28,
            ease: "power2.out",
          },
          position + 0.22
        );

        timeline.set(
          pulseRef.current,
          {
            attr: { cx: point.x, cy: point.y, r: 10.5 },
            opacity: 0.34,
            strokeWidth: 1.8,
          },
          position
        );

        timeline.to(
          pulseRef.current,
          {
            attr: { r: 30 },
            opacity: 0,
            strokeWidth: 0.6,
            duration: 0.58,
            ease: "power2.out",
          },
          position + 0.08
        );
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          opacity: 0.08,
        });
        gsap.set(frameRef.current, { autoAlpha: 0.28, scale: 0.985 });
        gsap.set(boardGlowRef.current, { autoAlpha: 0, scale: 1 });
        gsap.set(cardRef.current, { autoAlpha: 0.82, y: 22, scale: 0.985 });
        gsap.set(nodeElements, {
          opacity: 0.18,
          scale: 0.9,
          transformOrigin: "50% 50%",
          transformBox: "fill-box",
        });
        gsap.set(labelElements, { autoAlpha: 0.08, y: 14 });
        gsap.set(tokenRef.current, {
          autoAlpha: 0,
          attr: { cx: boardNodes[0].x, cy: boardNodes[0].y, r: 8.5 },
          strokeWidth: 2,
        });
        gsap.set(tokenHaloRef.current, {
          autoAlpha: 0.05,
          attr: { cx: boardNodes[0].x, cy: boardNodes[0].y, r: 18 },
        });
        gsap.set(pulseRef.current, {
          opacity: 0,
          attr: { cx: boardNodes[0].x, cy: boardNodes[0].y, r: 10.5 },
          strokeWidth: 1.8,
        });
        gsap.set(bridgeRef.current, { autoAlpha: 0, y: 30 });

        const timeline = gsap.timeline({
          smoothChildTiming: true,
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 2.35,
            pin: panelRef.current,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.from(
          editorialElements,
          {
            autoAlpha: 0,
            y: 48,
            stagger: 0.12,
            duration: 0.65,
          },
          0
        );

        timeline.to(
          cardRef.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.86,
          },
          0.08
        );

        timeline.to(
          frameRef.current,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.72,
          },
          0.18
        );

        timeline.to(
          boardGlowRef.current,
          {
            autoAlpha: 0,
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            duration: 0.9,
          },
          0.18
        );

        timeline.to(
          cardRef.current,
          {
            y: -8,
            duration: 5.9,
            ease: "none",
          },
          0.55
        );

        timeline.to(
          pathRef.current,
          {
            strokeDashoffset: 0,
            opacity: 0.86,
            duration: 1.12,
          },
          0.42
        );

        timeline.from(
          nodeElements,
          {
            autoAlpha: 0.25,
            scale: 0.86,
            stagger: 0.08,
            duration: 0.62,
          },
          0.48
        );

        timeline.to(
          tokenRef.current,
          {
            autoAlpha: 1,
            duration: 0.34,
          },
          1.02
        );

        activateStage(timeline, 0, 1.24);
        activateStage(timeline, 1, 2.38);
        activateStage(timeline, 2, 3.52);
        activateStage(timeline, 3, 4.66);

        timeline.to(
          bridgeRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
          },
          5.45
        );
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          opacity: 0.08,
        });
        gsap.set(frameRef.current, { autoAlpha: 0.4, scale: 0.985 });
        gsap.set(boardGlowRef.current, { autoAlpha: 0, scale: 1 });
        gsap.set(cardRef.current, { autoAlpha: 0.9, y: 18, scale: 0.99 });
        gsap.set(nodeElements, {
          opacity: 0.2,
          scale: 0.9,
          transformOrigin: "50% 50%",
          transformBox: "fill-box",
        });
        gsap.set(labelElements, { autoAlpha: 0.1, y: 12 });
        gsap.set(tokenRef.current, {
          autoAlpha: 0,
          attr: { cx: boardNodes[0].x, cy: boardNodes[0].y, r: 8.5 },
          strokeWidth: 2,
        });
        gsap.set(tokenHaloRef.current, {
          autoAlpha: 0.05,
          attr: { cx: boardNodes[0].x, cy: boardNodes[0].y, r: 18 },
        });
        gsap.set(pulseRef.current, {
          opacity: 0,
          attr: { cx: boardNodes[0].x, cy: boardNodes[0].y, r: 10.5 },
          strokeWidth: 1.8,
        });
        gsap.set(bridgeRef.current, { autoAlpha: 0, y: 24 });

        const mobileLoop = gsap.timeline({
          paused: true,
          repeat: -1,
          repeatDelay: 0.45,
        });
        let mobileLoopStarted = false;

        activateStage(mobileLoop, 1, 0.16, {
          travelEase: "power2.inOut",
          stageEase: "power2.out",
        });
        activateStage(mobileLoop, 2, 1.34, {
          travelEase: "power2.inOut",
          stageEase: "power2.out",
        });
        activateStage(mobileLoop, 3, 2.52, {
          travelEase: "power2.inOut",
          stageEase: "power2.out",
        });
        activateStage(mobileLoop, 0, 3.7, {
          travelEase: "power2.inOut",
          stageEase: "power2.out",
        });

        const mobileLoopTrigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => {
            if (mobileLoopStarted) mobileLoop.resume();
          },
          onEnterBack: () => {
            if (mobileLoopStarted) mobileLoop.resume();
          },
          onLeave: () => mobileLoop.pause(),
          onLeaveBack: () => mobileLoop.pause(),
        });

        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });

        timeline.from(editorialElements, {
          autoAlpha: 0,
          y: 36,
          stagger: 0.1,
          duration: 0.55,
        });

        timeline.to(
          cardRef.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
          },
          0.04
        );

        timeline.to(
          frameRef.current,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.5,
          },
          0.12
        );

        timeline.to(
          boardGlowRef.current,
          {
            autoAlpha: 0,
            scale: 1,
            duration: 0.6,
          },
          0.12
        );

        timeline.to(
          pathRef.current,
          {
            strokeDashoffset: 0,
            opacity: 0.82,
            duration: 0.9,
          },
          0.22
        );

        timeline.to(
          tokenRef.current,
          {
            autoAlpha: 1,
            duration: 0.2,
          },
          0.48
        );

        activateStage(timeline, 0, 0.62, {
          travelEase: "power2.inOut",
          stageEase: "power2.out",
        });

        timeline.call(
          () => {
            mobileLoopStarted = true;
            if (mobileLoopTrigger.isActive) {
              mobileLoop.play(0);
            }
          },
          null,
          1.1
        );

        timeline.to(
          bridgeRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
          },
          1.42
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  const tokenPosition = prefersReducedMotion
    ? boardNodes[boardNodes.length - 1]
    : boardNodes[0];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#070707] text-[#F5F2EB]"
      data-theme="dark"
    >
      <div
        className={`relative ${
          prefersReducedMotion ? "py-24 md:py-32" : "py-24 md:h-[212vh] md:py-0"
        }`}
      >
        <div
          ref={panelRef}
          className={`relative flex items-center ${
            prefersReducedMotion ? "min-h-0" : "md:h-screen"
          }`}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8B7E66]/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#8B7E66]/18 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-24 md:px-12 md:py-0">
            <div className="grid items-center gap-12 md:translate-y-2 md:grid-cols-[0.84fr_1.16fr] md:gap-20">
              <div
                ref={editorialRef}
                className="max-w-xl space-y-7"
              >
                <span
                  data-copy
                  className="block text-[11px] font-bold uppercase tracking-[0.32em] text-[#DBD5B5]/48"
                >
                  Critical Thinking
                </span>

                <div className="space-y-6">
                  <h2
                    data-copy
                    className="max-w-[7.2ch] font-display text-[3.8rem] leading-[0.9] tracking-[-0.05em] text-[#F5F2EB] md:text-[5.15rem]"
                  >
                    <span className="text-[#DBD5B5]">How</span>{" "}
                    <span className="text-[#F5F2EB]">I Read the Game</span>
                  </h2>

                  <p
                    data-copy
                    className="max-w-[31rem] font-heading text-[1rem] leading-[1.72] tracking-[0.01em] text-[#A0A0A0] md:text-[1.34rem] md:leading-[1.74]"
                  >
                    {highlightDescription(
                      "Before I learned formal systems design, I learned to read pressure, tempo, and trade-offs through competitive play. MLBB sharpened the habits I still rely on now: scanning the field, predicting the next move, committing with intent, and adapting without noise."
                    )}
                  </p>
                </div>
              </div>

              <div
                className="relative"
                aria-hidden="true"
              >
                <div
                  ref={cardRef}
                  className="relative overflow-hidden rounded-[2rem] border border-[#DBD5B5]/[0.045] bg-[linear-gradient(180deg,rgba(14,14,14,0.95),rgba(8,8,8,0.94))] p-4 shadow-[0_10px_28px_rgba(0,0,0,0.18)] md:p-5"
                >
                  <div
                    ref={boardGlowRef}
                    className="pointer-events-none absolute inset-0"
                  />

                  <svg
                    viewBox="0 0 620 380"
                    className="relative z-10 w-full"
                    fill="none"
                  >
                    <g ref={frameRef}>
                      <rect
                        x="18"
                        y="18"
                        width="584"
                        height="344"
                        rx="28"
                        stroke="#8B7E66"
                        strokeOpacity="0.14"
                      />
                      <path
                        d="M78 54H542"
                        stroke="#8B7E66"
                        strokeOpacity="0.06"
                      />
                      <path
                        d="M78 324H542"
                        stroke="#8B7E66"
                        strokeOpacity="0.06"
                      />
                      <path
                        d="M116 36V344"
                        stroke="#8B7E66"
                        strokeOpacity="0.1"
                        strokeDasharray="6 10"
                      />
                      <path
                        d="M310 36V344"
                        stroke="#8B7E66"
                        strokeOpacity="0.08"
                        strokeDasharray="6 10"
                      />
                      <path
                        d="M504 36V344"
                        stroke="#8B7E66"
                        strokeOpacity="0.1"
                        strokeDasharray="6 10"
                      />
                    </g>

                    <g>
                      <text
                        x="48"
                        y="58"
                        fill="#DBD5B5"
                        fillOpacity="0.56"
                        fontSize="11"
                        letterSpacing="4.2"
                      >
                        STRATEGY BOARD
                      </text>
                      <text
                        x="480"
                        y="42"
                        fill="#DBD5B5"
                        fillOpacity="0.5"
                        fontSize="10"
                        letterSpacing="3"
                      >
                        MLBB SIGNAL
                      </text>
                    </g>

                    <path
                      ref={pathRef}
                      d="M88 248C122 210 164 156 220 132C282 106 318 218 380 216C434 214 474 126 528 118"
                      stroke="#DBD5B5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {boardNodes.map((node, index) => (
                      <g
                        key={node.id}
                        ref={(element) => {
                          nodeRefs.current[index] = element;
                        }}
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="31"
                          fill="#C7B580"
                          fillOpacity="0.034"
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="22"
                          fill="#DBD5B5"
                          fillOpacity="0.018"
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="14"
                          fill="#0D0C1D"
                          stroke="#DBD5B5"
                          strokeOpacity="0.78"
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="8.5"
                          fill="#111111"
                          stroke="#8B7E66"
                          strokeOpacity="0.18"
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="2.8"
                          fill="#DBD5B5"
                        />
                        <text
                          x={node.x}
                          y={node.y + 46}
                          fill="#F5F2EB"
                          fillOpacity="0.92"
                          fontSize="17"
                          fontFamily="Clash Display, sans-serif"
                          letterSpacing="-0.2"
                          textAnchor="middle"
                        >
                          {node.title}
                        </text>
                      </g>
                    ))}

                    {boardNodes.map((node, index) => (
                      <g
                        key={`${node.id}-detail`}
                        ref={(element) => {
                          labelRefs.current[index] = element;
                        }}
                      >
                        <rect
                          x={node.detailX}
                          y={node.detailY - 20}
                          width={node.detail.length * 8.5 + 20}
                          height="26"
                          rx="13"
                          fill="#101010"
                          stroke="#8B7E66"
                          strokeOpacity="0.18"
                        />
                        <text
                          x={node.detailX + 10}
                          y={node.detailY - 3}
                          fill="#DBD5B5"
                          fillOpacity="0.58"
                          fontSize="11"
                          fontFamily="Geist Mono, monospace"
                          letterSpacing="0.9"
                        >
                          {node.detail}
                        </text>
                      </g>
                    ))}

                    <circle
                      ref={tokenHaloRef}
                      cx={tokenPosition.x}
                      cy={tokenPosition.y}
                      r={prefersReducedMotion ? "21" : "18"}
                      fill="#DBD5B5"
                      fillOpacity={prefersReducedMotion ? "0.09" : "0.06"}
                    />
                    <circle
                      ref={pulseRef}
                      cx={tokenPosition.x}
                      cy={tokenPosition.y}
                      r="10.5"
                      fill="none"
                      stroke="#F5F2EB"
                      strokeOpacity="0.4"
                      strokeWidth="1.8"
                    />
                    <circle
                      ref={tokenRef}
                      cx={tokenPosition.x}
                      cy={tokenPosition.y}
                      r="8.5"
                      fill="#DBD5B5"
                      fillOpacity="0.96"
                      stroke="#F5F2EB"
                      strokeOpacity="0.85"
                      strokeWidth="2"
                    />
                    <circle
                      cx={tokenPosition.x}
                      cy={tokenPosition.y}
                      r="19"
                      fill="#DBD5B5"
                      fillOpacity={prefersReducedMotion ? "0.1" : "0.045"}
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              ref={bridgeRef}
              className="max-w-[23rem] border-t border-[#8B7E66]/14 pt-4 font-display text-[2rem] leading-[1.02] tracking-[-0.04em] text-[#DBD5B5]/96 md:pt-5 md:text-[2.72rem]"
            >
              What began as game sense became research discipline.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CriticalThinkingSection;
