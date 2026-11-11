import { DEMO_ACCOUNT } from "@/lib/constants";
import { currentIsoDate, isoDaysAgo } from "@/lib/dates";
import type { ClinicData, Condition, Gender, StoredUser } from "@/lib/types";

const doctors = [
  {
    id: "doc_rafiq",
    name: "Dr. Rafiq Islam",
    specialization: "Cardiology",
    hospital: "Ibn Sina Hospital",
    phone: "+8801710002005",
    email: "rafiq@ibnsina.com",
    joinedDaysAgo: 6,
  },
  {
    id: "doc_farhana",
    name: "Dr. Farhana Akter",
    specialization: "Dermatology",
    hospital: "Square Hospital",
    phone: "+8801710002006",
    email: "farhana@square.com",
    joinedDaysAgo: 11,
  },
  {
    id: "doc_tanvir",
    name: "Dr. Tanvir Ahmed",
    specialization: "Orthopedics",
    hospital: "LabAid Hospital",
    phone: "+8801710002004",
    email: "tanvir@labaid.com",
    joinedDaysAgo: 22,
  },
  {
    id: "doc_nusrat",
    name: "Dr. Nusrat Jahan",
    specialization: "Neurology",
    hospital: "United Hospital",
    phone: "+8801710002008",
    email: "nusrat@united.com",
    joinedDaysAgo: 21,
  },
  {
    id: "doc_imran",
    name: "Dr. Imran Hossain",
    specialization: "Neurology",
    hospital: "Evercare Hospital",
    phone: "+8801710002007",
    email: "imran@evercare.com",
    joinedDaysAgo: 25,
  },
  {
    id: "doc_ayesha",
    name: "Dr. Ayesha Rahman",
    specialization: "Cardiology",
    hospital: "Square Hospital",
    phone: "+8801710002001",
    email: "ayesha@square.com",
    joinedDaysAgo: 29,
  },
] as const;

const namedPatients: Array<{
  id: string;
  name: string;
  gender: Gender;
  age: number;
  phone: string;
  condition: Condition;
  doctorId: string;
  daysAgo: number;
}> = [
  {
    id: "pat_01",
    name: "Salma Khan",
    gender: "Male",
    age: 71,
    phone: "+8801988348754",
    condition: "Recovering",
    doctorId: "doc_tanvir",
    daysAgo: 6,
  },
  {
    id: "pat_02",
    name: "Salma Khan",
    gender: "Male",
    age: 50,
    phone: "+88019160773549",
    condition: "Recovering",
    doctorId: "doc_nusrat",
    daysAgo: 6,
  },
  {
    id: "pat_03",
    name: "Rahim Roy",
    gender: "Male",
    age: 48,
    phone: "+8801924065745",
    condition: "Critical",
    doctorId: "doc_imran",
    daysAgo: 9,
  },
  {
    id: "pat_04",
    name: "Rahim Sarkar",
    gender: "Male",
    age: 19,
    phone: "+8801941058932",
    condition: "Recovering",
    doctorId: "doc_ayesha",
    daysAgo: 9,
  },
  {
    id: "pat_05",
    name: "Rina Khan",
    gender: "Male",
    age: 45,
    phone: "+8801688470425",
    condition: "Under Observation",
    doctorId: "doc_rafiq",
    daysAgo: 11,
  },
  {
    id: "pat_06",
    name: "Mitu Ali",
    gender: "Female",
    age: 45,
    phone: "+8801901907397",
    condition: "Recovering",
    doctorId: "doc_nusrat",
    daysAgo: 11,
  },
  {
    id: "pat_07",
    name: "Jamal Sarkar",
    gender: "Female",
    age: 56,
    phone: "+8801958028857",
    condition: "Recovering",
    doctorId: "doc_tanvir",
    daysAgo: 11,
  },
  {
    id: "pat_08",
    name: "Karim Ali",
    gender: "Male",
    age: 45,
    phone: "+8801575800161",
    condition: "Recovering",
    doctorId: "doc_farhana",
    daysAgo: 12,
  },
];

