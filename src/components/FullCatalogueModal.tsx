"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Sparkles, Eye, ArrowUpRight, Filter } from "lucide-react";
import { PRODUCTS_DATA, ProductItem, PRODUCT_CATEGORIES } from "@/data/brandData";

interface FullCatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

export default function FullCatalogueModal({
  isOpen,
  onClose,
  onSelectProduct,
}: FullCatalogueModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = PRODUCTS_DATA.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#063B91]/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] z-10 my-4 max-h-[92vh] flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#DDF5FF] bg-gradient-to-r from-[#EAF6FF] to-white flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0754C9]/10 text-[#0754C9] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-[#0754C9]" />
                <span>Sky Laban Artisanal Menu</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#063B91]">
                Complete Dessert Catalogue
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Explore all verified categories, authentic ingredients, and signature creations.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close catalogue"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Category Tabs */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-white space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search across all products (e.g. Nutella Gulstha, Lotus Koushiri, Kunafa)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0754C9] text-xs sm:text-sm text-slate-800 outline-none"
              />
            </div>

            {/* Horizontal Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === "All"
                    ? "bg-[#0754C9] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({PRODUCTS_DATA.length})
              </button>
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#0754C9] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="overflow-y-auto p-4 sm:p-6 flex-1">
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center text-xs sm:text-sm text-slate-400">
                No products match &ldquo;{search}&rdquo;. Try another dessert name or category.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#DDF5FF] hover:border-[#0754C9]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer select-none"
                  >
                    <div className="relative aspect-square w-full bg-gradient-to-b from-[#eaf6ff] to-white p-3 flex items-center justify-center">
                      {prod.badge && (
                        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#0754C9] text-white text-[9px] font-bold">
                          {prod.badge}
                        </div>
                      )}
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          sizes="200px"
                          className="object-contain p-2 group-hover:scale-104 transition-transform duration-300 drop-shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-white flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[10px] font-bold text-[#0754C9] uppercase block truncate">
                          {prod.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#063B91] group-hover:text-[#0754C9] line-clamp-1 mt-0.5">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {prod.tagline}
                        </p>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#0754C9] font-bold">
                        <span>{prod.price ? prod.price : "At Outlets"}</span>
                        <span className="flex items-center gap-0.5 text-[10px] text-slate-400 group-hover:text-[#0754C9]">
                          Details <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredProducts.length} of {PRODUCTS_DATA.length} authentic dessert creations</span>
            <button
              onClick={onClose}
              className="font-bold text-[#0754C9] hover:underline cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
