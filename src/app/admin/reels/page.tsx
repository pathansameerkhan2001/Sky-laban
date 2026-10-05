"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Film,
  Plus,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { ReelItem } from "@/lib/db";
import { getMediaUrl, toStoragePath } from "@/lib/media";
import AdminImageUpload from "@/components/admin/AdminImageUpload";

export default function AdminReelsPage() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<Partial<ReelItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reels");
      if (res.ok) {
        const data = await res.json();
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
      image: "",
      order: reels.length + 1,
      isActive: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (reel: ReelItem) => {
    setEditingReel({ ...reel });
    setFormError(null);
    setIsModalOpen(true);
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
      alert("Failed to update status.");
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
    const currentItem = reels[index];
    const targetItem = reels[targetIndex];

    const currentOrder = currentItem.order || index + 1;
    const targetOrder = targetItem.order || targetIndex + 1;

    try {
      await Promise.all([
        fetch("/api/admin/reels", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...currentItem, order: targetOrder }),
        }),
        fetch("/api/admin/reels", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...targetItem, order: currentOrder }),
        }),
      ]);
      fetchReels();
    } catch (err) {
      console.error("Reorder failed:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/reels?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReels((prev) => prev.filter((r) => r.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert("Failed to delete reel.");
      }
    } catch {
      alert("Error deleting reel.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReel?.url?.trim() || !editingReel?.image) {
      setFormError("Please provide an Instagram URL and a thumbnail image.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      ...editingReel,
      image: toStoragePath(editingReel.image),
    };

    try {
      const method = editingReel.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/reels", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchReels();
        setIsModalOpen(false);
      } else {
        const err = await res.json();
        setFormError(err.error || "Failed to save reel.");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to save reel.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Instagram Reels</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage the Instagram Reels displayed on the website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchReels}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh"
            aria-label="Refresh reels"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Reel</span>
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
        ) : reels.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No reels configured. Click &quot;Add Reel&quot; above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reels.map((reel, index) => (
              <div
                key={reel.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#D12B9A] font-bold text-xs flex items-center justify-center shrink-0 border border-pink-100">
                    #{reel.number || index + 1}
                  </div>

                  <div className="relative w-14 h-20 sm:w-16 sm:h-24 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {reel.image ? (
                      <Image
                        src={getMediaUrl(reel.image)}
                        alt={reel.title || "Reel thumbnail"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 truncate">
                        {reel.title || `Reel #${reel.number}`}
                      </h2>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          reel.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {reel.isActive ? "Active" : "Draft"}
                      </span>
                    </div>

                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#0754C9] hover:underline font-mono truncate max-w-md"
                    >
                      <span className="truncate">{reel.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>

                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      Storage: {reel.image}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(index, "up")}
                      disabled={index === 0}
                      className="p-1 text-slate-500 hover:text-[#0754C9] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(index, "down")}
                      disabled={index === reels.length - 1}
                      className="p-1 text-slate-500 hover:text-[#0754C9] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                      aria-label="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(reel)}
                    className={`p-2 rounded-lg border transition-colors ${
                      reel.isActive
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    }`}
                    title={reel.isActive ? "Deactivate" : "Activate"}
                    aria-label={reel.isActive ? "Deactivate" : "Activate"}
                  >
                    {reel.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(reel)}
                    className="p-2 rounded-lg bg-sky-50 border border-sky-100 text-[#0754C9] hover:bg-sky-100 transition-colors"
                    title="Edit Reel"
                    aria-label="Edit Reel"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirmId === reel.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <span className="text-[10px] text-rose-700 font-bold px-1">Del?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(reel.id)}
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
                      onClick={() => setDeleteConfirmId(reel.id)}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors"
                      title="Delete Reel"
                      aria-label="Delete Reel"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#0754C9]" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingReel?.id ? "Edit Instagram Reel" : "Add Instagram Reel"}
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

            <form onSubmit={handleSave} className="space-y-3.5 mt-4">
              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {formError}
                </div>
              )}

              <AdminImageUpload
                folder="reels"
                value={editingReel?.image}
                onChange={(path) =>
                  setEditingReel((prev) => ({ ...prev, image: path }))
                }
                label="Reel Thumbnail"
                helperText="Upload 9:16 vertical thumbnail image"
                aspectRatio="portrait"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instagram Reel URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.instagram.com/reel/..."
                  value={editingReel?.url || ""}
                  onChange={(e) =>
                    setEditingReel((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reel Title / Caption
                </label>
                <input
                  type="text"
                  placeholder="e.g. Founder Message — Opening in Kondapur"
                  value={editingReel?.title || ""}
                  onChange={(e) =>
                    setEditingReel((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingReel?.order || 1}
                    onChange={(e) =>
                      setEditingReel((prev) => ({
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
                    value={editingReel?.isActive ? "active" : "draft"}
                    onChange={(e) =>
                      setEditingReel((prev) => ({
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
                  <span>{saving ? "Saving..." : "Save Reel"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
