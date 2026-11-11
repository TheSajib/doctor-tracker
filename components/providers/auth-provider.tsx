"use client";

import { useEffect, createContext, useContext, useMemo, useSyncExternalStore } from "react";
import {
  getAuthClientSnapshot,
  getAuthServerSnapshot,
  loginWithPassword,
  logoutAccount,
  refreshRemoteSession,
  signupAccount,
  subscribeAuth,
} from "@/lib/auth-store";
import type { AuthUser, SignupInput } from "@/lib/types";

type AuthContextValue = {
  ready: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useSyncExternalStore(
    subscribeAuth,
    getAuthClientSnapshot,
    getAuthServerSnapshot,
  );

  useEffect(() => {
    void refreshRemoteSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready: auth.ready,
      user: auth.user,
      login: loginWithPassword,
      signup: signupAccount,
      logout: logoutAccount,
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
