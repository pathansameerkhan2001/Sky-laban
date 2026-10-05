"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Search, Filter, Trash2, X, Phone, Mail, MapPin, RefreshCw } from "lucide-react";
import { EnquiryItem } from "@/lib/db";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/enquiries");
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: EnquiryItem["status"]) => {
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setSavingNotes(true);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedEnquiry.id, status: selectedEnquiry.status, notes }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, notes } : e))
        );
        setSelectedEnquiry({ ...selectedEnquiry, notes });
      }
    } catch {
      alert("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete enquiry from "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      }
    } catch {
      alert("Failed to delete enquiry");
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchesType = typeFilter === "all" || e.type === typeFilter;
    const matchesSearch =
      (e.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.phone || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.message || "").toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Website Enquiries</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer inquiries and franchise interest submitted from the public site.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchEnquiries}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors self-start sm:self-auto"
          title="Refresh"
          aria-label="Refresh enquiries"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, phone, or message..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:border-[#0754C9] text-xs outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {["all", "franchise", "contact", "general"].map((tp) => (
            <button
              key={tp}
              type="button"
              onClick={() => setTypeFilter(tp)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                typeFilter === tp ? "bg-[#0754C9] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tp} ({tp === "all" ? enquiries.length : enquiries.filter((e) => e.type === tp).length})
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No enquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block truncate">{enq.name}</span>
                      <span className="text-[11px] text-slate-500 truncate">{enq.phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          enq.type === "franchise"
                            ? "bg-[#EBF5FE] text-[#0754C9] border border-sky-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {enq.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{enq.city}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{enq.message}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateStatus(enq.id, e.target.value as EnquiryItem["status"])}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border outline-none cursor-pointer ${
                          enq.status === "new"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : enq.status === "in_review"
                            ? "bg-sky-50 text-sky-800 border-sky-200"
                            : enq.status === "contacted"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="in_review">In Review</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setNotes(enq.notes || "");
                          }}
                          className="px-2.5 py-1 rounded bg-[#EBF5FE] text-[#0754C9] hover:bg-sky-100 font-semibold text-[11px]"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(enq.id, enq.name)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Enquiry"
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

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EBF5FE] text-[#0754C9] uppercase">
                  {selectedEnquiry.type} Enquiry
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">Phone:</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-semibold text-[#0754C9] flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{selectedEnquiry.phone}</span>
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">City:</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{selectedEnquiry.city}</span>
                  </span>
                </div>
                {selectedEnquiry.email && (
                  <div className="col-span-2">
                    <span className="text-slate-400 block font-medium">Email:</span>
                    <a href={`mailto:${selectedEnquiry.email}`} className="font-semibold text-[#0754C9] flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{selectedEnquiry.email}</span>
                    </a>
                  </div>
                )}
                {selectedEnquiry.investmentBudget && (
                  <div>
                    <span className="text-slate-400 block font-medium">Budget:</span>
                    <span className="font-semibold text-slate-800">{selectedEnquiry.investmentBudget}</span>
                  </div>
                )}
                {selectedEnquiry.preferredLocation && (
                  <div>
                    <span className="text-slate-400 block font-medium">Target Location:</span>
                    <span className="font-semibold text-slate-800">{selectedEnquiry.preferredLocation}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Message:</span>
                <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedEnquiry.message}
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Internal Notes:</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record outcome of phone call, meeting date, or next steps..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#0754C9] outline-none text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <button
                type="button"
                onClick={() => handleDelete(selectedEnquiry.id, selectedEnquiry.name)}
                className="text-rose-600 hover:text-rose-700 text-xs font-semibold"
              >
                Delete Enquiry
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-4 py-1.5 rounded-lg bg-[#0754C9] text-white hover:bg-[#0645B8] text-xs font-semibold shadow-2xs"
                >
                  {savingNotes ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
