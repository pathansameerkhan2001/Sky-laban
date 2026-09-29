"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Receipt,
  MapPin,
  MessageSquare,
  TrendingUp,
  Plus,
  ExternalLink,
  Film,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  FolderTree,
  Award,
  Sliders,
  Sparkles,
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  publishedProducts?: number;
  totalCategories: number;
  totalOutlets: number;
  existingOutlets: number;
  upcomingOutlets: number;
  activeOutlets?: number;
  totalReels: number;
  heroSlides?: number;
  activeHeroSlides?: number;
  totalFounders?: number;
  totalEnquiries: number;
  newEnquiries: number;
  totalOrders: number;
  pendingOrders: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    status: string;
    createdAt: string;
    items: { productName: string; quantity: number }[];
  }[];
  recentEnquiries: {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    type: string;
    status: string;
    createdAt: string;
  }[];
  recentlyUpdatedProducts: {
    id: string;
    name: string;
    category: string;
    image: string;
    badge?: string;
  }[];
  lastUpdated: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed fetching stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#0754C9] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading Dashboard Metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#063B91] via-[#0645B8] to-[#0754C9] p-6 sm:p-8 text-white shadow-[0_15px_35px_rgba(6,59,145,0.18)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#DDF5FF] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span>Welcome to Sky Laban Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Overview &amp; Real-Time Operations
          </h1>
          <p className="text-sm text-white/80 mt-1.5 leading-relaxed">
            Monitor catalogue items, retail branch networks, hero slides, Instagram reels, and leadership profiles.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#063B91] hover:bg-[#DDF5FF] font-bold text-xs shadow-md transition-colors"
          >
            <Plus className="w-4 h-4 text-[#0754C9]" />
            <span>New Product</span>
          </Link>
          <Link
            href="/admin/hero"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs backdrop-blur-sm transition-colors"
          >
            <Sliders className="w-4 h-4 text-[#43B8F2]" />
            <span>Hero Slides</span>
          </Link>
        </div>
      </div>

      {/* 6 Content Management Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Metric 1: Total Products & Published Products */}
        <div className="p-5 rounded-2xl bg-white border border-[#E0EDFA] shadow-[0_6px_20px_rgba(7,84,201,0.04)] hover:shadow-[0_10px_25px_rgba(7,84,201,0.08)] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#EBF6FF] text-[#0754C9] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#063B91]">{stats?.totalProducts ?? 0}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center justify-between">
              <span className="text-emerald-700 font-bold">{stats?.publishedProducts ?? stats?.totalProducts ?? 0} published online</span>
              <Link href="/admin/products" className="text-[#0754C9] hover:underline flex items-center gap-0.5">
                Manage &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Metric 2: Categories */}
        <div className="p-5 rounded-2xl bg-white border border-[#E0EDFA] shadow-[0_6px_20px_rgba(7,84,201,0.04)] hover:shadow-[0_10px_25px_rgba(7,84,201,0.08)] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dessert Categories
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#EBF6FF] text-[#0754C9] flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#063B91]">{stats?.totalCategories ?? 0}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center justify-between">
              <span>Salankatia, Gulstha &amp; more</span>
              <Link href="/admin/categories" className="text-[#0754C9] hover:underline flex items-center gap-0.5">
                View &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Metric 3: Hero Slides */}
        <div className="p-5 rounded-2xl bg-white border border-[#E0EDFA] shadow-[0_6px_20px_rgba(7,84,201,0.04)] hover:shadow-[0_10px_25px_rgba(7,84,201,0.08)] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Hero Slides
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0754C9] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#063B91]">{stats?.heroSlides ?? 3}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center justify-between">
              <span className="text-[#0754C9] font-bold">{stats?.activeHeroSlides ?? 3} active slides</span>
              <Link href="/admin/hero" className="text-[#0754C9] hover:underline flex items-center gap-0.5">
                Slides &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Metric 4: Instagram Reels */}
        <div className="p-5 rounded-2xl bg-white border border-[#E0EDFA] shadow-[0_6px_20px_rgba(7,84,201,0.04)] hover:shadow-[0_10px_25px_rgba(7,84,201,0.08)] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Instagram Reels
            </span>
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#063B91]">{stats?.totalReels ?? 8}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center justify-between">
              <span>Moments of Pure Delight</span>
              <Link href="/admin/reels" className="text-[#0754C9] hover:underline flex items-center gap-0.5">
                Reels &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Metric 5: Active Outlets */}
        <div className="p-5 rounded-2xl bg-white border border-[#E0EDFA] shadow-[0_6px_20px_rgba(7,84,201,0.04)] hover:shadow-[0_10px_25px_rgba(7,84,201,0.08)] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Outlets
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#063B91]">{stats?.existingOutlets ?? 15}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center justify-between">
              <span className="text-emerald-700 font-bold">15 Open (Shaikpet First)</span>
              <Link href="/admin/outlets" className="text-[#0754C9] hover:underline flex items-center gap-0.5">
                Map &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Metric 6: Founders Profiles */}
        <div className="p-5 rounded-2xl bg-white border border-[#E0EDFA] shadow-[0_6px_20px_rgba(7,84,201,0.04)] hover:shadow-[0_10px_25px_rgba(7,84,201,0.08)] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Founders Profiles
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#063B91]">{stats?.totalFounders ?? 2}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center justify-between">
              <span className="text-slate-600">B. Akram &amp; B. Aslam Ali Khan</span>
              <Link href="/admin/founders" className="text-[#0754C9] hover:underline flex items-center gap-0.5">
                Profiles &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0754C9]" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quick Actions
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/hero"
            className="px-3.5 py-1.5 rounded-lg bg-[#EBF5FE] text-[#0754C9] hover:bg-[#DDF0FE] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Hero Slides</span>
          </Link>
          <Link
            href="/admin/categories"
            className="px-3.5 py-1.5 rounded-lg bg-[#EBF5FE] text-[#0754C9] hover:bg-[#DDF0FE] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Categories</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-3.5 py-1.5 rounded-lg bg-[#EBF5FE] text-[#0754C9] hover:bg-[#DDF0FE] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Products</span>
          </Link>
          <Link
            href="/admin/founders"
            className="px-3.5 py-1.5 rounded-lg bg-[#EBF5FE] text-[#0754C9] hover:bg-[#DDF0FE] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Founders</span>
          </Link>
          <Link
            href="/admin/reels"
            className="px-3.5 py-1.5 rounded-lg bg-[#EBF5FE] text-[#0754C9] hover:bg-[#DDF0FE] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Instagram Reels</span>
          </Link>
          <Link
            href="/admin/website-content"
            className="px-3.5 py-1.5 rounded-lg bg-[#EBF5FE] text-[#0754C9] hover:bg-[#DDF0FE] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Our Story &amp; Content</span>
          </Link>
        </div>
      </div>

      {/* Two-Column Grid: Retail Branch Network & Customer Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Retail Branch Network */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-[#E0EDFA] flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0754C9]" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Retail Branch Network (15 Outlets)
              </h2>
            </div>
            <Link
              href="/admin/outlets"
              className="text-xs font-bold text-[#0754C9] hover:underline"
            >
              View Map ({stats?.totalOutlets ?? 15})
            </Link>
          </div>

          <div className="p-4 space-y-3 flex-1">
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#EBF5FE] to-[#F5FAFF] border border-[#DDF5FF] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0754C9]">
                  Flagship First Store
                </span>
                <p className="text-sm font-extrabold text-[#063B91]">Shaikpet Flagship Store</p>
                <p className="text-xs text-slate-600">Opened April 2026 &bull; Hyderabad, Telangana</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Alhamdulillah
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs text-slate-700">
              <span className="font-semibold">Current Active Outlets</span>
              <span className="font-black text-[#063B91]">{stats?.existingOutlets ?? 15} Open Stores</span>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Kondapur, Madhapur, Tolichowki, Jubilee Hills, Banjara Hills...</span>
              <Link href="/admin/outlets" className="text-[#0754C9] font-bold hover:underline shrink-0">
                Manage All &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Franchise & Customer Enquiries */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-[#E0EDFA] flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0754C9]" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Customer Enquiries
              </h2>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-[#0754C9] hover:underline"
            >
              View All ({stats?.totalEnquiries ?? 0})
            </Link>
          </div>

          <div className="p-4 divide-y divide-slate-100 flex-1">
            {stats?.recentEnquiries?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No enquiries received yet.</p>
            ) : (
              stats?.recentEnquiries?.map((enq) => (
                <div key={enq.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800">{enq.name}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-[#EBF5FE] text-[#0754C9]">
                        {enq.type}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          enq.status === "new"
                            ? "bg-amber-100 text-amber-800 font-bold"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {enq.city} &bull; {enq.phone}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Featured / Recently Updated Products Gallery */}
      <div className="rounded-2xl bg-white border border-[#E0EDFA] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#0754C9]" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Featured Hero Products
            </h2>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-[#0754C9] hover:underline"
          >
            All Products &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {stats?.recentlyUpdatedProducts?.map((prod) => (
            <div
              key={prod.id}
              className="p-2.5 rounded-xl border border-slate-100 bg-[#FAFDFE] hover:border-[#0754C9]/30 transition-all text-center flex flex-col items-center"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white mb-2 flex items-center justify-center p-1">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-[#0754C9] uppercase">{prod.category}</span>
              <h3 className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">{prod.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
