import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa6";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasReachedSecondSection, setHasReachedSecondSection] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPhotographySubmenuOpen, setIsPhotographySubmenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("/"); // Track active section in state
  const location = useLocation();
  const navigate = useNavigate();
  const isMenuNavigationRef = useRef(false);

  useEffect(() => {
    const updateNavState = () => {
      setIsScrolled(window.scrollY > 50);

      if (location.pathname !== "/") {
        setHasReachedSecondSection(false);
        return;
      }

      if (window.scrollY <= 8) {
        setHasReachedSecondSection(false);
        return;
      }

      const secondSection = document.getElementById("work");
      const secondSectionTop = secondSection?.getBoundingClientRect().top ?? window.innerHeight;
      setHasReachedSecondSection(secondSectionTop <= window.innerHeight - 1);
    };

    updateNavState();
    window.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", updateNavState);
    return () => {
      window.removeEventListener("scroll", updateNavState);
      window.removeEventListener("resize", updateNavState);
    };
  }, [location.pathname]);

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

  // Reset Photography Submenu when Mobile Menu closes
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsPhotographySubmenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  // Lock background scroll while the full-screen menu is open.
  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const scrollY = window.scrollY;
    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;
    const previousBodyPosition = bodyStyle.position;
    const previousBodyTop = bodyStyle.top;
    const previousBodyWidth = bodyStyle.width;
    const previousBodyOverflow = bodyStyle.overflow;
    const previousBodyOverscroll = bodyStyle.overscrollBehavior;
    const previousHtmlOverflow = htmlStyle.overflow;
    const previousHtmlOverscroll = htmlStyle.overscrollBehavior;

    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";
    bodyStyle.overflow = "hidden";
    bodyStyle.overscrollBehavior = "none";
    htmlStyle.overflow = "hidden";
    htmlStyle.overscrollBehavior = "none";

    return () => {
      bodyStyle.position = previousBodyPosition;
      bodyStyle.top = previousBodyTop;
      bodyStyle.width = previousBodyWidth;
      bodyStyle.overflow = previousBodyOverflow;
      bodyStyle.overscrollBehavior = previousBodyOverscroll;
      htmlStyle.overflow = previousHtmlOverflow;
      htmlStyle.overscrollBehavior = previousHtmlOverscroll;

      if (!isMenuNavigationRef.current) {
        window.scrollTo(0, scrollY);
      }
    };
  }, [isMobileMenuOpen]);

  const isPhotographyPage = location.pathname.startsWith("/photography");
  const shouldCollapseHomeNav = location.pathname === "/" && hasReachedSecondSection;
  const shouldHideDesktopNavLinks = true;
  const mobileButtonInset = {
    top: "calc(env(safe-area-inset-top, 0px) + 0.75rem)",
    right: "calc(env(safe-area-inset-right, 0px) + 1.1rem)",
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Photography", href: "/#photography" },
    { name: "Journey", href: "/#about" },
    { name: "Research", href: "/#research" },
  ];

  const handleNavigation = (e, href) => {
    e.preventDefault();

    isMenuNavigationRef.current = true;
    setActiveSection(href);
    setIsMobileMenuOpen(false);

    const runAfterMenuUnlock = (callback) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          callback();
          window.setTimeout(() => {
            isMenuNavigationRef.current = false;
          }, 160);
        });
      });
    };

    runAfterMenuUnlock(() => {
      if (href.startsWith("/#")) {
        const targetId = href.replace("/", "");

        if (location.pathname === "/") {
          const element = document.querySelector(targetId);
          if (element) element.scrollIntoView({ behavior: "smooth" });
          return;
        }

        navigate(href);
        window.setTimeout(() => {
          const element = document.querySelector(targetId);
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 300);
        return;
      }

      if (href === "/") {
        if (location.pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        navigate("/");
        return;
      }

      if (href === "/photography") {
        sessionStorage.removeItem("photographyReturnTarget");
      }

      navigate(href);
    });
  };

  const getPhotographyReturnTarget = () => {
      const storedTarget = sessionStorage.getItem("photographyReturnTarget");

      if (storedTarget === "/" || storedTarget?.startsWith("/#")) {
          return storedTarget;
      }

      return "/";
  };

  const handleLogoClick = () => {
      if (location.pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
      }

      if (location.pathname === "/photography") {
          navigate(getPhotographyReturnTarget());
          return;
      }

      navigate("/");
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] px-6 md:px-12 flex justify-between items-center transition-all duration-500 py-6 mix-blend-difference text-[#F5F2EB] ${isScrolled ? "backdrop-blur-lg" : "bg-transparent"}`}>
        {/* Left Side Navigation Area */}
        <div className="flex-shrink-0 relative z-[60]">
            {/* 1. Photography Grid: Return to landing */}
            {location.pathname === "/photography" && (
                <button
                  onClick={handleLogoClick}
                  className="group flex h-10 w-10 items-center justify-center transition-transform duration-300 hover:-translate-x-1"
                  aria-label="Back to Home"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#F5F2EB] transition-colors duration-300 group-hover:text-[#DBD5B5]">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
            )}

            {/* 2. Album Detail Page: Show Back Icon */}
            {location.pathname.startsWith("/photography/") && (
                <button 
                  onClick={() => navigate("/photography")}
                  className="group flex items-center justify-center w-10 h-10 transition-transform duration-300 hover:-translate-x-1"
                  aria-label="Back to Albums"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#F5F2EB] group-hover:text-[#DBD5B5] transition-colors duration-300">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
            )}
            
            {/* 3. Home Page: Show Nothing (Clean) */}
        </div>

        {/* Conditional Navigation Rendering */}
        {isPhotographyPage ? (
          /* Photography Page: Minimalist short-long-short Hamburger - Hidden when menu is open */
          <div
            className={`md:hidden flex items-center fixed z-[120] transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            style={mobileButtonInset}
          >
            <button
              className="group flex h-9 w-9 items-center justify-center transition-opacity duration-300 hover:opacity-80"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <div className="flex h-4 w-5 flex-col items-end justify-center gap-[6px]">
                <span className="h-px w-5 bg-[#DBD5B5]/82 transition-all duration-300 group-hover:w-4 group-hover:bg-[#F5F2EB]" />
                <span className="h-px w-3.5 bg-[#DBD5B5]/70 transition-all duration-300 group-hover:w-5 group-hover:bg-[#F5F2EB]" />
              </div>
            </button>
          </div>
        ) : (
          <>
            {/* Standard Desktop Links */}
            <div 
              className={`hidden items-center gap-8 transition-all duration-300 ${shouldHideDesktopNavLinks ? "translate-y-[-0.25rem] opacity-0 pointer-events-none" : "translate-y-0 opacity-100 pointer-events-auto"}`}
              aria-hidden={shouldHideDesktopNavLinks}
            >
              {navLinks.map((link) => (
                <div key={link.name} className="relative group/nav-item">
                  {link.name === "Photography" ? (
                    <>
                      <a
                        href={link.href}
                        onClick={(e) => handleNavigation(e, link.href)}
                        className="text-[11px] font-auralis-display font-light tracking-[0.08em] text-[#F5F2EB]/78 hover:text-[#DBD5B5] transition-all duration-300 relative block py-2 cursor-pointer"
                        data-hover
                      >
                        {link.name}
                        <span className="absolute bottom-1 left-0 w-0 h-[1px] bg-[#DBD5B5] transition-all duration-300 group-hover/nav-item:w-full opacity-100" />
                      </a>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover/nav-item:opacity-100 group-hover/nav-item:translate-y-0 group-hover/nav-item:pointer-events-auto transition-all duration-300 ease-out">
                        <div className="bg-[#070707]/90 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl py-2 min-w-[140px] flex flex-col gap-1">
                          <a 
                            href="/#photography"
                            onClick={(e) => handleNavigation(e, "/#photography")}
                            className="text-[10px] font-auralis-display font-light tracking-[0.08em] text-white/58 hover:text-[#DBD5B5] hover:bg-white/5 px-4 py-2 text-center transition-colors duration-200"
                          >
                            Portfolio
                          </a>
                          <div className="w-8 h-px bg-white/10 mx-auto" />
                          <a 
                            href="/photography"
                            onClick={(e) => handleNavigation(e, "/photography")}
                            className="text-[10px] font-auralis-display font-light tracking-[0.08em] text-white/58 hover:text-[#DBD5B5] hover:bg-white/5 px-4 py-2 text-center transition-colors duration-200"
                          >
                            Albums
                          </a>
                        </div>
                      </div>
                    </>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavigation(e, link.href)}
                      className="text-[11px] font-auralis-display font-light tracking-[0.08em] text-[#F5F2EB]/78 hover:text-[#DBD5B5] transition-all duration-300 relative block py-2 group cursor-pointer"
                      data-hover
                    >
                      {link.name}
                      <span className="absolute bottom-1 left-0 w-0 h-[1px] bg-[#DBD5B5] transition-all duration-300 group-hover:w-full opacity-100" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Standard Menu Button - mobile always, desktop after second section */}
            <div
              className={`fixed z-[120] flex items-center transition-opacity duration-200 ${shouldCollapseHomeNav ? "md:flex" : "md:hidden"} ${isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              style={mobileButtonInset}
            >
              <button
                className="group flex h-9 w-9 items-center justify-center transition-opacity duration-300 hover:opacity-80"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                <div className="flex h-4 w-5 flex-col items-end justify-center gap-[6px]">
                  <span className="h-px w-5 bg-[#DBD5B5]/82 transition-all duration-300 group-hover:w-4 group-hover:bg-[#F5F2EB]" />
                  <span className="h-px w-3.5 bg-[#DBD5B5]/70 transition-all duration-300 group-hover:w-5 group-hover:bg-[#F5F2EB]" />
                </div>
              </button>
            </div>
          </>
        )}
      </nav>

      {/* Close Button - OUTSIDE overlay to avoid iOS stacking context issues */}
      {isMobileMenuOpen && (
        <button 
            onClick={() => setIsMobileMenuOpen(false)}
            onTouchEnd={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}
            className="fixed z-[200] group flex h-10 w-10 items-center justify-center active:scale-95 transition-transform duration-150"
            style={{ ...mobileButtonInset, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            aria-label="Close Menu"
        >
            <div className="relative flex h-5 w-5 items-center justify-center rounded-full border border-[#DBD5B5]/20 transition-colors duration-300 group-hover:border-[#F5F2EB]/42">
                <span className="absolute h-px w-3.5 rotate-45 bg-[#DBD5B5]/82 transition-colors duration-300 group-hover:bg-[#F5F2EB]" />
                <span className="absolute h-px w-3.5 -rotate-45 bg-[#DBD5B5]/82 transition-colors duration-300 group-hover:bg-[#F5F2EB]" />
            </div>
        </button>
      )}

      {/* Unified Cinematic Full-Screen Menu Overlay (All Pages) */}
      <div 
        className={`fixed inset-0 z-[140] bg-[#060605] transition-all duration-700 ease-in-out ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Background Decorative Element */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.035] bg-noise-pattern" />
          <div className="absolute left-[8vw] top-0 h-full w-px bg-gradient-to-b from-transparent via-[#DBD5B5]/10 to-transparent" />
        </div>

        {/* Menu Content - Positioned from top with scroll for mobile */}
        <div className="relative h-full flex flex-col justify-start items-start px-8 md:px-[10vw] pt-24 md:pt-28 pb-10 overflow-y-auto">
          <div className="mb-10 flex items-center gap-4 font-auralis-mono text-[0.62rem] uppercase tracking-[0.24em] text-[#C7B580]/54">
            <span className="h-px w-8 bg-[#C7B580]/28" />
            <span>Index</span>
          </div>

          <div className="flex flex-col gap-5 md:gap-6 items-start">
            {navLinks.map((link, index) => {
              // Use stored activeSection state for reliable highlighting
              let isActive = false;
              
              if (link.href === "/") {
                isActive = activeSection === "/";
              } else {
                isActive = activeSection === link.href;
              }
              
              // Special handling for Photography in Mobile Menu (Accordion)
              if (link.name === "Photography") {
                  return (
                    <div 
                        key={link.name} 
                        className="flex flex-col items-start w-full"
                        style={{ 
                            transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : "0ms",
                            transform: isMobileMenuOpen ? "translateY(0)" : "translateY(40px)",
                            opacity: isMobileMenuOpen ? 1 : 0
                        }}
                    >
                        <button
                          onClick={(e) => {
                              e.preventDefault();
                              setIsPhotographySubmenuOpen(!isPhotographySubmenuOpen);
                          }}
                          className={`flex items-baseline gap-4 text-left [font-family:var(--font-auralis-jp)] text-[clamp(2.45rem,5.5vw,5.6rem)] font-light leading-[0.95] tracking-[-0.085em] transition-all duration-500 hover:translate-x-3 hover:tracking-[-0.07em] ${isActive || isPhotographySubmenuOpen ? "text-[#F5F2EB]" : "text-[#F5F2EB]/34 hover:text-[#DBD5B5]"}`}
                        >
                          {link.name}
                          <span className={`font-auralis-mono text-[0.82rem] tracking-[0.08em] text-[#C7B580]/54 transition-transform duration-300 ${isPhotographySubmenuOpen ? "rotate-180" : ""}`}>↓</span>
                        </button>
                        
                        {/* Mobile Submenu Accordion */}
                        <div className={`overflow-hidden transition-all duration-300 ease-out w-full ${isPhotographySubmenuOpen ? "max-h-28 opacity-100 mt-5" : "max-h-0 opacity-0 mt-0"}`}>
                            <div className="ml-3 flex flex-col gap-3 border-l border-[#DBD5B5]/12 pl-6">
                                <a 
                                    href="/#photography"
                                    onClick={(e) => handleNavigation(e, "/#photography")}
                                    className="[font-family:var(--font-auralis-jp)] text-lg font-light tracking-[-0.02em] text-white/44 transition-colors hover:text-[#DBD5B5]"
                                >
                                    Portfolio
                                </a>
                                <a 
                                    href="/photography"
                                    onClick={(e) => handleNavigation(e, "/photography")}
                                    className="[font-family:var(--font-auralis-jp)] text-lg font-light tracking-[-0.02em] text-white/44 transition-colors hover:text-[#DBD5B5]"
                                >
                                    Albums
                                </a>
                            </div>
                        </div>
                    </div>
                  );
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavigation(e, link.href)}
                  className={`[font-family:var(--font-auralis-jp)] text-[clamp(2.45rem,5.5vw,5.6rem)] font-light leading-[0.95] tracking-[-0.085em] transition-all duration-500 hover:translate-x-3 hover:tracking-[-0.07em] ${isActive ? "text-[#F5F2EB]" : "text-[#F5F2EB]/34 hover:text-[#DBD5B5]"}`}
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
            className="mt-16 flex flex-col gap-3.5 items-start transition-all duration-700 delay-500"
            style={{ 
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? "translateY(0)" : "translateY(20px)"
            }}
          >
            <div className="mb-4 h-px w-10 bg-[#DBD5B5]/18" />
            <a 
              href="mailto:rhinelesther@gmail.com" 
              className="font-auralis-mono text-[0.66rem] uppercase tracking-[0.18em] text-[#C7B580]/64 transition-colors hover:text-[#F5F2EB]"
            >
              Get in Touch
            </a>
            <a 
              href="mailto:rhinelesther@gmail.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="[font-family:var(--font-auralis-jp)] text-base font-light tracking-[-0.012em] text-white/34 transition-colors hover:text-white/76 cursor-pointer"
            >
              rhinelesther@gmail.com
            </a>
            
            {/* Social Links Row */}
            <div className="mt-4 flex items-center gap-5">
                <a 
                  href="https://github.com/Lesz-Xi" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 hover:text-[#DBD5B5] transition-all duration-300 hover:scale-110"
                  aria-label="GitHub"
                >
                  <FaGithub size={20} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/rhine-lesther-tague-4b604a246" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 hover:text-[#DBD5B5] transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn size={20} />
                </a>
                <a 
                  href="https://www.instagram.com/ichrhin3y?igsh=MXBwejdiYTEyODBlbg%3D%3D&utm_source=q" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 hover:text-[#DBD5B5] transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} />
                </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
