# Roomd — Project Context
*For continuing development in a new chat session*

---

## What is Roomd?

Roomd (formerly Dormy) is a shared dorm room supply checklist app for college roommates. Built in May 2026.

**Live URL:** https://roomdapp.com
**Vercel project:** dormy-mauve.vercel.app (same project)
**GitHub repo:** https://github.com/chammontree0709/Dormy
**Local folder:** /Users/cooperhammontree/Dormy

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router, Turbopack)
- **Backend/DB:** Supabase (auth + real-time database)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel (auto-deploys on push to main)
- **Node.js:** Installed at `~/node/bin/node` (NOT system node — use this path)

---

## How to Run Locally

```bash
cd /Users/cooperhammontree/Dormy
~/node/bin/node node_modules/next/dist/bin/next dev
# Opens at http://localhost:3000
```

## How to Push Changes to Production

```bash
cd /Users/cooperhammontree/Dormy
git add .
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

3 tables:

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
- `sort_order` (int)

**Important:** Joining rooms uses an RPC function `join_room_by_invite_code(p_invite_code, p_display_name)` — direct table queries are blocked by RLS for non-members.

**Realtime** is enabled on `room_items` for live sync.

---

## App Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── not-found.tsx               # Branded 404
│   ├── checklists/page.tsx         # Public checklist browser (no auth needed)
│   ├── privacy/page.tsx            # Privacy policy
│   ├── terms/page.tsx              # Terms of service
│   ├── forgot-password/page.tsx    # Password reset
│   ├── join/page.tsx               # Enter invite code
│   ├── join/[code]/page.tsx        # Auto-join via link
│   ├── (auth)/login/page.tsx       # Login
│   ├── (auth)/signup/page.tsx      # Signup
│   └── (app)/
│       ├── dashboard/page.tsx      # User's rooms
│       ├── room/[id]/page.tsx      # Shared checklist (real-time)
│       ├── room/[id]/item/[itemId] # Item detail + reviews
│       └── templates/page.tsx      # Browse all preset items
├── components/
│   ├── checklist/ChecklistItem.tsx # Individual item with claim + buy buttons
│   ├── room/AddItemModal.tsx       # Add items modal
│   ├── room/InviteModal.tsx        # Show invite code modal
│   ├── layout/Navbar.tsx           # Top nav
│   └── ui/Button.tsx, Card.tsx
├── data/presets.ts                 # ALL preset items (75+), categories, starter packs
├── lib/
│   ├── supabase/client.ts          # Browser Supabase client
│   ├── supabase/server.ts          # Server Supabase client
│   ├── amazon.ts                   # Affiliate link builder
│   └── utils.ts
└── types/index.ts
```

---

## Key Features Built

1. **Shared real-time checklist** — Supabase Realtime syncs across all roommates instantly
2. **"I'll buy this" claim system** — roommates can claim items before buying to avoid doubles
3. **75+ preset items** across 13 categories with reviews, price estimates, Amazon links
4. **9 starter packs** — Freshman Essentials, Study Setup, Fitness Pack, Room Glow Up, etc.
5. **Room invite codes** — 6-digit codes, shareable links
6. **Custom items** — add anything not in the preset list
7. **Amazon affiliate links** — tag `roomd05-20` on every Buy button
8. **Google AdSense** — pending approval, script added to layout
9. **PWA-ready** — manifest.json, theme color, Apple web app meta tags

---

## Monetization

- **Amazon Associates:** Tag `roomd05-20` — earns 1–4% commission on purchases
- **Google AdSense:** ID `ca-pub-7336988558032518` — pending approval as of May 2026
  - Ad placeholder banners exist in: room page, item detail page, templates page
  - Once approved, replace the placeholder `<div>` blocks with real AdSense units
- **Future:** Custom domain email list, promoted listings

---

## Next.js 16 Quirks

- Middleware file is called `proxy.ts` (not `middleware.ts`) — exports `proxy` function
- `useSearchParams()` requires a Suspense boundary wrapper
- Run builds with: `~/node/bin/node node_modules/next/dist/bin/next build`

---

## Known Pending Items

- [ ] Google AdSense approval (submitted, waiting 1–3 days)
- [ ] Amazon affiliate tag confirmed working (`roomd05-20`)
- [ ] Custom domain `roomdapp.com` connected to Vercel
- [ ] Verify all bug fixes from the bug report are live (last push: "Fix build errors")

## Recently Fixed (last push)
- Custom branded 404 page
- `/privacy` and `/terms` pages
- `/checklists` public page (no login required)
- `/forgot-password` page
- `/join` page (enter code without a link)
- Footer links (Privacy, Terms, Support)
- Dynamic copyright year
- Password show/hide toggle on login + signup
- Invite code no longer redirects mid-signup
- Forgot password link on login page

---

## Preset Data

All preset items live in `src/data/presets.ts` — no database seeding needed. To add more items, just add to the `PRESET_ITEMS` array following the existing format. Each item needs:
- `id` (unique slug)
- `name`, `description`, `category`
- `amazon_url` (search URL, affiliate tag added automatically)
- `image_emoji`, `price_estimate`, `priority` (essential/recommended/nice-to-have)
- `reviews` (array of {author, rating, text, date})
- `tags` (array of strings)

Categories: bedding, bathroom, tech, kitchen, laundry, storage, decor, health, fitness, entertainment, school, plants, campus

---

## Things Still To Do (future sessions)

- Add Google sign-in (OAuth via Supabase)
- Add a favicon/app icon
- Add Roomd social media accounts (TikTok/Instagram for college audience)
- Consider App Store listing (wrap in Capacitor or Expo)
- Add email verification flow if Supabase has it enabled
- Add a support contact page beyond just the email
