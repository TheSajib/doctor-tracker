export function initials(name: string) {
  const parts = name
    .replace(/^dr\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function cleanText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizePhone(value: string) {
  return value.replace(/[\s()-]/g, "");
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}
