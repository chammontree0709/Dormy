# Roomd — Project Context
*For continuing development in a new chat session*

---

## What is Roomd?

Roomd (formerly Dormy) is a shared dorm room supply checklist app for college roommates. Target audience: incoming college students. Built May 2026.

**Live URL:** https://roomdapp.com
**Vercel project:** dormy-mauve.vercel.app (same project)
**GitHub repo:** https://github.com/chammontree0709/Dormy
**Local folder:** /Users/cooperhammontree/claude/Dormy

---

## Tech Stack

- **Frontend:** Next.js (App Router, Turbopack)
- **Backend/DB:** Supabase (auth + real-time database)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Deployment:** Vercel (auto-deploys on push to main)
- **Node.js:** Installed at `~/node/bin/node` (NOT system node — use this path)
- **Fonts:** Outfit (sans), Playfair Display (serif/italic headings) via next/font

---

## How to Run Locally

```bash
cd /Users/cooperhammontree/claude/Dormy
~/node/bin/node node_modules/next/dist/bin/next dev
# Opens at http://localhost:3000
```

## How to Push Changes to Production

```bash
cd /Users/cooperhammontree/claude/Dormy
git add <files>
git commit -m "your message"
git push origin main
# Vercel auto-deploys in ~2 minutes
```

---

## Credentials & Keys

| Key | Value |
|---|---|
| Supabase URL | `https://maycdzyjpfrofmgzksbn.supabase.co` |
| Supabase Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heWNkenlqcGZyb2ZtZ3prc2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNDg5MTEsImV4cCI6MjA5NDcyNDkxMX0.FmYx1tvhfGTPK8XWEakEGD8CTkrZPJ6yWtvkwV7S7ys` |
| Amazon Affiliate Tag | `roomd05-20` |
| Google AdSense ID | `ca-pub-7336988558032518` |
| Support Email | support@roomdapp.com |
| GitHub username | chammontree0709 |

---

## Supabase Database Schema

### `rooms`
- `id` (uuid, PK)
- `name` (text)
- `invite_code` (text, unique, 6 chars)
- `created_by` (uuid → auth.users)
- `created_at` (timestamptz)

### `room_members`
- `room_id` + `user_id` (composite PK)
- `display_name` (text)
- `joined_at` (timestamptz)
- `questionnaire_answers` (jsonb) — roommate compatibility quiz answers

### `room_items`
- `id` (uuid, PK)
- `room_id` (uuid → rooms)
- `preset_id` (text, nullable — references local preset data)
- `custom_name`, `custom_url` (text, nullable)
- `category` (text)
- `is_checked` (boolean)
- `checked_by_name`, `checked_at`
- `claimed_by_name`, `claimed_at` ← "I'll buy this" feature
- `added_by_name`, `added_at`
- `notes` (text)
- `quantity` (int, default 1)
- `owned` (boolean) ← "Bringing from home" feature
- `sort_order` (int)

**Important:** Joining rooms uses an RPC function `join_room_by_invite_code(p_invite_code, p_display_name)` — direct table queries are blocked by RLS for non-members.

**Realtime** is enabled on `room_items` for live sync.

---

## Design System (Thaely-inspired theme)

The entire site uses a consistent editorial design language:

- **Primary color:** `zinc-950` (#09090b) for headings, CTAs, logo mark
- **Accent:** `emerald-500/600` for tags, focus rings, success states, prices
- **Backgrounds:** `bg-white` pages, `bg-zinc-50` secondary surfaces
- **Typography:** Playfair Display italic for all section headings (`style={{ fontFamily: 'var(--font-playfair)' }}`)
- **Eyebrow labels:** `text-xs font-bold tracking-widest text-emerald-600 uppercase`
- **Section dividers:** `border-b border-zinc-200 pb-8 mb-8` (no card boxes for page headers)
- **CTA sections:** `bg-zinc-950 rounded-3xl p-10` dark block with emerald-500 button
- **Primary buttons:** `bg-zinc-950 hover:bg-zinc-800 active:scale-[0.98]`
- **No emojis anywhere in the UI** — all replaced with Lucide icons
- **Logo:** Inline SVG `LogoMark` component (`src/components/ui/LogoMark.tsx`) — zinc-950 rounded square with emerald checkmark. Used everywhere instead of logo.png

---

## App Structure

```
src/
├── app/
│   ├── page.tsx                     # Landing page (has marquee + Thaely sections)
│   ├── not-found.tsx                # 404 page
│   ├── opengraph-image.tsx          # OG image (zinc/emerald palette)
│   ├── globals.css                  # Dark mode overrides (zinc + gray), marquee animation
│   ├── layout.tsx                   # Root layout (Outfit + Playfair fonts, AdSense script)
│   ├── checklists/
│   │   ├── page.tsx                 # Public checklist browser (SEO, no auth)
│   │   └── [slug]/page.tsx          # Individual checklist page
│   ├── guides/
│   │   ├── page.tsx                 # Guides index (SEO, no auth)
│   │   └── [slug]/page.tsx          # Individual guide page
│   ├── share/[code]/page.tsx        # Public room share view (no auth)
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── join/page.tsx                # Enter invite code manually
│   ├── join/[code]/page.tsx         # Auto-join via link
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx          # Supports optional invite code at signup
│   └── (app)/                       # Auth-gated
│       ├── dashboard/page.tsx       # User's rooms list
│       ├── room/[id]/page.tsx       # Shared checklist (real-time)
│       │   └── item/[itemId]/       # Item detail + reviews
│       ├── templates/page.tsx       # Browse presets + add to room
│       ├── inspo/page.tsx           # Room vibe inspiration + add to room
│       └── questionnaire/page.tsx   # Roommate compatibility quiz
├── components/
│   ├── checklist/ChecklistItem.tsx  # Two-row mobile layout: name on row 1, actions row 2
│   ├── room/AddItemModal.tsx
│   ├── room/InviteModal.tsx
│   ├── layout/Navbar.tsx            # No Quiz tab; uses LogoMark SVG
│   └── ui/
│       ├── Button.tsx               # Primary: zinc-950, Secondary: zinc border
│       ├── Card.tsx
│       ├── LogoMark.tsx             # ← Reusable SVG logo mark (zinc-950 + emerald check)
│       └── AdUnit.tsx
├── data/presets.ts                  # ALL preset items, categories, starter packs
├── lib/
│   ├── supabase/client.ts
│   ├── supabase/server.ts
│   ├── amazon.ts                    # Affiliate link builder (tag: roomd05-20)
│   └── utils.ts
└── types/index.ts
```

---

## Key Features

1. **Shared real-time checklist** — Supabase Realtime syncs across all roommates
2. **"I'll buy this" claim system** — prevents duplicate purchases
3. **"Bringing from home" toggle** — marks owned items
4. **75+ preset items** — 13 categories, price estimates, Amazon links, reviews
5. **9 starter packs** — Freshman Essentials, Study Setup, etc.
6. **Room invite codes** — 6-digit codes + shareable links
7. **Shopping mode** — touch-friendly full-screen mode for in-store use
8. **Move-in date countdown** — displays days until move-in on room page
9. **Add to room from Templates & Inspo** — room picker + one-tap add
10. **Questionnaire** — roommate compatibility quiz (accessible at /questionnaire, not in nav)
11. **Activity feed** — recent actions per room
12. **Custom items** — add anything not in preset list
13. **Dark mode** — class-based, toggled in profile dropdown

---

## Monetization

- **Amazon Associates:** Tag `roomd05-20` — 1–4% commission on purchases via Buy buttons
- **Google AdSense:** ID `ca-pub-7336988558032518` — `ads.txt` present at `/public/ads.txt`, awaiting approval
  - `AdUnit` placeholders exist in: room page, item detail, templates page
  - Replace `slot="XXXXXXXXXX"` with real slot IDs once approved

---

## Dark Mode

Implemented via CSS class `.dark` on `<html>`. Toggled in Navbar profile dropdown, persisted in localStorage. Dark mode overrides in `globals.css` cover both `gray-*` and `zinc-*` utility classes. Background is slate-900 (`#0f172a`).

