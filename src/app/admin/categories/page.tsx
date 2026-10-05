"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FolderTree,
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
import { CategoryItem } from "@/lib/db";
import { getMediaUrl, toStoragePath } from "@/lib/media";
import AdminImageUpload from "@/components/admin/AdminImageUpload";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
    setEditingCategory({
      name: "",
      description: "",
      image: "",
      order: categories.length + 1,
      isActive: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory({ ...cat });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name?.trim()) {
      setFormError("Category name is required.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      ...editingCategory,
      image: toStoragePath(editingCategory.image),
    };

    try {
      const method = editingCategory.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        const errData = await res.json();
        setFormError(errData.error || "Failed to save category.");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (cat: CategoryItem) => {
    try {
      const updated = { ...cat, isActive: !cat.isActive };
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? updated : c))
        );
      }
    } catch (err) {
      console.error("Toggle error:", err);
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

    const currentOrder = cat.order || currentIndex + 1;
    const targetOrder = targetCat.order || swapIndex + 1;

    try {
      await Promise.all([
        fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...cat, order: targetOrder }),
        }),
        fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...targetCat, order: currentOrder }),
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
      } else {
        alert("Failed to delete category.");
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
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage product categories and presentation order.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchCategories}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh"
            aria-label="Refresh categories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Main Table / Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No categories found. Click &quot;Add Category&quot; above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#0754C9] font-bold text-xs flex items-center justify-center shrink-0 border border-sky-100">
                    #{cat.order || index + 1}
                  </div>

                  <div className="relative w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-1 shrink-0">
                    {cat.image ? (
                      <Image
                        src={getMediaUrl(cat.image)}
                        alt={cat.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-slate-300" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 truncate">
                        {cat.name}
                      </h2>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          cat.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Draft"}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-slate-500 line-clamp-1 max-w-md mt-0.5">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => handleReorder(cat, "up")}
                      disabled={index === 0}
                      className="p-1 text-slate-500 hover:text-[#0754C9] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(cat, "down")}
                      disabled={index === categories.length - 1}
                      className="p-1 text-slate-500 hover:text-[#0754C9] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                      aria-label="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(cat)}
                    className={`p-2 rounded-lg border transition-colors ${
                      cat.isActive
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    }`}
                    title={cat.isActive ? "Deactivate" : "Activate"}
                    aria-label={cat.isActive ? "Deactivate" : "Activate"}
                  >
                    {cat.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-lg bg-sky-50 border border-sky-100 text-[#0754C9] hover:bg-sky-100 transition-colors"
                    title="Edit Category"
                    aria-label="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirmId === cat.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <span className="text-[10px] text-rose-700 font-bold px-1">Del?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id)}
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
                      onClick={() => setDeleteConfirmId(cat.id)}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors"
                      title="Delete Category"
                      aria-label="Delete Category"
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
                <FolderTree className="w-4 h-4 text-[#0754C9]" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingCategory?.id ? "Edit Category" : "Add Category"}
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
                folder="branding"
                value={editingCategory?.image}
                onChange={(path) =>
                  setEditingCategory((prev) => ({ ...prev, image: path }))
                }
                label="Category Icon / Image"
                helperText="Upload transparent badge or dessert asset"
                aspectRatio="square"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salankatia"
                  value={editingCategory?.name || ""}
                  onChange={(e) =>
                    setEditingCategory((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Layered dessert cream signature"
                  value={editingCategory?.description || ""}
                  onChange={(e) =>
                    setEditingCategory((prev) => ({ ...prev, description: e.target.value }))
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
                    value={editingCategory?.order || 1}
                    onChange={(e) =>
                      setEditingCategory((prev) => ({
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
                    value={editingCategory?.isActive ? "active" : "draft"}
                    onChange={(e) =>
                      setEditingCategory((prev) => ({
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
