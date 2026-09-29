"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Eye, ArrowUpRight, ArrowRight } from "lucide-react";
import { PRODUCTS_DATA, ProductItem } from "@/data/brandData";
import ProductDetailModal from "./ProductDetailModal";
import FullCatalogueModal from "./FullCatalogueModal";

const ALL_CATEGORIES = [
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
];

interface ProductsProps {
  selectedCategory?: string;
}

export default function Products({ selectedCategory }: ProductsProps) {
  const [products, setProducts] = useState<ProductItem[]>(PRODUCTS_DATA);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isFullCatalogueOpen, setIsFullCatalogueOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Sync with prop if passed from Categories section
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "All") {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  // Load dynamic products from backend
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

  return (
    <section
      id="products"
      className="py-14 sm:py-20 lg:py-24 bg-[#f8fcff] relative overflow-hidden scroll-mt-16"
    >
      {/* Background Soft Sky Ambient Glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#DDF5FF]/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#43B8F2]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF5FF] text-[#0754C9] text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span>Products &amp; Customer Favorites</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#063B91] tracking-tight leading-tight mb-2.5">
            Creamy Happiness
            <br />
            <span className="text-[#0754C9] font-serif italic">In Every Scoop</span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Indulge in artisanal dessert perfection — handcrafted with 100% pure farm dairy,
            roasted Mediterranean nuts, and signature velvet layers.
          </p>

          {/* Category Filter Pills */}
          <div className="w-full overflow-x-auto no-scrollbar pt-5 pb-2">
            <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 min-w-max px-2 mx-auto">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                    activeCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-[#0754C9] text-white shadow-md shadow-[#0754C9]/25 scale-[1.02]"
                      : "bg-white text-slate-600 hover:text-[#0754C9] hover:bg-[#DDF5FF]/40 border border-[#DDF5FF]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 mb-10 sm:mb-12">
          {displayedProducts.slice(0, 12).map((prod) => (
            <div
              key={prod.id}
              onClick={() => setSelectedProduct(prod)}
              className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DDF5FF] hover:border-[#0754C9]/40 shadow-[0_6px_20px_rgba(7,84,201,0.06)] hover:shadow-[0_12px_32px_rgba(7,84,201,0.14)] transition-all duration-300 flex flex-col h-full cursor-pointer select-none hover:-translate-y-1"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-square w-full bg-gradient-to-b from-[#eaf6ff] via-[#f4faff] to-white p-3 sm:p-5 overflow-hidden flex items-center justify-center shrink-0">
                {prod.badge && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#0754C9] text-white text-[9px] sm:text-[10px] font-bold tracking-wide shadow-xs flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#43B8F2]" />
                    <span className="truncate max-w-[80px] sm:max-w-none">{prod.badge}</span>
                  </div>
                )}

                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 280px, 320px"
                    className="object-contain p-1 sm:p-2 transition-transform duration-300 ease-out group-hover:scale-105 drop-shadow-[0_6px_16px_rgba(7,84,201,0.18)]"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Product Info Frame */}
              <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between bg-white">
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
                  <span className="hidden sm:flex items-center gap-1 group-hover:text-[#0645B8]">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsFullCatalogueOpen(true)}
            className="group inline-flex items-center gap-2.5 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-white hover:bg-[#0754C9] text-[#0754C9] hover:text-white border-1.5 border-[#0754C9] font-bold text-xs sm:text-sm shadow-sm hover:shadow-[0_8px_25px_rgba(7,84,201,0.22)] transition-all duration-200 cursor-pointer"
          >
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
