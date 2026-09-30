import { cookies } from "next/headers";
import crypto from "crypto";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./supabase/config";

const SESSION_COOKIE_NAME = "skylaban_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "skylaban-secret-key-cream-desserts-2025";
const ALLOWED_ADMIN_ROLES = ["admin", "super admin", "super_admin", "editor", "administrator"];
const KNOWN_ADMIN_EMAILS = ["adnix.in@gmail.com"];
const KNOWN_ADMIN_UUIDS = ["53177535-cbd5-4f02-b7c5-ce9cabc4c6f6"];

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: string;
  expiresAt: number;
}

// Simple deterministic base64url encoder / decoder with HMAC signature
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
}

export function createToken(session: AdminSession): string {
  const payload = JSON.stringify(session);
  const encodedPayload = base64UrlEncode(payload);
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): AdminSession | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encodedPayload, signature] = parts;
    const expectedSignature = sign(encodedPayload);
    if (signature !== expectedSignature) return null;

    const payload = base64UrlDecode(encodedPayload);
    const session: AdminSession = JSON.parse(payload);

    if (Date.now() > session.expiresAt) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function setAdminSessionCookie(session: AdminSession): Promise<void> {
  const token = createToken(session);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();

    // 1. Primary: Verify authenticated user from Supabase Auth server
    try {
      const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        let isAuthorized = false;
        let role = user.app_metadata?.role || user.user_metadata?.role || "admin";
        let displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin";

        // Check public.admin_users table
        try {
          const { data: byUserId } = await supabase
            .from("admin_users")
            .select("id, user_id, email, display_name, role")
            .eq("user_id", user.id)
            .maybeSingle();

          if (byUserId && ALLOWED_ADMIN_ROLES.includes(String(byUserId.role).trim().toLowerCase())) {
            isAuthorized = true;
            role = byUserId.role || role;
            displayName = byUserId.display_name || displayName;
          } else {
            const { data: byId } = await supabase
              .from("admin_users")
              .select("id, user_id, email, display_name, role")
              .eq("id", user.id)
              .maybeSingle();

            if (byId && ALLOWED_ADMIN_ROLES.includes(String(byId.role).trim().toLowerCase())) {
              isAuthorized = true;
              role = byId.role || role;
              displayName = byId.display_name || displayName;
            } else if (user.email) {
              const { data: byEmail } = await supabase
                .from("admin_users")
                .select("id, user_id, email, display_name, role")
                .eq("email", user.email.toLowerCase().trim())
                .maybeSingle();

              if (byEmail && ALLOWED_ADMIN_ROLES.includes(String(byEmail.role).trim().toLowerCase())) {
                isAuthorized = true;
                role = byEmail.role || role;
                displayName = byEmail.display_name || displayName;
              }
            }
          }
        } catch {}

        if (!isAuthorized) {
          const appRole = String(user.app_metadata?.role || user.user_metadata?.role || "").trim().toLowerCase();
          if (ALLOWED_ADMIN_ROLES.includes(appRole)) {
            isAuthorized = true;
          }

          const envEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
            .toLowerCase()
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean);
          const allAllowedEmails = [...KNOWN_ADMIN_EMAILS, ...envEmails];

          if (
            (user.email && allAllowedEmails.includes(user.email.toLowerCase().trim())) ||
            KNOWN_ADMIN_UUIDS.includes(user.id)
          ) {
            isAuthorized = true;
          }
        }

        if (isAuthorized) {
          return {
            userId: user.id,
            email: user.email || "",
            name: displayName,
            role,
            expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
          };
        }
      }
    } catch {}

    // 2. Fallback: Verify signed admin session cookie
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}
