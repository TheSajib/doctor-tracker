import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatLongDate } from "@/lib/dates";
import { initials } from "@/lib/format";
import type { DoctorRow } from "@/lib/types";

export function DoctorsTable({ rows }: { rows: DoctorRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left">
        <thead className="bg-[#f7fbfa] text-[11px] tracking-[0.14em] text-muted uppercase">
          <tr>
            <th className="px-5 py-3 font-medium">Doctor</th>
            <th className="px-4 py-3 font-medium">Hospital</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 text-center font-medium">Patients</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            <th className="px-4 py-3 text-right font-medium">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-14 text-center text-sm text-muted">
                No doctors match these filters.
              </td>
            </tr>
          ) : (
            rows.map((doctor) => (
              <tr key={doctor.id} className="border-t border-line">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint text-[11px] font-semibold text-teal-deep">
                      {initials(doctor.name)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">{doctor.name}</p>
                      <p className="text-xs text-muted">{doctor.specialization}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-ink">{doctor.hospital}</td>
                <td className="px-4 py-3.5">
                  <p className="text-sm text-[#1f6f64]">{doctor.email}</p>
                  <p className="text-xs text-muted">{doctor.phone}</p>
                </td>
                <td className="px-4 py-3.5 text-center text-sm text-ink tabular-nums">
                  {doctor.patientCount}
                </td>
                <td className="px-4 py-3.5 text-sm text-muted">
                  {formatLongDate(doctor.joinedAt)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href={`/doctors/${doctor.id}`}
                    className="inline-flex items-center gap-1 text-sm text-muted transition hover:text-ink"
                  >
                    View
                    <ArrowUpRight className="size-4" />
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
