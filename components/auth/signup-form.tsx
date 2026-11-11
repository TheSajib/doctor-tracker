"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthScreen } from "@/components/auth/auth-screen";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { hasErrors, validateSignup } from "@/lib/validators";

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validateSignup({ name, email, password, confirm });
    setErrors(nextErrors);
    setFormError("");
    if (hasErrors(nextErrors)) return;
    setPending(true);
    try {
      await signup({ name, email, password });
      router.push("/dashboard");
      router.refresh();
    } catch (reason) {
      setFormError(
        reason instanceof Error ? reason.message : "Could not create the account.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthScreen>
      <div className="w-full max-w-[420px] rounded-[28px] border border-white bg-white px-7 py-8 shadow-[0_30px_80px_-42px_rgba(16,50,45,0.55)] sm:px-8">
        <h2 className="font-serif text-[2rem] leading-none font-medium tracking-tight text-ink">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-muted">
          Set up access to the clinic workspace.
        </p>
        <form noValidate className="mt-7 space-y-4" onSubmit={onSubmit}>
          <Field label="Full name" error={errors.name}>
            <TextInput
              autoComplete="name"
              value={name}
              invalid={Boolean(errors.name)}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <TextInput
              type="email"
              autoComplete="email"
              value={email}
              invalid={Boolean(errors.email)}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field label="Password" error={errors.password}>
            <TextInput
              type="password"
              autoComplete="new-password"
              value={password}
              invalid={Boolean(errors.password)}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          <Field label="Confirm password" error={errors.confirm}>
            <TextInput
              type="password"
              autoComplete="new-password"
              value={confirm}
              invalid={Boolean(errors.confirm)}
              onChange={(event) => setConfirm(event.target.value)}
            />
          </Field>
          {formError ? (
            <p className="text-sm text-[#e11d48]" role="alert">
              {formError}
            </p>
          ) : null}
          <Button type="submit" className="mt-2 w-full" disabled={pending}>
            {pending ? "Creating account" : "Create account"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted">
          Already registered?{" "}
          <Link href="/" className="font-medium text-teal-deep">
            Sign in
          </Link>
        </p>
      </div>
    </AuthScreen>
  );
}
