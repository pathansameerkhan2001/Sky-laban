"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Film,
  Plus,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Play,
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
import { ReelItem } from "@/lib/db";
import { InstagramIcon } from "@/components/SocialIcons";
import { getMediaUrl } from "@/lib/media";

export default function AdminReelsPage() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<Partial<ReelItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reels");
      if (res.ok) {
        const data = await res.json();
        // Sort by order
        setReels(data.sort((a: ReelItem, b: ReelItem) => (a.order || 0) - (b.order || 0)));
      }
    } catch (err) {
      console.error("Error fetching reels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleOpenAdd = () => {
    const nextNum = (reels.length + 1).toString().padStart(2, "0");
    setEditingReel({
      number: nextNum,
      title: "",
      url: "https://www.instagram.com/reel/",
      image: `/images/reel_${((reels.length % 8) + 1)}.jpg`,
      order: reels.length + 1,
      isActive: true,
    });
    setPreviewUrl(`/images/reel_${((reels.length % 8) + 1)}.jpg`);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (reel: ReelItem) => {
    setEditingReel({ ...reel });
    setPreviewUrl(reel.image || null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image must be smaller than 8MB");
      return;
    }

    setUploadError(null);
    setUploadingImage(true);

    // Show instant local preview via object URL
    const localObjUrl = URL.createObjectURL(file);
    setPreviewUrl(localObjUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "reels");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed on server");
      }

      const data = await res.json();
      if (data.url) {
        setEditingReel((prev) => ({
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

  const handleTogglePublish = async (reel: ReelItem) => {
    try {
      const updated = { ...reel, isActive: !reel.isActive };
      const res = await fetch("/api/admin/reels", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setReels((prev) =>
          prev.map((r) => (r.id === reel.id ? { ...r, isActive: !reel.isActive } : r))
        );
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === reels.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newReels = [...reels];
    const currentItem = newReels[index];
    const targetItem = newReels[targetIndex];

    // Swap orders
    const currentOrder = currentItem.order;
    currentItem.order = targetItem.order;
    targetItem.order = currentOrder;

    // Swap in array
    newReels[index] = targetItem;
    newReels[targetIndex] = currentItem;

    setReels(newReels);

    try {
      await Promise.all([
        fetch("/api/admin/reels", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentItem),
        }),
        fetch("/api/admin/reels", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(targetItem),
        }),
      ]);
    } catch (err) {
      console.error("Failed saving reorder:", err);
      fetchReels();
    }
  };

  const handleDelete = async (id: string, number: string) => {
    if (!window.confirm(`Are you sure you want to delete Reel #${number}?`)) return;

    try {
      const res = await fetch(`/api/admin/reels?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReels((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      alert("Failed to delete reel");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReel?.url || !editingReel?.image) {
      alert("Please provide both an Instagram URL and a thumbnail image.");
      return;
    }

    setSaving(true);
    try {
      const method = editingReel.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/reels", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingReel),
      });

      if (res.ok) {
        await fetchReels();
        setIsModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save reel");
      }
    } catch (err) {
      console.error(err);
      alert("Network error saving reel");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#DDF5FF] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5FE] text-[#0754C9] text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <Film className="w-3.5 h-3.5" />
            <span>Moments of Pure Delight</span>
          </div>
          <h1 className="text-2xl font-black text-[#063B91] tracking-tight">
            Instagram Reels Showcase
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Display authentic 9:16 vertical cover images, actual Instagram links, captions, and manage carousel sequence order.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchReels}
            disabled={loading}
            className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh reels"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-bold shadow-md shadow-[#0754C9]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Reel</span>
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Total Reels</span>
          <span className="text-lg font-black text-[#063B91]">{reels.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Published</span>
          <span className="text-lg font-black text-emerald-600">
            {reels.filter((r) => r.isActive !== false).length}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Draft / Hidden</span>
          <span className="text-lg font-black text-amber-600">
            {reels.filter((r) => r.isActive === false).length}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Section Location</span>
          <span className="text-[11px] font-bold text-[#0754C9] truncate">Before Outlets</span>
        </div>
      </div>

      {/* Reels Showcase Grid Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className={`group relative rounded-3xl overflow-hidden bg-slate-900 border-2 shadow-md hover:shadow-xl transition-all flex flex-col justify-between aspect-[9/16] ${
              reel.isActive !== false ? "border-white" : "border-amber-400/80 opacity-75"
            }`}
          >
            {/* Thumbnail Image */}
            <Image
              src={getMediaUrl(reel.image || "/images/reel_1.jpg")}
              alt={reel.title || `Reel ${reel.number}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

            {/* Top Bar: Sequence Number, Status & External Link */}
            <div className="relative z-10 p-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] font-black px-2.5 py-0.5 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md">
                  #{reel.number}
                </span>
                <span
                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full backdrop-blur-md ${
                    reel.isActive !== false
                      ? "bg-emerald-500/80 text-white"
                      : "bg-amber-500/80 text-white"
                  }`}
                >
                  {reel.isActive !== false ? "Live" : "Draft"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleTogglePublish(reel)}
                  className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-[#0754C9] transition-colors"
                  title={reel.isActive !== false ? "Hide from website" : "Publish to website"}
                >
                  {reel.isActive !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={reel.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-[#0754C9] transition-colors"
                  title="Open Reel on Instagram"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Center: Play Overlay */}
            <div className="relative z-10 flex items-center justify-center pointer-events-none">
              <div className="w-11 h-11 rounded-full bg-white/80 text-[#0754C9] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              </div>
            </div>

            {/* Bottom Bar: Title, Order & Actions */}
            <div className="relative z-10 p-3.5 bg-black/75 backdrop-blur-md border-t border-white/10 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-white line-clamp-2 leading-tight">
                  {reel.title || `Reel ${reel.number}`}
                </p>
                <span className="shrink-0 text-[10px] font-mono text-slate-300">
                  Ord: {reel.order}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                {/* Reorder Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveOrder(index, "up")}
                    disabled={index === 0}
                    className="p-1 rounded bg-white/10 text-white hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move earlier in carousel"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleMoveOrder(index, "down")}
                    disabled={index === reels.length - 1}
                    className="p-1 rounded bg-white/10 text-white hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move later in carousel"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Edit & Delete */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(reel)}
                    className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white text-white hover:text-[#0754C9] text-[11px] font-bold transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(reel.id, reel.number)}
                    className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
                    title="Delete Reel"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Reel Modal */}
      {isModalOpen && editingReel && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] overflow-hidden my-8">
            <div className="p-5 border-b border-[#E0EDFA] bg-gradient-to-r from-[#EBF5FE] to-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#063B91]">
                  {editingReel.id ? "Edit Instagram Reel Card" : "Add New Reel Card"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set actual reel cover thumbnail, title, Instagram URL and carousel position.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sequence Number */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sequence Number *</label>
                  <input
                    type="text"
                    required
                    value={editingReel.number || ""}
                    onChange={(e) => setEditingReel({ ...editingReel, number: e.target.value })}
                    placeholder="01, 02, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none text-xs"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Displayed as #01 badge on card</p>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingReel.order || 1}
                    onChange={(e) =>
                      setEditingReel({ ...editingReel, order: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none text-xs"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Lower numbers appear first</p>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reel Title / Caption *</label>
                <input
                  type="text"
                  required
                  value={editingReel.title || ""}
                  onChange={(e) => setEditingReel({ ...editingReel, title: e.target.value })}
                  placeholder="e.g. Signature Salankatia Pour"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none text-xs"
                />
              </div>

              {/* Exact Instagram URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Instagram Reel URL *</label>
                  {editingReel.url && editingReel.url.startsWith("http") && (
                    <a
                      href={editingReel.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-[#0754C9] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test link</span>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  required
                  value={editingReel.url || ""}
                  onChange={(e) => setEditingReel({ ...editingReel, url: e.target.value })}
                  placeholder="https://www.instagram.com/reel/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none text-xs"
                />
              </div>

              {/* Thumbnail Image Upload & Live Preview Section */}
              <div className="p-4 rounded-2xl bg-[#f8fbfe] border border-[#DDF5FF] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#0754C9]" />
                    <span>Real Thumbnail Image (9:16 Vertical) *</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Stores in Supabase / Local storage</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* Preview Box */}
                  <div className="relative aspect-[9/16] w-28 mx-auto sm:mx-0 rounded-2xl overflow-hidden bg-slate-900 border-2 border-[#43B8F2] shadow-md shrink-0">
                    {previewUrl ? (
                      <Image
                        src={getMediaUrl(previewUrl)}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized={previewUrl.startsWith("blob:")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-7 h-7 rounded-full bg-white/80 text-[#0754C9] flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-current translate-x-0.2" />
                      </div>
                    </div>
                    <div className="absolute bottom-1.5 inset-x-1.5 text-center pointer-events-none">
                      <span className="text-[9px] font-bold text-white line-clamp-1 drop-shadow-xs">
                        {editingReel.title || "Preview"}
                      </span>
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="sm:col-span-2 space-y-2.5">
                    {/* File Upload Button */}
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#0754C9] hover:bg-[#EBF5FE]/50 text-[#0754C9] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{uploadingImage ? "Uploading to Storage..." : "Upload New Thumbnail Image"}</span>
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-400 text-center">or specify image URL:</div>

                    {/* Direct Image Path/URL Input */}
                    <input
                      type="text"
                      required
                      value={editingReel.image || ""}
                      onChange={(e) => {
                        setEditingReel({ ...editingReel, image: e.target.value });
                        setPreviewUrl(e.target.value);
                      }}
                      placeholder="/images/reel_1.jpg or https://..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none text-xs"
                    />

                    {uploadError && (
                      <p className="text-[11px] font-bold text-rose-500">{uploadError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 block">Published / Active Status</span>
                  <span className="text-[11px] text-slate-500">
                    When active, this reel appears in the carousel on the website.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingReel.isActive !== false}
                    onChange={(e) =>
                      setEditingReel({ ...editingReel, isActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0754C9]"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-[#0754C9] text-white hover:bg-[#0645B8] font-bold shadow-md cursor-pointer disabled:opacity-60 transition-all"
                >
                  {saving ? "Saving..." : "Save Reel Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
