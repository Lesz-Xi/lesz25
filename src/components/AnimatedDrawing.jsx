import { useEffect, useRef } from "react";
import { animate, svg, stagger } from "animejs";

const AnimatedDrawing = ({
  className = "",
  autoPlay = true,
  loop = true,
  duration = 2000,
  staggerDelay = 100,
  letterColors = [
    "#667eea", // Purple
    "#764ba2", // Dark purple
    "#f093fb", // Pink
    "#f5576c", // Red-pink
    "#4facfe", // Blue
    "#00f2fe", // Cyan
  ],
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll(".line");

    // Apply colors to each path using CSS custom properties
    paths.forEach((path, index) => {
      const colorIndex = index % letterColors.length;
      const color = letterColors[colorIndex];

      // Multiple approaches to ensure color applies
      path.style.setProperty("--path-color", color);
      path.style.stroke = color;
      path.setAttribute("stroke", color);

      // Debug log
      console.log(`Path ${index}: ${color}`);
    });

    const drawables = svg.createDrawable(paths);

    const animation = animate(drawables, {
      draw: ["0 0", "0 1", "1 1"],
      ease: "inOutQuad",
      duration: duration,
      delay: stagger(staggerDelay),
      loop: loop,
      autoplay: autoPlay,
    });

    return () => {
      if (animation && animation.pause) {
        animation.pause();
      }
    };
  }, [autoPlay, loop, duration, staggerDelay, letterColors]);

  return (
    <div className={`animated-drawing ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 240 80"
        className="w-full h-full"
        style={{ maxWidth: "400px", height: "auto" }}
      >
        <g
          fill="none"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        >
          {/* L */}
          <path className="line" d="M20 20v40h30" />

          {/* e */}
          <path className="line" d="M75 35a15 15 0 1 1 0 20m0-10h15" />

          {/* s */}
          <path
            className="line"
            d="M115 35c0-5 4-10 10-10s10 5 10 10c0 5-4 10-10 10-6 0-10 5-10 10s4 10 10 10 10-5 10-10"
          />

          {/* z */}
          <path className="line" d="M160 27h25l-25 33h25" />

          {/* . (period) */}
          <circle
            className="line"
            cx="205"
            cy="55"
            r="3"
            fill="currentColor"
            stroke="none"
          />
        </g>
      </svg>
    </div>
  );
};

export default AnimatedDrawing;
