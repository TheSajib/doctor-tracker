import { normalizeEmail, normalizePhone, cleanText } from "@/lib/format";
import type { DoctorInput, PatientInput } from "@/lib/types";

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+[1-9]\d{9,14}$/;

export function validateDoctor(
  input: DoctorInput,
): FieldErrors<"name" | "specialization" | "hospital" | "phone" | "email"> {
  const errors: FieldErrors<
    "name" | "specialization" | "hospital" | "phone" | "email"
  > = {};
  const name = cleanText(input.name);
  if (name.length < 3) errors.name = "Name is too short";
  else if (name.length > 80) errors.name = "Name is too long";
  if (!input.specialization.trim()) errors.specialization = "Required";
  if (cleanText(input.hospital).length < 2) errors.hospital = "Required";
  if (!phonePattern.test(normalizePhone(input.phone))) {
    errors.phone = "Invalid phone";
  }
  if (!emailPattern.test(normalizeEmail(input.email))) {
    errors.email = "Invalid email";
  }
  return errors;
}

export function validatePatient(
  input: {
    name: string;
    age: string;
    phone: string;
    doctorId: string;
    notes: string;
  },
): FieldErrors<"name" | "age" | "phone" | "doctorId" | "notes"> {
  const errors: FieldErrors<"name" | "age" | "phone" | "doctorId" | "notes"> =
    {};
  const name = cleanText(input.name);
  if (name.length < 3) errors.name = "Name is too short";
  else if (name.length > 80) errors.name = "Name is too long";
  const age = Number(input.age);
  if (!input.age.trim()) errors.age = "Required";
  else if (!Number.isInteger(age) || age < 0 || age > 120) {
    errors.age = "Enter a valid age";
  }
  if (!phonePattern.test(normalizePhone(input.phone))) {
    errors.phone = "Invalid phone";
  }
  if (!input.doctorId) errors.doctorId = "Required";
  if (input.notes.trim().length > 500) {
    errors.notes = "Keep notes under 500 characters";
  }
  return errors;
}

export function toDoctorInput(input: DoctorInput): DoctorInput {
  return {
    name: cleanText(input.name),
    specialization: input.specialization.trim(),
    hospital: cleanText(input.hospital),
    phone: normalizePhone(input.phone),
    email: normalizeEmail(input.email),
  };
}

export function toPatientInput(
  input: Omit<PatientInput, "age"> & { age: string },
): PatientInput {
  return {
    name: cleanText(input.name),
    gender: input.gender,
    age: Number(input.age),
    phone: normalizePhone(input.phone),
    condition: input.condition,
    doctorId: input.doctorId,
    notes: input.notes.trim(),
  };
}

export function hasErrors(errors: object) {
  return Object.values(errors).some(Boolean);
}

export function validateSignup(input: {
  name: string;
  email: string;
  password: string;
  confirm: string;
}) {
  const errors: FieldErrors<"name" | "email" | "password" | "confirm"> = {};
  if (cleanText(input.name).length < 2) errors.name = "Name is too short";
  if (!emailPattern.test(normalizeEmail(input.email))) {
    errors.email = "Invalid email";
  }
  if (input.password.length < 8) errors.password = "Use at least 8 characters";
  if (input.password !== input.confirm) errors.confirm = "Passwords do not match";
  return errors;
}
