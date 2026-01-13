import React, { useState, useEffect } from "react";
import Logo from "./Logo";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "My Story", href: "#work" },
    { name: "Roles", href: "#roles" },
    { name: "Photos", href: "#photography" },
    { name: "Journey", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-5 left-0 w-full z-50 px-10 flex justify-between items-center pointer-events-none">
      {/* Logo Area (Left) */}
      <div className="flex-shrink-0 pointer-events-auto">
        <Logo 
          className="w-10 h-10 transition-transform duration-300 hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
        />
      </div>

      {/* Desktop Links (Right) */}
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
            className="text-[11px] font-display uppercase tracking-[0.2em] text-white/60 hover:text-[#DBD5B5] transition-all duration-300 relative group"
            data-hover
          >
            {link.name}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#DBD5B5] transition-all duration-300 group-hover:w-full opacity-40" />
          </a>
        ))}
      </div>

      {/* Mobile Menu Button (Right) */}
      <div className="md:hidden flex items-center pointer-events-auto">
        <button
          className={`p-3 rounded-full border transition-all duration-500
          ${isScrolled 
            ? "bg-black/40 backdrop-blur-xl border-white/10 shadow-lg" 
            : "bg-white/[0.05] backdrop-blur-md border-white/10"}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-hover
        >
          <div className="w-5 h-4 relative flex flex-col justify-between">
            <span className={`w-full h-px bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-full h-px bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-full h-px bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden absolute top-full right-8 mt-4 w-64 transition-all duration-500 ease-in-out pointer-events-none
        ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <div className={`bg-black/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-3xl overflow-hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[#DBD5B5]/70 hover:text-[#DBD5B5] text-sm font-display uppercase tracking-widest py-2 border-b border-white/5 last:border-0 transition-all duration-300"
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
