import { Activity } from "lucide-react";
import { cn } from "@/lib/cn";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-full bg-[#12b5a0] text-white shadow-[0_8px_16px_-10px_rgba(18,181,160,0.9)]">
        <Activity className="size-4" strokeWidth={2.4} />
      </span>
      <span
        className={cn(
          "text-[15px] font-semibold tracking-tight",
          light ? "text-white" : "text-ink",
        )}
      >
        Doctor Tracker
      </span>
    </div>
  );
}
