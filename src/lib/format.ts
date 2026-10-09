import type { Lang } from "./types";

export function formatPrice(n: number, lang: Lang) {
  return lang === "ar" ? `${n} ج.م` : `${n} EGP`;
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function splitLines(s: string | null | undefined): string[] {
  return (s ?? "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}
