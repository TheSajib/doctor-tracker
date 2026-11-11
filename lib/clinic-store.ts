import { http } from "@/lib/api";
import { isRemote } from "@/lib/config";
import { currentIsoDate, isoDaysAgo } from "@/lib/dates";
import { readClinic, writeClinic } from "@/lib/storage";
import type { ClinicData, DoctorInput, PatientInput } from "@/lib/types";

type ClinicSnapshot = ClinicData & {
  ready: boolean;
  revision: number;
};

const serverSnapshot: ClinicSnapshot = {
  doctors: [],
  patients: [],
  ready: false,
  revision: 0,
};

const remoteSnapshotBase: ClinicSnapshot = {
  doctors: [],
  patients: [],
  ready: true,
  revision: 0,
};

let localSnapshot: ClinicSnapshot = serverSnapshot;
let remoteSnapshot: ClinicSnapshot = remoteSnapshotBase;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function ensure() {
  if (loaded || typeof window === "undefined" || isRemote) return;
  loaded = true;
  const data = readClinic();
  localSnapshot = { ...data, ready: true, revision: 0 };
}

export function subscribeClinic(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getClinicClientSnapshot() {
  if (isRemote) return remoteSnapshot;
  ensure();
  return localSnapshot;
}

export function getClinicServerSnapshot() {
  return isRemote ? remoteSnapshotBase : serverSnapshot;
}

function commit(next: ClinicData) {
  localSnapshot = { ...next, ready: true, revision: 0 };
  writeClinic(next);
  emit();
}

function bumpRemote() {
  remoteSnapshot = {
    ...remoteSnapshot,
    revision: remoteSnapshot.revision + 1,
  };
  emit();
}

export async function createDoctorRecord(input: DoctorInput) {
  if (isRemote) {
    await http.createDoctor(input);
    bumpRemote();
    return;
  }

  ensure();
  if (localSnapshot.doctors.some((doctor) => doctor.email === input.email)) {
    throw new Error("A doctor with this email already exists.");
  }
  commit({
    doctors: [
      ...localSnapshot.doctors,
      { ...input, id: crypto.randomUUID(), joinedAt: isoDaysAgo(0, currentIsoDate()) },
    ],
    patients: localSnapshot.patients,
  });
}

export async function createPatientRecord(input: PatientInput) {
  if (isRemote) {
    await http.createPatient(input);
    bumpRemote();
    return;
  }

  ensure();
  if (!localSnapshot.doctors.some((doctor) => doctor.id === input.doctorId)) {
    throw new Error("Assign a doctor who is already in the network.");
  }
  commit({
    doctors: localSnapshot.doctors,
    patients: [
      ...localSnapshot.patients,
      { ...input, id: crypto.randomUUID(), admittedAt: isoDaysAgo(0, currentIsoDate()) },
    ],
  });
}

export async function updatePatientRecord(id: string, input: PatientInput) {
  if (isRemote) {
    await http.updatePatient(id, input);
    bumpRemote();
    return;
  }

  ensure();
  const existing = localSnapshot.patients.find((patient) => patient.id === id);
  if (!existing) throw new Error("This patient is no longer on the list.");
  if (!localSnapshot.doctors.some((doctor) => doctor.id === input.doctorId)) {
    throw new Error("Assign a doctor who is already in the network.");
  }
  commit({
    doctors: localSnapshot.doctors,
    patients: localSnapshot.patients.map((patient) =>
      patient.id === id ? { ...patient, ...input } : patient,
    ),
  });
}

export async function deletePatientRecord(id: string) {
  if (isRemote) {
    await http.deletePatient(id);
    bumpRemote();
    return;
  }

  ensure();
  commit({
    doctors: localSnapshot.doctors,
    patients: localSnapshot.patients.filter((patient) => patient.id !== id),
  });
}
