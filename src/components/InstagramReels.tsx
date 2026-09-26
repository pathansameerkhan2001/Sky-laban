"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, ArrowRight, Eye, Film, Sparkles, Heart, Camera } from "lucide-react";
import { InstagramIcon } from "./SocialIcons";

export interface InstagramReel {
  id: string;
  title: string;
  category: "Behind the Scenes" | "New Flavors" | "Happy Customers" | "Special Moments";
  url: string;
  image: string;
  views: string;
}

export const INSTAGRAM_REELS: InstagramReel[] = [
  {
    id: "reel-1",
    title: "Bronte Pistachio Puree Cascade",
    category: "New Flavors",
    url: "https://www.instagram.com/p/DXXQr6XEhQx/?hl=en",
    image: "/images/reel_1.jpg",
    views: "24.5K",
  },
  {
    id: "reel-2",
    title: "Belgian Dark Cocoa Fudge Churn",
    category: "Behind the Scenes",
    url: "https://www.instagram.com/reel/DZ_5R_3ynJv/?hl=en",
    image: "/images/reel_2.jpg",
    views: "18.2K",
  },
  {
    id: "reel-3",
    title: "The Iconic Salankatia Duo Spoon Pull",
    category: "Special Moments",
    url: "https://www.instagram.com/reel/DZKrKpTycXc/?hl=en",
    image: "/images/reel_3.jpg",
    views: "52.3K",
  },
  {
    id: "reel-4",
    title: "Creamy Happiness in Every Smile",
    category: "Happy Customers",
    url: "https://www.instagram.com/reel/DdYbdllTrwK/?hl=en",
    image: "/images/reel_4.jpg",
    views: "36.7K",
  },
  {
    id: "reel-5",
    title: "Welcome to Sky Laban Flagship Parlor",
    category: "Behind the Scenes",
    url: "https://www.instagram.com/reel/DdV6_-hvJuZ/?hl=en",
    image: "/images/reel_5.jpg",
    views: "28.1K",
  },
  {
    id: "reel-6",
    title: "Toasted Nuts & Roasted Flakes Fold",
    category: "New Flavors",
    url: "https://www.instagram.com/reel/DdVTC9kR043/?hl=en",
    image: "/images/reel_6.jpg",
    views: "19.4K",
  },
  {
    id: "reel-7",
    title: "Late Night Sweet Cravings Boutique",
    category: "Special Moments",
    url: "https://www.instagram.com/reel/DdELqzTyiHW/?hl=en",
    image: "/images/reel_7.jpg",
    views: "31.2K",
  },
  {
    id: "reel-8",
    title: "Opening the Fresh Salankatia Seal",
    category: "Happy Customers",
    url: "https://www.instagram.com/reel/DbIjYlIocid/?hl=en",
    image: "/images/reel_8.jpg",
    views: "45.8K",
  },
];

const CATEGORIES = [
  { name: "Behind the Scenes", icon: Film },
  { name: "New Flavors", icon: Sparkles },
  { name: "Happy Customers", icon: Heart },
  { name: "Special Moments", icon: Camera },
];

