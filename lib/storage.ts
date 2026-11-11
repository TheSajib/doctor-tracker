import { CLINIC_STORAGE_KEY, USERS_STORAGE_KEY } from "@/lib/constants";
import { createSeedClinic, createSeedUsers } from "@/lib/seed";
import type { ClinicData, StoredUser } from "@/lib/types";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readUsers(): StoredUser[] {
  if (!canUseStorage()) return createSeedUsers();
  const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    const seeded = createSeedUsers();
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    if (!Array.isArray(parsed)) throw new Error("Invalid users");
    return parsed;
  } catch {
    const seeded = createSeedUsers();
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function writeUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function readClinic(): ClinicData {
  if (!canUseStorage()) return { doctors: [], patients: [] };
  const raw = window.localStorage.getItem(CLINIC_STORAGE_KEY);
  if (!raw) {
    const seeded = createSeedClinic();
    window.localStorage.setItem(CLINIC_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw) as ClinicData;
    if (!Array.isArray(parsed.doctors) || !Array.isArray(parsed.patients)) {
      throw new Error("Invalid clinic");
    }
    return parsed;
  } catch {
    const seeded = createSeedClinic();
    window.localStorage.setItem(CLINIC_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function writeClinic(data: ClinicData) {
  window.localStorage.setItem(CLINIC_STORAGE_KEY, JSON.stringify(data));
}
