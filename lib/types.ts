export type Gender = "Male" | "Female" | "Other";

export type Condition =
  | "Stable"
  | "Recovering"
  | "Critical"
  | "Under Observation";

export type DateRange = "any" | "7d" | "30d" | "90d";

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  joinedAt: string;
};

export type Patient = {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  phone: string;
  condition: Condition;
  doctorId: string;
  admittedAt: string;
  notes: string;
};

export type DoctorInput = {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
};

export type PatientInput = {
  name: string;
  gender: Gender;
  age: number;
  phone: string;
  condition: Condition;
  doctorId: string;
  notes: string;
};

export type DoctorRow = Doctor & { patientCount: number };

export type PatientRow = Patient & { doctorName: string };

export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
  from: number;
  to: number;
};

export type DoctorQuery = {
  search: string;
  specialization: string;
  range: DateRange;
  page: number;
  pageSize: number;
  today: string;
};

export type PatientQuery = {
  search: string;
  condition: string;
  doctorId?: string;
  range: DateRange;
  page: number;
  pageSize: number;
  today: string;
};

export type RegistrationPoint = {
  date: string;
  label: string;
  registrations: number;
  critical: number;
};

export type DashboardData = {
  totalDoctors: number;
  totalPatients: number;
  newPatients7d: number;
  criticalCases: number;
  avgPerDoctor: number;
  conditions: { condition: Condition; count: number }[];
  patientsPerDoctor: { id: string; name: string; count: number }[];
  registrations: RegistrationPoint[];
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type Session = {
  token: string;
  user: AuthUser;
};

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type StoredUser = AuthUser & { password: string };

export type ClinicData = {
  doctors: Doctor[];
  patients: Patient[];
};
