import { Suspense } from "react";
import { PortalShell } from "@/components/layout/portal-shell";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-canvas text-sm text-muted">
          Opening workspace
        </div>
      }
    >
      <PortalShell>{children}</PortalShell>
    </Suspense>
  );
}
