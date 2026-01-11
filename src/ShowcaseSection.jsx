import React from "react";
import CardSwap, { Card } from "./components/CardSwap";
import { projects } from "./constants";
import { playHoverSound } from "./utils/soundUtils";

const ShowcaseSection = () => {
  return (
    <div
      id="work"
      className="relative min-h-screen py-20 overflow-hidden mt-30"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      {/* Gray gradient background similar to screenshot */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, #000001 50%, #FFFCE1 50%, #0a0a0a 100%)",
        }}
      />

      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 z-10 relative">
          <h2
            className="text-5xl md:text-6xl font-semibold mb-4 text-[#FFFCE1]"
            style={{
              fontFamily:
                "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
            }}
          >
            Projects
          </h2>
          <p
            className="text-xl text-[#929292]"
            style={{
              fontFamily:
                "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
            }}
          >
            Crafting digital experiences with precision
          </p>
        </div>

        {/* Centered CardSwap */}
        <div className="relative flex items-center justify-center w-full">
          <div className="relative h-[600px] lg:h-[700px] w-[400px] lg:w-[500px]">
            <CardSwap
              width={400}
              height={500}
              cardDistance={50}
              verticalDistance={60}
              delay={4000}
              pauseOnHover={false} // Changed to false to keep animation running
              skewAmount={9}
              easing="elastic"
            >
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="shadow-2xl cursor-pointer transition-transform hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(to bottom right, #212529, #F1DFC2",
                    borderColor: "#ffffff",
                  }}
                >
                  <div className="p-6 h-full flex flex-col">
                    {/* Simple card design matching screenshot */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        {project.id === 1 && (
                          <span className="text-white text-xl">●</span>
                        )}
                        {project.id === 2 && (
                          <span className="text-white text-xl">⚙</span>
                        )}
                        {project.id === 3 && (
                          <span className="text-white text-xl">&lt;/&gt;</span>
                        )}
                        {project.id === 4 && (
                          <span className="text-white text-xl">📊</span>
                        )}
                        {project.id === 5 && (
                          <span className="text-white text-xl">☁️</span>
                        )}
                      </div>
                      <h4
                        className="text-2xl font-semibold text-white"
                        style={{
                          fontFamily:
                            "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
                        }}
                      >
                        {project.title}
                      </h4>
                    </div>

                    {/* Project Image */}
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-6 bg-gray-900">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                      />
                    </div>

                    {/* Project Content */}
                    <div className="flex-1 space-y-4">
                      <p
                        className="text-black-50 text-sm line-clamp-3"
                        style={{
                          fontFamily:
                            "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
                        }}
                      >
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs bg-white/15 text-shadow-gray-50 rounded-full border border-white/10"
                            style={{
                              fontFamily:
                                "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* View Project Link */}
                    <div className="mt-6">
                      <a
                        href={project.link}
                        onMouseEnter={playHoverSound}
                        className="inline-flex items-center gap-2 transition-colors text-gray-900 hover:text-gray-200"
                        style={{
                          fontFamily:
                            "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
                        }}
                      >
                        <span>View Project</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M7 17L17 7M17 7H7M17 7V17"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseSection;
