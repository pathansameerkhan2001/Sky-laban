"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, AlertCircle, RefreshCw, ShieldAlert } from "lucide-react";
import { SystemSettings } from "@/lib/db";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

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
    return <div className="py-16 text-center text-xs text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#063B91] tracking-tight">System &amp; Brand Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure site metadata, brand identity, social links, and store operational flags.
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

      <form onSubmit={handleSave} className="space-y-5">
        {/* Brand Information */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs space-y-4">
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
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs space-y-4">
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

        {/* Operational Status */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#063B91] uppercase tracking-wider">
              Store Operations
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableOrdering}
                onChange={(e) => setSettings({ ...settings, enableOrdering: e.target.checked })}
                className="w-4 h-4 text-[#0754C9] rounded"
              />
              <div>
                <span className="font-bold text-xs text-slate-800 block">Accept Online Pick-Up Inquiries</span>
                <span className="text-[11px] text-slate-400">Allows website visitors to request pick-up orders from closest branch.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-4 h-4 text-[#0754C9] rounded"
              />
              <div>
                <span className="font-bold text-xs text-slate-800 block">Maintenance Notice Mode</span>
                <span className="text-[11px] text-slate-400">Shows a polite maintenance banner on public pages during seasonal updates.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-bold shadow-md shadow-[#0754C9]/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
