"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import { HeroSlideItem } from "@/lib/db";

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlideItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/hero");
      if (res.ok) {
        const data = await res.json();
        setSlides(data.sort((a: HeroSlideItem, b: HeroSlideItem) => (a.order || 0) - (b.order || 0)));
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
      image: "/products/salankatia-hero-spoon.jpg",
      order: slides.length + 1,
      isActive: true,
      tag: "Sky Laban Signature",
    });
    setPreviewUrl("/products/salankatia-hero-spoon.jpg");
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlideItem) => {
    setEditingSlide({ ...slide });
    setPreviewUrl(slide.image || null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image must be smaller than 8MB");
      return;
    }

    setUploadError(null);
    setUploadingImage(true);
    const localObjUrl = URL.createObjectURL(file);
    setPreviewUrl(localObjUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "hero");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed on server");
      }

      const data = await res.json();
      if (data.url) {
        setEditingSlide((prev) => ({
          ...prev,
          image: data.url,
        }));
        setPreviewUrl(data.url);
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Failed to upload image. You can also paste an image URL.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide?.title || !editingSlide?.image) {
      setUploadError("Please provide title and slide image.");
      return;
    }

    setSaving(true);
    try {
      const method = editingSlide.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/hero", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSlide),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSlides();
      } else {
        const errData = await res.json();
        setUploadError(errData.error || "Failed to save hero slide.");
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to save hero slide.");
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

    const updatedCurrent = { ...slide, order: targetSlide.order };
    const updatedTarget = { ...targetSlide, order: slide.order };

    try {
      await Promise.all([
        fetch("/api/admin/hero", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCurrent),
        }),
        fetch("/api/admin/hero", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTarget),
        }),
      ]);
      fetchSlides();
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/hero?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSlides((prev) => prev.filter((s) => s.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#063B91] via-[#0645B8] to-[#0754C9] p-6 sm:p-8 text-white shadow-[0_15px_35px_rgba(6,59,145,0.18)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#DDF5FF] text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#43B8F2]" />
            <span>Hero Slider Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hero Banners &amp; Slides
          </h1>
          <p className="text-sm text-white/80 mt-1 max-w-xl">
            Manage the hero banner slides displayed at the top of the homepage. Changes immediately reflect in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSlides}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Refresh slides"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#063B91] hover:bg-[#DDF5FF] font-bold text-xs sm:text-sm shadow-md transition-colors"
          >
            <Plus className="w-4 h-4 text-[#0754C9]" />
            <span>Add Hero Slide</span>
          </button>
        </div>
      </div>

      {/* Slides Grid */}
      <div className="bg-white rounded-2xl border border-[#E0EDFA] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E0EDFA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#0754C9]" />
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Slides ({slides.length})
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Active slides will be presented in the hero carousel
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading hero slides...</div>
        ) : slides.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No hero slides configured.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Order Badge */}
                  <div className="w-8 h-8 rounded-full bg-[#EBF5FE] text-[#0754C9] font-black text-sm flex items-center justify-center shrink-0 border border-[#DDF5FF]">
                    #{slide.order}
                  </div>

                  {/* Slide Image Preview */}
                  <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-2xl overflow-hidden border border-[#DDF5FF] bg-slate-900 shrink-0 shadow-xs">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                    {slide.tag && (
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white">
                        {slide.tag}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-extrabold text-[#063B91]">
                        {slide.title}
                      </h3>
                      {slide.isActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          Active / Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                          Draft / Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 max-w-2xl font-normal leading-relaxed">
                      {slide.subtitle}
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Image: {slide.image}
                    </div>
                  </div>
                </div>

                {/* Actions Strip */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {/* Reorder Buttons */}
                  <div className="flex items-center border border-[#E0EDFA] rounded-xl bg-white p-0.5">
                    <button
                      onClick={() => handleReorder(slide, "up")}
                      disabled={index === 0}
                      className="p-1.5 text-slate-500 hover:text-[#0754C9] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorder(slide, "down")}
                      disabled={index === slides.length - 1}
                      className="p-1.5 text-slate-500 hover:text-[#0754C9] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle Active */}
                  <button
                    onClick={() => handleTogglePublish(slide)}
                    className={`p-2 rounded-xl border transition-colors ${
                      slide.isActive
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    }`}
                    title={slide.isActive ? "Deactivate" : "Activate"}
                  >
                    {slide.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEdit(slide)}
                    className="p-2 rounded-xl bg-[#EBF5FE] border border-[#DDF5FF] text-[#0754C9] hover:bg-[#DDF0FE] transition-colors"
                    title="Edit Slide"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  {deleteConfirmId === slide.id ? (
                    <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl border border-red-200">
                      <span className="text-[10px] text-red-700 font-bold px-1">Confirm?</span>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-600"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(slide.id)}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#DDF5FF] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#0754C9]" />
                <h3 className="text-lg font-bold text-[#063B91]">
                  {editingSlide?.id ? "Edit Hero Slide" : "Add Hero Slide"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-5">
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {uploadError}
                </div>
              )}

              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Slide Hero Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-20 rounded-2xl overflow-hidden border-2 border-[#DDF5FF] bg-slate-900 shrink-0 shadow-sm">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Slide Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBF5FE] text-[#0754C9] hover:bg-[#DDF0FE] text-xs font-bold transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? "Uploading to Storage..." : "Upload Image"}</span>
                    </button>
                    <p className="text-[11px] text-slate-500">
                      Organized into Supabase Storage <code className="text-[#0754C9]">hero/</code>. Max 8MB.
                    </p>
                    <input
                      type="text"
                      placeholder="Or enter image URL / asset path..."
                      value={editingSlide?.image || ""}
                      onChange={(e) => {
                        setEditingSlide({ ...editingSlide, image: e.target.value });
                        setPreviewUrl(e.target.value);
                      }}
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0754C9]"
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Artisanal Delight"
                  value={editingSlide?.title || ""}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Engaging copy highlighting the dessert texture and quality..."
                  value={editingSlide?.subtitle || ""}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, subtitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              {/* Tag / Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tag / Badge (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flagship Salankatia"
                  value={editingSlide?.tag || ""}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, tag: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              {/* Display Order & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingSlide?.order || 1}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={editingSlide?.isActive ? "active" : "draft"}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        isActive: e.target.value === "active",
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9]"
                  >
                    <option value="active">Active / Visible</option>
                    <option value="draft">Draft / Inactive</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0754C9] text-white hover:bg-[#0645B8] text-xs font-bold shadow-md shadow-[#0754C9]/20 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Slide"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
