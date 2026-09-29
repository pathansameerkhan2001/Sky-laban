"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Layers } from "lucide-react";

export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  image?: string;
  photoImage?: string;
  tagline?: string;
  order?: number;
  isActive?: boolean;
}

const DEFAULT_CATEGORIES: CategoryData[] = [
  {
    id: "gulstha",
    name: "Gulstha",
    image: "/images/categories/gulstha-cloud@2x.png",
    photoImage: "/products/chocolate-almond-bowl.jpg",
    tagline: "Rich Nutella & pistachio dairy swirl",
    order: 1,
  },
  {
    id: "salankatia",
    name: "Salankatia",
    image: "/images/categories/salankatia-cloud@2x.png",
    photoImage: "/products/salankatia-pistachio-lotus.jpg",
    tagline: "Our iconic signature flagship dessert",
    order: 2,
  },
  {
    id: "koushiri",
    name: "Koushiri",
    image: "/images/categories/koushiri-cloud@2x.png",
    photoImage: "/products/koushiri-lotus.jpg",
    tagline: "Crisp strands & creamy dairy layers",
    order: 3,
  },
  {
    id: "ruh-hayati",
    name: "Ruh Hayati",
    image: "/images/categories/ruh-hayati-cloud@2x.png",
    photoImage: "/products/aseera-pistachio-bottle.jpg",
    tagline: "Artisanal bottled dessert cream elixir",
    order: 4,
  },
  {
    id: "lou-a",
    name: "Lou'a",
    image: "/images/categories/lou-a-cloud@2x.png",
    photoImage: "/products/salankatia-kinder.jpg",
    tagline: "Velvety pistachio & Kinder cups",
    order: 5,
  },
  {
    id: "hiba-cake",
    name: "Hiba Cake",
    image: "/images/categories/hiba-cake-cloud@2x.png",
    photoImage: "/products/heba-cake.jpg",
    tagline: "Laban-soaked cloud sponge cake",
    order: 6,
  },
  {
    id: "cakes",
    name: "Cakes",
    image: "/images/categories/cakes-cloud@2x.png",
    photoImage: "/products/fazea-chocola-cake.jpg",
    tagline: "Fazea Chocola & celebration gateaux",
    order: 7,
  },
  {
    id: "kunafa-pastry",
    name: "Kunafa & Pastry",
    image: "/images/categories/kunafa-pastry-cloud@2x.png",
    photoImage: "/products/koushri-box-cake.jpg",
    tagline: "Golden kataifi strands with clotted ashta",
    order: 8,
  },
  {
    id: "kabsa",
    name: "Kabsa",
    image: "/images/categories/kabsa-cloud@2x.png",
    photoImage: "/products/kabsa-dessert-tray.jpg",
    tagline: "Royal sweet dessert tray with saffron & nuts",
    order: 9,
  },
  {
    id: "traditional-desserts",
    name: "Traditional Desserts",
    image: "/images/categories/traditional-desserts-cloud@2x.png",
    photoImage: "/products/muhallabia-pudding-pot.jpg",
    tagline: "Time-honored Middle Eastern muhallabia pots",
    order: 10,
  },
  {
    id: "special",
    name: "Special",
    image: "/images/categories/special-cloud@2x.png",
    photoImage: "/products/chocolate-sphere-gift.jpg",
    tagline: "Artisan chocolate spheres & gift presentations",
    order: 11,
  },
];

interface CategoriesProps {
  onSelectCategory?: (categoryName: string) => void;
}

