"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Eye, ArrowUpRight } from "lucide-react";
import { PRODUCTS_DATA, ProductItem } from "@/data/brandData";
import ProductDetailModal from "./ProductDetailModal";

export default function Products() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Signature Flagship", "Nut Creams", "Chocolate Delights", "Royal Series"];

  const filteredProducts =
    activeCategory === "All"
      ? PRODUCTS_DATA
      : PRODUCTS_DATA.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="py-20 lg:py-28 bg-[#f8fcff] relative overflow-hidden">
      {/* Background Soft Sky Circles */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#DDF5FF]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#43B8F2]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DDF5FF] text-[#0754C9] text-xs font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span>OUR DESSERT COLLECTION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B91] tracking-tight leading-tight mb-4">
            Velvety Creations Crafted to Perfection
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            From our celebrated Salankatia dual-layer creation to aromatic nut creams, every scoop is prepared with uncompromising dairy purity and master culinary balance.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#0754C9] text-white shadow-md shadow-[#0754C9]/20"
                    : "bg-white text-slate-600 hover:text-[#0754C9] border border-[#DDF5FF] hover:border-[#43B8F2]/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod, idx) => (
            <motion.div
              key={prod.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-3xl overflow-hidden border border-[#DDF5FF] shadow-[0_10px_30px_rgba(7,84,201,0.06)] hover:shadow-[0_20px_40px_rgba(7,84,201,0.14)] transition-all duration-300 flex flex-col"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-[#eaf6ff] to-white p-6 overflow-hidden flex items-center justify-center">
                {/* Badge if present */}
                {prod.badge && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#0754C9] text-white text-[11px] font-bold tracking-wide shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#43B8F2]" />
                    <span>{prod.badge}</span>
                  </div>
                )}

                {/* Product Image with Zoom on hover ONLY */}
                <div className="relative w-full h-full">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-108 drop-shadow-[0_8px_20px_rgba(7,84,201,0.18)]"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0754C9] uppercase tracking-wider mb-1">
                    {prod.category}
                  </div>

                  <h3 className="text-xl font-bold text-[#063B91] mb-1.5 group-hover:text-[#0754C9] transition-colors">
                    {prod.name}
                  </h3>

                  <p className="text-xs font-medium text-slate-500 mb-3">
                    {prod.tagline}
                  </p>

                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {prod.description}
                  </p>
                </div>

                {/* Tasting Notes Tags */}
                <div className="pt-2 border-t border-[#DDF5FF]">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {prod.tastingNotes.slice(0, 2).map((note, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#DDF5FF]/60 text-[#0754C9]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* View Product CTA */}
                  <button
                    onClick={() => setSelectedProduct(prod)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#eaf6ff] hover:bg-[#0754C9] text-[#0754C9] hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Product</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Interactive Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
