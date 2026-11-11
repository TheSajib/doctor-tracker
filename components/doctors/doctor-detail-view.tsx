"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PatientsView } from "@/components/patients/patients-view";
import { panelClass } from "@/components/ui/page-header";
import { formatLongDate } from "@/lib/dates";
import { initials } from "@/lib/format";
import { useDoctorRecord } from "@/lib/use-clinic-data";

export function DoctorDetailView() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { doctor, loading, error } = useDoctorRecord(id);

  if (loading) {
    return <p className="text-sm text-muted">Loading doctor profile…</p>;
  }

  if (!doctor) {
    return (
      <div className={`${panelClass} px-6 py-16 text-center`}>
        <h1 className="font-serif text-4xl font-medium text-ink">
          Doctor not found
        </h1>
        <p className="mt-2 text-sm text-muted">
          {error ?? "This profile is not in the current clinic."}
        </p>
        <Link
          href="/doctors"
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-teal-deep"
        >
          <ChevronLeft className="size-4" />
          Back to doctors
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/doctors"
        className="inline-flex items-center gap-1 text-sm text-muted transition hover:text-ink"
      >
        <ChevronLeft className="size-4" />
        Doctors
      </Link>
      <section className={`${panelClass} mt-4 flex flex-wrap items-center justify-between gap-5 p-5 sm:p-6`}>
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-mint text-base font-semibold text-teal-deep">
            {initials(doctor.name)}
          </span>
          <div>
            <h1 className="font-serif text-3xl leading-none font-medium tracking-tight text-ink sm:text-4xl">
              {doctor.name}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {doctor.specialization} · {doctor.hospital}
            </p>
            <p className="mt-1 text-sm text-[#1f6f64]">
              {doctor.email} · {doctor.phone}
            </p>
            <p className="mt-1 text-xs text-muted">
              Joined {formatLongDate(doctor.joinedAt)}
            </p>
          </div>
        </div>
        <div className="min-w-24 text-left sm:text-right">
          <p className="font-serif text-5xl leading-none text-ink">
            {doctor.patientCount}
          </p>
          <p className="mt-2 text-xs tracking-[0.14em] text-muted uppercase">
            Patients
          </p>
        </div>
      </section>
      <div className="mt-6">
        <PatientsView doctorId={doctor.id} />
      </div>
    </div>
  );
}
