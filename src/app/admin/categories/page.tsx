"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  FolderTree,
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
import { CategoryItem } from "@/lib/db";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.sort((a: CategoryItem, b: CategoryItem) => (a.order || 0) - (b.order || 0)));
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    const nextOrder = categories.length + 1;
    setEditingCategory({
      name: "",
      description: "",
      image: "/images/categories/gulstha-cloud@2x.png",
      order: nextOrder,
      isActive: true,
    });
    setPreviewUrl("/images/categories/gulstha-cloud@2x.png");
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory({ ...cat });
    setPreviewUrl(cat.image || null);
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
      formData.append("folder", "categories");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed on server");
      }

      const data = await res.json();
      if (data.url) {
        setEditingCategory((prev) => ({
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
    if (!editingCategory?.name) {
      setUploadError("Category name is required.");
      return;
    }

    setSaving(true);
    try {
      const method = editingCategory.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        const errData = await res.json();
        setUploadError(errData.error || "Failed to save category.");
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (cat: CategoryItem) => {
    try {
      const updated = { ...cat, isActive: !cat.isActive };
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? updated : c))
        );
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  };

  const handleReorder = async (cat: CategoryItem, direction: "up" | "down") => {
    const currentIndex = categories.findIndex((c) => c.id === cat.id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === categories.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetCat = categories[swapIndex];

    const updatedCurrent = { ...cat, order: targetCat.order };
    const updatedTarget = { ...targetCat, order: cat.order };

    try {
      await Promise.all([
        fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCurrent),
        }),
        fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTarget),
        }),
      ]);
      fetchCategories();
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
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
            <span>Catalogue Structure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dessert Categories Management
          </h1>
          <p className="text-sm text-white/80 mt-1 max-w-xl">
            Manage the 10 dessert categories displayed in the &ldquo;Explore Our Categories&rdquo; cloud-badge section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#063B91] hover:bg-[#DDF5FF] font-bold text-xs sm:text-sm shadow-md transition-colors"
          >
            <Plus className="w-4 h-4 text-[#0754C9]" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-[#E0EDFA] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E0EDFA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-[#0754C9]" />
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Configured Categories ({categories.length})
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Live updates are published directly to the public website
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No categories found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Order Badge */}
                  <div className="w-7 h-7 rounded-full bg-[#EBF5FE] text-[#0754C9] font-black text-xs flex items-center justify-center shrink-0 border border-[#DDF5FF]">
                    #{cat.order}
                  </div>

                  {/* Cloud Badge Image */}
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-slate-50 border border-[#DDF5FF] shrink-0 p-1 flex items-center justify-center">
                    {cat.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-[#063B91]">
                        {cat.name}
                      </h3>
                      {cat.isActive !== false ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                          Draft
                        </span>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                        {cat.description}
                      </p>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">
                      Image: {cat.image || "Default Cloud Badge"}
                    </span>
                  </div>
                </div>

                {/* Actions Strip */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {/* Move Up/Down */}
                  <div className="flex items-center border border-[#E0EDFA] rounded-xl bg-white p-0.5">
                    <button
                      onClick={() => handleReorder(cat, "up")}
                      disabled={index === 0}
                      className="p-1.5 text-slate-500 hover:text-[#0754C9] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorder(cat, "down")}
                      disabled={index === categories.length - 1}
                      className="p-1.5 text-slate-500 hover:text-[#0754C9] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle Published */}
                  <button
                    onClick={() => handleTogglePublish(cat)}
                    className={`p-2 rounded-xl border transition-colors ${
                      cat.isActive !== false
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    }`}
                    title={cat.isActive !== false ? "Unpublish from website" : "Publish on website"}
                  >
                    {cat.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-xl bg-[#EBF5FE] border border-[#DDF5FF] text-[#0754C9] hover:bg-[#DDF0FE] transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete with Confirmation */}
                  {deleteConfirmId === cat.id ? (
                    <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl border border-red-200">
                      <span className="text-[10px] text-red-700 font-bold px-1">Delete?</span>
                      <button
                        onClick={() => handleDelete(cat.id)}
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
                      onClick={() => setDeleteConfirmId(cat.id)}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 transition-colors"
                      title="Delete Category"
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
                <FolderTree className="w-5 h-5 text-[#0754C9]" />
                <h3 className="text-lg font-bold text-[#063B91]">
                  {editingCategory?.id ? "Edit Category" : "Add New Category"}
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

              {/* Cloud Badge Image Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Category Cloud Badge Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#DDF5FF] bg-slate-50 shrink-0 p-1 flex items-center justify-center shadow-xs">
                    {previewUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={previewUrl}
                          alt="Category Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-400" />
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
                      Organized into Supabase Storage <code className="text-[#0754C9]">categories/</code>. Max 8MB.
                    </p>
                    <input
                      type="text"
                      placeholder="Or enter image URL..."
                      value={editingCategory?.image || ""}
                      onChange={(e) => {
                        setEditingCategory({ ...editingCategory, image: e.target.value });
                        setPreviewUrl(e.target.value);
                      }}
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0754C9]"
                    />
                  </div>
                </div>
              </div>

              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salankatia"
                  value={editingCategory?.name || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this dessert category..."
                  value={editingCategory?.description || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9]"
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
                    value={editingCategory?.order || 1}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
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
                    value={editingCategory?.isActive !== false ? "published" : "draft"}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        isActive: e.target.value === "published",
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0754C9]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft / Hidden</option>
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
                  <span>{saving ? "Saving..." : "Save Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
