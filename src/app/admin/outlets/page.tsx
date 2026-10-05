"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Search,
  CheckCircle2,
  Phone,
  RefreshCw,
  ImageIcon,
} from "lucide-react";
import { OutletItem } from "@/lib/db";
import { getMediaUrl, toStoragePath } from "@/lib/media";
import AdminImageUpload from "@/components/admin/AdminImageUpload";

export default function AdminOutletsPage() {
  const [outlets, setOutlets] = useState<OutletItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Partial<OutletItem & { image?: string; phone?: string; isActive?: boolean }> | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
      phone: "+91 98765 43210",
      status: "existing",
      mapsUrl: "",
      order: outlets.length + 1,
      image: "",
      isActive: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (outlet: OutletItem) => {
    setEditingOutlet({ ...outlet });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/outlets?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOutlets((prev) => prev.filter((o) => o.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert("Failed to delete outlet.");
      }
    } catch {
      alert("Error deleting outlet.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOutlet?.name?.trim() || !editingOutlet?.city?.trim()) {
      setFormError("Outlet name and city are required.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      ...editingOutlet,
      image: toStoragePath(editingOutlet.image),
    };

    try {
      const method = editingOutlet.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/outlets", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchOutlets();
        setIsModalOpen(false);
      } else {
        const err = await res.json();
        setFormError(err.error || "Failed to save outlet.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Network error saving outlet.");
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
    <div className="space-y-5 pb-12">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Our Outlets</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage physical store locations, contact details, and status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchOutlets}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh"
            aria-label="Refresh outlets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Outlet</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search branches..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
          {[
            { id: "all", label: "All" },
            { id: "existing", label: "Open" },
            { id: "upcoming", label: "Upcoming" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterState(f.id)}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                filterState === f.id ? "bg-white text-[#0754C9] shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Outlets Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No outlets found. Click &quot;Add Outlet&quot; above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((outlet, index) => (
              <div
                key={outlet.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-100">
                    #{outlet.order || index + 1}
                  </div>

                  <div className="relative w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {outlet.image ? (
                      <Image
                        src={getMediaUrl(outlet.image)}
                        alt={outlet.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <MapPin className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 truncate">
                        {outlet.name}
                      </h2>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          outlet.status === "existing"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {outlet.status === "existing" ? "Operational" : "Upcoming"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 truncate max-w-md">
                      {outlet.city}, {outlet.state} • {outlet.address}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      {outlet.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{outlet.phone}</span>
                        </span>
                      )}
                      {outlet.mapsUrl && (
                        <a
                          href={outlet.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-[#0754C9] hover:underline"
                        >
                          <span>Google Maps</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(outlet)}
                    className="p-2 rounded-lg bg-sky-50 border border-sky-100 text-[#0754C9] hover:bg-sky-100 transition-colors"
                    title="Edit Outlet"
                    aria-label="Edit Outlet"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirmId === outlet.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <span className="text-[10px] text-rose-700 font-bold px-1">Del?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(outlet.id)}
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
                      onClick={() => setDeleteConfirmId(outlet.id)}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors"
                      title="Delete Outlet"
                      aria-label="Delete Outlet"
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
                <MapPin className="w-4 h-4 text-[#0754C9]" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingOutlet?.id ? "Edit Outlet Location" : "Add Outlet Location"}
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

              {/* Outlet Image */}
              <AdminImageUpload
                folder="outlets"
                value={editingOutlet?.image}
                onChange={(path) =>
                  setEditingOutlet((prev) => ({ ...prev, image: path }))
                }
                label="Storefront Image (Optional)"
                helperText="Upload store photo to sky-laban-media/outlets"
                aspectRatio="video"
              />

              {/* Outlet Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Outlet / Branch Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kondapur Flagship Lounge"
                  value={editingOutlet?.name || ""}
                  onChange={(e) =>
                    setEditingOutlet((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad"
                    value={editingOutlet?.city || ""}
                    onChange={(e) =>
                      setEditingOutlet((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <select
                    value={editingOutlet?.state || "Telangana"}
                    onChange={(e) =>
                      setEditingOutlet((prev) => ({
                        ...prev,
                        state: e.target.value as OutletItem["state"],
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#0754C9]"
                  >
                    <option value="Telangana">Telangana</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Goa">Goa</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address
                </label>
                <textarea
                  rows={2}
                  placeholder="Full physical address or landmark..."
                  value={editingOutlet?.address || ""}
                  onChange={(e) =>
                    setEditingOutlet((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                />
              </div>

              {/* Phone & Maps URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={editingOutlet?.phone || ""}
                    onChange={(e) =>
                      setEditingOutlet((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={editingOutlet?.mapsUrl || ""}
                    onChange={(e) =>
                      setEditingOutlet((prev) => ({ ...prev, mapsUrl: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                  />
                </div>
              </div>

              {/* Status and Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Outlet Status
                  </label>
                  <select
                    value={editingOutlet?.status || "existing"}
                    onChange={(e) =>
                      setEditingOutlet((prev) => ({
                        ...prev,
                        status: e.target.value as "existing" | "upcoming",
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                  >
                    <option value="existing">Existing / Operational</option>
                    <option value="upcoming">Upcoming Expansion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingOutlet?.order || 1}
                    onChange={(e) =>
                      setEditingOutlet((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#0754C9]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
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
                  <span>{saving ? "Saving..." : "Save Outlet"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
