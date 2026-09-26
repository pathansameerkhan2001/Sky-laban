"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Utensils, CheckCircle2, Info } from "lucide-react";
import { ProductItem } from "@/data/brandData";

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (product) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#063B91]/50 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] overflow-hidden z-10 my-8"
        >
          {/* Header Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-[#0754C9] shadow-md flex items-center justify-center transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Image Area */}
          <div className="relative aspect-[16/10] w-full bg-gradient-to-b from-[#DDF5FF] to-white flex items-center justify-center p-6">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 650px"
              className="object-contain p-4 drop-shadow-[0_12px_30px_rgba(7,84,201,0.22)]"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#0754C9] text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#43B8F2]" />
                <span>{product.badge}</span>
              </div>
            )}
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#0754C9] uppercase tracking-wider">
                {product.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#063B91] mt-1">
                {product.name}
              </h3>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                {product.tagline}
              </p>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>

            {/* Tasting Notes */}
            <div>
              <h4 className="text-xs font-bold text-[#063B91] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0754C9]" />
                <span>Tasting Notes & Textures</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.tastingNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#DDF5FF] text-[#0754C9] text-xs font-semibold"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Serving Suggestion */}
            {product.servingSuggestion && (
              <div className="p-3.5 rounded-2xl bg-[#f5fbff] border border-[#DDF5FF] flex items-start gap-3">
                <Utensils className="w-5 h-5 text-[#0754C9] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-[#063B91] block mb-0.5">
                    Artisan Serving Guide
                  </span>
                  {product.servingSuggestion}
                </div>
              </div>
            )}

            {/* Ingredient Notice */}
            <div className="flex items-center gap-2 text-[11px] text-slate-700 pt-2 border-t border-slate-100">
              <Info className="w-3.5 h-3.5 text-[#0754C9]" />
              <span>Contains whole dairy cream and tree nuts (pistachios, almonds, hazelnuts). No artificial flavorings.</span>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
