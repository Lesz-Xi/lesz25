import React from "react";
import Hero from "../sections/Hero";
import ShowcaseSection from "../../ShowcaseSection";
import LogoSection from "../sections/LogoSection";
import CareerSection from "../sections/CareerSection";
import ContactSection from "../sections/ContactSection";
import RoleShowcase from "../sections/RoleShowcase";
import ProjectCarousel from "../sections/ProjectCarousel";
import ResearchSection from "../sections/ResearchSection";
import PhotographySection from "../sections/PhotographySection";
import ServicesSection from "../sections/ServicesSection";
import Footer from "../Footer";

const Home = () => {
  return (
    <>
      <Hero />
      
      <div id="work">
         <ShowcaseSection />
      </div>

      <div id="roles">
         <RoleShowcase />
      </div>

      <ProjectCarousel />

      <ResearchSection />

      <PhotographySection />
      
      <ServicesSection />

      <div id="about">
         <CareerSection />
      </div>

      <LogoSection />

      <div id="contact">
         <ContactSection />
      </div>

      <Footer />
    </>
  );
};

export default Home;
