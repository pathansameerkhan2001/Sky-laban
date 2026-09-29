"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Receipt,
  MapPin,
  Film,
  FileText,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Award,
  Sliders,
  Sparkles,
} from "lucide-react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero Slides", icon: Sliders },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/founders", label: "Founders", icon: Award },
  { href: "/admin/reels", label: "Instagram Reels", icon: Film },
  { href: "/admin/outlets", label: "Outlets & Map", icon: MapPin },
  { href: "/admin/website-content", label: "Our Story & Content", icon: FileText },
  { href: "/admin/enquiries", label: "Customer Enquiries", icon: MessageSquare },
  { href: "/admin/users", label: "Admin Users", icon: Users },
  { href: "/admin/settings", label: "Brand Settings", icon: Settings },
];

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // If on login page, render children directly without admin shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Verify session
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
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F8FF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0754C9] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-[#0754C9]">Loading Sky Laban Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F9FD] flex flex-col lg:flex-row text-slate-800 antialiased">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-[#E0EDFA] shadow-[2px_0_15px_rgba(7,84,201,0.03)] shrink-0 h-screen sticky top-0 z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#E0EDFA] flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="relative w-28 h-10">
              <Image
                src="/images/sky_laban_logo_transparent.png"
                alt="Sky Laban Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#0754C9]/10 text-[#0754C9] text-[10px] font-extrabold tracking-wider uppercase">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 scrollbar-thin">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Main Management
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#0754C9] text-white shadow-md shadow-[#0754C9]/20"
                    : "text-slate-600 hover:text-[#0754C9] hover:bg-[#EBF5FE]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#0754C9]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-[#E0EDFA] bg-gradient-to-b from-white to-[#F8FCFF]">
          <div className="flex items-center justify-between gap-3 mb-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#063B91] to-[#43B8F2] flex items-center justify-center text-white font-bold text-xs shrink-0">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name || "Admin"}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.role || "Super Admin"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#EBF5FE] hover:bg-[#DDF0FE] text-[#0754C9] text-xs font-bold transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="lg:hidden bg-white border-b border-[#E0EDFA] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="relative w-24 h-8">
            <Image
              src="/images/sky_laban_logo_transparent.png"
              alt="Sky Laban"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl text-[#0754C9] hover:bg-[#EBF5FE]"
            title="View Live Site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col p-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-extrabold text-[#063B91] text-base">Sky Laban Admin</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                      isActive ? "bg-[#0754C9] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-sm font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar on Desktop */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E0EDFA]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#43B8F2]" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sky Laban Digital Management Engine
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-800 block">{user?.name}</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Live Database Active
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
