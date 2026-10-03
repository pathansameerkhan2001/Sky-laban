"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { getMediaUrl } from "@/lib/media";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const errorParam = searchParams.get("error");
  const redirectParam = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    if (errorParam === "unauthorized") {
      return "Access restricted: Your account is authenticated in Supabase but lacks administrator privileges.";
    }
    if (errorParam === "auth-code-error") {
      return "The recovery or authentication link has expired or is invalid. Please request a new link.";
    }
    if (errorParam === "session_expired") {
      return "Your session has expired. Please sign in again.";
    }
    return null;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Access restricted to authorized admins.");
      }

      // Safe redirect: use redirect parameter if valid, otherwise go to /admin
      const target =
        redirectParam && redirectParam.startsWith("/admin") && !redirectParam.startsWith("//")
          ? redirectParam
          : "/admin";

      window.location.href = target;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid credentials or unauthorized account. Please check your details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#EAF6FF] via-[#D8EFFF] to-[#F5FAFF] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Soft Ambient Floating Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#43B8F2]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0754C9]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Clean Centered Login Card */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-[#DDF5FF] shadow-[0_25px_60px_rgba(7,84,201,0.14)] p-7 sm:p-9 z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <Image
              src="/images/sky_laban_logo_transparent.png"
              alt="Sky Laban"
              width={180}
              height={64}
              priority
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_2px_10px_rgba(7,84,201,0.22)]"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF6FF] text-[#0754C9] text-xs font-bold tracking-wider uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Administration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#063B91] tracking-tight">
            Sky Laban Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sign in to manage your website content.
          </p>
        </div>

        {/* Password Reset Success Banner */}
        {resetSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Your password has been successfully updated! Please sign in with your new password.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="brandnix.in@gmail.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#0754C9] focus:ring-2 focus:ring-[#0754C9]/15 text-sm text-slate-800 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 focus:border-[#0754C9] focus:ring-2 focus:ring-[#0754C9]/15 text-sm text-slate-800 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-0.5 pb-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-500 hover:text-slate-700 select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-3.5 h-3.5 rounded border-slate-300 text-[#0754C9] focus:ring-[#0754C9]/20 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-xs font-semibold text-[#0754C9] hover:text-[#063B91] hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0645B8] to-[#0754C9] hover:from-[#063B91] hover:to-[#0645B8] text-white font-bold text-sm shadow-md shadow-[#0754C9]/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <a
            href="/"
            className="text-xs font-semibold text-[#0754C9] hover:underline"
          >
            &larr; Back to Sky Laban Public Website
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#EAF6FF] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#0754C9] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

