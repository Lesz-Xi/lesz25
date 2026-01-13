import React from "react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-[#12110E] py-16 relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand/Bio Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-bold tracking-[0.3em] font-pixel uppercase text-[#8B7E66]">
                Principal
              </span>
              <h2 className="text-4xl md:text-5xl font-display text-[#F5F2EB] tracking-tight">
                Rhine Tague
              </h2>
              <p className="text-xl font-accent text-[#8B7E66]">
                Developer & Photographer
              </p>
            </div>
            
            <p className="text-[#F5F2EB]/60 text-base leading-relaxed max-w-md font-heading tracking-wide">
              I focus on building clean, user-friendly experiences 
              that make complex ideas simple, effective, and meaningful.
              Based in the Philippines, available worldwide.
            </p>

            <div className="pt-4 flex items-center gap-6">
              <a href="mailto:hello@rhinetague.com" className="text-xs font-bold font-pixel uppercase tracking-widest text-[#F5F2EB] hover:text-[#8B7E66] transition-colors border-b border-[#8B7E66]/30 pb-1">
                Get in touch
              </a>
            </div>
          </div>

          {/* Spacer for Desktop */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.3em] font-pixel uppercase text-[#8B7E66]">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { name: "My Story", href: "#work" },
                { name: "Roles", href: "#roles" },
                { name: "Photography", href: "#photography" },
                { name: "The Journey", href: "#about" },
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm font-heading text-[#F5F2EB]/60 hover:text-[#F5F2EB] hover:translate-x-1 transition-all inline-block">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services/Resources */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.3em] font-pixel uppercase text-[#8B7E66]">
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                "Visual Archive",
                "Technical Stack",
                "Curriculum Vitae",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-heading text-[#F5F2EB]/60 hover:text-[#F5F2EB] hover:translate-x-1 transition-all inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.3em] font-pixel uppercase text-[#8B7E66]">
              Connection
            </h4>
            <ul className="space-y-3">
              {[
                "LinkedIn",
                "GitHub",
                "Instagram",
                "X / Twitter",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-heading text-[#F5F2EB]/60 hover:text-[#F5F2EB] hover:translate-x-1 transition-all inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#F5F2EB]/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-[10px] font-pixel text-[#F5F2EB]/40 uppercase tracking-widest">
              © 2026 Rhine Tague — Made with precision
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[10px] font-pixel text-[#F5F2EB]/40 hover:text-[#8B7E66] transition-colors uppercase tracking-[0.2em]">
                Privacy
              </a>
              <a href="#" className="text-[10px] font-pixel text-[#F5F2EB]/40 hover:text-[#8B7E66] transition-colors uppercase tracking-[0.2em]">
                Terms
              </a>
            </div>
          </div>
          
          <span className="text-[10px] font-pixel text-[#F5F2EB]/30 uppercase tracking-[0.4em] hidden md:block">
            Design & Code
          </span>
        </div>
      </div>

      {/* Architectural Background Element - RT */}
      <div className="absolute right-[-2%] bottom-[-8%] opacity-[0.02] pointer-events-none select-none">
        <h1 className="text-[18rem] font-bold font-pixel leading-none">
          RT
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
