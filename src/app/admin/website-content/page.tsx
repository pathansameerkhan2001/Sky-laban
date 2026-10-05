"use client";

import React, { useState, useEffect } from "react";
import { FileText, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { WebsiteContent } from "@/lib/db";

export default function AdminWebsiteContentPage() {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchContent = async () => {
    try {
      setLoading(true);
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
        setSuccessMsg("Website content updated successfully.");
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
    return (
      <div className="space-y-4 animate-pulse max-w-4xl">
        <div className="h-16 bg-slate-100 rounded-xl" />
        <div className="h-48 bg-slate-100 rounded-xl" />
        <div className="h-48 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl pb-12">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Site Content</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage core brand copy, marquee ticker, and contact information.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
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

      <form onSubmit={handleSave} className="space-y-4">
        {/* Card 1: Marquee Headline Animation */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Continuous Marquee Headline Loop
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Horizontal ticker text repeated smoothly below the Hero carousel.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Marquee Loop Text
            </label>
            <input
              type="text"
              value={content.marqueeText || ""}
              onChange={(e) => setContent({ ...content, marqueeText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#0754C9] text-xs font-mono text-slate-800 outline-none"
            />
          </div>
        </div>

        {/* Card 2: Instagram Reels Section Copy */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Instagram Reels Header &amp; Profile Link
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              The heading, supporting text, and official Instagram account URL.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={content.reelsHeading || "Moments of Pure Delight"}
                onChange={(e) => setContent({ ...content, reelsHeading: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="text"
                value={content.instagramProfileUrl || ""}
                onChange={(e) => setContent({ ...content, instagramProfileUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supporting Subtext
            </label>
            <textarea
              rows={2}
              value={content.reelsSubtext || ""}
              onChange={(e) => setContent({ ...content, reelsSubtext: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
            />
          </div>
        </div>

        {/* Card 3: Top Announcement Bar Badges & Contact */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Top Bar Badges &amp; Contact Details
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Information displayed in the top header announcement bar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Badge 1</label>
              <input
                type="text"
                value={content.announcementText1 || ""}
                onChange={(e) => setContent({ ...content, announcementText1: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Badge 2</label>
              <input
                type="text"
                value={content.announcementText2 || ""}
                onChange={(e) => setContent({ ...content, announcementText2: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Badge 3</label>
              <input
                type="text"
                value={content.announcementText3 || ""}
                onChange={(e) => setContent({ ...content, announcementText3: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Care Phone
              </label>
              <input
                type="text"
                value={content.contactPhone || ""}
                onChange={(e) => setContent({ ...content, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={content.contactEmail || ""}
                onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Franchise Section Copy */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Franchise Opportunities Section
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Headline and subtext for the franchise banner.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Franchise Headline
            </label>
            <input
              type="text"
              value={content.franchiseHeadline || ""}
              onChange={(e) => setContent({ ...content, franchiseHeadline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Franchise Subtext
            </label>
            <textarea
              rows={2}
              value={content.franchiseSubheadline || ""}
              onChange={(e) => setContent({ ...content, franchiseSubheadline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
