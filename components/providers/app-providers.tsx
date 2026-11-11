"use client";

import { AuthProvider } from "@/components/providers/auth-provider";
import { ClinicProvider } from "@/components/providers/clinic-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ClinicProvider>{children}</ClinicProvider>
    </AuthProvider>
  );
}
