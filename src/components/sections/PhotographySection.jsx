import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuralisMotion } from "../hooks/useAuralisMotion.js";

const featuredPhotos = [
  {
    id: "switzerland",
    url: "/images/switz-new-feat.webp",
    title: "Alpine Serenity",
    location: "Zug, Switzerland",
    year: "2022",
    tag: "Distance Snow Quiet",
    concept: "Ma",
    conceptLine: "Space makes the distance legible.",
  },
  {
    id: "paris",
    url: "/images/feat-paris.webp",
    title: "City of Light",
    location: "Paris, France",
    year: "2022",
    tag: "Architecture Window Line",
    concept: "Shibui",
    conceptLine: "Refinement appears through restraint.",
  },
  {
    id: "nature",
    url: "/images/nature-feat.webp",
    title: "Nature",
    location: "Collections",
    year: "2022",
    tag: "Stillness Green Weather",
    concept: "Wabi-sabi",
    conceptLine: "Weather and irregularity remain visible.",
  },
  {
    id: "beach",
    url: "/images/sunset-new-feat.webp",
    title: "Sunrise & Sunset",
    location: "Collections",
    year: "2025",
    tag: "Horizon Light Tide",
    concept: "Ma",
    conceptLine: "The horizon holds the pause.",
  },
  {
    id: "philippines",
    url: "/images/ph-feat.webp",
    title: "Islands & Icons",
    location: "Davao City, Philippines",
    year: "2025",
    tag: "Home Heat Return",
    concept: "Shibui",
    conceptLine: "Familiarity becomes quiet structure.",
  },
  {
    id: "flowers",
    url: "/images/flowers-feat.webp",
    title: "Flowers",
    location: "Botanical Garden",
    year: "2025",
    tag: "Petal Garden Close looking",
    concept: "Wabi-sabi",
    conceptLine: "Small impermanence becomes the subject.",
  },
];

const PhotographySection = () => {
  const sectionRef = useRef(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const activePhoto = featuredPhotos[activePhotoIndex];

  useAuralisMotion(sectionRef);

  const showPreviousPhoto = () => {
    setActivePhotoIndex((currentIndex) => (
      currentIndex === 0 ? featuredPhotos.length - 1 : currentIndex - 1
    ));
  };

  const showNextPhoto = () => {
    setActivePhotoIndex((currentIndex) => (
      currentIndex === featuredPhotos.length - 1 ? 0 : currentIndex + 1
    ));
  };

  const rememberPhotographyOrigin = () => {
    sessionStorage.setItem("photographyReturnTarget", "/#photography");
  };

  return (
    <section id="photography" ref={sectionRef} className="auralis-section" data-theme="dark">
      <div className="auralis-shell">
        <div className="auralis-section-head">
          <div data-auralis-reveal>
            <div className="auralis-rule" data-auralis-rule />
            <span className="auralis-mark">Wabi-sabi — Image</span>
            <span className="auralis-submark">Materials that hold time</span>
          </div>

          <div className="auralis-head-main" data-auralis-reveal>
            <h2 className="auralis-title">
              <span className="block">texture softens</span>
              <span className="block auralis-serif">the system.</span>
            </h2>
            <p className="auralis-copy">
              I return to images when words become too loud. Each frame keeps a
              small piece of time intact: quiet weather, remembered distance, and
              the feeling of looking until the world begins to soften.
            </p>
          </div>
        </div>

        <div className="image-monograph" data-auralis-reveal>
          <Link
            to={`/photography/${activePhoto.id}`}
            className="image-monograph-frame"
            aria-label={`View ${activePhoto.title}`}
            onClick={rememberPhotographyOrigin}
            data-image-monograph-card
          >
            <img
              key={activePhoto.id}
              src={activePhoto.url}
              srcSet={`${activePhoto.url.replace(".webp", "-mobile.webp")} 600w, ${activePhoto.url} 1200w`}
              sizes="(max-width: 980px) 100vw, 76vw"
              alt={activePhoto.title}
              decoding="async"
              loading="lazy"
              data-auralis-image
            />
          </Link>

          <div className="image-monograph-meta">
            <div>
              <span className="image-monograph-count">
                {String(activePhotoIndex + 1).padStart(2, "0")} / {String(featuredPhotos.length).padStart(2, "0")}
              </span>
              <h3>{activePhoto.title}</h3>
              <p>{activePhoto.location} — {activePhoto.year}</p>
            </div>

            <div className="image-monograph-concept">
              <span>{activePhoto.concept}</span>
              <p>{activePhoto.conceptLine}</p>
            </div>

            <span className="image-monograph-tag">{activePhoto.tag}</span>
          </div>

          <div className="image-monograph-controls" aria-label="Featured photography controls">
            <button type="button" onClick={showPreviousPhoto} aria-label="Show previous album">
              &lt;
            </button>
            <button type="button" onClick={showNextPhoto} aria-label="Show next album">
              &gt;
            </button>
          </div>
        </div>

        <div className="image-monograph-browse" data-auralis-reveal>
          <Link to="/photography" onClick={rememberPhotographyOrigin}>
            Browse gallery <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PhotographySection;
