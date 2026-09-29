"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, Trash2, X, Shield, Lock, Mail, User } from "lucide-react";
import { AdminUser } from "@/lib/db";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Omit<AdminUser, "passwordHash">[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Editor" as AdminUser["role"] });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchUsers = async () => {
    try {
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
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#063B91] tracking-tight">Admin Accounts &amp; Security</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage authorized staff members with access to the Sky Laban administration dashboard.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-bold shadow-md shadow-[#0754C9]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin User</span>
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-[#E0EDFA] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading authorized users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-[#E0EDFA] text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8FCFF] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#063B91] to-[#43B8F2] flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {u.name[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">{u.name}</span>
                          <span className="text-[11px] text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EBF5FE] text-[#0754C9] font-bold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {users.length > 1 && (
                        <button
                          onClick={() => handleDelete(u.id, u.email)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete User"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] overflow-hidden">
            <div className="p-5 border-b border-[#E0EDFA] bg-gradient-to-r from-[#EBF5FE] to-white flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#063B91]">Add Admin Account</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 font-semibold">{errorMsg}</div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="e.g. Operations Manager"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#0754C9]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="name@skylaban.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#0754C9]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#0754C9]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminUser["role"] })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none bg-white focus:border-[#0754C9]"
                >
                  <option value="Editor">Editor (Content &amp; Products)</option>
                  <option value="Manager">Manager (Orders &amp; Outlets)</option>
                  <option value="Super Admin">Super Admin (Full Access)</option>
                </select>
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