export default function InstagramReels() {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(2); // Start on reel 3 (the featured spoon pull)
  const [isHovered, setIsHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = INSTAGRAM_REELS.length;

  const nextReel = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevReel = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      nextReel();
    } else if (isRightSwipe) {
      prevReel();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Autoplay carousel, pause on hover
  useEffect(() => {
    if (isHovered || shouldReduceMotion) return;
    const timer = setInterval(() => {
      nextReel();
    }, 4200);
    return () => clearInterval(timer);
  }, [isHovered, shouldReduceMotion, nextReel]);

  // Calculate 5 visible reels with wrap-around
  const getVisibleIndices = () => {
    const indices = [];
    for (let offset = -2; offset <= 2; offset++) {
      indices.push({
        index: (currentIndex + offset + total) % total,
        offset,
      });
    }
    return indices;
  };

  const handleCategoryClick = (catName: string) => {
    setActiveCategory(catName);
    const targetIdx = INSTAGRAM_REELS.findIndex((r) => r.category === catName);
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
    }
  };

  return (
    <section
      id="instagram-reels"
      className="relative py-20 lg:py-28 bg-gradient-to-b from-[#eef8fe] via-[#e2f3fe] to-[#f4faff] overflow-hidden"
    >
      {/* Soft Ambient Sky Blur Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#43B8F2]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-Column Grid: Left Narrative + Right Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-14">
          
          {/* LEFT COLUMN: Section Branding, Headings & Social Proof */}
          <div className="lg:col-span-5 flex flex-col items-start">
            
            {/* Top Small Label with Instagram Gradient Accent */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/80 shadow-sm mb-5">
              <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center p-0.5 shadow-xs">
                <InstagramIcon className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="text-xs font-bold tracking-widest uppercase text-[#0754C9]">
                FROM OUR INSTAGRAM
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B91] leading-[1.15] tracking-tight mb-5">
              Sweet Stories
              <br />
              <span className="text-[#0754C9] font-serif italic">
                in Every Reel
              </span>
            </h2>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-8 max-w-md">
              Behind the scenes, new flavors, happy customers and all the creamy
              moments — follow Sky Laban on Instagram for the latest.
            </p>

            {/* CTA Button: Follow Us on Instagram */}
            <a
              href="https://www.instagram.com/sky_laban/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Sky Laban on Instagram"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white font-semibold text-sm sm:text-base shadow-[0_8px_25px_rgba(7,84,201,0.28)] hover:shadow-[0_12px_32px_rgba(7,84,201,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer mb-8"
            >
              <InstagramIcon className="w-4 h-4 text-white" />
              <span>Follow Us on Instagram</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>

            {/* Social Proof Stats: Avatars + 10K+ Sweet Moments */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/70 border border-white/80 shadow-sm">
              <div className="flex -space-x-2 overflow-hidden">
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#43B8F2] text-white text-xs font-bold flex items-center justify-center">
                  🍦
                </span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#0754C9] text-white text-xs font-bold flex items-center justify-center">
                  🍫
                </span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#2CB4FE] text-white text-xs font-bold flex items-center justify-center">
                  ✨
                </span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#063B91] text-white text-xs font-bold flex items-center justify-center">
                  ❤️
                </span>
              </div>
              <div className="text-left">
                <div className="text-base font-extrabold text-[#063B91] leading-none mb-0.5">
                  10K+
                </div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Sweet Moments Shared
                </div>
              </div>
            </div>

            {/* Salankatia Duo Visual Accent at Bottom-Left */}
            <div className="hidden lg:block relative w-56 h-36 mt-8">
              <Image
                src="/images/sky_laban_salankatia_tub.png"
                alt="Sky Laban Signature Salankatia Tub"
                fill
                sizes="224px"
                className="object-contain drop-shadow-[0_15px_25px_rgba(7,84,201,0.2)]"
              />
            </div>

          </div>

          {/* RIGHT COLUMN: Trending Reel Train Carousel */}
          <div
            className="lg:col-span-7 relative flex flex-col items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Carousel Navigation Buttons */}
            <div className="w-full flex items-center justify-between mb-4 px-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#0754C9]" />
                <span>Trending Reels ({currentIndex + 1} of {total})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevReel}
                  aria-label="Previous reel"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#0754C9] text-slate-700 hover:text-white border border-[#DDF5FF] shadow-sm flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextReel}
                  aria-label="Next reel"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#0754C9] text-slate-700 hover:text-white border border-[#DDF5FF] shadow-sm flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reel Train Stage with Touch Swipe Support */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center overflow-hidden py-4 touch-pan-y"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {getVisibleIndices().map(({ index, offset }) => {
                  const reel = INSTAGRAM_REELS[index];
                  const isCenter = offset === 0;

                  // Dynamic style computation for 3D/Train perspective
                  const xTranslate = offset * 110; // offset spacing percentage
                  const scale = isCenter ? 1.05 : Math.abs(offset) === 1 ? 0.92 : 0.82;
                  const zIndex = isCenter ? 30 : Math.abs(offset) === 1 ? 20 : 10;
                  const opacity = Math.abs(offset) === 2 ? 0.65 : 1;

                  return (
                    <motion.a
                      key={`${reel.id}-${offset}`}
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Watch ${reel.title} on Instagram`}
                      animate={{
                        x: `${xTranslate}%`,
                        scale,
                        opacity,
                        zIndex,
                      }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className={`group absolute w-40 sm:w-52 md:w-56 aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden border-2 ${
                        isCenter
                          ? "border-[#43B8F2] shadow-[0_20px_45px_rgba(7,84,201,0.25)] ring-4 ring-white/80"
                          : "border-white/80 shadow-[0_10px_25px_rgba(7,84,201,0.12)]"
                      } bg-slate-900 cursor-pointer select-none`}
                    >
                      {/* Reel Thumbnail Image */}
                      <Image
                        src={reel.image}
                        alt={reel.title}
                        fill
                        sizes="(max-width: 640px) 160px, 224px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={isCenter}
                      />

                      {/* Dark Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 group-hover:from-black/90 transition-all duration-300" />

                      {/* Top Right: Instagram Badge */}
                      <div className="absolute top-3 right-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center p-1 text-white shadow-xs">
                        <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      </div>

                      {/* Center: Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCenter
                              ? "bg-white/90 text-[#0754C9] shadow-lg group-hover:scale-110 group-hover:bg-white"
                              : "bg-white/40 text-white backdrop-blur-xs group-hover:bg-white/80 group-hover:text-[#0754C9]"
                          }`}
                        >
                          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
                        </div>
                      </div>

                      {/* Bottom Reel Details: View Count & Title */}
                      <div className="absolute bottom-3 left-3 right-3 text-left">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-[10px] sm:text-[11px] font-semibold text-white/95 mb-1.5">
                          <Eye className="w-3 h-3 text-[#43B8F2]" />
                          <span>{reel.views}</span>
                        </div>
                        <div className="text-[11px] sm:text-xs font-bold text-white line-clamp-2 leading-snug drop-shadow-sm">
                          {reel.title}
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Pagination Track & Dot Indicators */}
            <div className="flex items-center gap-1.5 my-5">
              {INSTAGRAM_REELS.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Go to reel ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === dotIdx
                      ? "w-8 bg-[#0754C9]"
                      : "w-2 bg-[#DDF5FF] hover:bg-[#43B8F2]"
                  }`}
                />
              ))}
            </div>

            {/* Category Pills Bar (Matching Reference Mockup!) */}
            <div className="w-full max-w-xl mx-auto p-2 sm:p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-[0_8px_25px_rgba(7,84,201,0.08)] grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.name;

                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#DDF5FF] text-[#0754C9] shadow-xs font-bold"
                        : "text-slate-600 hover:text-[#0754C9] hover:bg-[#eaf6ff]/50"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#0754C9] mb-1" />
                    <span className="text-[11px] font-semibold text-center leading-tight">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
