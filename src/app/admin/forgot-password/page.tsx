"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, KeyRound, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { getMediaUrl } from "@/lib/media";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset link. Please try again.");
      }

      setSubmitted(true);
      setSuccessMsg(
        data.message ||
          "If an account exists with this email address, a password reset link has been dispatched. Please check your inbox and spam folder."
      );
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#EAF6FF] via-[#D8EFFF] to-[#F5FAFF] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Soft Ambient Floating Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#43B8F2]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0754C9]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Clean Centered Card */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-[#DDF5FF] shadow-[0_25px_60px_rgba(7,84,201,0.14)] p-7 sm:p-9 z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="relative w-44 h-14 mb-3">
            <Image
              src={getMediaUrl("/images/sky_laban_logo_transparent.png")}
              alt="Sky Laban"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF6FF] text-[#0754C9] text-xs font-bold tracking-wider uppercase mb-2">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Account Recovery</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#063B91] tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs">
            Enter your admin email and we will send you a secure password reset link.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success View */}
        {submitted ? (
          <div className="space-y-5 text-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Check Your Inbox</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{successMsg}</p>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-left text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-[#0754C9]">Next steps:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                <li>Click the reset link inside the email.</li>
                <li>You will be directed to create a new password.</li>
                <li>Be sure to inspect your spam or junk folder.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Send to another email</span>
              </button>

              <Link
                href="/admin/login"
                className="w-full py-3 px-4 rounded-xl bg-[#0754C9] hover:bg-[#0645B8] text-white font-bold text-xs shadow-md shadow-[#0754C9]/20 transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@skylaban.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#0754C9] focus:ring-2 focus:ring-[#0754C9]/15 text-sm text-slate-800 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0645B8] to-[#0754C9] hover:from-[#063B91] hover:to-[#0645B8] text-white font-bold text-sm shadow-md shadow-[#0754C9]/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0754C9] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
