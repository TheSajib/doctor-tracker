import { CONDITIONS, DOCTOR_PAGE_SIZE, PATIENT_PAGE_SIZE } from "@/lib/constants";
import { formatShortDate, inDateRange, isoDaysAgo, lastNDays } from "@/lib/dates";
import type {
  DashboardData,
  Doctor,
  DoctorQuery,
  DoctorRow,
  Page,
  Patient,
  PatientQuery,
  PatientRow,
} from "@/lib/types";

export function paginate<T>(items: T[], page: number, pageSize: number): Page<T> {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), pages);
  const start = (safePage - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return {
    items: slice,
    total,
    page: safePage,
    pageSize,
    pages,
    from: total === 0 ? 0 : start + 1,
    to: start + slice.length,
  };
}

export function withDoctorCounts(doctors: Doctor[], patients: Patient[]): DoctorRow[] {
  return doctors.map((doctor) => ({
    ...doctor,
    patientCount: patients.filter((patient) => patient.doctorId === doctor.id).length,
  }));
}

export function withDoctorNames(patients: Patient[], doctors: Doctor[]): PatientRow[] {
  const names = new Map(doctors.map((doctor) => [doctor.id, doctor.name]));
  return patients.map((patient) => ({
    ...patient,
    doctorName: names.get(patient.doctorId) ?? "Unassigned",
  }));
}

export function queryDoctors(
  doctors: Doctor[],
  patients: Patient[],
  query: DoctorQuery,
): Page<DoctorRow> {
  const needle = query.search.trim().toLowerCase();
  const rows = withDoctorCounts(doctors, patients)
    .filter((doctor) => {
      if (query.specialization !== "all" && doctor.specialization !== query.specialization) {
        return false;
      }
      if (!inDateRange(doctor.joinedAt, query.range, query.today)) return false;
      if (!needle) return true;
      return [doctor.name, doctor.hospital, doctor.email, doctor.phone, doctor.specialization]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    })
    .sort(
      (a, b) => b.patientCount - a.patientCount || a.name.localeCompare(b.name),
    );
  return paginate(rows, query.page, query.pageSize || DOCTOR_PAGE_SIZE);
}

export function queryPatients(
  doctors: Doctor[],
  patients: Patient[],
  query: PatientQuery,
): Page<PatientRow> {
  const needle = query.search.trim().toLowerCase();
  const rows = withDoctorNames(patients, doctors)
    .filter((patient) => {
      if (query.doctorId && patient.doctorId !== query.doctorId) return false;
      if (query.condition !== "all" && patient.condition !== query.condition) return false;
      if (!inDateRange(patient.admittedAt, query.range, query.today)) return false;
      if (!needle) return true;
      return [patient.name, patient.phone, patient.doctorName]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    })
    .sort(
      (a, b) => b.admittedAt.localeCompare(a.admittedAt) || a.id.localeCompare(b.id),
    );
  return paginate(rows, query.page, query.pageSize || PATIENT_PAGE_SIZE);
}

export function findDoctor(
  doctors: Doctor[],
  patients: Patient[],
  id: string,
): DoctorRow | null {
  const doctor = doctors.find((item) => item.id === id);
  if (!doctor) return null;
  return withDoctorCounts([doctor], patients)[0] ?? null;
}

export function buildDashboard(
  doctors: Doctor[],
  patients: Patient[],
  today: string,
): DashboardData {
  const from7 = isoDaysAgo(6, today);
  const days = lastNDays(30, today);
  const points = new Map(
    days.map((date) => [
      date,
      {
        date,
        label: formatShortDate(date),
        registrations: 0,
        critical: 0,
      },
    ]),
  );

  for (const patient of patients) {
    const point = points.get(patient.admittedAt);
    if (!point) continue;
    point.registrations += 1;
    if (patient.condition === "Critical") point.critical += 1;
  }

  const totalDoctors = doctors.length;
  const totalPatients = patients.length;

  return {
    totalDoctors,
    totalPatients,
    newPatients7d: patients.filter((patient) => patient.admittedAt >= from7).length,
    criticalCases: patients.filter((patient) => patient.condition === "Critical").length,
    avgPerDoctor: totalDoctors === 0 ? 0 : totalPatients / totalDoctors,
    conditions: CONDITIONS.map((condition) => ({
      condition,
      count: patients.filter((patient) => patient.condition === condition).length,
    })),
    patientsPerDoctor: withDoctorCounts(doctors, patients)
      .map((doctor) => ({
        id: doctor.id,
        name: doctor.name,
        count: doctor.patientCount,
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    registrations: days.map((date) => points.get(date)!),
  };
}
