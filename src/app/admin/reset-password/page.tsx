"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, KeyRound } from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabase/config";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  // Check for recovery session on mount
  useEffect(() => {
    let isMounted = true;

    async function checkRecoverySession() {
      try {
        // 1. Check if user is currently authenticated via recovery session in cookies/storage
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (session?.user) {
          if (isMounted) {
            setHasValidSession(true);
            setVerifyingSession(false);
          }
          return;
        }

        // 2. Also listen for PASSWORD_RECOVERY event if hash fragment exists (#access_token=...)
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (event === "PASSWORD_RECOVERY" || currentSession?.user) {
            if (isMounted) {
              setHasValidSession(true);
              setVerifyingSession(false);
            }
          }
        });

        // 3. Fallback: check getUser()
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          if (isMounted) {
            setHasValidSession(true);
            setVerifyingSession(false);
          }
          return;
        }

        // Timeout to allow hash processing if needed
        setTimeout(() => {
          if (isMounted) {
            setVerifyingSession(false);
          }
        }, 1200);

        return () => {
          authListener?.subscription.unsubscribe();
        };
      } catch (err) {
        console.warn("Session check notice:", err);
        if (isMounted) {
          setVerifyingSession(false);
        }
      }
    }

    checkRecoverySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      // 1. Try server API route first
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/login");
        }, 3000);
        return;
      }

      // 2. Client-side fallback via Supabase browser client
      const { error: clientUpdateError } = await supabase.auth.updateUser({
        password,
      });

      if (clientUpdateError) {
        throw new Error(clientUpdateError.message || "Failed to update password. Please request a new link.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password. Your reset link may have expired.");
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Password Reset</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#063B91] tracking-tight">
            Create New Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs">
            Choose a strong, unique password to secure your admin account.
          </p>
        </div>

        {/* Verifying Session State */}
        {verifyingSession ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <span className="w-8 h-8 border-3 border-[#0754C9] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-slate-500">Verifying security token...</p>
          </div>
        ) : !hasValidSession && !success ? (
          /* Invalid or Expired Session Warning */
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Invalid or Expired Link</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                This password reset link is invalid or has already been used. For your security, password links expire after one-time use.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/forgot-password"
                className="w-full py-3 px-4 rounded-xl bg-[#0754C9] hover:bg-[#0645B8] text-white font-bold text-xs shadow-md shadow-[#0754C9]/20 transition-all flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Request a New Reset Link</span>
              </Link>
            </div>

            <div className="pt-1">
              <Link
                href="/admin/login"
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : success ? (
          /* Success Screen */
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Password Updated!</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Your password has been changed successfully. You will be redirected to the sign-in page in a moment.
              </p>
            </div>

            <div className="pt-3">
              <Link
                href="/admin/login"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0645B8] to-[#0754C9] text-white font-bold text-xs shadow-md shadow-[#0754C9]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Reset Password Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
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

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 focus:border-[#0754C9] focus:ring-2 focus:ring-[#0754C9]/15 text-sm text-slate-800 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Validation Hints */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    password.length >= 8 ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
                <span className={password.length >= 8 ? "text-emerald-700 font-medium" : ""}>
                  Minimum 8 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    confirmPassword && password === confirmPassword ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
                <span
                  className={
                    confirmPassword && password === confirmPassword
                      ? "text-emerald-700 font-medium"
                      : ""
                  }
                >
                  Passwords match
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || password.length < 8 || password !== confirmPassword}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0645B8] to-[#0754C9] hover:from-[#063B91] hover:to-[#0645B8] text-white font-bold text-sm shadow-md shadow-[#0754C9]/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
