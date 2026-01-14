import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("/"); // Track active section in state
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync activeSection with location changes (for browser back/forward)
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      setActiveSection("/" + location.hash);
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
           element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else if (location.pathname === "/") {
      setActiveSection("/");
    } else {
      setActiveSection(location.pathname);
    }
  }, [location]);

  const isPhotographyPage = location.pathname.startsWith("/photography");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "My Story", href: "/#work" },
    { name: "Photos", href: "/photography" },
    { name: "Journey", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  const handleNavigation = (e, href) => {
    e.preventDefault();
    
    // Update active section IMMEDIATELY before closing menu
    setActiveSection(href);
    setIsMobileMenuOpen(false);

    if (href.startsWith("/#")) {
       const targetId = href.replace("/", "");
       if (location.pathname === "/") {
          const element = document.querySelector(targetId);
          if (element) element.scrollIntoView({ behavior: "smooth" });
       } else {
          navigate(href.replace("#", "#")); // Navigate to /#section
          setTimeout(() => {
             const element = document.querySelector(targetId);
             if (element) element.scrollIntoView({ behavior: "smooth" });
          }, 300);
       }
    } else if (href === "/") {
        if (location.pathname === "/") {
           window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
           navigate("/");
        }
    } else {
       navigate(href);
    }
  };

  const handleLogoClick = () => {
      if (location.pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
          navigate("/");
      }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] px-6 md:px-12 flex justify-between items-center transition-all duration-500 py-6 ${isScrolled ? "bg-black/20 backdrop-blur-lg" : "bg-transparent"}`}>
        {/* Left Side Navigation Area */}
        <div className="flex-shrink-0 relative z-[60]">
            {/* 1. Home Page: Show Nothing (Clean) */}


            {/* 2. Album Detail Page: Show Back Icon */}
            {location.pathname.startsWith("/photography/") && (
                <button 
                  onClick={() => navigate("/photography")}
                  className="group flex items-center justify-center w-10 h-10 transition-transform duration-300 hover:-translate-x-1"
                  aria-label="Back to Albums"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-[#DBD5B5] transition-colors duration-300">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
            )}
            
            {/* 3. Main Photography Grid: Show Nothing (Clean) */}
        </div>

        {/* Conditional Navigation Rendering */}
        {isPhotographyPage ? (
          /* Photography Page: Minimalist 2-line Hamburger - Hidden when menu is open */
          <div className={`flex items-center absolute top-12 right-12 md:right-16 z-[70] transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <button
              className="group flex flex-col gap-[6px] p-2 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <div className="w-6 h-px bg-white group-hover:bg-[#DBD5B5] transition-all duration-300" />
              <div className="w-6 h-px bg-white group-hover:bg-[#DBD5B5] transition-all duration-300" />
            </button>
          </div>
        ) : (
          <>
            {/* Standard Desktop Links */}
            <div 
              className={`hidden md:flex items-center gap-6 px-6 rounded-full border transition-all duration-500 ease-out pointer-events-auto
              ${
                isScrolled
                  ? "bg-black/40 backdrop-blur-xl border-white/10 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                  : "bg-white/[0.03] backdrop-blur-md border-white/5 py-3"
              }`}
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavigation(e, link.href)}
                  className="text-[11px] font-display uppercase tracking-[0.2em] text-white/60 hover:text-[#DBD5B5] transition-all duration-300 relative group cursor-pointer"
                  data-hover
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#DBD5B5] transition-all duration-300 group-hover:w-full opacity-40" />
                </a>
              ))}
            </div>

            {/* Standard Mobile Menu Button - Hidden when menu is open */}
            <div className={`md:hidden flex items-center transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              <button
                className={`p-3 rounded-full border transition-all duration-500
                ${isScrolled 
                  ? "bg-black/40 backdrop-blur-xl border-white/10 shadow-lg" 
                  : "bg-white/[0.05] backdrop-blur-md border-white/10"}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="w-5 h-4 relative flex flex-col justify-between">
                  <span className="w-full h-px bg-white" />
                  <span className="w-full h-px bg-white" />
                  <span className="w-full h-px bg-white" />
                </div>
              </button>
            </div>
          </>
        )}
      </nav>

      {/* Unified Cinematic Full-Screen Menu Overlay (All Pages) */}
      <div 
        className={`fixed inset-0 z-[80] bg-[#070707] transition-all duration-700 ease-in-out ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Background Decorative Element */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#DBD5B5]/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#DBD5B5]/5 blur-[100px] rounded-full" />
        </div>

        {/* Close Button - iOS-optimized with touch-action and no backdrop-blur */}
        <button 
            onClick={() => setIsMobileMenuOpen(false)}
            onTouchEnd={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}
            className="absolute top-6 right-6 z-[90] group w-14 h-14 flex items-center justify-center rounded-full bg-black/60 border border-white/20 active:bg-white/10 transition-all duration-200"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            aria-label="Close Menu"
        >
            <div className="relative w-6 h-6 flex justify-center items-center">
                <span className="absolute w-5 h-[2px] bg-white group-hover:bg-[#DBD5B5] transition-all duration-300 rotate-45" />
                <span className="absolute w-5 h-[2px] bg-white group-hover:bg-[#DBD5B5] transition-all duration-300 -rotate-45" />
            </div>
        </button>

        {/* Menu Content - Positioned from top with scroll for mobile */}
        <div className="relative h-full flex flex-col justify-start items-start px-8 md:px-32 pt-24 md:pt-32 pb-8 overflow-y-auto">
          <div className="flex flex-col gap-6 md:gap-8 items-start">
            {navLinks.map((link, index) => {
              // Use stored activeSection state for reliable highlighting
              let isActive = false;
              
              if (link.href === "/") {
                isActive = activeSection === "/";
              } else if (link.href === "/photography") {
                isActive = activeSection.startsWith("/photography");
              } else {
                isActive = activeSection === link.href;
              }
              
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavigation(e, link.href)}
                  className={`text-5xl md:text-7xl font-display font-medium uppercase tracking-tighter transition-all duration-500 hover:tracking-wide hover:ml-4 ${isActive ? "text-[#DBD5B5]" : "text-white/40 hover:text-[#DBD5B5]"}`}
                  style={{ 
                    transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : "0ms",
                    transform: isMobileMenuOpen ? "translateY(0)" : "translateY(40px)",
                    opacity: isMobileMenuOpen ? 1 : 0
                  }}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Contact Info in Menu */}
          <div 
            className="mt-20 flex flex-col gap-4 items-start transition-all duration-700 delay-500"
            style={{ 
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? "translateY(0)" : "translateY(20px)"
            }}
          >
            <div className="w-12 h-[1px] bg-[#DBD5B5]/30 mb-4" />
            <a 
              href="/#contact" 
              onClick={(e) => handleNavigation(e, "/#contact")}
              className="text-[#DBD5B5] text-xs uppercase tracking-[0.3em] font-medium hover:text-white transition-colors"
            >
              Get in Touch
            </a>
            <a 
              href="mailto:rhinelesther@gmail.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors text-lg font-light tracking-wide cursor-pointer"
            >
              rhinelesther@gmail.com
            </a>
            
            {/* Social Links Row */}
            <div className="flex items-center gap-6 mt-4">
                <a href="https://github.com/Lesz-Xi" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#DBD5B5] transition-colors text-sm uppercase tracking-widest">Github</a>
                <a href="https://www.linkedin.com/in/rhinelesther/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#DBD5B5] transition-colors text-sm uppercase tracking-widest">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
