"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { InstagramIcon } from "./SocialIcons";
import { getMediaUrl } from "@/lib/media";
import SafeImage from "./SafeImage";

export interface ReelSequenceItem {
  id: string;
  number: string;
  title?: string;
  url: string;
  image: string;
  order?: number;
  isActive?: boolean;
}

export const REEL_SEQUENCE: ReelSequenceItem[] = [
  {
    id: "reel-01",
    number: "01",
    title: "Founder Message — Now Open in Kondapur",
    url: "https://www.instagram.com/p/DXXQr6XEhQx/?hl=en",
    image: "/images/reel_1.jpg",
    order: 1,
    isActive: true,
  },
  {
    id: "reel-02",
    number: "02",
    title: "Hear it from the Owners — Franchise Story",
    url: "https://www.instagram.com/reel/DZ_5R_3ynJv/?hl=en",
    image: "/images/reel_2.jpg",
    order: 2,
    isActive: true,
  },
  {
    id: "reel-03",
    number: "03",
    title: "Sky Laban is Now in Shaikpet!",
    url: "https://www.instagram.com/reel/DZKrKpTycXc/?hl=en",
    image: "/images/reel_3.jpg",
    order: 3,
    isActive: true,
  },
  {
    id: "reel-04",
    number: "04",
    title: "Fallen in Love with Salankatia — Raghavendra Colony",
    url: "https://www.instagram.com/reel/DdYbdllTrwK/?hl=en",
    image: "/images/reel_4.jpg",
    order: 4,
    isActive: true,
  },
  {
    id: "reel-05",
    number: "05",
    title: "Crafting Happiness Daily — Salankatia Scoop",
    url: "https://www.instagram.com/reel/DdV6_-hvJuZ/?hl=en",
    image: "/images/reel_5.jpg",
    order: 5,
    isActive: true,
  },
  {
    id: "reel-06",
    number: "06",
    title: "Kadapa Sky Laban Review & Opening",
    url: "https://www.instagram.com/reel/DdVTC9kR043/?hl=en",
    image: "/images/reel_6.jpg",
    order: 6,
    isActive: true,
  },
  {
    id: "reel-07",
    number: "07",
    title: "Owner Launch Message — Raghavendra Colony",
    url: "https://www.instagram.com/reel/DdELqzTyiHW/?hl=en",
    image: "/images/reel_7.jpg",
    order: 7,
    isActive: true,
  },
  {
    id: "reel-08",
    number: "08",
    title: "Sky Laban Ongole Grand Experience",
    url: "https://www.instagram.com/reel/DbIjYlIocid/?hl=en",
    image: "/images/reel_8.jpg",
    order: 8,
    isActive: true,
  },
];

const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/sky_laban/?hl=en";

