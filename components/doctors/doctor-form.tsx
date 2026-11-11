"use client";

import { useState } from "react";
import { useClinic } from "@/components/providers/clinic-provider";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { SPECIALIZATIONS } from "@/lib/constants";
import { hasErrors, toDoctorInput, validateDoctor } from "@/lib/validators";

const empty = {
  name: "",
  specialization: "",
  hospital: "",
  phone: "",
  email: "",
};

export function DoctorForm({ onDone }: { onDone: () => void }) {
  const { createDoctor } = useClinic();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [pending, setPending] = useState(false);

  function set<K extends keyof typeof empty>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validateDoctor(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setPending(true);
    try {
      await createDoctor(toDoctorInput(values));
      onDone();
    } catch (reason) {
      setErrors({
        form:
          reason instanceof Error
            ? reason.message
            : "Could not create this doctor.",
      });
      setPending(false);
    }
  }

  return (
    <form noValidate className="space-y-4" onSubmit={onSubmit}>
      <Field label="Full name" error={errors.name}>
        <TextInput
          value={values.name}
          invalid={Boolean(errors.name)}
          placeholder="Dr. Jane Doe"
          onChange={(event) => set("name", event.target.value)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Specialization" error={errors.specialization}>
          <Select
            label="Specialization"
            value={values.specialization}
            invalid={Boolean(errors.specialization)}
            onChange={(value) => set("specialization", value)}
          >
            <option value="">Choose</option>
            {SPECIALIZATIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Hospital" error={errors.hospital}>
          <TextInput
            value={values.hospital}
            invalid={Boolean(errors.hospital)}
            placeholder="Square Hospital"
            onChange={(event) => set("hospital", event.target.value)}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" error={errors.phone}>
          <TextInput
            value={values.phone}
            invalid={Boolean(errors.phone)}
            placeholder="+8801XXXXXXXXX"
            onChange={(event) => set("phone", event.target.value)}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <TextInput
            type="email"
            value={values.email}
            invalid={Boolean(errors.email)}
            placeholder="name@hospital.com"
            onChange={(event) => set("email", event.target.value)}
          />
        </Field>
      </div>
      {errors.form ? (
        <p className="text-sm text-[#e11d48]" role="alert">
          {errors.form}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating" : "Create doctor"}
      </Button>
    </form>
  );
}
