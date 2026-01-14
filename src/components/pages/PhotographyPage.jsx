import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";

const PhotographyPage = () => {
    const containerRef = useRef(null);

    const albums = [
        {
            id: "switzerland",
            title: "Alpine Serenity",
            location: "Zug, Switzerland",
            year: "2023",
            image: "/images/project1.png"
        },
        {
            id: "paris",
            title: "City of Light",
            location: "Paris, France",
            year: "2024",
            image: "/images/project1.png"
        },
        {
            id: "nature",
            title: "Quiet Whispers",
            location: "Nature",
            year: "2023",
            image: "/images/project1.png"
        },
        {
            id: "beach",
            title: "Beach",
            location: "Davao City, Philippines",
            year: "2022",
            image: "/images/project1.png"
        },
        {
            id: "philippines",
            title: "Islands & Icons",
            location: "Davao City, Philippines",
            year: "2023",
            image: "/images/project1.png"
        },
        {
            id: "lights",
            title: "Lights",
            location: "Urban Geometry",
            year: "2024",
            image: "/images/project1.png"
        },
        {
            id: "flowers",
            title: "Flowers",
            location: "Botanical Garden",
            year: "2023",
            image: "/images/project1.png"
        }
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".album-card", 
                { y: 100, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1, 
                    stagger: 0.1, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%"
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#070707] text-[#DBD5B5] pt-32 pb-20 px-6 md:px-12">
            
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-20 md:mb-32">
                <h1 className="text-5xl md:text-7xl font-bold font-accent text-[#DBD5B5] mb-4">
                    Albums
                </h1>
                <p className="max-w-md text-[#DBD5B5]/70 text-sm md:text-[14px] font-geist-mono leading-relaxed border-l border-[#DBD5B5]/10 pl-4 py-1">
                    Photography is my escape—a way to find beauty in the ordinary. Capturing what's often overlooked has shaped how I see the world, both as an artist and as a person.
                </p>
            </div>

            {/* 2-Column Grid - Simple Staggered Layout */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-32">
                {albums.map((album, index) => {
                    // Last item (5th) should be centered
                    const isLastOdd = index === albums.length - 1 && albums.length % 2 === 1;
                    
                    return (
                    <Link 
                        to={`/photography/${album.id}`} 
                        key={album.id} 
                        className={`album-card group block ${index % 2 === 1 ? 'lg:mt-32' : ''} ${isLastOdd ? 'lg:col-span-2 lg:justify-self-center lg:w-[calc(50%-2rem)]' : ''}`}
                        onClick={() => {
                            // Save scroll position before navigating
                            sessionStorage.setItem('photographyScrollPosition', window.scrollY.toString());
                        }}
                    >
                        <div className="relative mb-8">
                            {/* Outside Corner Brackets (Framing the Image) */}
                            <div className="hidden md:block absolute -inset-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out translate-y-2 group-hover:translate-y-0">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white" />
                            </div>

                            {/* Card Container (Image Area) */}
                            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                                <img 
                                    src={album.image} 
                                    alt={album.title} 
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out brightness-100 md:brightness-90 group-hover:brightness-110 group-hover:scale-[1.05]"
                                />
                                
                                {/* Backdrop Overlay (Dark by default on desktop, hidden on mobile) */}
                                <div className="absolute inset-0 bg-black/0 md:bg-black/40 transition-opacity duration-500 z-10 group-hover:opacity-0" />

                                {/* Center VIEW Indicator (Stays inside Focus) */}
                                <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-4 h-8 border-t border-b border-l border-white" />
                                        <span className="text-[11px] tracking-[0.4em] font-medium text-white uppercase">VIEW</span>
                                        <div className="w-4 h-8 border-t border-b border-r border-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Below */}
                        <div className="relative pl-4 pr-4 pb-2">
                             <div className="flex justify-between items-end">
                                <div className="flex flex-col gap-1.5">
                                    <h2 className="text-3xl md:text-4xl font-medium text-white md:text-white/40 tracking-tight group-hover:text-white transition-colors duration-300">
                                        {album.title}
                                    </h2>
                                    <span className="text-[12px] tracking-[0.3em] font-display uppercase text-[#DBD5B5]/40 group-hover:text-[#DBD5B5]/70 transition-colors duration-300">
                                        {album.location}
                                    </span>
                                </div>

                                <div className="flex flex-col items-end pb-1">
                                     {/* Year */}
                                     <span className="text-xs font-medium text-[#DBD5B5]/30 tabular-nums">
                                        {album.year}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                    );
                })}
            </div>

        </div>
    );
};

export default PhotographyPage;
