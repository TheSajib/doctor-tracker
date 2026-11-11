import { Suspense } from "react";
import { AuthScreen } from "@/components/auth/auth-screen";
import { LoginForm } from "@/components/auth/login-form";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <AuthScreen>
          <div className="h-[420px] w-full max-w-[420px] rounded-[28px] bg-white" />
        </AuthScreen>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
