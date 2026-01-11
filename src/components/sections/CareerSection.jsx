const CareerSection = () => {
  const careerData = [
    {
      title: "Freelance Architect",
      period: "2016 - 2020",
      description:
        "As a freelance architect, I worked on a range of residential and commercial projects, balancing form and function. I collaborated with clients and contractors to transform concepts into reality, ensuring each design was both aesthetically pleasing and structurally sound.",
      showDot: false,
    },
    {
      title: "Product Designer at Spotify",
      period: "2020 - 2022",
      description:
        "At Spotify, I helped shape innovative features for millions of users globally. My focus was on creating seamless music discovery experiences, enhancing user interfaces, and optimizing cross-platform navigation, which led to an improved product flow and increased user satisfaction.",
      showDot: false,
    },
    {
      title: "Freelance Product Designer",
      period: "2022 - Now",
      description:
        "Now I design user-centric products that align with client visions. As a freelance product designer, I collaborate with startups and established companies, crafting solutions that elevate user experiences and increase engagement across both digital and physical interfaces.",
      showDot: false,
    },
  ];

  return (
    <section id="career" className="bg-[#0a0a0a] py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-neutral-800 rounded-full text-sm text-white mb-8">
            <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
            Career
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-[#FFFCE1] mb-4">
            My Career
          </h2>
        </div>

        {/* Career Timeline */}
        <div className="space-y-16 md:space-y-20">
          {careerData.map((item, index) => (
            <div key={index} className="relative">
              {/* Career Item */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                {/* Left Side - Title & Period */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl md:text-2xl font-semibold text-[#FFFCE1]">
                      {item.title}
                    </h3>
                    {item.showDot && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <p className="text-neutral-400 text-sm md:text-base">
                    {item.period}
                  </p>
                </div>

                {/* Right Side - Description */}
                <div className="md:pl-8">
                  <p
                    className={`leading-relaxed text-base md:text-lg ${
                      item.title === "Freelance Architect"
                        ? "text-[#929292]"
                        : "text-[#929292]"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Divider Line */}
              {index < careerData.length - 1 && (
                <div className="mt-16 md:mt-20 h-px bg-neutral-800"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerSection;
