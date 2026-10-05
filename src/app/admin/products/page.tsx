"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Filter,
  ImageIcon,
  CheckCircle2,
  List,
  LayoutGrid,
} from "lucide-react";
import { ProductItem, PRODUCT_CATEGORIES } from "@/data/brandData";
import { getMediaUrl, toStoragePath } from "@/lib/media";
import AdminImageUpload from "@/components/admin/AdminImageUpload";

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<string[]>(Array.from(PRODUCT_CATEGORIES));
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data: ProductItem[] = await res.json();
        setProducts(data);
        const uniqueCats = Array.from(
          new Set([...Array.from(PRODUCT_CATEGORIES), ...data.map((p) => p.category)])
        );
        setCategories(uniqueCats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle ?action=new URL trigger
  useEffect(() => {
    if (searchParams?.get("action") === "new") {
      handleOpenAdd();
    }
  }, [searchParams]);

  const handleOpenAdd = () => {
    setEditingProduct({
      name: "",
      category: "Salankatia",
      description: "",
      tagline: "",
      image: "",
      price: "",
      isAvailable: true,
      isHero: false,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    setEditingProduct({ ...product });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert("Failed to delete product.");
      }
    } catch {
      alert("Error deleting product.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name?.trim() || !editingProduct?.category) {
      setFormError("Product name and category are required.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const cleanImage = toStoragePath(editingProduct.image);

    const payload = {
      ...editingProduct,
      image: cleanImage,
    };

    try {
      const method = editingProduct.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save failed.");
      }

      await fetchProducts();
      setIsModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) setFormError(err.message);
      else setFormError("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? p.isAvailable !== false
        : p.isAvailable === false;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Products</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Sky Laban products and their images.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2 py-1 rounded text-[11px] transition-colors ${
                statusFilter === "all" ? "bg-white text-[#0754C9] shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-2 py-1 rounded text-[11px] transition-colors ${
                statusFilter === "active" ? "bg-emerald-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("inactive")}
              className={`px-2 py-1 rounded text-[11px] transition-colors ${
                statusFilter === "inactive" ? "bg-slate-700 text-white font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 self-end lg:self-auto bg-slate-100 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "table" ? "bg-white text-[#0754C9] shadow-2xs" : "text-slate-400 hover:text-slate-700"
            }`}
            title="Table View"
            aria-label="Table View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "grid" ? "bg-white text-[#0754C9] shadow-2xs" : "text-slate-400 hover:text-slate-700"
            }`}
            title="Grid View"
            aria-label="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <Filter className="w-3 h-3 text-slate-400 shrink-0" />
        <button
          type="button"
          onClick={() => setSelectedCategory("All")}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === "All"
              ? "bg-[#0754C9] text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          All ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-[#0754C9] text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Content: Table (Desktop) / Cards (Mobile or Grid) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No products match the selected criteria.
          </div>
        ) : viewMode === "table" ? (
          /* Desktop Clean Table View */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-14">Image</th>
                  <th className="py-2.5 px-4">Product Name</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4 hidden md:table-cell">Description</th>
                  <th className="py-2.5 px-4 w-24">Status</th>
                  <th className="py-2.5 px-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2 px-4">
                      <div className="relative w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-0.5">
                        {prod.image ? (
                          <Image
                            src={getMediaUrl(prod.image)}
                            alt={prod.name}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 font-semibold text-slate-900">
                      <div>{prod.name}</div>
                      {prod.price && (
                        <div className="text-[11px] text-slate-400 font-normal">{prod.price}</div>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-[#0754C9] border border-sky-100">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-slate-500 max-w-xs truncate hidden md:table-cell">
                      {prod.description}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          prod.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {prod.isAvailable ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prod)}
                          className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded text-slate-400 hover:text-[#0754C9] hover:bg-sky-50 transition-colors"
                          title="Edit Product"
                          aria-label="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {deleteConfirmId === prod.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 p-1 rounded border border-rose-200">
                            <span className="text-[10px] text-rose-700 font-bold px-1">Del?</span>
                            <button
                              type="button"
                              onClick={() => handleDelete(prod.id)}
                              className="px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(prod.id)}
                            className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                            aria-label="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View (Responsive Cards) */
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex flex-col justify-between space-y-3 transition-colors"
              >
                <div className="space-y-2">
                  <div className="relative w-full h-32 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-2">
                    {prod.image ? (
                      <Image
                        src={getMediaUrl(prod.image)}
                        alt={prod.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-[#0754C9] border border-sky-100">
                        {prod.category}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          prod.isAvailable
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {prod.isAvailable ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mt-1 truncate">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{prod.price || "—"}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(prod)}
                      className="p-1.5 rounded text-slate-400 hover:text-[#0754C9] hover:bg-sky-50"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(prod.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                <ShoppingBag className="w-4 h-4 text-[#0754C9]" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingProduct?.id ? "Edit Product" : "Add Product"}
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

              {/* Unified Product Image Upload */}
              <AdminImageUpload
                folder="products"
                value={editingProduct?.image}
                onChange={(storagePath) =>
                  setEditingProduct((prev) => ({ ...prev, image: storagePath }))
                }
                label="Product Image"
                helperText="Upload to sky-laban-media/products (Square or transparent PNG recommended)"
                aspectRatio="square"
              />

              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salankatia Classic Cream"
                  value={editingProduct?.name || ""}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={editingProduct?.category || "Salankatia"}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingProduct?.isAvailable ? "active" : "inactive"}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        isAvailable: e.target.value === "active",
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                  >
                    <option value="active">Active / Available</option>
                    <option value="inactive">Inactive / Hidden</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Product tasting notes, ingredients, and texture description..."
                  value={editingProduct?.description || ""}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              {/* Optional Display Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Price / Size (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹180 or Per Tub"
                  value={editingProduct?.price || ""}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              {/* Action Buttons */}
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
                  <span>{saving ? "Saving..." : "Save Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400">Loading products...</div>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
