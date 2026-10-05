"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, Lock, Mail, User, ShieldCheck, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { AdminUser } from "@/lib/db";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Omit<AdminUser, "passwordHash">[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Editor" as AdminUser["role"] });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Delete admin user "${email}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setSuccessMsg(`User ${email} removed.`);
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        alert(data.error || "Cannot delete user");
      }
    } catch {
      alert("Error deleting user");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.name || !newUser.password) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchUsers();
        setIsModalOpen(false);
        setNewUser({ name: "", email: "", password: "", role: "Editor" });
        setSuccessMsg("Admin user created successfully.");
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        setErrorMsg(data.error || "Failed to save user");
      }
    } catch {
      setErrorMsg("Error creating user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Admin Accounts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage authorized staff members with access to the Sky Laban administration panel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchUsers}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh"
            aria-label="Refresh users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMsg("");
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Admin User</span>
          </button>
        </div>
      </div>

      {/* Users Table / List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EBF5FE] text-[#0754C9] border border-sky-200 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name[0]?.toUpperCase() || "A"}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 block truncate">{u.name}</span>
                          <span className="text-[11px] text-slate-500 truncate">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EBF5FE] text-[#0754C9] border border-sky-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {users.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(u.id, u.email)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete User"
                          aria-label={`Delete ${u.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Add Admin Account</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto">
              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="e.g. Operations Manager"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-[#0754C9] text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="brandnix.in@gmail.com"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-[#0754C9] text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-[#0754C9] text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminUser["role"] })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-[#0754C9] text-xs outline-none"
                >
                  <option value="Editor">Editor (Content &amp; Products)</option>
                  <option value="Manager">Manager (Operations &amp; Outlets)</option>
                  <option value="Super Admin">Super Admin (Full Access)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#0754C9] text-white hover:bg-[#0645B8] font-semibold shadow-2xs disabled:opacity-60"
                >
                  {saving ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