---

## Preset Data

All preset items in `src/data/presets.ts` — no DB seeding needed. Each item has:
- `id`, `name`, `description`, `category`
- `amazon_url` (affiliate tag auto-appended by `buildAffiliateUrl`)
- `image_emoji` (kept in data but **not rendered in UI**)
- `price_estimate`, `priority` (essential/recommended/nice-to-have)
- `reviews[]`, `tags[]`

Categories: bedding, bathroom, tech, kitchen, laundry, storage, decor, health, fitness, entertainment, school, plants, campus

`PRESET_LISTS` (starter packs) and `CATEGORIES` also have `emoji`/`icon` fields — kept in data but not rendered.

---

## Next.js Quirks

- Middleware file is `proxy.ts` (not `middleware.ts`) — exports `proxy` function
- `useSearchParams()` requires Suspense boundary
- Build: `~/node/bin/node node_modules/next/dist/bin/next build`

---

## Known Status (as of May 2026)

- [x] Google AdSense `ads.txt` present — awaiting site approval
- [x] Amazon affiliate tag `roomd05-20` live on all Buy buttons
- [x] Custom domain `roomdapp.com` on Vercel
- [x] Full Thaely editorial theme applied sitewide
- [x] All emojis removed from UI (replaced with Lucide icons)
- [x] Logo replaced with inline SVG LogoMark
- [x] Dark mode working for zinc + gray color classes
- [x] Mobile checklist items: two-row layout (name visible on all screen sizes)
- [ ] AdSense ad slot IDs — replace XXXXXXXXXX placeholders once approved
- [ ] SEO: /checklists and /guides pages need backlinks/traffic for affiliate revenue
