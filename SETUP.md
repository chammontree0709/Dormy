# Dormy — Setup Guide

## 1. Supabase (database + auth)

1. Go to [app.supabase.com](https://app.supabase.com) and create a free project
2. In your project → **SQL Editor** → paste and run the contents of `supabase/schema.sql`
3. Go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. In **Authentication → Providers**, make sure **Email** is enabled
5. Optional: Go to **Authentication → URL Configuration** and set your site URL

## 2. Environment variables

```bash
cp .env.local.example .env.local
# Then fill in your values
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_AMAZON_AFFILIATE_TAG=your-tag-20
```

## 3. Amazon Associates (monetization)

1. Apply at [affiliate-program.amazon.com](https://affiliate-program.amazon.com)
2. Once approved, your tag looks like `yourname-20`
3. Set it as `NEXT_PUBLIC_AMAZON_AFFILIATE_TAG` in `.env.local`
4. All product links in the app will automatically include your affiliate tag

## 4. Google AdSense (additional monetization)

The app has ad placeholder banners in the room checklist and templates pages. Replace the placeholder `<div>` blocks with your AdSense code:

Search for `"Ad space — Google AdSense goes here"` in:
- `src/app/(app)/room/[id]/page.tsx`
- `src/app/(app)/room/[id]/item/[itemId]/page.tsx`
- `src/app/(app)/templates/page.tsx`

## 5. Run locally

```bash
# Node.js 18+ required
npm install
npm run dev
# Open http://localhost:3000
```

## 6. Deploy (Vercel — recommended, free tier)

```bash
npm install -g vercel
vercel
# Add env vars in Vercel dashboard → Settings → Environment Variables
```

---

## App structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── (auth)/login          # Login
│   ├── (auth)/signup         # Signup (with optional invite code)
│   ├── join/[code]           # Join room via invite link
│   └── (app)/
│       ├── dashboard         # User's rooms
│       ├── room/[id]         # Shared checklist (real-time)
│       ├── room/[id]/item/[itemId]  # Item detail + reviews
│       └── templates         # Browse preset lists
├── data/presets.ts           # All preset items, categories, and lists
├── lib/amazon.ts             # Affiliate link builder
└── supabase/schema.sql       # Database schema
```

## Adding more preset items

Edit `src/data/presets.ts`. Each item has:
- `id` — unique string slug
- `name`, `description`, `category`
- `amazon_url` — Amazon search URL (affiliate tag added automatically)
- `image_emoji`, `price_estimate`, `priority`
- `reviews` — hardcoded student reviews
- `tags`

## Realtime sync

Supabase Realtime is enabled for `room_items`. When any roommate checks/unchecks/adds an item, all connected clients update instantly via websocket subscription in `src/app/(app)/room/[id]/page.tsx`.
