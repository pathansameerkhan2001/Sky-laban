"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Hero() {
  const [headerHeight, setHeaderHeight] = useState<number>(112);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const updateHeight = () => {
      const h = header.offsetHeight;
      if (h > 0) {
        setHeaderHeight((prev) => (prev !== h ? h : prev));
      }
    };

    updateHeight();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        updateHeight();
      });
      ro.observe(header);
    }

    window.addEventListener("resize", updateHeight, { passive: true });

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <section
      id="home"
      className="hero relative w-full overflow-hidden bg-gradient-to-br from-[#40A8EB] via-[#35AFF2] to-[#2BA0E8]"
      style={{
        width: "100%",
        maxWidth: "none",
        minHeight: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      {/* Background Image Layer (Positioned to ensure full visibility of container, spoon, and toppings) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
        <Image
          src="/hero/sky-laban-hero-enhanced.jpg"
          alt="Sky Laban Salankatia"
          fill
          priority
          sizes="100vw"
          className="hero-image w-full h-full object-cover object-right md:object-center lg:object-[60%_center] xl:object-center"
        />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-0 flex flex-col justify-center min-h-[calc(100vh-112px)]">
        <div className="max-w-xl lg:max-w-lg xl:max-w-xl text-left">
          {/* Small label: PREMIUM DESSERTS */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/80 shadow-[0_4px_15px_rgba(7,84,201,0.12)] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#0754C9]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#0754C9]">
              PREMIUM DESSERTS
            </span>
          </div>

          {/* Main heading: Creamy Happiness in Every Scoop */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#063B91] leading-[1.12] tracking-tight mb-5 drop-shadow-sm">
            Creamy Happiness
            <br />
            <span className="text-white drop-shadow-[0_2px_12px_rgba(7,84,201,0.35)]">
              in Every Scoop
            </span>
          </h1>

          {/* Supporting text */}
          <p className="text-base sm:text-lg text-slate-900/90 font-medium leading-relaxed mb-8 max-w-lg drop-shadow-xs">
            Indulge in the rich and creamy goodness of Sky Laban — crafted with
            premium ingredients for an unforgettable taste.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            {/* Primary CTA */}
            <a
              href="#products"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white font-semibold text-sm sm:text-base shadow-[0_8px_25px_rgba(7,84,201,0.3)] hover:shadow-[0_12px_30px_rgba(7,84,201,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <span>Explore Our Products</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>

            {/* Secondary CTA */}
            <a
              href="#our-story"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/95 hover:bg-white text-[#0754C9] font-semibold text-sm sm:text-base border border-white/80 shadow-[0_4px_15px_rgba(7,84,201,0.1)] hover:shadow-[0_8px_20px_rgba(7,84,201,0.18)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <span>Discover Our Story</span>
              <ArrowRight className="w-4 h-4 text-[#0754C9] transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
