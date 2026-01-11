import React, { useState } from "react";
import Hero from "./Hero";
import ShowcaseSection from "../../ShowcaseSection";
import LogoSection from "./LogoSection";
import CareerSection from "./CareerSection";
import ContactSection from "./ContactSection";
import AnimatedCounter from "../HeroModels/AnimatedCounter";
import Dock from "../Dock";
import IntroAnimation from "../IntroAnimation";

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      {!showIntro && (
        <>
          <Hero />
          <ShowcaseSection />
          <CareerSection />
          <AnimatedCounter />
          <LogoSection />
          <ContactSection />
        </>
      )}
    </>
  );
};

export default App;
