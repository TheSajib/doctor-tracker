"use client";

import { useEffect, useMemo, useState } from "react";
import { useClinic } from "@/components/providers/clinic-provider";
import { http } from "@/lib/api";
import { useTodayIso } from "@/lib/today";
import { DOCTOR_PAGE_SIZE, PATIENT_PAGE_SIZE } from "@/lib/constants";
import {
  buildDashboard,
  findDoctor,
  paginate,
  queryDoctors,
  queryPatients,
} from "@/lib/queries";
import type {
  DashboardData,
  DateRange,
  Doctor,
  DoctorRow,
  Page,
  PatientRow,
} from "@/lib/types";

function message(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export function useDoctorPage(input: {
  search: string;
  specialization: string;
  range: DateRange;
  page: number;
}) {
  const { search, specialization, range, page } = input;
  const clinic = useClinic();
  const today = useTodayIso();
  const localPage = useMemo(
    () =>
      queryDoctors(clinic.doctors, clinic.patients, {
        search,
        specialization,
        range,
        page,
        pageSize: DOCTOR_PAGE_SIZE,
        today,
      }),
    [clinic.doctors, clinic.patients, search, specialization, range, page, today],
  );
  const [remotePage, setRemotePage] = useState<Page<DoctorRow> | null>(null);
  const [loading, setLoading] = useState(clinic.mode === "remote");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clinic.mode !== "remote") return;
    let active = true;
    const handle = window.setTimeout(() => {
      setLoading(true);
      http
        .listDoctors({
          search,
          specialization,
          range,
          page,
          pageSize: DOCTOR_PAGE_SIZE,
          today,
        })
        .then((result) => {
          if (!active) return;
          setRemotePage(result);
          setError(null);
        })
        .catch((reason: unknown) => {
          if (active) setError(message(reason));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 200);
    return () => {
      active = false;
      window.clearTimeout(handle);
    };
  }, [clinic.mode, clinic.revision, search, specialization, range, page, today]);

  if (clinic.mode === "local") {
    return { page: localPage, loading: false, error: null };
  }

  return {
    page:
      remotePage ??
      paginate([], input.page, DOCTOR_PAGE_SIZE),
    loading,
    error,
  };
}

export function usePatientPage(input: {
  search: string;
  condition: string;
  range: DateRange;
  page: number;
  doctorId?: string;
}) {
  const { search, condition, range, page, doctorId } = input;
  const clinic = useClinic();
  const today = useTodayIso();
  const localPage = useMemo(
    () =>
      queryPatients(clinic.doctors, clinic.patients, {
        search,
        condition,
        range,
        page,
        doctorId,
        pageSize: PATIENT_PAGE_SIZE,
        today,
      }),
    [
      clinic.doctors,
      clinic.patients,
      search,
      condition,
      range,
      page,
      doctorId,
      today,
    ],
  );
  const [remotePage, setRemotePage] = useState<Page<PatientRow> | null>(null);
  const [loading, setLoading] = useState(clinic.mode === "remote");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clinic.mode !== "remote") return;
    let active = true;
    const handle = window.setTimeout(() => {
      setLoading(true);
      http
        .listPatients({
          search,
          condition,
          range,
          page,
          doctorId,
          pageSize: PATIENT_PAGE_SIZE,
          today,
        })
        .then((result) => {
          if (!active) return;
          setRemotePage(result);
          setError(null);
        })
        .catch((reason: unknown) => {
          if (active) setError(message(reason));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 200);
    return () => {
      active = false;
      window.clearTimeout(handle);
    };
  }, [clinic.mode, clinic.revision, search, condition, range, page, doctorId, today]);

  if (clinic.mode === "local") {
    return { page: localPage, loading: false, error: null };
  }

  return {
    page: remotePage ?? paginate([], input.page, PATIENT_PAGE_SIZE),
    loading,
    error,
  };
}

export function useDoctorRecord(id: string) {
  const clinic = useClinic();
  const localDoctor = useMemo(
    () => findDoctor(clinic.doctors, clinic.patients, id),
    [clinic.doctors, clinic.patients, id],
  );
  const [remoteDoctor, setRemoteDoctor] = useState<DoctorRow | null>(null);
  const [loading, setLoading] = useState(clinic.mode === "remote");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clinic.mode !== "remote") return;
    let active = true;
    http
      .getDoctor(id)
      .then((doctor) => {
        if (!active) return;
        setRemoteDoctor(doctor);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setRemoteDoctor(null);
        setError(message(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [clinic.mode, clinic.revision, id]);

  if (clinic.mode === "local") {
    return { doctor: localDoctor, loading: false, error: null };
  }
  return { doctor: remoteDoctor, loading, error };
}

export function useDashboardData() {
  const clinic = useClinic();
  const today = useTodayIso();
  const localData = useMemo(
    () => buildDashboard(clinic.doctors, clinic.patients, today),
    [clinic.doctors, clinic.patients, today],
  );
  const [remoteData, setRemoteData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(clinic.mode === "remote");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clinic.mode !== "remote") return;
    let active = true;
    http
      .getDashboard()
      .then((data) => {
        if (!active) return;
        setRemoteData(data);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (active) setError(message(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [clinic.mode, clinic.revision]);

  if (clinic.mode === "local") {
    return { data: localData, loading: false, error: null };
  }
  return { data: remoteData, loading, error };
}

export function useDoctorOptions(): Doctor[] {
  const clinic = useClinic();
  const today = useTodayIso();
  const [remoteDoctors, setRemoteDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    if (clinic.mode !== "remote") return;
    let active = true;
    http
      .listDoctors({
        search: "",
        specialization: "all",
        range: "any",
        page: 1,
        pageSize: 100,
        today,
      })
      .then((page) => {
        if (active) setRemoteDoctors(page.items);
      })
      .catch(() => {
        if (active) setRemoteDoctors([]);
      });
    return () => {
      active = false;
    };
  }, [clinic.mode, clinic.revision, today]);

  return clinic.mode === "local" ? clinic.doctors : remoteDoctors;
}
