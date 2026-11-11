import { ApiError, http } from "@/lib/api";
import { isRemoteAuth } from "@/lib/config";
import { cleanText, normalizeEmail } from "@/lib/format";
import { clearSession, readSession, writeSession } from "@/lib/session";
import { readUsers, writeUsers } from "@/lib/storage";
import type { AuthUser, Session, SignupInput } from "@/lib/types";

type AuthSnapshot = {
  ready: boolean;
  user: AuthUser | null;
};

const serverSnapshot: AuthSnapshot = { ready: false, user: null };
let snapshot: AuthSnapshot = serverSnapshot;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function ensure() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const session = readSession();
  if (isRemoteAuth && session) {
    snapshot = { ready: false, user: null };
    return;
  }
  snapshot = { ready: true, user: session?.user ?? null };
}

export function subscribeAuth(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAuthClientSnapshot() {
  ensure();
  return snapshot;
}

export function getAuthServerSnapshot() {
  return serverSnapshot;
}

function commit(session: Session | null) {
  snapshot = { ready: true, user: session?.user ?? null };
  if (session) writeSession(session);
  else clearSession();
  emit();
}

function unreachable(error: unknown): never {
  if (error instanceof TypeError) {
    throw new Error("Cannot reach the clinic API. Start the backend and try again.");
  }
  throw error;
}

export async function refreshRemoteSession() {
  if (!isRemoteAuth || typeof window === "undefined") return;
  const tokenAtStart = readSession()?.token;
  if (!tokenAtStart) return;
  try {
    const user = await http.me();
    if (readSession()?.token !== tokenAtStart) return;
    commit({ token: tokenAtStart, user });
  } catch (error) {
    if (readSession()?.token !== tokenAtStart) return;
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      commit(null);
      return;
    }
    const current = readSession();
    snapshot = { ready: true, user: current?.user ?? null };
    emit();
  }
}

export async function loginWithPassword(email: string, password: string) {
  if (isRemoteAuth) {
    try {
      const session = await http.login(normalizeEmail(email), password);
      commit(session);
    } catch (error) {
      unreachable(error);
    }
    return;
  }

  const account = readUsers().find((item) => item.email === normalizeEmail(email));
  if (!account || account.password !== password) {
    throw new Error("Email or password is incorrect.");
  }
  commit({
    token: crypto.randomUUID(),
    user: { id: account.id, name: account.name, email: account.email },
  });
}

export async function signupAccount(input: SignupInput) {
  const email = normalizeEmail(input.email);
  const name = cleanText(input.name);

  if (isRemoteAuth) {
    try {
      const session = await http.signup({ name, email, password: input.password });
      commit(session);
    } catch (error) {
      unreachable(error);
    }
    return;
  }

  const users = readUsers();
  if (users.some((item) => item.email === email)) {
    throw new Error("An account with this email already exists.");
  }
  const account = {
    id: crypto.randomUUID(),
    name,
    email,
    password: input.password,
  };
  writeUsers([...users, account]);
  commit({
    token: crypto.randomUUID(),
    user: { id: account.id, name, email },
  });
}

export function logoutAccount() {
  if (isRemoteAuth && readSession()?.token) {
    void http.logout().catch(() => {});
  }
  commit(null);
}
