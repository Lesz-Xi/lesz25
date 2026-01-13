import { playHoverSound } from "../utils/soundUtils";

const Button = ({ text, className }) => {
  return (
    <a
      onClick={(e) => {
        e.preventDefault();

        const target = document.getElementById("projects");

        if (target) {
          const offset = window.innerHeight * 0.1;

          const top =
            target.getBoundingClientRect().top + window.scrollY - offset;

          window.scrollTo({ top, behavior: "smooth" });
        }
      }}
      onMouseEnter={playHoverSound}
      className={`${className ?? ""} cta-wrapper`}
      data-hover
    >
      <div className="cta-button group">
        <p className="text mx-auto">{text}</p>
        <div className="arrow-wrapper absolute right-8">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-white/80 group-hover:text-[#DBD5B5] transition-colors duration-300"
          >
            <path d="M7 13l5 5 5-5M12 6v12" />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default Button;
