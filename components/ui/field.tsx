import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const controlClass =
  "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-[#a8b6b2] focus:border-teal";

export function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs text-[#e11d48]">{error}</span>
      ) : null}
    </label>
  );
}

export function TextInput({
  invalid,
  className,
  ...props
}: React.ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={cn(
        controlClass,
        invalid ? "border-[#e11d48]" : "border-line",
        className,
      )}
      {...props}
    />
  );
}

export function TextArea({
  invalid,
  className,
  ...props
}: React.ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-[#a8b6b2] focus:border-teal",
        invalid ? "border-[#e11d48]" : "border-line",
        className,
      )}
      {...props}
    />
  );
}
