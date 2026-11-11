import { SESSION_COOKIE, SESSION_STORAGE_KEY } from "@/lib/constants";
import type { Session } from "@/lib/types";

const WEEK_SECONDS = 60 * 60 * 24 * 7;

export function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.token || !parsed.user?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(session: Session) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(session.token)}; Path=/; Max-Age=${WEEK_SECONDS}; SameSite=Lax`;
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
