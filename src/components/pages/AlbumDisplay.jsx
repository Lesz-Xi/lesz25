import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "../Logo";
import { getLenis } from "../sections/App";

gsap.registerPlugin(ScrollTrigger);

const AlbumDisplay = () => {
  const { albumId } = useParams();
  const containerRef = useRef(null);
  const galleryRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // Page entry animations using official useGSAP hook
  // This automatically cleans up when component unmounts
  useGSAP(() => {
    // Create master timeline for page entry
    const masterTl = gsap.timeline({ 
      defaults: { ease: "power3.out" },
      delay: 0.1
    });

    // Reset all elements first
    gsap.set(".hero-image-container", { scale: 0.95, opacity: 0 });
    gsap.set(".title-scroll", { y: 60, opacity: 0 });
    gsap.set(".description-scroll", { y: 40, opacity: 0 });

    // Animate hero image
    masterTl.to(".hero-image-container", {
      scale: 1,
      opacity: 1,
      duration: 1.2
    });

    // Animate title
    masterTl.to(".title-scroll", {
      y: 0,
      opacity: 1,
      duration: 1
    }, "-=0.6");

    // Animate description
    masterTl.to(".description-scroll", {
      y: 0,
      opacity: 1,
      duration: 0.8
    }, "-=0.4");

  }, { scope: containerRef }); // Scope to container for proper cleanup

  // Gallery animations using useGSAP
  // UNIFIED: Show all cards immediately for both mobile and desktop
  // ScrollTrigger removed for reliability after multiple fix attempts
  useGSAP(() => {
    // Immediately show all gallery cards - no ScrollTrigger complexity
    gsap.set(".gallery-landscape", { 
      clipPath: "inset(0% 0 0 0)",
      opacity: 1 
    });
    gsap.set(".gallery-portrait", { 
      opacity: 1, 
      y: 0,
      clipPath: "inset(0% 0 0 0)" 
    });
  }, { scope: galleryRef }); // Scope to gallery for proper cleanup

  // Mock Data (Duplicated from PhotographyPage for now)
  const albums = [
    {
        id: "switzerland",
        title: "Alpine Serenity",
        heroTitle: "Zug",
        location: "Zug, Switzerland",
        year: "2023",
        image: "/images/project1.png",
        description: "Capturing the vibrant life, culture, and diversity of the alpine landscape through a collaborative travel photography project. The aim was to document the silent majesty of the peaks."
    },
    {
        id: "paris",
        title: "City of Light",
        heroTitle: "Paris",
        location: "Paris, France",
        year: "2024",
        image: "/images/paris/optimized/IMG_3228.jpg",
        description: "Exploring the romantic streets and hidden corners of Paris, chasing light and shadow across the historic architecture."
    },
    {
        id: "nature",
        title: "Quiet Whispers",
        heroTitle: "Nature",
        location: "Nature",
        year: "2023",
        image: "/images/project1.png",
        description: "A deep dive into the untouched wilderness, listening to the stories told by the ancient trees and misty mornings."
    },
    {
        id: "beach",
        title: "Beach",
        heroTitle: "Davao",
        location: "Davao City, Philippines",
        year: "2022",
        image: "/images/project1.png",
        description: "Capturing the rhythmic dance of the ocean, the serene blues, and the isolation of island life."
    },
    {
        id: "philippines",
        title: "Islands & Icons",
        heroTitle: "Davao City",
        location: "Davao City, Philippines",
        year: "2023",
        image: "/images/project1.png",
        description: "A visual tapestry of Davao: from the pulse of the night markets and urban geometry to the serene breath of the coast. Documenting the soul of the city through its people and architecture."
    }
  ];

  const album = albums.find(a => a.id === albumId) || albums[0];

  // Gallery Data Configuration
  const galleryData = {
    paris: [
        { type: "landscape", src: "/images/paris/optimized/IMG_3228.jpg", category: "Cityscape", title: "Eiffel Gold" },
        { type: "portrait", src: "/images/paris/optimized/IMG_3153.jpg", category: "Street", title: "Montmartre Steps" },
        { type: "portrait", src: "/images/paris/optimized/P1550735.jpg", category: "Architecture", title: "Louvre Geometry" },
        { type: "landscape", src: "/images/paris/optimized/IMG_3323.jpg", category: "Urban", title: "Seine Sunset" },
        { type: "portrait", src: "/images/paris/optimized/IMG_3359.jpg", category: "Detail", title: "Metro Life" },
        { type: "portrait", src: "/images/paris/optimized/IMG_3359.jpg", category: "Detail", title: "Cafe Culture" },
        { type: "landscape", src: "/images/paris/optimized/IMG_3323.jpg", category: "Panoramic", title: "Parisian Skyline" }
    ],
    switzerland: [
        { type: "landscape", src: "/images/project1.png", category: "Landscape", title: "Alpine Dawn" },
        { type: "portrait", src: "/images/project1.png", category: "Portrait", title: "Glacial Stillness" },
        { type: "portrait", src: "/images/project1.png", category: "Nature", title: "Mountain Shadows" },
        { type: "landscape", src: "/images/project1.png", category: "Cinematic", title: "Valley of Silence" },
        { type: "portrait", src: "/images/project1.png", category: "Abstract", title: "Icy Veins" },
        { type: "portrait", src: "/images/project1.png", category: "Wildlife", title: "Chamois Watch" },
        { type: "landscape", src: "/images/project1.png", category: "Sunset", title: "Golden Matterhorn" }
    ],
    // Defaults for others
    default: [
        { type: "landscape", src: "/images/project1.png", category: "Landscape", title: "Scenic View" },
        { type: "portrait", src: "/images/project1.png", category: "Portrait", title: "Vertical Detail" },
        { type: "portrait", src: "/images/project1.png", category: "Portrait", title: "Vertical Detail" },
        { type: "landscape", src: "/images/project1.png", category: "Landscape", title: "Wide Shot" },
        { type: "portrait", src: "/images/project1.png", category: "Portrait", title: "Close Up" },
        { type: "portrait", src: "/images/project1.png", category: "Portrait", title: "Texture" },
        { type: "landscape", src: "/images/project1.png", category: "Landscape", title: "Final Horizon" }
    ]
  };

  const currentGallery = galleryData[albumId] || galleryData.default;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#070707] text-white">
      {/* Hero Section */}
      <div className="relative w-full h-[95vh]">
        {/* Full Screen Image */}
        <div className="hero-image-container absolute inset-x-4 top-24 bottom-0 md:inset-x-12 md:top-24 rounded-3xl overflow-hidden">
            <img 
                src={album.image} 
                alt={album.title} 
                className="w-full h-full object-cover"
            />
        </div>
      </div>

      {/* Title Section - Below Hero */}
      <div className="title-scroll relative z-10 w-full flex justify-center pt-16 pb-8">
          <h1 className="font-accent text-[13vw] md:text-[10vw] max-w-[95vw] leading-none tracking-tighter text-[#DBD5B5] text-center whitespace-nowrap overflow-visible">
              {album.heroTitle}
          </h1>
      </div>

      {/* Description Section */}
      <div className="description-scroll relative z-10 max-w-2xl mx-auto px-6 pt-8 pb-40 flex flex-col items-center text-center gap-8">
        <p className="text-lg md:text-xl font-geist-mono text-[#DBD5B5]/80 leading-relaxed">
            {album.description || `A visual exploration of ${album.title}. Capturing the essence of ${album.location} through light, shadow, and composition.`}
        </p>
      </div>

      {/* Gallery Grid */}
      <div ref={galleryRef} className="max-w-7xl mx-auto px-4 md:px-12 pt-20 pb-40 flex flex-col gap-40">
        
        {/* Row 1: Landscape */}
        <div 
            className="gallery-landscape group relative aspect-[21/9] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(currentGallery[0]?.src || "/images/project1.png")}
        >
            <img 
                src={currentGallery[0]?.src || "/images/project1.png"} 
                alt={currentGallery[0]?.title || "Gallery"} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">{currentGallery[0]?.category || "Landscape"}</span>
                <span className="text-xl md:text-2xl font-display text-white">{currentGallery[0]?.title || "Untitled"}</span>
            </div>
        </div>

        {/* Row 2: Two Portraits (Aligned) */}
        <div className="gallery-portrait-row grid grid-cols-2 gap-16">
            <div 
                className="gallery-portrait group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(currentGallery[1]?.src || "/images/project1.png")}
            >
                <img src={currentGallery[1]?.src || "/images/project1.png"} alt={currentGallery[1]?.title || "Gallery"} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-geist-mono">{currentGallery[1]?.category || "Portrait"}</span>
                    <span className="text-lg md:text-xl font-display text-white">{currentGallery[1]?.title || "Untitled"}</span>
                </div>
            </div>
            <div 
                className="gallery-portrait group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(currentGallery[2]?.src || "/images/project1.png")}
            >
                <img src={currentGallery[2]?.src || "/images/project1.png"} alt={currentGallery[2]?.title || "Gallery"} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-geist-mono">{currentGallery[2]?.category || "Portrait"}</span>
                    <span className="text-lg md:text-xl font-display text-white">{currentGallery[2]?.title || "Untitled"}</span>
                </div>
            </div>
        </div>

        {/* Row 3: Landscape */}
        <div 
            className="gallery-landscape group relative aspect-[21/9] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(currentGallery[3]?.src || "/images/project1.png")}
        >
            <img src={currentGallery[3]?.src || "/images/project1.png"} alt={currentGallery[3]?.title || "Gallery"} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-geist-mono">{currentGallery[3]?.category || "Landscape"}</span>
                <span className="text-xl md:text-2xl font-display text-white">{currentGallery[3]?.title || "Untitled"}</span>
            </div>
        </div>

        {/* Row 4: Staggered Portraits (First Top, Second Bottom) */}
        <div className="gallery-portrait-row grid grid-cols-2 gap-16 items-start">
            <div 
                className="gallery-portrait group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(currentGallery[4]?.src || "/images/project1.png")}
            >
                <img src={currentGallery[4]?.src || "/images/project1.png"} alt={currentGallery[4]?.title || "Gallery"} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-geist-mono">{currentGallery[4]?.category || "Portrait"}</span>
                    <span className="text-lg md:text-xl font-display text-white">{currentGallery[4]?.title || "Untitled"}</span>
                </div>
            </div>
            <div 
                className="gallery-portrait group relative aspect-[3/4] rounded-2xl overflow-hidden mt-32 cursor-pointer"
                onClick={() => setSelectedImage(currentGallery[5]?.src || "/images/project1.png")}
            >
                <img src={currentGallery[5]?.src || "/images/project1.png"} alt={currentGallery[5]?.title || "Gallery"} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-geist-mono">{currentGallery[5]?.category || "Portrait"}</span>
                    <span className="text-lg md:text-xl font-display text-white">{currentGallery[5]?.title || "Untitled"}</span>
                </div>
            </div>
        </div>

        {/* Row 5: Staggered Portraits (First Bottom, Second Top) */}
        <div className="gallery-portrait-row grid grid-cols-2 gap-16 items-start">
            <div 
                className="gallery-portrait group relative aspect-[3/4] rounded-2xl overflow-hidden mt-32 cursor-pointer"
                onClick={() => setSelectedImage(currentGallery[6]?.src || "/images/project1.png")}
            >
                <img src={currentGallery[6]?.src || "/images/project1.png"} alt={currentGallery[6]?.title || "Gallery"} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-geist-mono">{currentGallery[6]?.category || "Portrait"}</span>
                    <span className="text-lg md:text-xl font-display text-white">{currentGallery[6]?.title || "Untitled"}</span>
                </div>
            </div>
            <div 
                className="gallery-portrait group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(currentGallery[7]?.src || "/images/project1.png")}
            >
                <img src={currentGallery[7]?.src || "/images/project1.png"} alt={currentGallery[7]?.title || "Gallery"} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-geist-mono">{currentGallery[7]?.category || "Portrait"}</span>
                    <span className="text-lg md:text-xl font-display text-white">{currentGallery[7]?.title || "Untitled"}</span>
                </div>
            </div>
        </div>

        {/* Row 6: Landscape */}
        <div 
            className="gallery-landscape group relative aspect-[21/9] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(currentGallery[8]?.src || "/images/project1.png")}
        >
            <img src={currentGallery[8]?.src || "/images/project1.png"} alt={currentGallery[8]?.title || "Gallery"} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-geist-mono">{currentGallery[8]?.category || "Landscape"}</span>
                <span className="text-xl md:text-2xl font-display text-white">{currentGallery[8]?.title || "Untitled"}</span>
            </div>
        </div>

        {/* Row 7: Two Portraits (Aligned) */}
        <div className="gallery-portrait-row grid grid-cols-2 gap-16">
            <div 
                className="gallery-portrait group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(currentGallery[9]?.src || "/images/project1.png")}
            >
                <img src={currentGallery[9]?.src || "/images/project1.png"} alt={currentGallery[9]?.title || "Gallery"} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-geist-mono">{currentGallery[9]?.category || "Portrait"}</span>
                    <span className="text-lg md:text-xl font-display text-white">{currentGallery[9]?.title || "Untitled"}</span>
                </div>
            </div>
            <div 
                className="gallery-portrait group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(currentGallery[10]?.src || "/images/project1.png")}
            >
                <img src={currentGallery[10]?.src || "/images/project1.png"} alt={currentGallery[10]?.title || "Gallery"} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-geist-mono">{currentGallery[10]?.category || "Portrait"}</span>
                    <span className="text-lg md:text-xl font-display text-white">{currentGallery[10]?.title || "Untitled"}</span>
                </div>
            </div>
        </div>

        {/* Row 8: Landscape */}
        <div 
            className="gallery-landscape group relative aspect-[21/9] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(currentGallery[11]?.src || "/images/project1.png")}
        >
            <img src={currentGallery[11]?.src || "/images/project1.png"} alt={currentGallery[11]?.title || "Gallery"} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-geist-mono">{currentGallery[11]?.category || "Landscape"}</span>
                <span className="text-xl md:text-2xl font-display text-white">{currentGallery[11]?.title || "Untitled"}</span>
            </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button - Top Right */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                }}
                className="fixed top-6 right-6 z-[110] p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors cursor-pointer group"
            >
                <X size={24} color="#DBD5B5" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-[95vw] max-h-[95vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Fullscreen view"
                className="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumDisplay;
