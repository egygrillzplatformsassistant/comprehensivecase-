# ASU Dentistry — Comprehensive Case Packages 🦷

A bilingual (English / العربية), mobile-first ordering website for **5th-year Ain Shams University
Faculty of Dentistry** students — comprehensive-cases **photography + editing + presentation-ready**
packages, built to convert: cheap-student-price marketing, a featured OFFER card, 4 highlighted
deals, per-department bundles, and a 3-field order form.

> Built with **Next.js 16 (App Router) + Tailwind CSS 4 + PostgreSQL (Drizzle ORM)**.
>
> _Note on the original brief:_ the request mentioned Firebase Firestore + GitHub Pages. GitHub Pages
> can only host static files — a live admin dashboard, order saving and login need a server. This
> build uses **Next.js + PostgreSQL** (Vercel + Neon both have generous free tiers) which gives you
> everything Firestore would, in one codebase. If you specifically still want Firestore, the schema
> section below maps 1-to-1 to Firestore collections.

---

## ✨ Features

### Student-facing
- **Language gate first** — full-screen EN / العربية chooser on a soft blurred background, saved to
  `localStorage`, with a persistent **EN | عربي** switcher in the navbar (full RTL support).
- **Soft blurred background** under all content (blurred clinic photo + gradient wash + grain).
- **Conversion-focused marketing copy** — “student prices”, “from 400 EGP”, “don’t overpay studios”,
  old-price strikethroughs, SAVE badges, a marquee ticker, social-proof stats.
- **Featured OFFER card** (top of page), **4 highlighted deals**, then **bundles per department**
  (Endo, Crown & Bridge, Oral Medicine, Operative…).
- **Multi-select cart** with a floating bottom bar → 3-field form (name / section / WhatsApp phone)
  → order saved with status `pending` + timestamp. Egyptian phone validation, price re-computed
  **server-side** (tamper-proof), IP rate-limiting.

### Admin dashboard (`/admin`)
Password-protected (cookie session, HMAC-signed, rate-limited login):

| Page | What you control |
|---|---|
| Dashboard | All orders, filter tabs, mark **pending → contacted → completed**, delete orders, stats (total orders, revenue all/done) |
| Departments | Add / edit / hide / delete departments, pick icon, sort order |
| Bundles | Add / edit / delete any bundle: names EN+AR, description, badge, feature lists (one per line), **price + old price**, highlighted-row toggle, visibility |
| Featured Offer | Enable/disable, badge, title, description, **included items**, footnote, price/old price |
| Site Content | **Every single text on the website** (hero, steps, ticker, cart, form, footer…) in EN + AR, grouped by section |

### Environment variables
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
ADMIN_PASSWORD=asu2026          # change this!
AUTH_SECRET=any-long-random-string
```

---

## 🗄 Database schema (Drizzle — `src/db/schema.ts`)

| Table | Purpose | Key columns |
|---|---|---|
| `departments` | Sections | `name_en/name_ar`, `icon`, `sort_order`, `active` |
| `bundles` | Pricing options | `department_id` (null = highlighted row), `name_en/ar`, `badge_en/ar`, `features_en/ar`, `price`, `old_price`, `highlighted`, `active` |
| `featured_offer` | Single editable OFFER row | `badge/title/desc/includes/footnote (en+ar)`, `price`, `old_price`, `enabled` |
| `site_texts` | Every UI string | `key`, `group`, `value_en`, `value_ar` |
| `orders` | Submissions | `name`, `section`, `phone`, `items` (JSONB), `total`, `status`, `created_at` |

> Firestore equivalent: collections `departments`, `bundles`, `orders` + doc `content/featured` +
> collection `texts` with the same fields.

Seed data (all bilingual) lives in `scripts/seed.ts`.

---

## 🚀 Run locally

```bash
npm install
npm run dev           # http://localhost:3000  •  /admin for the dashboard
npx drizzle-kit push  # create tables on a fresh database
npx tsx scripts/seed.ts
```

---

## ☁️ Deploy (free — recommended path)

The admin dashboard needs a Node server + database, so use **Vercel + Neon** instead of GitHub Pages:

1. **Database (Neon):** create a free project at [neon.tech](https://neon.tech) → copy the
   connection string.
2. **Repo:** push this project to GitHub.
3. **Vercel:** `New Project` → import the repo → add env vars
   `DATABASE_URL`, `ADMIN_PASSWORD`, `AUTH_SECRET` → Deploy.
4. **Init DB once:** locally run `DATABASE_URL=<neon-url> npx drizzle-kit push` and
   `DATABASE_URL=<neon-url> npx tsx scripts/seed.ts` (or add a temporary one-off route).
5. Share `https://your-app.vercel.app` in the class group. Admin: `https://your-app.vercel.app/admin`.

Optional: point a custom domain in Vercel settings.

---

## 🖼 Replacing the logo

A placeholder tooth mark is used now. To use the official Ain Shams Dentistry logo, drop the file
at `public/logo.png` and swap the `ToothLogo` component
(`src/components/home/ToothLogo.tsx`) for an `<img src="/logo.png" />`. Also replace `public/tooth.svg`
(favicon).

## 📁 Structure

```
src/
  app/
    page.tsx                  # public storefront (server → client app)
    admin/login               # password gate
    admin/(panel)/            # guarded: dashboard, departments, bundles, featured, content
    api/                      # orders + admin CRUD (all cookie-guarded)
  components/
    home/                     # gate, nav, hero, ticker, offer, steps, highlights, departments, cart, modal, footer
    admin/                    # shell, dashboard, managers, editors
  db/                         # drizzle client + schema
  lib/                        # auth, guards, site-data, formatting
scripts/seed.ts               # bilingual seed content
```