export default function InstagramReels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reels, setReels] = useState<ReelSequenceItem[]>(REEL_SEQUENCE);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Dynamically load reels from backend API so Admin Panel updates reflect instantly
  useEffect(() => {
    let isMounted = true;
    async function loadDynamicReels() {
      try {
        const res = await fetch("/api/public-data");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.reels) && data.reels.length > 0) {
            const activeReels = data.reels
              .filter((r: any) => r.isActive !== false)
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((r: any, idx: number) => ({
                id: r.id || `reel-${idx + 1}`,
                number: r.number || String(idx + 1).padStart(2, "0"),
                title: r.title || `Reel ${idx + 1}`,
                url: r.url,
                image: r.image,
                order: r.order,
                isActive: r.isActive,
              }));

            if (isMounted && activeReels.length > 0) {
              setReels(activeReels);
            }
          }
        }
      } catch (err) {
        console.warn("Using default reel sequence:", err);
      }
    }
    loadDynamicReels();
    return () => {
      isMounted = false;
    };
  }, []);

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
    const prevIdx = activeIndex === 0 ? reels.length - 1 : activeIndex - 1;
    scrollToReel(prevIdx);
  }, [activeIndex, reels.length, scrollToReel]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % (reels.length || 1);
    scrollToReel(nextIdx);
  }, [activeIndex, reels.length, scrollToReel]);

  // Autoplay rotation every 5s (pauses on hover)
  useEffect(() => {
    if (isHovered || reels.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, handleNext, reels.length]);

  return (
    <section
      id="instagram-reels"
      aria-label="Instagram Reel Moments"
      className="relative py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-[#eef8fe] via-[#e6f4fe] to-[#f4faff] overflow-hidden scroll-mt-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Anchor for #reels navigation links */}
      <div id="reels" className="absolute -top-20" aria-hidden="true" />
      {/* Ambient Sky Soft Glow Accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-white/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#43B8F2]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header based on Reference Design Image */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-[#DDF5FF] shadow-xs mb-3.5">
              <span className="w-4 h-4 rounded-sm bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center p-0.5 shadow-xs">
                <InstagramIcon className="w-3 h-3 text-white" />
              </span>
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#0754C9]">
                FROM OUR INSTAGRAM
              </span>
            </div>

            {/* Section Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#063B91] tracking-tight leading-tight">
              Moments of Pure Delight
            </h2>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
              Discover our latest creations, behind-the-scenes moments and the sweet experiences of Sky Laban.
            </p>
          </div>

          {/* Follow Us on Instagram CTA Button */}
          <div className="shrink-0">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0754C9]/25 hover:shadow-lg transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4 text-white" />
              <span>Follow Us on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
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
            {reels.map((reel, idx) => {
              const isFocused = activeIndex === idx;

              return (
                <a
                  key={reel.id}
                  data-reel-card
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open Sky Laban Instagram Reel ${reel.number} — ${reel.title || ""}`}
                  className={`group relative shrink-0 aspect-[9/16] w-[62vw] sm:w-[38vw] md:w-[28vw] lg:w-[calc((100%-60px)/4)] max-w-[285px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-[0_12px_30px_rgba(7,84,201,0.12)] hover:shadow-[0_20px_45px_rgba(7,84,201,0.24)] border-2 transition-all duration-300 snap-start select-none cursor-pointer ${
                    isFocused
                      ? "border-[#43B8F2] scale-100 ring-4 ring-white/60"
                      : "border-white/90 scale-[0.96] hover:scale-[0.99] hover:border-[#43B8F2]/60"
                  }`}
                >
                  {/* Full-bleed Genuine Reel Thumbnail Image */}
                  <SafeImage
                    src={getMediaUrl(reel.image)}
                    fallbackSrc="/images/reel_1.jpg"
                    alt={reel.title || `Sky Laban Instagram Reel ${reel.number}`}
                    fill
                    sizes="(max-width: 640px) 65vw, (max-width: 1024px) 35vw, 285px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Top-Right: Instagram Glyph Badge */}
                  <div className="absolute top-3.5 right-3.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center p-1 text-white border border-white/20 shadow-xs pointer-events-none">
                    <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white drop-shadow-xs" />
                  </div>

                  {/* Center: Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isFocused
                          ? "bg-white text-[#0754C9] scale-105 group-hover:scale-115"
                          : "bg-white/70 text-[#0754C9] backdrop-blur-xs group-hover:bg-white group-hover:text-[#0754C9] group-hover:scale-110"
                      }`}
                    >
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Bottom: Reel Title with subtle dark gradient for high readability */}
                  <div className="absolute inset-x-0 bottom-0 pt-16 pb-3.5 px-3 sm:px-4 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none flex flex-col justify-end">
                    <div className="flex items-end justify-between gap-2 text-white">
                      <span className="text-xs sm:text-[13px] font-bold line-clamp-2 leading-tight drop-shadow-sm">
                        {reel.title}
                      </span>
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-mono font-bold tracking-wider text-white border border-white/30">
                        {reel.number}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

        </div>

        {/* Minimal Progress Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {reels.map((reel, dotIdx) => (
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
