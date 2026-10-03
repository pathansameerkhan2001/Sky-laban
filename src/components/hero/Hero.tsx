"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getMediaUrl } from "@/lib/media";

export interface HeroSlide {
  id: string;
  desktopImage: string;
  mobileImage: string;
  alt: string;
  desktopObjectPosition: string;
  mobileObjectPosition: string;
}

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "table-feast",
    desktopImage: "/hero/hero-table-feast-desktop-hd.jpg",
    mobileImage: "/hero/hero-table-feast-mobile-hd.jpg",
    alt: "Sky Laban Signature Egyptian Desserts Feast - Aseera, Salankatiya, Koushri, Fazea Chocola",
    desktopObjectPosition: "object-center",
    mobileObjectPosition: "object-center",
  },
  {
    id: "cafe-experience",
    desktopImage: "/hero/hero-cafe-experience-desktop-hd.jpg",
    mobileImage: "/hero/hero-cafe-experience-mobile-hd.jpg",
    alt: "Sky Laban Authentic Egyptian Desserts - A Taste Worth Coming Back For",
    desktopObjectPosition: "object-center",
    mobileObjectPosition: "object-center",
  },
  {
    id: "gift-presentation",
    desktopImage: "/hero/hero-gift-presentation-desktop.jpg",
    mobileImage: "/hero/hero-gift-presentation-mobile.jpg",
    alt: "Sky Laban Signature Dessert Bowls & Ribboned Blue Gift Box Presentation",
    desktopObjectPosition: "object-center",
    mobileObjectPosition: "object-center",
  },
  {
    id: "dessert-collection",
    desktopImage: "/hero/hero-dessert-collection-desktop.jpg",
    mobileImage: "/hero/hero-dessert-collection-mobile.jpg",
    alt: "Sky Laban Complete Artisanal Dessert Collection, Bowls, and Packaging",
    desktopObjectPosition: "object-center",
    mobileObjectPosition: "object-center",
  },
];

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Load custom hero slides if available from Supabase / public data
  useEffect(() => {
    let isMounted = true;
    async function loadHeroData() {
      try {
        const res = await fetch("/api/public-data");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.heroSlides) && data.heroSlides.length > 0 && isMounted) {
            setSlides(data.heroSlides);
          }
        }
      } catch (err) {
        console.warn("Using default hero slides:", err);
      }
    }
    loadHeroData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Auto-slide every 5.5s (pauses on interaction/hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 45) {
        handleNext();
      } else if (diff < -45) {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  return (
    <section
      id="home"
      aria-label="Sky Laban Hero Showcase"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="hero relative w-full overflow-hidden bg-[#063B91] select-none focus:outline-none h-[68vh] sm:h-[72vh] md:h-[76vh] lg:h-[82vh] min-h-[460px] max-h-[820px]"
    >
      {/* Slides Background Track */}
      <div className="relative w-full h-full">
        {slides.map((slide, idx) => {
          const isActive = currentSlide === idx;

          return (
            <div
              key={slide.id || idx}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* DESKTOP HERO VIEW (Hidden on Mobile) */}
              <div className="hidden md:block relative w-full h-full">
                <Image
                  src={getMediaUrl(slide.desktopImage)}
                  alt={slide.alt || "Sky Laban Signature Desserts"}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  className={`w-full h-full object-cover ${slide.desktopObjectPosition || "object-center"}`}
                />
              </div>

              {/* MOBILE HERO VIEW (Hidden on Desktop) */}
              <div className="block md:hidden relative w-full h-full">
                <Image
                  src={getMediaUrl(slide.mobileImage || slide.desktopImage)}
                  alt={slide.alt || "Sky Laban Signature Desserts"}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  className={`w-full h-full object-cover ${slide.mobileObjectPosition || "object-center"}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Cinematic Contrast Overlay (Adaptive for Desktop & Mobile) */}
      <div
        className="absolute inset-0 z-15 pointer-events-none bg-gradient-to-t from-black/85 via-black/45 to-black/20 md:bg-gradient-to-r md:from-black/85 md:via-black/50 md:to-transparent"
        aria-hidden="true"
      />

      {/* Foreground Hero Text & Interaction Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end md:justify-center px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pb-12 sm:pb-14 md:pb-0 pointer-events-none">
        <div className="max-w-2xl text-left pointer-events-auto">
          {/* Eyebrow Badge */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] sm:text-xs font-black tracking-widest uppercase mb-3 sm:mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span>Authentic Egyptian &amp; Middle Eastern Desserts</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-[66px] font-black text-white tracking-tight leading-[1.08] drop-shadow-md"
          >
            Creamy Happiness
            <span className="block font-serif italic font-normal text-[#43B8F2] text-2xl sm:text-4xl md:text-5xl lg:text-[54px] mt-1 sm:mt-1.5">
              in Every Scoop
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg max-w-xl font-normal leading-relaxed drop-shadow-sm mt-2.5 sm:mt-4 line-clamp-3 sm:line-clamp-none"
          >
            Indulge in artisanal dessert perfection — handcrafted with slow-churned farm dairy, rich Nutella, spiced Lotus, and pure Bronte pistachios.
          </motion.p>

          {/* Minimal Interaction: Explore Our Products */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 sm:mt-7 flex items-center gap-3"
          >
            <a
              href="#products"
              className="group inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#0754C9] hover:bg-white text-white hover:text-[#063B91] font-bold text-xs sm:text-sm shadow-[0_8px_25px_rgba(7,84,201,0.4)] hover:shadow-[0_10px_30px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-103 active:scale-98 cursor-pointer"
            >
              <span>Explore Our Products</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white group-hover:text-[#063B91]" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* CAROUSEL NAVIGATION: Previous Button (Frosted Pill) */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-2.5 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-25 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#0754C9] shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-white/80 flex items-center justify-center transition-all duration-200 hover:scale-108 active:scale-95 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>

      {/* CAROUSEL NAVIGATION: Next Button (Frosted Pill) */}
      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-2.5 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-25 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-[#0754C9] shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-white/80 flex items-center justify-center transition-all duration-200 hover:scale-108 active:scale-95 cursor-pointer"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>

      {/* CAROUSEL PAGINATION: Discreet Center Dots */}
      <div
        role="tablist"
        aria-label="Carousel Slides"
        className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-25 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/30 shadow-sm"
      >
        {slides.map((slide, idx) => {
          const isActive = currentSlide === idx;

          return (
            <button
              key={slide.id || idx}
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentSlide(idx)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? "w-5 sm:w-7 h-1.5 sm:h-2 bg-[#43B8F2]"
                  : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/90"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
