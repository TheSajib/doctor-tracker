import type { Metadata } from "next";
import { Suspense } from "react";
import { DoctorDetailView } from "@/components/doctors/doctor-detail-view";

export const metadata: Metadata = {
  title: "Doctor",
};

export default function DoctorDetailPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading doctor profile…</p>}>
      <DoctorDetailView />
    </Suspense>
  );
}
