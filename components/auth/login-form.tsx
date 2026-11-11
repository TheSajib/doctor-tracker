"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthScreen } from "@/components/auth/auth-screen";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { DEMO_ACCOUNT } from "@/lib/constants";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }
  if (
    value.startsWith("/dashboard") ||
    value.startsWith("/doctors") ||
    value.startsWith("/patients")
  ) {
    return value;
  }
  return "/dashboard";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      await login(email, password);
      router.push(safeNext(searchParams.get("next")));
      router.refresh();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Email or password is incorrect.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthScreen>
      <div className="w-full max-w-[420px] rounded-[28px] border border-white bg-white px-7 py-8 shadow-[0_30px_80px_-42px_rgba(16,50,45,0.55)] sm:px-8">
        <h2 className="font-serif text-[2rem] leading-none font-medium tracking-tight text-ink">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-muted">Sign in to your admin portal.</p>
        <form noValidate className="mt-7 space-y-4" onSubmit={onSubmit}>
          <Field label="Email">
            <TextInput
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>
          <Field label="Password">
            <TextInput
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Field>
          {error ? (
            <p className="text-sm text-[#e11d48]" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="mt-2 w-full" disabled={pending}>
            {pending ? "Signing in" : "Sign in"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted">
          No account?{" "}
          <Link href="/signup" className="font-medium text-teal-deep">
            Sign up
          </Link>
        </p>
        <button
          type="button"
          className="mt-4 w-full text-center text-xs text-muted transition hover:text-teal-deep"
          onClick={() => {
            setEmail(DEMO_ACCOUNT.email);
            setPassword(DEMO_ACCOUNT.password);
            setError("");
          }}
        >
          Demo · {DEMO_ACCOUNT.email} · {DEMO_ACCOUNT.password}
        </button>
      </div>
    </AuthScreen>
  );
}
