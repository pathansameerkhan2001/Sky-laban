"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Filter,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Phone,
  Search,
} from "lucide-react";
import { OutletItem } from "@/lib/db";
import { getMediaUrl, toStoragePath } from "@/lib/media";

export default function AdminOutletsPage() {
  const [outlets, setOutlets] = useState<OutletItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Partial<OutletItem & { image?: string; phone?: string; isActive?: boolean }> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchOutlets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/outlets");
      if (res.ok) {
        const data = await res.json();
        setOutlets(data.sort((a: OutletItem, b: OutletItem) => (a.order || 0) - (b.order || 0)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  const handleOpenAdd = () => {
    setEditingOutlet({
      name: "",
      city: "",
      state: "Telangana",
      address: "",
      status: "existing",
      mapsUrl: "",
      order: outlets.length + 1,
      image: "/images/store_kondapur.jpg",
      phone: "+91 98765 43210",
      isActive: true,
    });
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (outlet: OutletItem) => {
    setEditingOutlet({ ...outlet, isActive: (outlet as any).isActive !== false });
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

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "outlets");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed on server");

      const storagePath = toStoragePath(data.storagePath || data.path || data.url);
      if (storagePath) {
        setEditingOutlet((prev) => ({
          ...prev,
          image: storagePath,
        }));
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed uploading outlet image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete outlet location "${name}" permanently?`)) return;

    try {
      const res = await fetch(`/api/admin/outlets?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOutlets((prev) => prev.filter((o) => o.id !== id));
      } else {
        alert("Failed to delete outlet.");
      }
    } catch {
      alert("Failed to delete outlet");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOutlet?.city || !editingOutlet?.name) return;

    setSaving(true);
    try {
      const method = editingOutlet.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/outlets", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingOutlet),
      });
      if (res.ok) {
        await fetchOutlets();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = outlets.filter((o) => {
    const matchesFilter =
      filterState === "all"
        ? true
        : filterState === "existing"
        ? o.status === "existing"
        : filterState === "upcoming"
        ? o.status === "upcoming"
        : o.state.toLowerCase() === filterState.toLowerCase();

    const matchesSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase()) ||
      o.state.toLowerCase().includes(search.toLowerCase()) ||
      o.address.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#063B91] tracking-tight">Outlets &amp; Presence Map</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage operational retail branches, upcoming locations, Google Maps links, and store photos.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-bold shadow-md shadow-[#0754C9]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Outlet</span>
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
            placeholder="Search by branch name, city, address..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {[
            { id: "all", label: "All Outlets" },
            { id: "existing", label: "Existing (Operational)" },
            { id: "upcoming", label: "Upcoming Expansion" },
            { id: "telangana", label: "Telangana" },
            { id: "andhra pradesh", label: "Andhra Pradesh" },
            { id: "tamil nadu", label: "Tamil Nadu" },
            { id: "karnataka", label: "Karnataka" },
            { id: "kerala", label: "Kerala" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterState(tab.id)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterState === tab.id ? "bg-[#0754C9] text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Outlets Table */}
      <div className="rounded-2xl bg-white border border-[#E0EDFA] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading branch outlets...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">No outlets match the selected filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-[#E0EDFA] text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Store Image</th>
                  <th className="py-3 px-4">Branch &amp; City</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Google Maps</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((outlet) => (
                  <tr key={outlet.id} className="hover:bg-[#F8FCFF] transition-colors">
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <Image
                          src={getMediaUrl((outlet as any).image || "/images/store_shaikpet.jpg")}
                          alt={outlet.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#0754C9] shrink-0" />
                        <div>
                          <span className="font-bold text-[#063B91] block">{outlet.name}</span>
                          <span className="text-[11px] text-slate-400">{outlet.address || outlet.city}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{outlet.state}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          outlet.status === "existing"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-sky-50 text-[#0754C9] border border-sky-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            outlet.status === "existing" ? "bg-emerald-500" : "bg-[#43B8F2]"
                          }`}
                        />
                        <span>{outlet.status === "existing" ? "Operational" : "Upcoming"}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">#{outlet.order || 1}</td>
                    <td className="py-3 px-4">
                      {outlet.mapsUrl ? (
                        <a
                          href={outlet.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#0754C9] hover:underline font-semibold"
                        >
                          <span>Directions</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-300">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(outlet)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0754C9] hover:bg-[#EBF5FE] transition-colors cursor-pointer"
                          title="Edit Outlet"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(outlet.id, outlet.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Outlet"
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

      {/* Add / Edit Outlet Modal */}
      {isModalOpen && editingOutlet && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#E0EDFA] bg-gradient-to-r from-[#EBF5FE] to-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#063B91]">
                  {editingOutlet.id ? "Edit Outlet Location" : "Add New Outlet Branch"}
                </h3>
                <p className="text-xs text-slate-500">Manage address, Google Maps directions, and store status.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              {uploadError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {uploadError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Name *</label>
                  <input
                    type="text"
                    required
                    value={editingOutlet.name || ""}
                    onChange={(e) => setEditingOutlet({ ...editingOutlet, name: e.target.value })}
                    placeholder="e.g. Kondapur Branch"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={editingOutlet.city || ""}
                    onChange={(e) => setEditingOutlet({ ...editingOutlet, city: e.target.value })}
                    placeholder="e.g. Kondapur, Hyderabad"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State *</label>
                  <select
                    value={editingOutlet.state || "Telangana"}
                    onChange={(e) => setEditingOutlet({ ...editingOutlet, state: e.target.value as OutletItem["state"] })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none bg-white"
                  >
                    <option value="Telangana">Telangana</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Goa">Goa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status *</label>
                  <select
                    value={editingOutlet.status || "existing"}
                    onChange={(e) => setEditingOutlet({ ...editingOutlet, status: e.target.value as "existing" | "upcoming" })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none bg-white"
                  >
                    <option value="existing">Existing (Open)</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={editingOutlet.order || 1}
                    onChange={(e) => setEditingOutlet({ ...editingOutlet, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                  />
                </div>
              </div>

              {/* Outlet Storefront Image Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Storefront Photo</label>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FCFF] border border-[#DDF5FF]">
                  <div className="relative w-14 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src={getMediaUrl(editingOutlet.image || "/images/store_shaikpet.jpg")}
                      alt="Store Preview"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
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
                      className="px-3 py-1.5 rounded-lg bg-[#EBF5FE] text-[#0754C9] text-xs font-bold hover:bg-[#DDF0FE] cursor-pointer"
                    >
                      {uploadingImage ? "Uploading..." : "Upload Store Photo"}
                    </button>
                    <span className="text-[10px] text-slate-400 block">Saves to `sky-laban-media/outlets/`</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Physical Address</label>
                <textarea
                  rows={2}
                  value={editingOutlet.address || ""}
                  onChange={(e) => setEditingOutlet({ ...editingOutlet, address: e.target.value })}
                  placeholder="Street address, landmark, locality..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Google Maps Link</label>
                <input
                  type="text"
                  value={editingOutlet.mapsUrl || ""}
                  onChange={(e) => setEditingOutlet({ ...editingOutlet, mapsUrl: e.target.value })}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#0754C9] text-white hover:bg-[#0645B8] font-bold shadow-md cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Outlet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
