"use client";

import React, { useState, useEffect } from "react";
import { Receipt, Search, Filter, Clock, CheckCircle2, AlertCircle, Eye, X } from "lucide-react";
import { OrderItem } from "@/lib/db";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: OrderItem["status"]) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#063B91] tracking-tight">Customer Orders</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track pickup, store delivery, and table reservation orders across branches.
          </p>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="p-4 rounded-2xl bg-white border border-[#E0EDFA] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name or phone..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {["all", "pending", "processing", "ready", "completed", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-[#0754C9] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white border border-[#E0EDFA] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-[#E0EDFA] text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Branch / Outlet</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#F8FCFF] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#063B91]">{ord.orderNumber}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 block">{ord.customerName}</span>
                      <span className="text-[11px] text-slate-400">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{ord.outletName || "Online Store"}</td>
                    <td className="py-3 px-4 font-medium text-slate-600 max-w-xs truncate">
                      {ord.items?.map((i) => `${i.quantity}x ${i.productName}`).join(", ")}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderItem["status"])}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                          ord.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : ord.status === "processing"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : ord.status === "ready"
                            ? "bg-sky-50 text-sky-700 border-sky-200"
                            : ord.status === "cancelled"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 py-1 rounded-lg bg-[#EBF5FE] text-[#0754C9] hover:bg-[#DDF0FE] font-bold text-[11px]"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-[#0754C9]">Order #{selectedOrder.orderNumber}</span>
                <h3 className="text-base font-extrabold text-[#063B91] mt-0.5">Order Summary</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-500 block">Customer Information</span>
                <p className="font-bold text-slate-800 text-sm">{selectedOrder.customerName}</p>
                <p className="text-slate-600">{selectedOrder.customerPhone}</p>
                {selectedOrder.customerEmail && <p className="text-slate-600">{selectedOrder.customerEmail}</p>}
              </div>

              <div>
                <span className="font-bold text-slate-500 block">Assigned Outlet</span>
                <p className="text-slate-800 font-semibold">{selectedOrder.outletName || "Online Store"}</p>
              </div>

              <div>
                <span className="font-bold text-slate-500 block mb-1">Items Ordered</span>
                <div className="bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-100">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-700">{item.productName}</span>
                      <span className="font-bold text-[#0754C9]">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Order Placed:</span>
                <span className="text-slate-700">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
