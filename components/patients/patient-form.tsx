"use client";

import { useState } from "react";
import { useClinic } from "@/components/providers/clinic-provider";
import { useDoctorOptions } from "@/lib/use-clinic-data";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { CONDITIONS, GENDERS } from "@/lib/constants";
import type { Gender, PatientInput, PatientRow } from "@/lib/types";
import { hasErrors, toPatientInput, validatePatient } from "@/lib/validators";

export function PatientForm({
  initial,
  lockDoctorId,
  onDone,
}: {
  initial?: PatientRow | null;
  lockDoctorId?: string;
  onDone: () => void;
}) {
  const { createPatient, updatePatient } = useClinic();
  const doctors = useDoctorOptions();
  const [name, setName] = useState(initial?.name ?? "");
  const [age, setAge] = useState(initial ? String(initial.age) : "");
  const [gender, setGender] = useState<Gender>(initial?.gender ?? "Male");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [condition, setCondition] = useState(initial?.condition ?? "Stable");
  const [doctorId, setDoctorId] = useState(
    lockDoctorId ?? initial?.doctorId ?? "",
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [pending, setPending] = useState(false);

  function clearError(key: string) {
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const draft = { name, age, phone, doctorId, notes };
    const nextErrors = validatePatient(draft);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    const input: PatientInput = toPatientInput({
      name,
      age,
      gender,
      phone,
      condition,
      doctorId,
      notes,
    });
    setPending(true);
    try {
      if (initial) await updatePatient(initial.id, input);
      else await createPatient(input);
      onDone();
    } catch (reason) {
      setErrors({
        form:
          reason instanceof Error
            ? reason.message
            : "Could not save this patient.",
      });
      setPending(false);
    }
  }

  return (
    <form noValidate className="space-y-4" onSubmit={onSubmit}>
      <Field label="Full name" error={errors.name}>
        <TextInput
          value={name}
          invalid={Boolean(errors.name)}
          placeholder="Patient name"
          onChange={(event) => {
            setName(event.target.value);
            clearError("name");
          }}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Age" error={errors.age}>
          <TextInput
            inputMode="numeric"
            value={age}
            invalid={Boolean(errors.age)}
            placeholder="45"
            onChange={(event) => {
              setAge(event.target.value);
              clearError("age");
            }}
          />
        </Field>
        <Field label="Gender">
          <Select label="Gender" value={gender} onChange={(value) => setGender(value as Gender)}>
            {GENDERS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" error={errors.phone}>
          <TextInput
            value={phone}
            invalid={Boolean(errors.phone)}
            placeholder="+8801XXXXXXXXX"
            onChange={(event) => {
              setPhone(event.target.value);
              clearError("phone");
            }}
          />
        </Field>
        <Field label="Condition">
          <Select
            label="Condition"
            value={condition}
            onChange={(value) =>
              setCondition(value as PatientInput["condition"])
            }
          >
            {CONDITIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Doctor" error={errors.doctorId}>
        <Select
          label="Doctor"
          value={doctorId}
          disabled={Boolean(lockDoctorId)}
          invalid={Boolean(errors.doctorId)}
          onChange={(value) => {
            setDoctorId(value);
            clearError("doctorId");
          }}
        >
          <option value="">Assign a doctor</option>
          {doctors
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
        </Select>
      </Field>
      <Field label="Notes" error={errors.notes}>
        <TextArea
          value={notes}
          invalid={Boolean(errors.notes)}
          placeholder="Optional clinical notes"
          onChange={(event) => {
            setNotes(event.target.value);
            clearError("notes");
          }}
        />
      </Field>
      {errors.form ? (
        <p className="text-sm text-[#e11d48]" role="alert">
          {errors.form}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving" : initial ? "Save changes" : "Add patient"}
      </Button>
    </form>
  );
}
