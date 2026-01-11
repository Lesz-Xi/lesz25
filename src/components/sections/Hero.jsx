import Button from "../Button";
import HeroExperience from "../HeroModels/HeroExperience";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Dock from "../Dock";
import {
  FaHome,
  FaProjectDiagram,
  FaBriefcase,
  FaEnvelope,
} from "react-icons/fa";
import AnimatedGreeting from "../AnimatedGreeting";
import Threads from "../Threads";

const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text .hero-line",
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.3,
        duration: 1,
        ease: "power2.inOut",
      }
    );
  });

  const navItems = [
    {
      icon: <FaHome size={18} />,
      label: "Home",
      onClick: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    },
    {
      icon: <FaProjectDiagram size={18} />,
      label: "Projects",
      onClick: () => {
        const projectsSection = document.getElementById("work");
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
    {
      icon: <FaBriefcase size={18} />,
      label: "Career",
      onClick: () => {
        const careerSection = document.getElementById("career");
        if (careerSection) {
          careerSection.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
    {
      icon: <FaEnvelope size={18} />,
      label: "Contact",
      onClick: () => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
  ];

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Dock Navigation */}
      <Dock
        items={navItems}
        panelHeight={40}
        baseItemSize={40}
        magnification={80}
      />

      <div className="absolute top-0 left-0 z-10"></div>

      <div className="hero-layout">
        {/*LEFT: HERO CONTENT */}
        <header
          className="flex flex-col justify-center md:w-full w-screen
          md:px-20
          px-5 mt-20 md:mt-50"
        >
          <div className="flex flex-col gap-7">
            <div className="hero-text">
              {/* Hi intro paragraph - moved above Creating */}
              <h1 className="hero-line text-3xl md:text-5xl lg:text-6xl font-medium mb-8">
                <span className="text-[#929292]">
                  <AnimatedGreeting />
                  <br />
                  I'm
                </span>{" "}
                <span className="text-[#FFFCE1]">Lesz.</span>
              </h1>

              <p className="hero-line text-[#929292] text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl">
                I'm a <span className="text-[#FFFCE1]">designer</span> based in
                the <span className="text-[#FFFCE1]">Philippines</span>. I
                develop innovative, user-centric solutions that bring your
                creative vision to life.
              </p>

              {/* Creating - simplified without animated words */}
            </div>

            <Button
              className="md:w-80 md:h-16 w-60 h-12 mt-8"
              id="button"
              text="See my Work"
            />

            {/* Threads component below the button */}
            <div className="w-full h-[600px] mt-1 relative">
              <Threads
                amplitude={1}
                distance={0}
                enableMouseInteraction={false}
                color={[0.9, 0.9, 0.9]}
              />
            </div>
          </div>
        </header>
        {/*RIGHT: 3D MODEL */}
        <figure>
          <div className="hero-3d-layout">
            <HeroExperience />
          </div>
        </figure>
      </div>
    </section>
  );
};

export default Hero;
