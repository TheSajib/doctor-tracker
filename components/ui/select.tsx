import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { controlClass } from "@/components/ui/field";

export function Select({
  value,
  onChange,
  children,
  label,
  invalid,
  className,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  label: string;
  invalid?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        aria-label={label}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          controlClass,
          "appearance-none pr-10",
          invalid ? "border-[#e11d48]" : "border-line",
          disabled && "cursor-not-allowed bg-[#f7fbfa] text-muted",
        )}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
