"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Sparkles,
  Eye,
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS_DATA, ProductItem } from "@/data/brandData";
import ProductDetailModal from "./ProductDetailModal";
import FullCatalogueModal from "./FullCatalogueModal";
import { getMediaUrl } from "@/lib/media";
import SafeImage from "./SafeImage";

const CATEGORIES = [
  "All",
  "Gulstha",
  "Salankatia",
  "Koushiri",
  "Ruh Hayati",
  "Lou'a",
  "Hiba Cake",
  "Cakes",
  "Kunafa & Pastry",
  "Kabsa",
  "Traditional Desserts",
  "Special",
] as const;

export const CATEGORY_SUBHEADINGS: Record<string, string> = {
  All: "In Every Scoop",
  Gulstha: "In Every Scoop of Gulstha",
  Salankatia: "In Every Scoop of Salankatia",
  Koushiri: "In Every Scoop of Koushiri",
  "Ruh Hayati": "In Every Scoop of Ruh Hayati",
  "Lou'a": "In Every Scoop of Lou'a",
  "Hiba Cake": "In Every Bite of Hiba Cake",
  Cakes: "In Every Bite of Cakes",
  "Kunafa & Pastry": "In Every Bite of Kunafa & Pastry",
  Kabsa: "In Every Bite of Kabsa",
  "Traditional Desserts": "In Every Bite of Tradition",
  Special: "In Every Special Creation",
};

export function getCategorySubheading(cat: string): string {
  if (CATEGORY_SUBHEADINGS[cat]) return CATEGORY_SUBHEADINGS[cat];
  const foundKey = Object.keys(CATEGORY_SUBHEADINGS).find(
    (k) => k.toLowerCase() === cat.toLowerCase()
  );
  if (foundKey) return CATEGORY_SUBHEADINGS[foundKey];
  return `In Every Scoop of ${cat}`;
}

interface ProductsProps {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export default function Products({ selectedCategory, onSelectCategory }: ProductsProps) {
  const [products, setProducts] = useState<ProductItem[]>(PRODUCTS_DATA);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isFullCatalogueOpen, setIsFullCatalogueOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "carousel">("grid");

