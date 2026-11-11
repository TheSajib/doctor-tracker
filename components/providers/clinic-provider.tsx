"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { isRemote } from "@/lib/config";
import {
  createDoctorRecord,
  createPatientRecord,
  deletePatientRecord,
  getClinicClientSnapshot,
  getClinicServerSnapshot,
  subscribeClinic,
  updatePatientRecord,
} from "@/lib/clinic-store";
import type { DoctorInput, Patient, PatientInput, Doctor } from "@/lib/types";

type ClinicContextValue = {
  ready: boolean;
  mode: "local" | "remote";
  doctors: Doctor[];
  patients: Patient[];
  revision: number;
  createDoctor: (input: DoctorInput) => Promise<void>;
  createPatient: (input: PatientInput) => Promise<void>;
  updatePatient: (id: string, input: PatientInput) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
};

const ClinicContext = createContext<ClinicContextValue | null>(null);

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const clinic = useSyncExternalStore(
    subscribeClinic,
    getClinicClientSnapshot,
    getClinicServerSnapshot,
  );
  const mode: "local" | "remote" = isRemote ? "remote" : "local";

  const value = useMemo<ClinicContextValue>(
    () => ({
      ready: clinic.ready,
      mode,
      doctors: clinic.doctors,
      patients: clinic.patients,
      revision: clinic.revision,
      createDoctor: createDoctorRecord,
      createPatient: createPatientRecord,
      updatePatient: updatePatientRecord,
      deletePatient: deletePatientRecord,
    }),
    [clinic, mode],
  );

  return (
    <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
  );
}

export function useClinic() {
  const value = useContext(ClinicContext);
  if (!value) throw new Error("useClinic must be used within ClinicProvider");
  return value;
}
