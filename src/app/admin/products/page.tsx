"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
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
  Upload,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Tag,
} from "lucide-react";
import { ProductItem, PRODUCT_CATEGORIES } from "@/data/brandData";
import { getMediaUrl, toStoragePath } from "@/lib/media";
import { uploadSkyLabanMedia } from "@/lib/upload";

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
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

  // Check if opened with ?action=new
  useEffect(() => {
    if (searchParams?.get("action") === "new") {
      handleOpenAdd();
    }
  }, [searchParams]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setUploadingImage(true);

    try {
      const res = await uploadSkyLabanMedia({ file, folder: "products" });
      if (!res.success) {
        throw new Error(res.error || "Upload failed on server");
      }

      setEditingProduct((prev) => ({
        ...prev,
        image: res.storagePath,
      }));
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload image to Supabase Storage.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct({
      name: "",
      category: "Salankatia",
      description: "",
      tagline: "",
      image: "",
      price: "",
      badge: "Signature",
      isHero: true,
      isAvailable: true,
      tastingNotes: ["Rich Milk Cream", "Fresh Ingredients"],
      servingSuggestion: "Chilled Dessert Tub",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    setEditingProduct({ ...product });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete product "${name}" permanently?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch {
      alert("Error deleting product.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.category) {
      setErrorMsg("Product name and category are required.");
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
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? p.isAvailable !== false
        : p.isAvailable === false;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesStatus && matchesSearch;
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
      <div className="p-4 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Box */}
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

          {/* Active / Inactive Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === "all" ? "bg-white text-[#0754C9] shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === "active" ? "bg-emerald-500 text-white shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Active Only
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === "inactive" ? "bg-rose-500 text-white shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* View Switcher & Category Dropdown */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-white text-[#0754C9] shadow-xs" : "text-slate-400 hover:text-slate-700"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-white text-[#0754C9] shadow-xs" : "text-slate-400 hover:text-slate-700"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === "All"
              ? "bg-[#0754C9] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All Categories ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#0754C9] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ================= 1. TABLE VIEW ================= */}
      {viewMode === "table" && (
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
                    <th className="py-3 px-4">Hero Visibility</th>
                    <th className="py-3 px-4">Badge</th>
                    <th className="py-3 px-4">Price</th>
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
                              src={getMediaUrl(prod.image || "/products/salankatia-nutella-lotus.jpg")}
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
                          <span className="text-[11px] text-slate-400">Full Menu Only</span>
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
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {prod.isAvailable !== false ? "Active" : "Inactive"}
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
      )}

      {/* ================= 2. GRID VIEW ================= */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-[#DDF5FF] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="relative aspect-square w-full bg-gradient-to-b from-[#EBF6FF] to-white p-4 flex items-center justify-center">
                <Image
                  src={getMediaUrl(prod.image || "/products/salankatia-nutella-lotus.jpg")}
                  alt={prod.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                />
                {prod.badge && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0754C9] text-white text-[9px] font-bold">
                    {prod.badge}
                  </div>
                )}
                <span
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    prod.isAvailable !== false ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
                  }`}
                >
                  {prod.isAvailable !== false ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between border-t border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-[#0754C9] uppercase tracking-wider block">
                    {prod.category}
                  </span>
                  <h4 className="text-xs font-bold text-[#063B91] mt-0.5 line-clamp-1">{prod.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                    {prod.tagline || prod.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {prod.price || "At Outlets"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-1 rounded-lg text-slate-400 hover:text-[#0754C9] hover:bg-[#EBF5FE]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id, prod.name)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
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
                  <select
                    value={editingProduct.category || "Salankatia"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none bg-white font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Image Upload & Preview */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Dessert Image</label>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#F8FCFF] border border-[#DDF5FF]">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#DDF5FF] bg-white shrink-0 p-1 flex items-center justify-center shadow-xs">
                    {editingProduct.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={getMediaUrl(editingProduct.image)}
                          alt="Product Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EBF5FE] text-[#0754C9] hover:bg-[#DDF0FE] text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? "Uploading to Storage..." : "Upload Image"}</span>
                      </button>
                      <span className="text-[10px] text-slate-400">Stores to Supabase storage `products/`</span>
                    </div>

                    <input
                      type="text"
                      value={editingProduct.image || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="Or enter image URL / path..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tagline / Subtitle */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Tagline</label>
                <input
                  type="text"
                  value={editingProduct.tagline || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  placeholder="e.g. Pistachio ribbons with clotted laban cream"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Detailed artisanal craftsmanship and tasting notes..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                />
              </div>

              {/* Verified Pricing & Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Price (Optional)</label>
                  <input
                    type="text"
                    value={editingProduct.price || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    placeholder="e.g. ₹299 (leave blank for 'At Outlets')"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Highlight Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    placeholder="e.g. Bestseller, Signature, New"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                  />
                </div>
              </div>

              {/* Toggles: Active Status & Hero Section */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isAvailable !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                    className="rounded text-[#0754C9] focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Active / Available Online</span>
                    <span className="text-[10px] text-slate-400 block">Controls public visibility on website</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isHero)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isHero: e.target.checked })}
                    className="rounded text-[#0754C9] focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Show in Moving Carousel</span>
                    <span className="text-[10px] text-slate-400 block">Feature in category carousel section</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-bold shadow-md transition-all disabled:opacity-60 cursor-pointer"
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

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading products view...</div>}>
      <AdminProductsContent />
    </Suspense>
  );
}
