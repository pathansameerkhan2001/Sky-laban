"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import SafeImage from "@/components/SafeImage";

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
      className="hero relative w-full overflow-hidden bg-[#063B91] select-none focus:outline-none h-[56vh] sm:h-[65vh] md:h-[74vh] lg:h-[80vh] min-h-[380px] sm:min-h-[440px] max-h-[780px]"
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
                <SafeImage
                  src={getMediaUrl(slide.desktopImage)}
                  fallbackSrc="/hero/hero-table-feast-desktop-hd.jpg"
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
                <SafeImage
                  src={getMediaUrl(slide.mobileImage || slide.desktopImage)}
                  fallbackSrc="/hero/hero-table-feast-mobile-hd.jpg"
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

      {/* Accessible single H1 for SEO and Screen Readers (Visual presentation is 100% focused on product photography) */}
      <h1 className="sr-only">Sky Laban — Authentic Egyptian &amp; Middle Eastern Desserts</h1>

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
