"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Sliders,
  MapPin,
  Film,
  Plus,
  ArrowRight,
  Edit2,
  Trash2,
  CheckCircle2,
  ImageIcon,
  FolderTree,
} from "lucide-react";
import { getMediaUrl } from "@/lib/media";

interface RecentProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  isAvailable: boolean;
  price?: string;
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

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 h-28 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="w-20 h-3 bg-slate-200 rounded" />
                <div className="w-8 h-8 rounded-lg bg-slate-100" />
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded" />
              <div className="w-32 h-2.5 bg-slate-100 rounded" />
            </div>
          ))}
        </div>

        {/* Skeleton Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-white border border-slate-200 h-64" />
          <div className="p-5 rounded-xl bg-white border border-slate-200 h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. COMPACT CMS SUMMARY CARDS (NO FAKE STATS)              */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Hero Slides */}
        <Link
          href="/admin/hero"
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0754C9] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Hero Slides
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0754C9] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {data?.totalHeroSlides ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{data?.activeHeroSlides ?? 0} active in hero</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0754C9]">
            <span>Manage Slides</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Products */}
        <Link
          href="/admin/products"
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0754C9] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Products
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0754C9] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {data?.totalProducts ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{data?.publishedProducts ?? data?.totalProducts ?? 0} active items</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0754C9]">
            <span>Manage Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        {/* Card 3: Outlets */}
        <Link
          href="/admin/outlets"
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0754C9] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Outlets
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {data?.totalOutlets ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{data?.existingOutlets ?? 0} Open • {data?.upcomingOutlets ?? 0} Upcoming</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0754C9]">
            <span>Manage Outlets</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        {/* Card 4: Instagram Reels */}
        <Link
          href="/admin/reels"
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0754C9] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Instagram Reels
            </span>
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#D12B9A] flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {data?.totalReels ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D12B9A]" />
              <span>{data?.activeReels ?? 0} active videos</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0754C9]">
            <span>Manage Reels</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* ========================================================= */}
      {/* 2. QUICK CMS ACTIONS                                      */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Link
          href="/admin/products?action=new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </Link>

        <Link
          href="/admin/hero"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span>Update Hero</span>
        </Link>

        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold transition-colors"
        >
          <FolderTree className="w-3.5 h-3.5 text-slate-500" />
          <span>Categories</span>
        </Link>

        <Link
          href="/admin/outlets"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>Add Outlet</span>
        </Link>

        <Link
          href="/admin/media"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold transition-colors"
        >
          <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>Media Library</span>
        </Link>
      </div>

      {/* ========================================================= */}
      {/* 3. RECENT CONTENT (TWO COLUMNS: PRODUCTS & HERO SLIDES)   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 1: RECENT PRODUCTS */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#0754C9]" />
                <h2 className="text-sm font-bold text-slate-900">Recent Products</h2>
              </div>
              <Link
                href="/admin/products"
                className="text-xs font-semibold text-[#0754C9] hover:underline flex items-center gap-1"
              >
                <span>View All ({data?.totalProducts ?? 0})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {(data?.recentProducts || []).length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No products found.
                </div>
              ) : (
                (data?.recentProducts || []).slice(0, 5).map((prod) => (
                  <div
                    key={prod.id}
                    className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 px-1 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                        <Image
                          src={getMediaUrl(prod.image)}
                          alt={prod.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {prod.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          prod.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {prod.isAvailable ? "Active" : "Inactive"}
                      </span>

                      <Link
                        href={`/admin/products`}
                        className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded text-slate-400 hover:text-[#0754C9] hover:bg-sky-50 transition-colors"
                        title="Edit product"
                        aria-label="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        disabled={deletingId === prod.id}
                        className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete product"
                        aria-label="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2">
            <Link
              href="/admin/products"
              className="w-full py-2 rounded-lg bg-slate-50 hover:bg-sky-50 text-[#0754C9] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Go to Products Table</span>
            </Link>
          </div>
        </div>

        {/* PANEL 2: RECENT HERO SLIDES */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0754C9]" />
                <h2 className="text-sm font-bold text-slate-900">Hero Section Slides</h2>
              </div>
              <Link
                href="/admin/hero"
                className="text-xs font-semibold text-[#0754C9] hover:underline flex items-center gap-1"
              >
                <span>View All ({data?.totalHeroSlides ?? 0})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {(data?.recentHeroSlides || []).length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No hero slides found.
                </div>
              ) : (
                (data?.recentHeroSlides || []).map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 px-1 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-14 h-9 rounded bg-slate-900 border border-slate-200 overflow-hidden shrink-0">
                        <Image
                          src={getMediaUrl(slide.image)}
                          alt={slide.title || "Hero Slide"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {slide.title || "Hero Slide"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Order: #{slide.order || idx + 1}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          slide.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {slide.isActive ? "Active" : "Inactive"}
                      </span>

                      <Link
                        href={`/admin/hero`}
                        className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded text-slate-400 hover:text-[#0754C9] hover:bg-sky-50 transition-colors"
                        title="Edit hero slide"
                        aria-label="Edit hero slide"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2">
            <Link
              href="/admin/hero"
              className="w-full py-2 rounded-lg bg-slate-50 hover:bg-sky-50 text-[#0754C9] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure Hero Section</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
