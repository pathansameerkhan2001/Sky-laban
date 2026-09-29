"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Sliders,
  MapPin,
  Film,
  FileText,
  Image as ImageIcon,
  Plus,
  ArrowRight,
  Sparkles,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FolderTree,
} from "lucide-react";
import { getMediaUrl } from "@/lib/media";

interface RecentProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  isAvailable: boolean;
  price: string;
}

interface RecentHeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  isActive: boolean;
}

interface DashboardData {
  totalProducts: number;
  publishedProducts: number;
  totalHeroSlides: number;
  activeHeroSlides: number;
  totalOutlets: number;
  existingOutlets: number;
  upcomingOutlets: number;
  totalReels: number;
  activeReels: number;
  recentProducts: RecentProduct[];
  recentHeroSlides: RecentHeroSlide[];
  lastUpdated: string;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Delete product action with confirmation
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`Product "${name}" deleted.`);
        fetchDashboardData();
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product.");
    } finally {
      setDeletingId(null);
    }
  };

  // Delete hero slide action with confirmation
  const handleDeleteSlide = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete slide "${title}"?`)) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/hero?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`Hero slide "${title}" deleted.`);
        fetchDashboardData();
      } else {
        alert("Failed to delete slide.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting hero slide.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-[#0754C9] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-[#063B91]">Loading live dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#063B91] text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-[#43B8F2]/30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#43B8F2]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= 1. LARGE PREMIUM WELCOME BANNER ================= */}
      {/* Light sky-blue gradient background matching reference design */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#DDF5FF] via-[#E8F7FF] to-[#D0EEFE] border border-[#BBE3FC] p-6 sm:p-8 lg:p-10 shadow-[0_12px_36px_rgba(7,84,201,0.08)]">
        {/* Decorative soft cloud ambient glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-white/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#43B8F2]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#C5E8FC] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0754C9]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0754C9]">
                Sky Laban Master Portal
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#063B91] tracking-tight leading-tight">
              Pure Tradition in Every Sip
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Welcome to the Sky Laban administration suite. Easily update homepage hero slides, introduce new signature desserts, synchronize store locator branches, and publish Instagram moments for dessert lovers across South India.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/admin/hero"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0754C9]/25 hover:shadow-lg transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-white" />
                <span>Edit Hero Section</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/90 hover:bg-white text-[#0754C9] hover:text-[#063B91] border border-[#BBE3FC] text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Manage Products</span>
              </Link>
            </div>
          </div>

          {/* Right Product Imagery Column */}
          <div className="lg:col-span-5 xl:col-span-4 relative flex items-center justify-center">
            <div className="relative w-64 sm:w-72 md:w-80 h-48 sm:h-56 flex items-center justify-center">
              {/* Product Tub / Dessert Image */}
              <div className="relative w-48 sm:w-56 h-40 sm:h-48 drop-shadow-[0_16px_30px_rgba(7,84,201,0.22)] z-10 transition-transform hover:scale-105 duration-300">
                <Image
                  src={getMediaUrl("/images/sky_laban_salankatia_tub.png")}
                  alt="Sky Laban Salankatia Signature Tub"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Floating Pistachio Accent */}
              <div className="absolute top-2 right-2 w-10 h-10 drop-shadow-md animate-bounce duration-1000 hidden sm:block">
                <Image
                  src={getMediaUrl("/images/pistachio_float_1.png")}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>

              {/* Floating Almond Accent */}
              <div className="absolute bottom-4 left-2 w-8 h-8 drop-shadow-md hidden sm:block">
                <Image
                  src={getMediaUrl("/images/almond_float_1.png")}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. FOUR STATISTICS CARDS ================= */}
      {/* Live database counts with distinct subtle backgrounds and navigation buttons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#063B91] tracking-tight">
              Live Content Overview
            </h3>
            <p className="text-xs text-slate-500">Real-time counts fetched directly from database tables.</p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Updated: {new Date(data?.lastUpdated || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Total Products */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDF5FF] shadow-[0_6px_20px_rgba(7,84,201,0.04)] hover:shadow-[0_12px_28px_rgba(7,84,201,0.09)] transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Products
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#EBF6FF] text-[#0754C9] flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-black text-[#063B91] tracking-tight">
                {data?.totalProducts ?? 0}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{data?.publishedProducts ?? data?.totalProducts ?? 0} published online</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-between w-full text-xs font-bold text-[#0754C9] hover:text-[#063B91] transition-colors"
              >
                <span>Manage Products</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Card 2: Hero Slides */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDF5FF] shadow-[0_6px_20px_rgba(7,84,201,0.04)] hover:shadow-[0_12px_28px_rgba(7,84,201,0.09)] transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hero Slides
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#E6F7FF] text-[#0091FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sliders className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-black text-[#063B91] tracking-tight">
                {data?.totalHeroSlides ?? 0}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0091FF]" />
                <span>{data?.activeHeroSlides ?? data?.totalHeroSlides ?? 0} active slides in hero</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                href="/admin/hero"
                className="inline-flex items-center justify-between w-full text-xs font-bold text-[#0754C9] hover:text-[#063B91] transition-colors"
              >
                <span>Manage Hero Slides</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Card 3: Outlets */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDF5FF] shadow-[0_6px_20px_rgba(7,84,201,0.04)] hover:shadow-[0_12px_28px_rgba(7,84,201,0.09)] transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Retail Outlets
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#E8FAF0] text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-black text-[#063B91] tracking-tight">
                {data?.totalOutlets ?? 0}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{data?.existingOutlets ?? 15} Open • {data?.upcomingOutlets ?? 15} Upcoming</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                href="/admin/outlets"
                className="inline-flex items-center justify-between w-full text-xs font-bold text-[#0754C9] hover:text-[#063B91] transition-colors"
              >
                <span>Manage Outlets</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Card 4: Instagram Reels */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDF5FF] shadow-[0_6px_20px_rgba(7,84,201,0.04)] hover:shadow-[0_12px_28px_rgba(7,84,201,0.09)] transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Instagram Reels
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#FDEEFA] text-[#D12B9A] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Film className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-black text-[#063B91] tracking-tight">
                {data?.totalReels ?? 0}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D12B9A]" />
                <span>{data?.activeReels ?? data?.totalReels ?? 0} active video moments</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                href="/admin/reels"
                className="inline-flex items-center justify-between w-full text-xs font-bold text-[#0754C9] hover:text-[#063B91] transition-colors"
              >
                <span>Manage Reels</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. SIX QUICK ACTION CARDS ================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#063B91] tracking-tight">
              Quick Actions
            </h3>
            <p className="text-xs text-slate-500">Jump directly into primary content editing workflows.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Action 1: Add Product */}
          <Link
            href="/admin/products"
            className="p-4 rounded-2xl bg-white border border-[#DDF5FF] hover:border-[#0754C9] shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#EBF6FF] text-[#0754C9] group-hover:bg-[#0754C9] group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#0754C9] transition-colors">
              Add Product
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Catalogue</span>
          </Link>

          {/* Action 2: Update Hero */}
          <Link
            href="/admin/hero"
            className="p-4 rounded-2xl bg-white border border-[#DDF5FF] hover:border-[#0754C9] shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#E6F7FF] text-[#0091FF] group-hover:bg-[#0091FF] group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
              <Sliders className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#0754C9] transition-colors">
              Update Hero
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Slides</span>
          </Link>

          {/* Action 3: Add Outlet */}
          <Link
            href="/admin/outlets"
            className="p-4 rounded-2xl bg-white border border-[#DDF5FF] hover:border-[#0754C9] shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#E8FAF0] text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#0754C9] transition-colors">
              Add Outlet
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Locations</span>
          </Link>

          {/* Action 4: Add Reel */}
          <Link
            href="/admin/reels"
            className="p-4 rounded-2xl bg-white border border-[#DDF5FF] hover:border-[#0754C9] shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FDEEFA] text-[#D12B9A] group-hover:bg-[#D12B9A] group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#0754C9] transition-colors">
              Add Reel
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Instagram</span>
          </Link>

          {/* Action 5: Edit Content */}
          <Link
            href="/admin/website-content"
            className="p-4 rounded-2xl bg-white border border-[#DDF5FF] hover:border-[#0754C9] shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#0754C9] transition-colors">
              Edit Content
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Copy &amp; Story</span>
          </Link>

          {/* Action 6: Media Library */}
          <Link
            href="/admin/media"
            className="p-4 rounded-2xl bg-white border border-[#DDF5FF] hover:border-[#0754C9] shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#0754C9] transition-colors">
              Media Library
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Bucket Storage</span>
          </Link>
        </div>
      </div>

      {/* ================= 4. RECENT CONTENT (TWO BOTTOM PANELS) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* PANEL 1: RECENT PRODUCTS */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#DDF5FF] shadow-[0_8px_25px_rgba(7,84,201,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#0754C9]" />
                <h4 className="text-sm sm:text-base font-extrabold text-[#063B91]">
                  Recent Products
                </h4>
              </div>
              <Link
                href="/admin/products"
                className="text-xs font-bold text-[#0754C9] hover:text-[#063B91] flex items-center gap-1 transition-colors"
              >
                <span>View All ({data?.totalProducts ?? 0})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Products List */}
            <div className="divide-y divide-slate-100">
              {(data?.recentProducts || []).length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No products recorded in database.
                </div>
              ) : (
                (data?.recentProducts || []).map((prod) => (
                  <div
                    key={prod.id}
                    className="py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/60 overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <Image
                          src={getMediaUrl(prod.image)}
                          alt={prod.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0 truncate">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-[#0754C9] font-medium truncate">
                          {prod.category} • <span className="text-slate-400">{prod.price}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Active/Inactive Status Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {prod.isAvailable ? "Active" : "Inactive"}
                      </span>

                      {/* Edit Button */}
                      <Link
                        href={`/admin/products`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#0754C9] hover:bg-[#EBF5FE] transition-colors"
                        title="Edit in Products"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        disabled={deletingId === prod.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-2">
            <Link
              href="/admin/products"
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#EBF5FE] text-[#0754C9] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Manage All Products</span>
            </Link>
          </div>
        </div>

        {/* PANEL 2: RECENT HERO SLIDES */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#DDF5FF] shadow-[0_8px_25px_rgba(7,84,201,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0754C9]" />
                <h4 className="text-sm sm:text-base font-extrabold text-[#063B91]">
                  Recent Hero Slides
                </h4>
              </div>
              <Link
                href="/admin/hero"
                className="text-xs font-bold text-[#0754C9] hover:text-[#063B91] flex items-center gap-1 transition-colors"
              >
                <span>View All ({data?.totalHeroSlides ?? 0})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Slides List */}
            <div className="divide-y divide-slate-100">
              {(data?.recentHeroSlides || []).length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No hero slides configured.
                </div>
              ) : (
                (data?.recentHeroSlides || []).map((slide) => (
                  <div
                    key={slide.id}
                    className="py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-16 h-10 rounded-xl bg-slate-100 border border-slate-200/60 overflow-hidden shrink-0">
                        <Image
                          src={getMediaUrl(slide.image)}
                          alt={slide.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 truncate">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {slide.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          Order #{slide.order} {slide.subtitle ? `• ${slide.subtitle}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Active/Inactive Status Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          slide.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {slide.isActive ? "Active" : "Inactive"}
                      </span>

                      {/* Edit Button */}
                      <Link
                        href="/admin/hero"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#0754C9] hover:bg-[#EBF5FE] transition-colors"
                        title="Edit in Hero Slides"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteSlide(slide.id, slide.title)}
                        disabled={deletingId === slide.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-2">
            <Link
              href="/admin/hero"
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#EBF5FE] text-[#0754C9] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Reorder Hero Slides</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