  // Carousel controls
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Sync with prop if passed
  useEffect(() => {
    if (selectedCategory && selectedCategory !== activeCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory, activeCategory]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    // Reset carousel scroll when category changes
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
  };

  // Load dynamic products from backend & Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        const res = await fetch("/api/public-data");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.products) && data.products.length > 0 && isMounted) {
            setProducts(data.products.filter((p: any) => p.isAvailable !== false));
          }
        }
      } catch (err) {
        console.warn("Using default products data:", err);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  // Update carousel scroll boundaries
  const updateScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  // Continuous smooth horizontal carousel motion when in carousel mode
  useEffect(() => {
    if (viewMode !== "carousel") return;
    const el = carouselRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let animId: number;
    let lastTime = performance.now();

    const step = (time: number) => {
      if (!isPaused && el) {
        const delta = time - lastTime;
        // Smooth gentle horizontal drift: ~30px per second
        const pixels = (30 * delta) / 1000;
        el.scrollLeft += pixels;

        // Loop seamlessly halfway through duplicated items
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
  }, [viewMode, isPaused, updateScrollState, displayedProducts.length]);

  // Manual Previous/Next Controls for Carousel
  const handleCarouselScroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
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

  // Duplicate items for continuous seamless carousel loop
  const carouselItems =
    displayedProducts.length > 0
      ? [...displayedProducts, ...displayedProducts]
      : [];

  return (
    <section
      id="products"
      aria-label="Sky Laban Products & Customer Favorites"
      className="relative py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-[#f4faff] via-[#edf7ff] to-white overflow-hidden scroll-mt-12"
    >
      {/* Target anchor for navigation links linking to #categories */}
      <div id="categories" className="absolute -top-16" aria-hidden="true" />

      {/* Decorative Soft Cloud Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#43B8F2]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-[#0754C9]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1760px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        
        {/* ================= 1. SECTION HEADER (Matching Reference Image 2) ================= */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E1F2FE] border border-[#CDE9FD] shadow-xs mb-3.5 select-none">
            <Sparkles className="w-3.5 h-3.5 text-[#0754C9]" />
            <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-[#0754C9]">
              ✨ PRODUCTS &amp; CUSTOMER FAVORITES
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#063B91] tracking-tight leading-[1.15] mb-3 text-center">
            Creamy Happiness
            <span className="block font-serif italic font-normal text-[#0754C9] text-2xl sm:text-3xl md:text-4xl lg:text-[48px] mt-1.5 min-h-[1.3em] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={activeCategory}
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -7 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="inline-block text-center"
                >
                  {getCategorySubheading(activeCategory)}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            &ldquo;Indulge in artisan dessert perfection — handcrafted with care, premium ingredients,
            rich flavours, and the signature taste of Sky Laban.&rdquo;
          </p>

          {/* ================= 2. ANIMATED CATEGORY FILTER PILLS ================= */}
          <div className="w-full mt-7 sm:mt-9">
            <div
              className="overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
              }}
            >
              <div className="flex items-center justify-start md:justify-center flex-nowrap md:flex-wrap gap-2 sm:gap-2.5 min-w-max md:min-w-0 mx-auto px-1">
                {CATEGORIES.map((cat) => {
                  const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 select-none ${
                        isSelected
                          ? "bg-[#0754C9] text-white font-bold shadow-md shadow-[#0754C9]/25 scale-[1.03] border border-[#0754C9]"
                          : "bg-white text-[#063B91] font-semibold border border-[#D0E6F9] hover:border-[#0754C9]/50 hover:bg-[#F0F8FF] hover:text-[#0754C9]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. CONTROLS BAR (Category Status & View Switcher) ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 pt-2 border-t border-[#E3F1FC]/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-[#0754C9] animate-pulse" />
            <span>
              Showing <span className="font-bold text-[#063B91]">{displayedProducts.length}</span>{" "}
              {displayedProducts.length === 1 ? "creation" : "creations"} in{" "}
              <span className="font-bold text-[#0754C9]">{activeCategory}</span>
            </span>
          </div>

          {/* View Mode Toggle & Carousel Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Carousel navigation chevrons (Visible in carousel mode) */}
            {viewMode === "carousel" && (
              <div className="flex items-center gap-1.5 mr-1">
                <button
                  onClick={() => handleCarouselScroll("left")}
                  aria-label="Previous products"
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#0754C9] text-[#063B91] hover:text-white border border-[#DDF5FF] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => handleCarouselScroll("right")}
                  aria-label="Next products"
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#0754C9] text-[#063B91] hover:text-white border border-[#DDF5FF] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}

            {/* View Switcher: Grid vs Carousel */}
            <div className="inline-flex items-center p-0.5 rounded-full bg-white border border-[#DDF5FF] shadow-xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#0754C9] text-white shadow-xs"
                    : "text-slate-500 hover:text-[#0754C9]"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Grid View</span>
              </button>

              <button
                onClick={() => setViewMode("carousel")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "carousel"
                    ? "bg-[#0754C9] text-white shadow-xs"
                    : "text-slate-500 hover:text-[#0754C9]"
                }`}
                title="Continuous Moving Carousel"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Moving Carousel</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= 4. PRODUCTS DISPLAY: GRID VIEW ================= */}
        {viewMode === "grid" && (
          <>
            {displayedProducts.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white/70 border border-[#DDF5FF] p-8">
                <Sparkles className="w-8 h-8 text-[#0754C9] mx-auto mb-2 opacity-50" />
                <h3 className="text-base font-bold text-[#063B91]">
                  No creations currently listed under {activeCategory}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try browsing &ldquo;All&rdquo; or select another dessert category above.
                </p>
                <button
                  onClick={() => handleCategoryChange("All")}
                  className="mt-4 px-4 py-2 rounded-full bg-[#0754C9] text-white text-xs font-bold shadow-xs cursor-pointer hover:bg-[#0645B8]"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6 mb-10 sm:mb-12"
              >
                {displayedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DDF5FF] hover:border-[#0754C9]/40 shadow-[0_6px_20px_rgba(7,84,201,0.06)] hover:shadow-[0_14px_34px_rgba(7,84,201,0.14)] transition-all duration-300 flex flex-col h-full cursor-pointer select-none hover:-translate-y-1"
                  >
                    {/* Top Accent Gradient Line */}
                    <div className="h-1 bg-gradient-to-r from-[#43B8F2] via-[#0754C9] to-[#063B91] opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Product Image Frame */}
                    <div className="relative aspect-square w-full bg-gradient-to-b from-[#eaf6ff] via-[#f4faff] to-white p-3 sm:p-5 overflow-hidden flex items-center justify-center shrink-0">
                      {prod.badge && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#0754C9] text-white text-[9px] sm:text-[10px] font-bold tracking-wide shadow-xs flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#43B8F2]" />
                          <span className="truncate max-w-[85px] sm:max-w-none">{prod.badge}</span>
                        </div>
                      )}

                      <div className="relative w-full h-full flex items-center justify-center">
                        <SafeImage
                          src={getMediaUrl(prod.image || "/products/salankatia-nutella-lotus.jpg")}
                          fallbackSrc="/products/salankatia-nutella-lotus.jpg"
                          alt={prod.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw"
                          className="object-contain p-1 sm:p-2 transition-transform duration-300 ease-out group-hover:scale-105 drop-shadow-[0_6px_16px_rgba(7,84,201,0.18)]"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Product Info Frame */}
                    <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between bg-white border-t border-[#EAF4FC]">
                      <div>
                        <div className="text-[10px] sm:text-xs font-bold text-[#0754C9] uppercase tracking-wider mb-1 line-clamp-1">
                          {prod.category}
                        </div>

                        <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-[#063B91] group-hover:text-[#0754C9] transition-colors line-clamp-1 mb-1">
                          {prod.name}
                        </h3>

                        <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-snug">
                          {prod.description || prod.tagline}
                        </p>
                      </div>

                      {/* Display Price & Details */}
                      <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-[#DDF5FF] flex items-center justify-between text-xs font-semibold text-[#0754C9]">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {prod.price ? prod.price : "Available in Store"}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold group-hover:text-[#0645B8]">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* ================= 5. PRODUCTS DISPLAY: SMOOTH MOVING CAROUSEL VIEW ================= */}
        {viewMode === "carousel" && (
          <div className="mb-10 sm:mb-12">
            <div
              ref={carouselRef}
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
              {carouselItems.map((prod, idx) => (
                <div
                  key={`${prod.id}-${idx}`}
                  onClick={() => setSelectedProduct(prod)}
                  className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#DDF5FF] hover:border-[#0754C9]/40 shadow-[0_8px_24px_rgba(7,84,201,0.06)] hover:shadow-[0_16px_36px_rgba(7,84,201,0.16)] transition-all duration-300 flex flex-col overflow-hidden text-left cursor-pointer hover:-translate-y-1.5 shrink-0 w-[220px] sm:w-[260px] md:w-[280px] lg:w-[310px]"
                >
                  {/* Top Accent Gradient Line */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#43B8F2] via-[#0754C9] to-[#063B91] opacity-0 group-hover:opacity-100 transition-opacity z-20" />

                  {/* Card Image Area */}
                  <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-[#eaf6ff] via-[#f4faff] to-white p-3 sm:p-4 overflow-hidden flex items-center justify-center shrink-0">
                    {prod.badge && (
                      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#0754C9] text-white text-[9px] font-bold tracking-wide shadow-xs flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#43B8F2]" />
                        <span>{prod.badge}</span>
                      </div>
                    )}

                    <div className="relative w-full h-full flex items-center justify-center">
                      <SafeImage
                        src={getMediaUrl(prod.image || "/products/salankatia-nutella-lotus.jpg")}
                        fallbackSrc="/products/salankatia-nutella-lotus.jpg"
                        alt={prod.name}
                        fill
                        sizes="(max-width: 640px) 210px, 270px"
                        className="object-contain p-1 group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-[0_8px_18px_rgba(7,84,201,0.16)]"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Card Label & Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white border-t border-[#EAF4FC]">
                    <div>
                      <div className="text-[10px] font-bold text-[#0754C9] uppercase tracking-wider mb-1 line-clamp-1">
                        {prod.category}
                      </div>

                      <h3 className="text-xs sm:text-sm font-extrabold text-[#063B91] group-hover:text-[#0754C9] transition-colors leading-snug line-clamp-1">
                        {prod.name}
                      </h3>

                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {prod.tagline || prod.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0754C9]">
                      <span className="text-[11px] font-semibold text-slate-400 group-hover:text-[#0754C9] transition-colors">
                        View Details
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Hint */}
            <div className="text-center mt-3 text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#43B8F2]" />
              <span>Hover or touch to pause • Swipe or click arrows to browse</span>
            </div>
          </div>
        )}

        {/* ================= 6. VIEW FULL MENU CATALOGUE ACTION ================= */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setIsFullCatalogueOpen(true)}
            className="group inline-flex items-center gap-2.5 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-white hover:bg-[#0754C9] text-[#0754C9] hover:text-white border-1.5 border-[#0754C9] font-bold text-xs sm:text-sm shadow-sm hover:shadow-[0_8px_25px_rgba(7,84,201,0.22)] transition-all duration-200 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#0754C9] group-hover:text-white transition-colors" />
            <span>View All Products &amp; Full Menu</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>

      {/* Interactive Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Full Menu Catalogue Modal */}
      <FullCatalogueModal
        isOpen={isFullCatalogueOpen}
        onClose={() => setIsFullCatalogueOpen(false)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />
    </section>
  );
}