export default function Categories({ onSelectCategory }: CategoriesProps) {
  const [categories, setCategories] = useState<CategoryData[]>(DEFAULT_CATEGORIES);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Load backend categories if customized
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const res = await fetch("/api/public-data");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.categories) && data.categories.length > 0) {
            const active = data.categories
              .filter((c: any) => c.isActive !== false)
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

            if (isMounted && active.length > 0) {
              const merged = active.map((cat: any) => {
                const defaultMatch = DEFAULT_CATEGORIES.find(
                  (d) => d.id === cat.id || d.name.toLowerCase() === cat.name.toLowerCase()
                );
                return {
                  ...cat,
                  photoImage: cat.photoImage || defaultMatch?.photoImage || `/products/chocolate-almond-bowl.jpg`,
                  image: cat.image || defaultMatch?.image || `/images/categories/${cat.id}-cloud@2x.png`,
                  tagline: cat.tagline || cat.description || defaultMatch?.tagline || "Artisanal dessert creation",
                };
              });
              setCategories(merged);
            }
          }
        }
      } catch (err) {
        console.warn("Using default categories:", err);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update scroll boundaries
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  // Continuous smooth horizontal carousel motion (Independent from marquee)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let animId: number;
    let lastTime = performance.now();

    const step = (time: number) => {
      if (!isPaused && el) {
        const delta = time - lastTime;
        // Smooth gentle horizontal drift: ~32px per second
        const pixels = (32 * delta) / 1000;
        el.scrollLeft += pixels;

        // Seamless loop wrap when reaching halfway (duplicated cards)
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
        updateScrollState();
      }
      lastTime = time;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, updateScrollState]);

  // Manual Previous/Next Controls
  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    setIsPaused(true);
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(() => {
      updateScrollState();
    }, 350);
  };

  const handleClickCategory = (categoryName: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Duplicate categories array for seamless infinite moving carousel
  const carouselItems = [...categories, ...categories];

  return (
    <section
      id="categories"
      aria-label="Explore Our Categories"
      className="py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-[#f8fcff] via-white to-[#f4faff] relative overflow-hidden scroll-mt-12"
    >
      {/* Decorative Soft Cloud Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#43B8F2]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0754C9]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header (Fixed in page flow) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="text-left max-w-2xl">
            {/* Exact Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5FE] border border-[#DDF5FF] shadow-xs mb-3.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0754C9]" />
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#0754C9]">
                HANDCRAFTED ARTISANAL DELIGHTS
              </span>
            </div>

            {/* Exact Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#063B91] tracking-tight leading-tight">
              Explore Our Categories
            </h2>

            {/* Exact Supporting Text */}
            <p className="text-sm sm:text-base text-slate-600 mt-2.5 italic font-medium leading-relaxed">
              &ldquo;Discover your favourite Sky Laban creations, crafted to make every moment special.&rdquo;
            </p>
          </div>

          {/* Carousel Navigation Controls (Desktop & Mobile) */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-end">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Previous categories"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-[#0754C9] text-[#063B91] hover:text-white border border-[#DDF5FF] shadow-xs flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Next categories"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-[#0754C9] text-[#063B91] hover:text-white border border-[#DDF5FF] shadow-xs flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* ================= MOVING CATEGORY CAROUSEL TRACK ================= */}
        {/* Independent horizontal carousel track with auto-glide and touch-swipe */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onScroll={updateScrollState}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-6 pt-2 px-1 scroll-smooth select-none cursor-grab active:cursor-grabbing"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {carouselItems.map((cat, idx) => (
            <div
              key={`${cat.id}-${idx}`}
              onClick={() => handleClickCategory(cat.name)}
              className="group relative bg-white rounded-3xl border border-[#DDF5FF] hover:border-[#0754C9]/40 shadow-[0_8px_24px_rgba(7,84,201,0.06)] hover:shadow-[0_16px_36px_rgba(7,84,201,0.16)] transition-all duration-300 flex flex-col overflow-hidden text-left cursor-pointer hover:-translate-y-2 shrink-0 w-[210px] sm:w-[250px] lg:w-[270px]"
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#43B8F2] via-[#0754C9] to-[#063B91] opacity-0 group-hover:opacity-100 transition-opacity z-20" />

              {/* Card Image Area with Real Dessert Photography */}
              <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-[#eaf6ff] via-[#f4faff] to-white p-3 sm:p-4 overflow-hidden flex items-center justify-center shrink-0">
                {/* Real High-Quality Dessert Image */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={cat.photoImage || `/products/chocolate-almond-bowl.jpg`}
                    alt={`Sky Laban ${cat.name}`}
                    fill
                    sizes="(max-width: 640px) 210px, 270px"
                    className="object-contain p-1 group-hover:scale-108 transition-transform duration-500 ease-out drop-shadow-[0_8px_18px_rgba(7,84,201,0.16)]"
                    loading="lazy"
                  />
                </div>

                {/* Sky Laban Cloud Badge Emblem (Floating bottom-right corner) */}
                <div className="absolute bottom-2 right-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-xs p-1 shadow-md border border-[#DDF5FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="relative w-full h-full">
                    <Image
                      src={cat.image || `/images/categories/${cat.id}-cloud@2x.png`}
                      alt=""
                      aria-hidden="true"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Card Label & Details */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white border-t border-[#EAF4FC]">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#063B91] group-hover:text-[#0754C9] transition-colors leading-snug line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.tagline || cat.description || "Signature Sky Laban creation"}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0754C9]">
                  <span className="text-[11px] font-semibold text-slate-400 group-hover:text-[#0754C9] transition-colors">
                    Explore Menu
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Hint & View All Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#43B8F2]" />
            <span>Hover or swipe to pause • Click category to browse creations</span>
          </div>

          <button
            onClick={() => handleClickCategory("All")}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-[#0754C9] text-[#063B91] hover:text-white border border-[#DDF5FF] hover:border-[#0754C9] font-bold text-xs shadow-xs hover:shadow-[0_6px_20px_rgba(7,84,201,0.18)] transition-all duration-200 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#0754C9] group-hover:text-white transition-colors" />
            <span>View All Products &amp; Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
