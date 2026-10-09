import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Departments (Endo, Crown & Bridge, Medicine, Operative, ...)        */
/* ------------------------------------------------------------------ */
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  icon: text("icon").notNull().default("sparkles"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Bundles — pricing options under a department or "highlighted"       */
/* ------------------------------------------------------------------ */
export const bundles = pgTable("bundles", {
  id: serial("id").primaryKey(),
  departmentId: integer("department_id").references(() => departments.id, {
    onDelete: "cascade",
  }),
  highlighted: boolean("highlighted").notNull().default(false),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  descEn: text("desc_en").notNull().default(""),
  descAr: text("desc_ar").notNull().default(""),
  badgeEn: text("badge_en").notNull().default(""),
  badgeAr: text("badge_ar").notNull().default(""),
  featuresEn: text("features_en").notNull().default(""), // newline separated
  featuresAr: text("features_ar").notNull().default(""),
  price: integer("price").notNull(),
  oldPrice: integer("old_price"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Featured offer — single row, fully editable from the admin          */
/* ------------------------------------------------------------------ */
export const featuredOffer = pgTable("featured_offer", {
  id: serial("id").primaryKey(),
  enabled: boolean("enabled").notNull().default(true),
  badgeEn: text("badge_en").notNull().default(""),
  badgeAr: text("badge_ar").notNull().default(""),
  titleEn: text("title_en").notNull().default(""),
  titleAr: text("title_ar").notNull().default(""),
  descEn: text("desc_en").notNull().default(""),
  descAr: text("desc_ar").notNull().default(""),
  includesEn: text("includes_en").notNull().default(""), // newline separated
  includesAr: text("includes_ar").notNull().default(""),
  footnoteEn: text("footnote_en").notNull().default(""),
  footnoteAr: text("footnote_ar").notNull().default(""),
  price: integer("price").notNull().default(0),
  oldPrice: integer("old_price"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Editable site texts — every word on the public site lives here      */
/* ------------------------------------------------------------------ */
export const siteTexts = pgTable("site_texts", {
  key: text("key").primaryKey(),
  group: text("group").notNull().default("general"),
  label: text("label").notNull().default(""),
  valueEn: text("value_en").notNull().default(""),
  valueAr: text("value_ar").notNull().default(""),
});

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */
export type OrderItem = {
  key: string; // "bundle:12" | "featured"
  nameEn: string;
  nameAr: string;
  price: number;
  deptEn?: string;
  deptAr?: string;
};

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  section: text("section").notNull(),
  phone: text("phone").notNull(),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  total: integer("total").notNull(),
  status: text("status").notNull().default("pending"), // pending | contacted | completed
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Department = typeof departments.$inferSelect;
export type Bundle = typeof bundles.$inferSelect;
export type FeaturedOfferRow = typeof featuredOffer.$inferSelect;
export type SiteText = typeof siteTexts.$inferSelect;
export type Order = typeof orders.$inferSelect;
