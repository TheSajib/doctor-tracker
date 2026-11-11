import { Pencil, Trash2 } from "lucide-react";
import { CONDITION_META } from "@/lib/constants";
import { formatLongDate } from "@/lib/dates";
import { initials } from "@/lib/format";
import type { Condition, PatientRow } from "@/lib/types";

export function PatientsTable({
  rows,
  showDoctor = true,
  onEdit,
  onDelete,
}: {
  rows: PatientRow[];
  showDoctor?: boolean;
  onEdit: (patient: PatientRow) => void;
  onDelete: (patient: PatientRow) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left">
        <thead className="bg-[#f7fbfa] text-[11px] tracking-[0.14em] text-muted uppercase">
          <tr>
            <th className="px-5 py-3 font-medium">Patient</th>
            <th className="px-4 py-3 font-medium">Condition</th>
            {showDoctor ? <th className="px-4 py-3 font-medium">Doctor</th> : null}
            <th className="px-4 py-3 font-medium">Admitted</th>
            <th className="px-4 py-3 text-right font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={showDoctor ? 5 : 4}
                className="px-5 py-14 text-center text-sm text-muted"
              >
                No patients match these filters.
              </td>
            </tr>
          ) : (
            rows.map((patient) => (
              <tr key={patient.id} className="border-t border-line">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint text-[11px] font-semibold text-teal-deep">
                      {initials(patient.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{patient.name}</p>
                      <p className="text-xs text-muted">
                        {patient.gender} · {patient.age} yrs · {patient.phone}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <ConditionPill condition={patient.condition} />
                </td>
                {showDoctor ? (
                  <td className="px-4 py-3.5 text-sm text-ink">{patient.doctorName}</td>
                ) : null}
                <td className="px-4 py-3.5 text-sm text-muted">
                  {formatLongDate(patient.admittedAt)}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${patient.name}`}
                      onClick={() => onEdit(patient)}
                      className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-mint hover:text-ink"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${patient.name}`}
                      onClick={() => onDelete(patient)}
                      className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ConditionPill({ condition }: { condition: Condition }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${CONDITION_META[condition].badge}`}
    >
      {condition}
    </span>
  );
}
