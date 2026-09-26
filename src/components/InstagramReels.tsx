"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { InstagramIcon } from "./SocialIcons";

export interface ReelSequenceItem {
  id: string;
  number: string;
  url: string;
  image: string;
}

export const REEL_SEQUENCE: ReelSequenceItem[] = [
  {
    id: "reel-01",
    number: "01",
    url: "https://www.instagram.com/p/DXXQr6XEhQx/?hl=en",
    image: "/images/reel_1.jpg",
  },
  {
    id: "reel-02",
    number: "02",
    url: "https://www.instagram.com/reel/DZ_5R_3ynJv/?hl=en",
    image: "/images/reel_2.jpg",
  },
  {
    id: "reel-03",
    number: "03",
    url: "https://www.instagram.com/reel/DZKrKpTycXc/?hl=en",
    image: "/images/reel_3.jpg",
  },
  {
    id: "reel-04",
    number: "04",
    url: "https://www.instagram.com/reel/DdYbdllTrwK/?hl=en",
    image: "/images/reel_4.jpg",
  },
  {
    id: "reel-05",
    number: "05",
    url: "https://www.instagram.com/reel/DdV6_-hvJuZ/?hl=en",
    image: "/images/reel_5.jpg",
  },
  {
    id: "reel-06",
    number: "06",
    url: "https://www.instagram.com/reel/DdVTC9kR043/?hl=en",
    image: "/images/reel_6.jpg",
  },
  {
    id: "reel-07",
    number: "07",
    url: "https://www.instagram.com/reel/DdELqzTyiHW/?hl=en",
    image: "/images/reel_7.jpg",
  },
  {
    id: "reel-08",
    number: "08",
    url: "https://www.instagram.com/reel/DbIjYlIocid/?hl=en",
    image: "/images/reel_8.jpg",
  },
];

export default function InstagramReels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Update active index on scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cards = container.querySelectorAll<HTMLElement>("[data-reel-card]");
    if (!cards.length) return;

    const containerLeft = container.scrollLeft;
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const distance = Math.abs(card.offsetLeft - containerLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  // Smooth scroll to specific reel index
  const scrollToReel = useCallback((index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cards = container.querySelectorAll<HTMLElement>("[data-reel-card]");
    if (cards[index]) {
      const targetCard = cards[index];
      const targetLeft = targetCard.offsetLeft - container.offsetLeft;
      container.scrollTo({
        left: targetLeft,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  }, []);

  const handlePrev = useCallback(() => {
    const prevIdx = activeIndex === 0 ? REEL_SEQUENCE.length - 1 : activeIndex - 1;
    scrollToReel(prevIdx);
  }, [activeIndex, scrollToReel]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % REEL_SEQUENCE.length;
    scrollToReel(nextIdx);
  }, [activeIndex, scrollToReel]);

  // Autoplay rotation every 4.8s (pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4800);
    return () => clearInterval(timer);
  }, [isHovered, handleNext]);

  return (
    <section
      id="instagram-reels"
      aria-label="Instagram Reel Sequence"
      className="relative py-14 sm:py-18 lg:py-20 bg-gradient-to-b from-[#eef8fe] via-[#e6f4fe] to-[#f4faff] overflow-hidden scroll-mt-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient Sky Soft Glow Accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-white/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#43B8F2]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Subtle Section Tag (Minimal branding without promotional text blocks) */}
        <div className="flex items-center justify-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-white/90 shadow-xs">
            <span className="w-4 h-4 rounded-sm bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center p-0.5 shadow-xs">
              <InstagramIcon className="w-3 h-3 text-white" />
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#0754C9]">
              INSTAGRAM REEL SEQUENCE
            </span>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div className="relative w-full">
          
          {/* Desktop Left Navigation Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous reel"
            className="hidden md:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-[#0754C9] text-[#063B91] hover:text-white shadow-[0_8px_20px_rgba(7,84,201,0.18)] border border-[#DDF5FF] items-center justify-center transition-all duration-200 cursor-pointer hover:scale-108 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Desktop Right Navigation Button */}
          <button
            onClick={handleNext}
            aria-label="Next reel"
            className="hidden md:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-[#0754C9] text-[#063B91] hover:text-white shadow-[0_8px_20px_rgba(7,84,201,0.18)] border border-[#DDF5FF] items-center justify-center transition-all duration-200 cursor-pointer hover:scale-108 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Horizontal Reel Sequence Track */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="w-full flex items-center gap-3.5 sm:gap-4 lg:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-1"
          >
            {REEL_SEQUENCE.map((reel, idx) => {
              const isFocused = activeIndex === idx;

              return (
                <a
                  key={reel.id}
                  data-reel-card
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open Sky Laban Instagram Reel ${reel.number}`}
                  className={`group relative shrink-0 aspect-[9/16] w-[58vw] sm:w-[38vw] md:w-[28vw] lg:w-[calc((100%-60px)/4)] max-w-[295px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-[0_12px_30px_rgba(7,84,201,0.12)] hover:shadow-[0_20px_45px_rgba(7,84,201,0.24)] border-2 transition-all duration-300 snap-start select-none cursor-pointer ${
                    isFocused
                      ? "border-[#43B8F2] scale-100 ring-4 ring-white/60"
                      : "border-white/90 scale-[0.96] hover:scale-[0.98] hover:border-[#43B8F2]/60"
                  }`}
                >
                  {/* Full-bleed Reel Thumbnail Image */}
                  <Image
                    src={reel.image}
                    alt={`Sky Laban Instagram Reel ${reel.number}`}
                    fill
                    sizes="(max-width: 640px) 60vw, (max-width: 1024px) 35vw, 25vw"
                    className="object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Subtle Cinematic Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 group-hover:from-black/75 transition-colors duration-300 pointer-events-none" />

                  {/* Top-Right: Instagram Glyph Badge */}
                  <div className="absolute top-3.5 right-3.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center p-1 text-white shadow-xs">
                    <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white drop-shadow-xs" />
                  </div>

                  {/* Center: Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isFocused
                          ? "bg-white text-[#0754C9] scale-105 group-hover:scale-115"
                          : "bg-white/40 text-white backdrop-blur-xs group-hover:bg-white group-hover:text-[#0754C9] group-hover:scale-110"
                      }`}
                    >
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Bottom-Right: Subtle Small Number Identifier (01, 02, ... 08) */}
                  <div className="absolute bottom-3.5 right-3.5 px-2.5 py-0.5 rounded-full bg-black/45 backdrop-blur-md text-[11px] font-mono font-bold tracking-wider text-white/95 border border-white/15">
                    {reel.number}
                  </div>
                </a>
              );
            })}
          </div>

        </div>

        {/* Minimal Progress Indicator Dots (01 02 03 04 05 06 07 08) */}
        <div className="flex items-center justify-center gap-2 mt-7 sm:mt-9">
          {REEL_SEQUENCE.map((reel, dotIdx) => (
            <button
              key={reel.id}
              onClick={() => scrollToReel(dotIdx)}
              aria-label={`Jump to reel ${reel.number}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === dotIdx
                  ? "w-7 h-2 bg-[#0754C9]"
                  : "w-2 h-2 bg-[#DDF5FF] hover:bg-[#43B8F2]"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
