import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-gradient-to-r from-[#1ec4a8] to-[#0c947f] text-white shadow-[0_10px_24px_-14px_rgba(12,148,127,0.95)] hover:brightness-[1.04]",
        variant === "ghost" &&
          "border border-line bg-white text-ink hover:bg-[#f6fbfa]",
        variant === "danger" && "bg-[#e11d48] text-white hover:brightness-105",
        className,
      )}
      {...props}
    />
  );
}
