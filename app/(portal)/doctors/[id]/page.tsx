import type { Metadata } from "next";
import { DoctorDetailView } from "@/components/doctors/doctor-detail-view";

export const metadata: Metadata = {
  title: "Doctor",
};

export default function DoctorDetailPage() {
  return <DoctorDetailView />;
}
