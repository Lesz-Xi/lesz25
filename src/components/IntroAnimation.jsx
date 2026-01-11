import { useEffect, useRef, useState } from "react";
import { animate, svg, stagger } from "animejs";

const IntroAnimation = ({
  onComplete,
  letterColors = [
    "#dfdcb9", // Purple
    "#85937a", // Dark purple
    "#dfdcb9", // Pink
    "#dfdcb9", // Red-pink
    "#dfdcb9", // Blue
    "#85937a", // Cyan
  ],
}) => {
  const svgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll(".line");

    // Apply colors to each path
    paths.forEach((path, index) => {
      const colorIndex = index % letterColors.length;
      const color = letterColors[colorIndex];

      path.style.setProperty("--path-color", color);
      path.style.stroke = color;
      path.setAttribute("stroke", color);

      console.log(`IntroAnimation Path ${index}: ${color}`);
    });

    const drawables = svg.createDrawable(paths);

    // Start the drawing animation
    const animation = animate(drawables, {
      draw: ["0 0", "0 1"],
      ease: "inOutQuad",
      duration: 1000,
      delay: stagger(150),
      loop: false,
      autoplay: true,
      complete: () => {
        // Wait longer after completion to appreciate the full drawing
        setTimeout(() => {
          setIsVisible(false);
          // Call onComplete after fade out animation
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 800);
        }, 3000);
      },
    });

    return () => {
      if (animation && animation.pause) {
        animation.pause();
      }
    };
  }, [onComplete, letterColors]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`intro-animation fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Grid background for design reference */}
      <div className="grid-bg absolute inset-0 opacity-20"></div>

      {/* Animated Drawing */}
      <div className="relative z-10">
        <svg
          ref={svgRef}
          viewBox="0 0 304 112"
          className="w-full h-full"
          style={{
            width: "min(80vw, 600px)",
            height: "auto",
          }}
        >
          <g
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path
              className="line"
              d="M59 90V56.136C58.66 46.48 51.225 39 42 39c-9.389 0-17 7.611-17 17s7.611 17 17 17h8.5v17H42C23.222 90 8 74.778 8 56s15.222-34 34-34c18.61 0 33.433 14.994 34 33.875V90H59z"
            />
            <polyline
              className="line"
              points="59 22.035 59 90 76 90 76 22 59 22"
            />
            <path
              className="line"
              d="M59 90V55.74C59.567 36.993 74.39 22 93 22c18.778 0 34 15.222 34 34v34h-17V56c0-9.389-7.611-17-17-17-9.225 0-16.66 7.48-17 17.136V90H59z"
            />
            <polyline
              className="line"
              points="127 22.055 127 90 144 90 144 22 127 22"
            />
            <path
              className="line"
              d="M127 90V55.74C127.567 36.993 142.39 22 161 22c18.778 0 34 15.222 34 34v34h-17V56c0-9.389-7.611-17-17-17-9.225 0-16.66 7.48-17 17.136V90h-17z"
            />
            <path
              className="line"
              d="M118.5 22a8.5 8.5 0 1 1-8.477 9.067v-1.134c.283-4.42 3.966-7.933 8.477-7.933z"
            />
            <path
              className="line"
              d="M144 73c-9.389 0-17-7.611-17-17v-8.5h-17V56c0 18.778 15.222 34 34 34V73z"
            />
            <path
              className="line"
              d="M178 90V55.74C178.567 36.993 193.39 22 212 22c18.778 0 34 15.222 34 34v34h-17V56c0-9.389-7.611-17-17-17-9.225 0-16.66 7.48-17 17.136V90h-17z"
            />
            <path
              className="line"
              d="M263 73c-9.389 0-17-7.611-17-17s7.611-17 17-17c9.18 0 16.58 7.4 17 17h-17v17h34V55.875C296.433 36.994 281.61 22 263 22c-18.778 0-34 15.222-34 34s15.222 34 34 34V73z"
            />
            <path
              className="line"
              d="M288.477 73A8.5 8.5 0 1 1 280 82.067v-1.134c.295-4.42 3.967-7.933 8.477-7.933z"
            />
          </g>
        </svg>
      </div>

      {/* Loading indicator or subtitle */}
      <div className="loading-text absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-wider">
        Loading Experience...
      </div>
    </div>
  );
};

export default IntroAnimation;
