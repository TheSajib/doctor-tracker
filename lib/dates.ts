import type { DateRange } from "@/lib/types";

function formatClock(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function currentIsoDate() {
  return formatClock(new Date());
}

export function isoDaysAgo(days: number, fromIso: string) {
  const [year, month, day] = fromIso.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  date.setDate(date.getDate() - days);
  return formatClock(date);
}

export function lastNDays(count: number, fromIso: string) {
  return Array.from({ length: count }, (_, index) =>
    isoDaysAgo(count - 1 - index, fromIso),
  );
}

export function inDateRange(iso: string, range: DateRange, todayIso: string) {
  if (range === "any") return true;
  const days = range === "7d" ? 6 : range === "30d" ? 29 : 89;
  return iso >= isoDaysAgo(days, todayIso);
}

export function formatLongDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatAvg(value: number) {
  if (!Number.isFinite(value)) return "0";
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
