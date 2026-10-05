"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ImageIcon,
} from "lucide-react";
import { HeroSlideItem } from "@/lib/db";
import { getMediaUrl, toStoragePath } from "@/lib/media";
import AdminImageUpload from "@/components/admin/AdminImageUpload";

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlideItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const originalImageRef = useRef<string | null>(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/hero");
      if (res.ok) {
        const data = await res.json();
        const normalized = data.map((s: any) => ({
          ...s,
          image: s.image || s.desktopImage || s.image_path,
        }));
        setSlides(normalized.sort((a: HeroSlideItem, b: HeroSlideItem) => (a.order || 0) - (b.order || 0)));
      }
    } catch (err) {
      console.error("Error fetching hero slides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleOpenAdd = () => {
    setEditingSlide({
      title: "",
      subtitle: "",
      image: "",
      order: slides.length + 1,
      isActive: true,
      tag: "Sky Laban Signature",
    });
    setFormError(null);
    originalImageRef.current = null;
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlideItem) => {
    const currentImg = slide.image || slide.desktopImage || (slide as any).image_path || "";
    setEditingSlide({ ...slide, image: currentImg });
    setFormError(null);
    originalImageRef.current = currentImg;
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImage = toStoragePath(editingSlide?.image);
    if (!editingSlide?.title || !cleanImage) {
      setFormError("Please enter a headline and upload a hero slide image.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const slidePayload = {
      ...editingSlide,
      image: cleanImage,
      desktopImage: cleanImage,
      image_path: cleanImage,
    };

    try {
      const method = editingSlide.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/hero", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slidePayload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSlides();
      } else {
        const errData = await res.json();
        setFormError(errData.error || "Failed to save hero slide.");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to save hero slide.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (slide: HeroSlideItem) => {
    try {
      const updated = { ...slide, isActive: !slide.isActive };
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setSlides((prev) =>
          prev.map((s) => (s.id === slide.id ? updated : s))
        );
      }
    } catch (err) {
      console.error("Toggle active error:", err);
    }
  };

  const handleReorder = async (slide: HeroSlideItem, direction: "up" | "down") => {
    const currentIndex = slides.findIndex((s) => s.id === slide.id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === slides.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetSlide = slides[swapIndex];

    const currentOrder = slide.order || currentIndex + 1;
    const targetOrder = targetSlide.order || swapIndex + 1;

    try {
      await Promise.all([
        fetch("/api/admin/hero", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...slide, order: targetOrder }),
        }),
        fetch("/api/admin/hero", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...targetSlide, order: currentOrder }),
        }),
      ]);
      fetchSlides();
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/hero?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSlides((prev) => prev.filter((s) => s.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert("Failed to delete slide.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting hero slide.");
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Hero Slides</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage the images and content displayed in the website hero section.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSlides}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh slides"
            aria-label="Refresh slides"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Hero Slide</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : slides.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No hero slides configured. Click "Add Hero Slide" above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  {/* Order Badge */}
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#0754C9] font-bold text-xs flex items-center justify-center shrink-0 border border-sky-100">
                    #{slide.order}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                    <Image
                      src={getMediaUrl(slide.image)}
                      alt={slide.title || "Hero slide"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Text details */}
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 truncate">
                        {slide.title}
                      </h2>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          slide.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {slide.isActive ? "Active" : "Draft"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                      {slide.subtitle}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      Storage: {slide.image}
                    </p>
                  </div>
                </div>

                {/* Actions Strip */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  {/* Reorder Buttons */}
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => handleReorder(slide, "up")}
                      disabled={index === 0}
                      className="p-1 text-slate-500 hover:text-[#0754C9] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(slide, "down")}
                      disabled={index === slides.length - 1}
                      className="p-1 text-slate-500 hover:text-[#0754C9] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                      aria-label="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle Active */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(slide)}
                    className={`p-2 rounded-lg border transition-colors ${
                      slide.isActive
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    }`}
                    title={slide.isActive ? "Deactivate slide" : "Activate slide"}
                    aria-label={slide.isActive ? "Deactivate slide" : "Activate slide"}
                  >
                    {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(slide)}
                    className="p-2 rounded-lg bg-sky-50 border border-sky-100 text-[#0754C9] hover:bg-sky-100 transition-colors"
                    title="Edit slide"
                    aria-label="Edit slide"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  {deleteConfirmId === slide.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <span className="text-[10px] text-rose-700 font-bold px-1">Delete?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(slide.id)}
                        className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(slide.id)}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors"
                      title="Delete Slide"
                      aria-label="Delete Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0754C9]" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingSlide?.id ? "Edit Hero Slide" : "Add Hero Slide"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {formError}
                </div>
              )}

              {/* Reusable Image Upload Component */}
              <AdminImageUpload
                folder="hero"
                value={editingSlide?.image}
                onChange={(storagePath) =>
                  setEditingSlide((prev) => ({
                    ...prev,
                    image: storagePath,
                    desktopImage: storagePath,
                  }))
                }
                label="Hero Slide Image"
                helperText="Upload to sky-laban-media/hero (16:9 banner recommended)"
                aspectRatio="video"
                required
              />

              {/* Headline */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headline / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Signature Egyptian Desserts Feast"
                  value={editingSlide?.title || ""}
                  onChange={(e) =>
                    setEditingSlide((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Supporting description for the hero banner..."
                  value={editingSlide?.subtitle || ""}
                  onChange={(e) =>
                    setEditingSlide((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              {/* Tag & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingSlide?.order || 1}
                    onChange={(e) =>
                      setEditingSlide((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingSlide?.isActive ? "active" : "draft"}
                    onChange={(e) =>
                      setEditingSlide((prev) => ({
                        ...prev,
                        isActive: e.target.value === "active",
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                  >
                    <option value="active">Active / Visible</option>
                    <option value="draft">Draft / Hidden</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0754C9] text-white hover:bg-[#0645B8] text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Hero Slide"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
