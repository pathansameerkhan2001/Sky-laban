"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, X, ExternalLink, Filter, CheckCircle2 } from "lucide-react";
import { OutletItem } from "@/lib/db";

export default function AdminOutletsPage() {
  const [outlets, setOutlets] = useState<OutletItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Partial<OutletItem> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchOutlets = async () => {
    try {
      const res = await fetch("/api/admin/outlets");
      if (res.ok) {
        const data = await res.json();
        setOutlets(data);
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
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (outlet: OutletItem) => {
    setEditingOutlet({ ...outlet });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete outlet location "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/outlets?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOutlets((prev) => prev.filter((o) => o.id !== id));
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
    if (filterState === "all") return true;
    if (filterState === "existing") return o.status === "existing";
    if (filterState === "upcoming") return o.status === "upcoming";
    return o.state.toLowerCase() === filterState.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#063B91] tracking-tight">Outlets &amp; Presence Map</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage 12 existing operational outlets, 15 upcoming locations, Google Maps directions, and state groupings.
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

      {/* Filter Tabs */}
      <div className="p-4 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {[
          { id: "all", label: "All Outlets" },
          { id: "existing", label: "Existing (Operational)" },
          { id: "upcoming", label: "Upcoming Expansion" },
          { id: "telangana", label: "Telangana" },
          { id: "andhra pradesh", label: "Andhra Pradesh" },
          { id: "tamil nadu", label: "Tamil Nadu" },
          { id: "karnataka", label: "Karnataka" },
          { id: "goa", label: "Goa" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterState(tab.id)}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterState === tab.id ? "bg-[#0754C9] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Outlets Table */}
      <div className="rounded-2xl bg-white border border-[#E0EDFA] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading branch outlets...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-[#E0EDFA] text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">City &amp; Branch Name</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Google Maps</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((outlet) => (
                  <tr key={outlet.id} className="hover:bg-[#F8FCFF] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            outlet.status === "existing"
                              ? "bg-[#063B91] text-white"
                              : "bg-[#DDF5FF] text-[#0754C9]"
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-[#063B91] block">{outlet.name}</span>
                          <span className="text-[11px] text-slate-400">{outlet.city}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{outlet.state}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{outlet.address}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          outlet.status === "existing"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}
                      >
                        {outlet.status === "existing" ? "Open Now" : "Upcoming"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {outlet.mapsUrl ? (
                        <a
                          href={outlet.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#0754C9] hover:underline font-semibold"
                        >
                          <span>Directions</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
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

      {/* Edit / Add Modal */}
      {isModalOpen && editingOutlet && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] overflow-hidden">
            <div className="p-5 border-b border-[#E0EDFA] bg-gradient-to-r from-[#EBF5FE] to-white flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#063B91]">
                {editingOutlet.id ? "Edit Outlet Location" : "Add New Outlet"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <option value="existing">Existing (Open Now)</option>
                    <option value="upcoming">Upcoming (Opening Soon)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Physical Address</label>
                <textarea
                  rows={2}
                  value={editingOutlet.address || ""}
                  onChange={(e) => setEditingOutlet({ ...editingOutlet, address: e.target.value })}
                  placeholder="Street address, landmark, pin code..."
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
