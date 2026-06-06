import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const navigation = [
  { name: "Roles", href: "/#roles" },
  { name: "Projects", href: "/#projects" },
  { name: "Research", href: "/#research" },
  { name: "Photography", href: "/#photography" },
  { name: "Journey", href: "/#about" },
];

const photoLinks = [
  { name: "Alpine Serenity", href: "/photography/switzerland" },
  { name: "City of Light", href: "/photography/paris" },
  { name: "Nature", href: "/photography/nature" },
  { name: "Sunrise & Sunset", href: "/photography/beach" },
  { name: "Islands & Icons", href: "/photography/philippines" },
  { name: "Flowers", href: "/photography/flowers" },
];

const principles = [
  { name: "Ma", line: "Leave space for the work to breathe." },
  { name: "Shibui", line: "Refine until only the necessary remains." },
  { name: "Wabi-sabi", line: "Let the trace of practice stay visible." },
];

const socials = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/rhine-lesther-tague-4b604a246", icon: <FaLinkedinIn size={16} /> },
  { name: "GitHub", href: "https://github.com/Lesz-Xi", icon: <FaGithub size={16} /> },
  { name: "Instagram", href: "https://www.instagram.com/ichrhin3y?igsh=MXBwejdiYTEyODBlbg%3D%3D&utm_source=q", icon: <FaInstagram size={16} /> },
  { name: "X / Twitter", href: "https://x.com/codefar1", icon: <FaXTwitter size={15} /> },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#070707] px-6 py-24 text-[#DBD5B5] md:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-noise-pattern" />

      <div className="auralis-shell relative z-10">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <span className="auralis-mark">Closing note</span>
            <h2 className="mt-8 max-w-3xl [font-family:var(--font-auralis-jp)] text-[clamp(3rem,6.9vw,7.2rem)] font-light leading-[0.92] tracking-[-0.092em] text-[#F5F2EB]">
              Rhine<span className="ml-1 text-[#C7B580]/82">.</span>
            </h2>
            <p className="mt-8 max-w-[34rem] [font-family:var(--font-auralis-jp)] text-[clamp(1rem,1.12vw,1.18rem)] font-light leading-[1.95] tracking-[-0.018em] text-[#DBD5B5]/52">
              Ultimately trying to understand how knowledge actually grows.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 font-auralis-mono text-[0.64rem] uppercase tracking-[0.2em] text-[#DBD5B5]/42">
              <a href="mailto:rhinelesther@gmail.com" className="transition-colors hover:text-[#F5F2EB]">
                Email →
              </a>
              {socials.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#F5F2EB]"
                  aria-label={item.name}
                >
                  {item.icon}
                  <span className="sr-only">{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <h3 className="font-auralis-mono text-[0.64rem] uppercase tracking-[0.22em] text-[#C7B580]/70">
                Index
              </h3>
              <nav className="mt-7 grid gap-3.5" aria-label="Footer navigation">
                {navigation.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="w-fit [font-family:var(--font-auralis-jp)] text-[clamp(0.98rem,1.08vw,1.08rem)] font-light tracking-[-0.006em] text-[#DBD5B5]/48 transition-colors hover:text-[#F5F2EB]"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="font-auralis-mono text-[0.64rem] uppercase tracking-[0.22em] text-[#C7B580]/70">
                Albums
              </h3>
              <nav className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2" aria-label="Footer photography albums">
                {photoLinks.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="w-fit [font-family:var(--font-auralis-jp)] text-[clamp(0.98rem,1.08vw,1.08rem)] font-light tracking-[-0.006em] text-[#DBD5B5]/48 transition-colors hover:text-[#F5F2EB]"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-8 border-t border-[#DBD5B5]/8 pt-10 lg:grid-cols-3">
          {principles.map((principle) => (
            <div key={principle.name} className="max-w-sm">
              <h3 className="font-auralis-mono text-[0.64rem] uppercase tracking-[0.22em] text-[#C7B580]/64">
                {principle.name}
              </h3>
              <p className="mt-3 max-w-[18rem] [font-family:var(--font-auralis-jp)] text-[0.92rem] font-light leading-[1.78] tracking-[-0.004em] text-[#DBD5B5]/40">
                {principle.line}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 font-auralis-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#DBD5B5]/32 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Rhine — made through imagination</p>
          <p>Space Restraint Trace</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
