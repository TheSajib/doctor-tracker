import { apiBaseUrl } from "@/lib/config";
import { readSession } from "@/lib/session";
import type {
  AuthUser,
  DashboardData,
  Doctor,
  DoctorInput,
  DoctorQuery,
  DoctorRow,
  Page,
  Patient,
  PatientInput,
  PatientQuery,
  PatientRow,
  Session,
  SignupInput,
} from "@/lib/types";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ErrorBody = { message?: string };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBaseUrl) {
    throw new ApiError("Set NEXT_PUBLIC_API_URL before using the remote API.", 0);
  }

  const token = readSession()?.token;
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (response.status === 204) return undefined as T;

  const body = (await response.json().catch(() => ({}))) as T & ErrorBody;
  if (!response.ok) {
    throw new ApiError(body.message || "Request failed.", response.status);
  }
  return body;
}

function queryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "" || value === "all" || value === "any") {
      continue;
    }
    search.set(key, String(value));
  }
  const value = search.toString();
  return value ? `?${value}` : "";
}

export const http = {
  login(email: string, password: string) {
    return request<Session>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  signup(input: SignupInput) {
    return request<Session>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  me() {
    return request<{ user: AuthUser }>("/auth/me").then((body) => body.user);
  },
  logout() {
    return request<void>("/auth/logout", { method: "POST" });
  },
  listDoctors(query: DoctorQuery) {
    return request<Page<DoctorRow>>(
      `/doctors${queryString({
        search: query.search,
        specialization: query.specialization,
        range: query.range,
        page: query.page,
        limit: query.pageSize,
      })}`,
    );
  },
  listPatients(query: PatientQuery) {
    return request<Page<PatientRow>>(
      `/patients${queryString({
        search: query.search,
        condition: query.condition,
        doctorId: query.doctorId,
        range: query.range,
        page: query.page,
        limit: query.pageSize,
      })}`,
    );
  },
  getDoctor(id: string) {
    return request<DoctorRow>(`/doctors/${id}`);
  },
  getDashboard() {
    return request<DashboardData>("/dashboard");
  },
  createDoctor(input: DoctorInput) {
    return request<Doctor>("/doctors", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  createPatient(input: PatientInput) {
    return request<Patient>("/patients", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  updatePatient(id: string, input: PatientInput) {
    return request<Patient>(`/patients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },
  deletePatient(id: string) {
    return request<void>(`/patients/${id}`, { method: "DELETE" });
  },
};