const fillers: Array<{
  daysAgo: number;
  condition: Condition;
  doctorId: string;
  name: string;
  gender: Gender;
  age: number;
}> = [
  { daysAgo: 29, condition: "Stable", doctorId: "doc_rafiq", name: "Abdul Kadir", gender: "Male", age: 70 },
  { daysAgo: 28, condition: "Under Observation", doctorId: "doc_farhana", name: "Shila Begum", gender: "Female", age: 58 },
  { daysAgo: 27, condition: "Critical", doctorId: "doc_rafiq", name: "Shahidul Islam", gender: "Male", age: 66 },
  { daysAgo: 27, condition: "Stable", doctorId: "doc_farhana", name: "Sumaiya Akter", gender: "Female", age: 31 },
  { daysAgo: 27, condition: "Recovering", doctorId: "doc_tanvir", name: "Jahid Hasan", gender: "Male", age: 44 },
  { daysAgo: 26, condition: "Critical", doctorId: "doc_nusrat", name: "Habibullah", gender: "Male", age: 68 },
  { daysAgo: 25, condition: "Under Observation", doctorId: "doc_imran", name: "Farzana Yasmin", gender: "Female", age: 47 },
  { daysAgo: 24, condition: "Critical", doctorId: "doc_rafiq", name: "Hasan Mahmud", gender: "Male", age: 62 },
  { daysAgo: 24, condition: "Critical", doctorId: "doc_farhana", name: "Karim Uddin", gender: "Male", age: 54 },
  { daysAgo: 24, condition: "Stable", doctorId: "doc_ayesha", name: "Sadia Islam", gender: "Female", age: 28 },
  { daysAgo: 24, condition: "Recovering", doctorId: "doc_tanvir", name: "Lamia Chowdhury", gender: "Female", age: 41 },
  { daysAgo: 24, condition: "Under Observation", doctorId: "doc_rafiq", name: "Faruk Hossain", gender: "Male", age: 37 },
  { daysAgo: 23, condition: "Stable", doctorId: "doc_farhana", name: "Tania Akter", gender: "Female", age: 29 },
  { daysAgo: 22, condition: "Recovering", doctorId: "doc_nusrat", name: "Mim Rahman", gender: "Female", age: 22 },
  { daysAgo: 21, condition: "Critical", doctorId: "doc_imran", name: "Masud Rana", gender: "Male", age: 52 },
  { daysAgo: 21, condition: "Under Observation", doctorId: "doc_rafiq", name: "Popy Rani", gender: "Female", age: 39 },
  { daysAgo: 20, condition: "Stable", doctorId: "doc_farhana", name: "Anika Sultana", gender: "Female", age: 24 },
  { daysAgo: 18, condition: "Critical", doctorId: "doc_tanvir", name: "Rubel Mia", gender: "Male", age: 33 },
  { daysAgo: 18, condition: "Recovering", doctorId: "doc_ayesha", name: "Orpa Khan", gender: "Female", age: 36 },
  { daysAgo: 17, condition: "Under Observation", doctorId: "doc_imran", name: "Nayeem Ahmed", gender: "Male", age: 26 },
  { daysAgo: 15, condition: "Critical", doctorId: "doc_rafiq", name: "Belal Hossain", gender: "Male", age: 61 },
  { daysAgo: 15, condition: "Stable", doctorId: "doc_farhana", name: "Rupa Akter", gender: "Female", age: 43 },
  { daysAgo: 14, condition: "Recovering", doctorId: "doc_tanvir", name: "Shakib Rahman", gender: "Male", age: 38 },
  { daysAgo: 13, condition: "Critical", doctorId: "doc_nusrat", name: "Mousumi Das", gender: "Female", age: 51 },
  { daysAgo: 13, condition: "Under Observation", doctorId: "doc_rafiq", name: "Nusrat Begum", gender: "Female", age: 34 },
];

export function createSeedClinic(today = currentIsoDate()): ClinicData {
  return {
    doctors: doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      phone: doctor.phone,
      email: doctor.email,
      joinedAt: isoDaysAgo(doctor.joinedDaysAgo, today),
    })),
    patients: [
      ...namedPatients.map((patient) => ({
        id: patient.id,
        name: patient.name,
        gender: patient.gender,
        age: patient.age,
        phone: patient.phone,
        condition: patient.condition,
        doctorId: patient.doctorId,
        admittedAt: isoDaysAgo(patient.daysAgo, today),
        notes: "",
      })),
      ...fillers.map((patient, index) => ({
        id: `pat_${String(index + 9).padStart(2, "0")}`,
        name: patient.name,
        gender: patient.gender,
        age: patient.age,
        phone: `+88017${String(10000000 + index * 173).slice(-8)}`,
        condition: patient.condition,
        doctorId: patient.doctorId,
        admittedAt: isoDaysAgo(patient.daysAgo, today),
        notes: "",
      })),
    ],
  };
}

export function createSeedUsers(): StoredUser[] {
  return [
    {
      id: "user_admin",
      name: DEMO_ACCOUNT.name,
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
    },
  ];
}
