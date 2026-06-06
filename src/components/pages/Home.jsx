import React from "react";
import Hero from "../sections/Hero";
import ShowcaseSection from "../../ShowcaseSection";
import CareerSection from "../sections/CareerSection";
import RoleShowcase from "../sections/RoleShowcase";
import ProjectCarousel from "../sections/ProjectCarousel";
import ResearchSection from "../sections/ResearchSection";
import PhotographySection from "../sections/PhotographySection";
import Footer from "../Footer";

const Home = () => {
  return (
    <>
      <Hero />

      <div className="auralis-page-field" data-theme="dark">
        <div id="work">
          <ShowcaseSection />
        </div>

        <div id="roles">
          <RoleShowcase />
        </div>

        <ProjectCarousel />

        <PhotographySection />

        <ResearchSection />

        <div id="about">
          <CareerSection />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
