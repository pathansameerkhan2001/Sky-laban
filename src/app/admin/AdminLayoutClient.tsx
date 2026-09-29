"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Sliders,
  ShoppingBag,
  MapPin,
  Film,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  User,
} from "lucide-react";
import { getMediaUrl } from "@/lib/media";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

// Exactly the 8 required sidebar navigation items from user specification
const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero Section", icon: Sliders },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/outlets", label: "Outlets", icon: MapPin },
  { href: "/admin/reels", label: "Instagram Reels", icon: Film },
  { href: "/admin/website-content", label: "Website Content", icon: FileText },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // If on login page, render children directly without admin shell
  const isLoginPage = pathname === "/admin/login";

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Verify authenticated session via API
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
        setLoading(false);
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
      router.push("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#041633] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#43B8F2] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-white/90">Loading Sky Laban Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F9FD] flex text-slate-800 antialiased font-sans">
      {/* ================= FIXED DARK NAVY-BLUE SIDEBAR (DESKTOP) ================= */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-col bg-[#041633] text-white shrink-0 h-screen sticky top-0 z-40 border-r border-[#0A2756] shadow-xl">
        {/* Brand Header */}
        <div className="p-6 pb-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-32 h-10 transition-transform group-hover:scale-102">
              <Image
                src={getMediaUrl("/images/sky_laban_logo_transparent.png")}
                alt="Sky Laban Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#43B8F2]/20 text-[#43B8F2] text-[10px] font-extrabold tracking-wider uppercase border border-[#43B8F2]/30">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation Items (Exactly 8 Items) */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-6 space-y-1.5 scrollbar-thin">
          <div className="px-3 pb-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Content Management
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#0754C9] text-white shadow-lg shadow-[#0754C9]/40 font-bold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-[#43B8F2]" : "text-white/50 group-hover:text-white"
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#43B8F2]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: Logout Action Button + Live Website Link */}
        <div className="p-4 border-t border-white/10 bg-[#031126]/60 space-y-2">
          {/* Logout Action (Item #9) */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-300 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 transition-all cursor-pointer group"
          >
            <span className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-rose-400 group-hover:text-rose-200" />
              <span>Logout</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400/80">Exit</span>
          </button>

          {/* External Live Site Link */}
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#43B8F2]" />
          </Link>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ================= TOP HEADER ================= */}
        <header className="bg-white border-b border-[#E0EDFA] px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-30 shadow-xs flex items-center justify-between gap-4">
          {/* Mobile Menu Button + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Header Titles */}
            <div>
              <h1 className="text-lg sm:text-xl font-black text-[#063B91] tracking-tight flex items-center gap-2">
                <span>Welcome Back!</span>
                <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-500" />
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Manage your Sky Laban website content, products, outlets and more.
              </p>
            </div>
          </div>

          {/* Right Header: Notification + Profile Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notification Bell */}
            <button
              className="relative p-2 rounded-xl text-slate-500 hover:text-[#0754C9] hover:bg-[#EBF5FE] transition-colors cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0754C9] ring-2 ring-white" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-slate-50 border border-slate-200/80 transition-all cursor-pointer"
                aria-label="Admin Profile Menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#063B91] to-[#43B8F2] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="hidden md:block text-left pr-1">
                  <p className="text-xs font-bold text-[#063B91] leading-tight truncate max-w-[130px]">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[130px]">
                    {user?.email || "admin@skylaban.com"}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Menu Dropdown Card */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#DDF5FF] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "Admin"}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email || "admin@skylaban.com"}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#EBF5FE] text-[#0754C9] text-[9px] font-extrabold uppercase">
                      {user?.role || "Authorized Admin"}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/admin/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#EBF5FE] hover:text-[#0754C9] transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Account Settings</span>
                    </Link>

                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#EBF5FE] hover:text-[#0754C9] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Live Website</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT VIEWPORT ================= */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* ================= MOBILE NAVIGATION DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-72 bg-[#041633] text-white h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="relative w-28 h-9">
                <Image
                  src={getMediaUrl("/images/sky_laban_logo_transparent.png")}
                  alt="Sky Laban"
                  fill
                  className="object-contain"
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-[#0754C9] text-white font-bold"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Clickable Backdrop to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </div>
  );
}
