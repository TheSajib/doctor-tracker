import type { Condition, DateRange } from "@/lib/types";

export const DOCTOR_PAGE_SIZE = 6;
export const PATIENT_PAGE_SIZE = 8;

export const DEMO_ACCOUNT = {
  name: "Sajib",
  email: "sajibcse28@gmail.com",
  password: "Admin@123",
};

export const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Neurology",
  "Pediatrics",
  "Gynecology",
  "Oncology",
  "General Medicine",
] as const;

export const CONDITIONS: Condition[] = [
  "Stable",
  "Recovering",
  "Critical",
  "Under Observation",
];

export const GENDERS = ["Male", "Female", "Other"] as const;

export const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "any", label: "Any time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export const CONDITION_META: Record<
  Condition,
  { badge: string; chart: string }
> = {
  Stable: { badge: "bg-[#e5f6f1] text-[#0f8f7c]", chart: "#14b89a" },
  Recovering: { badge: "bg-[#e6f6ec] text-[#1c8a52]", chart: "#7dcea0" },
  Critical: { badge: "bg-[#fdecea] text-[#d4533c]", chart: "#f0a36a" },
  "Under Observation": {
    badge: "bg-[#fff4df] text-[#b7791f]",
    chart: "#ef6d6d",
  },
};

export const SESSION_STORAGE_KEY = "dt.session.v1";
export const USERS_STORAGE_KEY = "dt.users.v1";
export const CLINIC_STORAGE_KEY = "dt.clinic.v1";
export const SESSION_COOKIE = "dt_session";
