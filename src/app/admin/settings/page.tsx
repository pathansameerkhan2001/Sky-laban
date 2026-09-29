"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  LogOut,
  Lock,
  KeyRound,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SystemSettings } from "@/lib/db";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchSettingsAndUser = async () => {
    try {
      setLoading(true);
      const [settingsRes, userRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/auth/me"),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data);
      }
      if (userRes.ok) {
        const uData = await userRes.json();
        if (uData?.authenticated) {
          setUser(uData.user);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccessMsg("Brand settings saved successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        throw new Error("Failed to save settings");
      }
    } catch {
      setErrorMsg("Failed to update settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="py-24 text-center text-xs text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#063B91] tracking-tight">Admin &amp; Website Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your admin profile, contact information, social links, and site configuration.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-bold shadow-md shadow-[#0754C9]/20 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ================= 1. ADMIN PROFILE INFORMATION ================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#DDF5FF] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#0754C9]" />
            <h2 className="text-sm font-bold text-[#063B91] uppercase tracking-wider">
              Signed-in Admin Profile
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
            Active Session
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F8FCFF] border border-[#DDF5FF]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#063B91] to-[#43B8F2] text-white font-black text-lg flex items-center justify-center shadow-md">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{user?.name || "Administrator"}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email || "admin@skylaban.com"}</p>
              <p className="text-[10px] font-semibold text-[#0754C9] mt-0.5">Role: {user?.role || "Authorized Admin"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Security / Password Note */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3 leading-relaxed">
          <KeyRound className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-amber-950">Password &amp; Security Policy</span>
            <span>
              For maximum security, passwords are encrypted and managed directly through Supabase Authentication. To update your password, use the Supabase Dashboard under <strong>Authentication &rarr; Users</strong> or initiate a password reset link. No insecure plaintext passwords are stored in code or databases.
            </span>
          </div>
        </div>
      </div>

      {/* ================= 2. BRAND & SEO CONFIGURATION ================= */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#DDF5FF] shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#063B91] uppercase tracking-wider">
              Brand Identity &amp; SEO
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Meta Title</label>
            <input
              type="text"
              value={settings.metaTitle}
              onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Meta Description</label>
            <textarea
              rows={2}
              value={settings.metaDescription}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#DDF5FF] shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#063B91] uppercase tracking-wider">
              Social Media Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">YouTube URL</label>
              <input
                type="text"
                value={settings.youtubeUrl}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#DDF5FF] shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#063B91] uppercase tracking-wider">
              Contact &amp; Store Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.contactPhone || ""}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={settings.contactEmail || ""}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Opening Hours</label>
            <input
              type="text"
              value={settings.openingHours || ""}
              onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-bold shadow-md shadow-[#0754C9]/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {saving ? "Saving Changes..." : "Save All Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
