import type { Bundle, Department, FeaturedOfferRow } from "@/db/schema";

export type Lang = "en" | "ar";

export type Texts = Record<string, { en: string; ar: string }>;

/** Padded/sanitised payload passed from the server page to the client app */
export type SiteData = {
  texts: Texts;
  departments: (Department & { bundles: Bundle[] })[];
  highlighted: Bundle[];
  featured: FeaturedOfferRow | null;
};

export type CartItem = {
  key: string; // "bundle:<id>" | "featured"
  nameEn: string;
  nameAr: string;
  deptEn?: string;
  deptAr?: string;
  price: number;
};

export const ORDER_STATUSES = ["pending", "contacted", "completed"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
