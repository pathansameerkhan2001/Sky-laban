"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  User,
  LogOut,
  KeyRound,
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
        setSuccessMsg("Brand settings saved successfully.");
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
    return (
      <div className="space-y-4 animate-pulse max-w-4xl">
        <div className="h-16 bg-slate-100 rounded-xl" />
        <div className="h-40 bg-slate-100 rounded-xl" />
        <div className="h-48 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl pb-12">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure admin account, contact info, and site metadata.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Admin Profile Information */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#0754C9]" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Admin Profile &amp; Session
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active Session
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0754C9] text-white font-bold text-sm flex items-center justify-center shrink-0">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">{user?.name || "Administrator"}</p>
              <p className="text-[11px] text-slate-500 font-mono">{user?.email || "brandnix.in@gmail.com"}</p>
              <p className="text-[10px] text-[#0754C9] font-medium">Role: {user?.role || "Authorized Admin"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Security Policy Info */}
        <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-100 text-slate-600 text-xs flex items-start gap-2.5 leading-relaxed">
          <KeyRound className="w-4 h-4 text-[#0754C9] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900 block">Security &amp; Authorization</span>
            <span>
              Authentication is securely managed through Supabase Auth using <code className="text-[#0754C9] font-mono">public.admin_users</code>. Authorized email: <code className="text-[#0754C9] font-mono">brandnix.in@gmail.com</code>.
            </span>
          </div>
        </div>
      </div>

      {/* Brand & SEO Configuration */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Brand Identity &amp; SEO
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.brandName || ""}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline || ""}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Meta Title</label>
            <input
              type="text"
              value={settings.metaTitle || ""}
              onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Meta Description</label>
            <textarea
              rows={2}
              value={settings.metaDescription || ""}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Social Media Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={settings.instagramUrl || ""}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={settings.facebookUrl || ""}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">YouTube URL</label>
              <input
                type="text"
                value={settings.youtubeUrl || ""}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Contact &amp; Store Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.contactPhone || ""}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={settings.contactEmail || ""}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Opening Hours</label>
            <input
              type="text"
              value={settings.openingHours || ""}
              onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0754C9]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
