"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Search, Filter, Trash2, X, Phone, Mail, MapPin } from "lucide-react";
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
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.city.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.toLowerCase().includes(search.toLowerCase()) ||
      e.message.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#063B91] tracking-tight">Customer &amp; Franchise Enquiries</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real submissions from website visitors interested in franchise partnerships and general contact.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, phone, or message..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {["all", "franchise", "contact", "general"].map((tp) => (
            <button
              key={tp}
              onClick={() => setTypeFilter(tp)}
              className={`px-3 py-1.5 rounded-full font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                typeFilter === tp ? "bg-[#0754C9] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tp} ({tp === "all" ? enquiries.length : enquiries.filter((e) => e.type === tp).length})
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="rounded-2xl bg-white border border-[#E0EDFA] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading enquiries...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">No enquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-[#E0EDFA] text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#F8FCFF] transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#063B91] block">{enq.name}</span>
                      <span className="text-[11px] text-slate-400">{enq.phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          enq.type === "franchise"
                            ? "bg-[#EBF5FE] text-[#0754C9] border border-[#DDF0FE]"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {enq.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">{enq.city}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{enq.message}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateStatus(enq.id, e.target.value as EnquiryItem["status"])}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                          enq.status === "new"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : enq.status === "in_review"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : enq.status === "contacted"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
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
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setNotes(enq.notes || "");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#EBF5FE] text-[#0754C9] hover:bg-[#DDF0FE] font-bold text-[11px]"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(enq.id, enq.name)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF5FE] text-[#0754C9] uppercase">
                  {selectedEnquiry.type} Enquiry
                </span>
                <h3 className="text-base font-extrabold text-[#063B91] mt-1">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block font-semibold">Phone:</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-bold text-[#0754C9] flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{selectedEnquiry.phone}</span>
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">City:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{selectedEnquiry.city}</span>
                  </span>
                </div>
                {selectedEnquiry.email && (
                  <div className="col-span-2">
                    <span className="text-slate-400 block font-semibold">Email:</span>
                    <a href={`mailto:${selectedEnquiry.email}`} className="font-bold text-[#0754C9] flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{selectedEnquiry.email}</span>
                    </a>
                  </div>
                )}
                {selectedEnquiry.investmentBudget && (
                  <div>
                    <span className="text-slate-400 block font-semibold">Budget:</span>
                    <span className="font-bold text-slate-800">{selectedEnquiry.investmentBudget}</span>
                  </div>
                )}
                {selectedEnquiry.preferredLocation && (
                  <div>
                    <span className="text-slate-400 block font-semibold">Target Location:</span>
                    <span className="font-bold text-slate-800">{selectedEnquiry.preferredLocation}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Message from Customer:</span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed">
                  {selectedEnquiry.message}
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Follow-Up Notes:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record outcome of call, meeting date, or next steps..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedEnquiry.id, selectedEnquiry.name)}
                className="text-rose-600 hover:text-rose-700 text-xs font-bold"
              >
                Delete Enquiry
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-4 py-1.5 rounded-xl bg-[#0754C9] text-white hover:bg-[#0645B8] text-xs font-bold shadow-xs cursor-pointer"
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
