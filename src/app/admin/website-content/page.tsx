"use client";

import React, { useState, useEffect } from "react";
import { FileText, Save, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import { WebsiteContent } from "@/lib/db";

export default function AdminWebsiteContentPage() {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/website-content");
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/website-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (res.ok) {
        setSuccessMsg("Website content updated successfully! Public pages reflect changes.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        throw new Error("Failed to save content");
      }
    } catch (err) {
      setErrorMsg("Failed to update website content. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return <div className="py-16 text-center text-xs text-slate-400">Loading website content...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#063B91] tracking-tight">Website Content Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Update the animated marquee bar, headline copy, announcement bar, Instagram profile link, and section toggles.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-bold shadow-md shadow-[#0754C9]/20 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save All Changes"}</span>
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Marquee Headline Animation */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#063B91] uppercase tracking-wider">
                Continuous Marquee Strip Text
              </h2>
              <p className="text-[11px] text-slate-500">
                Text repeated smoothly across the horizontal loop directly under the Hero slider.
              </p>
            </div>
            <Eye className="w-4 h-4 text-[#0754C9]" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Marquee Loop Phrase</label>
            <input
              type="text"
              value={content.marqueeText}
              onChange={(e) => setContent({ ...content, marqueeText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0754C9] text-xs font-mono text-slate-800 outline-none"
            />
          </div>
        </div>

        {/* Card 2: Instagram Reels Section Copy */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#063B91] uppercase tracking-wider">
              Instagram Reels Header &amp; Profile Link
            </h2>
            <p className="text-[11px] text-slate-500">
              The heading, supporting text, and official Instagram account URL.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Heading</label>
              <input
                type="text"
                value={content.reelsHeading || "Moments of Pure Delight"}
                onChange={(e) => setContent({ ...content, reelsHeading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Instagram URL</label>
              <input
                type="text"
                value={content.instagramProfileUrl}
                onChange={(e) => setContent({ ...content, instagramProfileUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Supporting Text</label>
            <textarea
              rows={2}
              value={content.reelsSubtext || ""}
              onChange={(e) => setContent({ ...content, reelsSubtext: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
            />
          </div>
        </div>

        {/* Card 3: Top Announcement Bar Badges & Contact */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#063B91] uppercase tracking-wider">
              Top Bar Badges &amp; Contact Details
            </h2>
            <p className="text-[11px] text-slate-500">
              Information shown in the dark blue top header strip.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge 1</label>
              <input
                type="text"
                value={content.announcementText1}
                onChange={(e) => setContent({ ...content, announcementText1: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge 2</label>
              <input
                type="text"
                value={content.announcementText2}
                onChange={(e) => setContent({ ...content, announcementText2: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge 3</label>
              <input
                type="text"
                value={content.announcementText3}
                onChange={(e) => setContent({ ...content, announcementText3: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Care Phone</label>
              <input
                type="text"
                value={content.contactPhone}
                onChange={(e) => setContent({ ...content, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Inquiries Email</label>
              <input
                type="email"
                value={content.contactEmail}
                onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Franchise Section Copy */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#063B91] uppercase tracking-wider">
              Franchise Opportunities Section
            </h2>
            <p className="text-[11px] text-slate-500">
              Headline and subtext for the franchise banner.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Franchise Headline</label>
            <input
              type="text"
              value={content.franchiseHeadline}
              onChange={(e) => setContent({ ...content, franchiseHeadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Franchise Subheadline</label>
            <textarea
              rows={2}
              value={content.franchiseSubheadline}
              onChange={(e) => setContent({ ...content, franchiseSubheadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
            />
          </div>
        </div>

        {/* Card 5: Section Visibility Toggles */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#063B91] uppercase tracking-wider">
              Homepage Section Visibility Toggles
            </h2>
            <p className="text-[11px] text-slate-500">
              Show or hide entire modules on the public homepage.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(content.sectionVisibility || {}).map(([key, val]) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={val}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      sectionVisibility: {
                        ...content.sectionVisibility,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-[#0754C9] rounded"
                />
                <span className="text-xs font-bold text-slate-700 capitalize">{key} Section</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-bold shadow-md shadow-[#0754C9]/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {saving ? "Saving Changes..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
