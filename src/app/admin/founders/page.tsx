"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  User,
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
import { FounderItem } from "@/lib/db";
import { getMediaUrl, toStoragePath } from "@/lib/media";
import AdminImageUpload from "@/components/admin/AdminImageUpload";

export default function AdminFoundersPage() {
  const [founders, setFounders] = useState<FounderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFounder, setEditingFounder] = useState<Partial<FounderItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchFounders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/founders");
      if (res.ok) {
        const data = await res.json();
        setFounders(data.sort((a: FounderItem, b: FounderItem) => (a.order || 0) - (b.order || 0)));
      }
    } catch (err) {
      console.error("Error fetching founders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFounders();
  }, []);

  const handleOpenAdd = () => {
    setEditingFounder({
      name: "",
      title: "",
      image: "",
      description: "",
      order: founders.length + 1,
      isActive: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (founder: FounderItem) => {
    setEditingFounder({ ...founder });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFounder?.name?.trim() || !editingFounder?.title?.trim()) {
      setFormError("Name and role title are required.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      ...editingFounder,
      image: toStoragePath(editingFounder.image),
    };

    try {
      const method = editingFounder.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/founders", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchFounders();
      } else {
        const errData = await res.json();
        setFormError(errData.error || "Failed to save founder record.");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to save founder record.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (founder: FounderItem) => {
    try {
      const updated = { ...founder, isActive: !founder.isActive };
      const res = await fetch("/api/admin/founders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setFounders((prev) =>
          prev.map((f) => (f.id === founder.id ? updated : f))
        );
      }
    } catch (err) {
      console.error("Toggle active error:", err);
    }
  };

  const handleReorder = async (founder: FounderItem, direction: "up" | "down") => {
    const currentIndex = founders.findIndex((f) => f.id === founder.id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === founders.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetFounder = founders[swapIndex];

    const currentOrder = founder.order || currentIndex + 1;
    const targetOrder = targetFounder.order || swapIndex + 1;

    try {
      await Promise.all([
        fetch("/api/admin/founders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...founder, order: targetOrder }),
        }),
        fetch("/api/admin/founders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...targetFounder, order: currentOrder }),
        }),
      ]);
      fetchFounders();
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/founders?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFounders((prev) => prev.filter((f) => f.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert("Failed to delete founder record.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Founders</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage founder profiles, roles, and images.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchFounders}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh"
            aria-label="Refresh founders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Founder</span>
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : founders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No founder records configured. Click &quot;Add Founder&quot; above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {founders.map((founder, index) => (
              <div
                key={founder.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#0754C9] font-bold text-xs flex items-center justify-center shrink-0 border border-sky-100">
                    #{founder.order || index + 1}
                  </div>

                  <div className="relative w-14 h-18 sm:w-16 sm:h-20 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {founder.image ? (
                      <Image
                        src={getMediaUrl(founder.image)}
                        alt={founder.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-300" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 truncate">
                        {founder.name}
                      </h2>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          founder.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {founder.isActive ? "Active" : "Draft"}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#0754C9] truncate">
                      {founder.title}
                    </p>

                    <p className="text-xs text-slate-500 line-clamp-2 max-w-xl">
                      {founder.description}
                    </p>

                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      Storage: {founder.image}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => handleReorder(founder, "up")}
                      disabled={index === 0}
                      className="p-1 text-slate-500 hover:text-[#0754C9] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(founder, "down")}
                      disabled={index === founders.length - 1}
                      className="p-1 text-slate-500 hover:text-[#0754C9] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                      aria-label="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(founder)}
                    className={`p-2 rounded-lg border transition-colors ${
                      founder.isActive
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    }`}
                    title={founder.isActive ? "Deactivate" : "Activate"}
                    aria-label={founder.isActive ? "Deactivate" : "Activate"}
                  >
                    {founder.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(founder)}
                    className="p-2 rounded-lg bg-sky-50 border border-sky-100 text-[#0754C9] hover:bg-sky-100 transition-colors"
                    title="Edit Founder"
                    aria-label="Edit Founder"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirmId === founder.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <span className="text-[10px] text-rose-700 font-bold px-1">Del?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(founder.id)}
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
                      onClick={() => setDeleteConfirmId(founder.id)}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors"
                      title="Delete Founder"
                      aria-label="Delete Founder"
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
                <User className="w-4 h-4 text-[#0754C9]" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingFounder?.id ? "Edit Founder Profile" : "Add Founder Profile"}
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

              {/* Founder Image Upload */}
              <AdminImageUpload
                folder="founders"
                value={editingFounder?.image}
                onChange={(path) =>
                  setEditingFounder((prev) => ({ ...prev, image: path }))
                }
                label="Founder Photograph"
                helperText="Upload portrait photograph to sky-laban-media/founders"
                aspectRatio="portrait"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B. Akram Ali Khan"
                  value={editingFounder?.name || ""}
                  onChange={(e) =>
                    setEditingFounder((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Founder & Managing Director"
                  value={editingFounder?.title || ""}
                  onChange={(e) =>
                    setEditingFounder((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bio / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Leadership vision, background in artisanal dessert craft..."
                  value={editingFounder?.description || ""}
                  onChange={(e) =>
                    setEditingFounder((prev) => ({ ...prev, description: e.target.value }))
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
                    value={editingFounder?.order || 1}
                    onChange={(e) =>
                      setEditingFounder((prev) => ({
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
                    value={editingFounder?.isActive ? "active" : "draft"}
                    onChange={(e) =>
                      setEditingFounder((prev) => ({
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
                  <span>{saving ? "Saving..." : "Save Founder"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
