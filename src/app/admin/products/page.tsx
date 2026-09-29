"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Eye,
  AlertCircle,
  Filter,
} from "lucide-react";
import { ProductItem } from "@/data/brandData";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data: ProductItem[] = await res.json();
        setProducts(data);
        const uniqueCats = Array.from(new Set(data.map((p) => p.category)));
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

  const handleOpenAdd = () => {
    setEditingProduct({
      name: "",
      category: categories[0] || "Salankatia",
      tagline: "",
      description: "",
      badge: "Signature",
      image: "/products/salankatia-nutella-lotus.jpg",
      tastingNotes: ["Velvety Cream", "Roasted Nuts"],
      servingSuggestion: "Serve cold at 4°C.",
      pairingNotes: "Arabic Coffee or Tea",
      price: "",
      isHero: true,
      isAvailable: true,
      order: products.length + 1,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: ProductItem) => {
    setEditingProduct({ ...prod });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      alert("Error deleting product.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.category) {
      setErrorMsg("Name and category are required.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const method = editingProduct.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }

      await fetchProducts();
      setIsModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMsg(err.message);
      else setErrorMsg("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#063B91] tracking-tight">Product Catalogue</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage Sky Laban signature desserts, verified pricing, categories, and homepage hero visibility.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-bold shadow-md shadow-[#0754C9]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, or ingredients..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === "All"
                ? "bg-[#0754C9] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#0754C9] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white border border-[#E0EDFA] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">No products match your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-[#E0EDFA] text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Homepage Hero</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Verified Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F8FCFF] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <Image
                            src={prod.image || "/products/salankatia-nutella-lotus.jpg"}
                            alt={prod.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-[#063B91] block">{prod.name}</span>
                          <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                            {prod.tagline}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{prod.category}</td>
                    <td className="py-3 px-4">
                      {prod.isHero ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          <Check className="w-3 h-3" />
                          <span>Hero Carousel</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Full Menu</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {prod.badge ? (
                        <span className="px-2 py-0.5 rounded-md bg-[#EBF5FE] text-[#0754C9] font-bold text-[10px]">
                          {prod.badge}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      {prod.price ? prod.price : <span className="text-slate-400 italic font-sans">At Outlets</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          prod.isAvailable !== false
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {prod.isAvailable !== false ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0754C9] hover:bg-[#EBF5FE] transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-[#E0EDFA] bg-gradient-to-r from-[#EBF5FE] to-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#063B91]">
                  {editingProduct.id ? "Edit Product Details" : "Add New Dessert Product"}
                </h3>
                <p className="text-xs text-slate-500">Update product photography, category, notes, and pricing.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Pistachio Lotus Salankatia"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.category || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    placeholder="e.g. Salankatia, Koushiri, Cakes"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline / Short Subtitle</label>
                <input
                  type="text"
                  value={editingProduct.tagline || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  placeholder="e.g. Dual-Layer Pistachio Mousse & Belgian Fudge"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Detailed artisanal description of layers and ingredients..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image Path / URL</label>
                  <input
                    type="text"
                    value={editingProduct.image || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    placeholder="/products/salankatia-nutella-lotus.jpg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    placeholder="e.g. Signature, Popular"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Verified Price (Optional)</label>
                  <input
                    type="text"
                    value={editingProduct.price || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    placeholder="e.g. ₹280 (Leave blank if unverified)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Serving Suggestion</label>
                  <input
                    type="text"
                    value={editingProduct.servingSuggestion || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, servingSuggestion: e.target.value })}
                    placeholder="e.g. Chilled at 4°C - 6°C."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pairing Notes</label>
                  <input
                    type="text"
                    value={editingProduct.pairingNotes || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, pairingNotes: e.target.value })}
                    placeholder="e.g. Turkish Coffee or Arabic Tea"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isHero !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isHero: e.target.checked })}
                    className="w-4 h-4 text-[#0754C9] rounded"
                  />
                  <span className="font-bold text-slate-700">Display on Homepage Hero Grid</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isAvailable !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-[#0754C9] rounded"
                  />
                  <span className="font-bold text-slate-700">In Stock / Available</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#0754C9] text-white hover:bg-[#0645B8] font-bold shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
