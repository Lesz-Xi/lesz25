import SpotlightCard from "../SpotlightCard";

const WhyMeSection = () => {
  const whyMeCards = [
    {
      icon: (
        <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6">
          <svg
            className="w-6 h-6 text-[#FFFCE1]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24= 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
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
          <svg
            className="w-6 h-6 text-[#FFFCE1]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
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
          <svg
            className="w-6 h-6 text-[#FFFCE1]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      ),
      title: "Pixel Perfect",
      description:
        "Meticulous attention to every element, ensuring a polished and cohesive final product that impresses.",
    },
  ];

  return (
    <section className="bg-[#0a0a0a] py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-neutral-700 rounded-full text-sm text-white mb-8">
            <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
            Why me?
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-[#FFFCE1] mb-4">
            I'll bring your vision to life
          </h2>
        </div>

        {/* Spotlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyMeCards.map((card, index) => (
            <SpotlightCard
              key={index}
              className="h-full"
              spotlightColor="rgba(255, 252, 225, 0.5)"
            >
              <div className="relative z-10">
                {card.icon}
                <h3 className="text-xl font-semibold text-[#FFFCE1] mb-4">
                  {card.title}
                </h3>
                <p className="text-[#929292] leading-relaxed">
                  {card.description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMeSection;
