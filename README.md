# Sam's List

A mobile-first PWA shopping list for Sam's Club with live price tracking, store-layout-aware item ordering, and budget management.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open the SQL Editor in your Supabase dashboard
3. Paste and run the contents of `supabase/schema.sql`
4. This creates all tables and seeds the default store layout

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

Find these in your Supabase project: **Settings → API**

### 4. Run locally

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-builds on every push to `main`

---

## Install on Your Phone

**iPhone (Safari required):**
1. Open your Vercel URL in Safari
2. Tap the Share icon
3. Tap "Add to Home Screen"

**Android (Chrome):**
1. Open your Vercel URL in Chrome
2. Tap the three-dot menu
3. Tap "Add to Home Screen"

---

## Project Status

| Phase | Description | Status |
|---|---|---|
| 0 | API Investigation | ✅ Complete |
| 1 | Foundation — list CRUD, checkboxes, Supabase | ✅ Complete |
| 2 | Budget, Master List, Store Layout, Add Item UI | ✅ Complete |
| 3 | Search & Price Automation (`__NEXT_DATA__` scraping) | 🔲 Next |
| 4 | PWA install, offline, polish | 🔲 Pending |
| 5 | Trip History | 🔲 Pending |

---

## Phase 3 Pre-Work (before building price search)

Before implementing `api/search-items.js` and `api/fetch-price.js`:

1. Open `samsclub.com` in Chrome with DevTools → Network tab
2. Search for a product, inspect `__NEXT_DATA__` in the page source
3. Document the JSON path to: name, price, thumbnail, category breadcrumbs
4. Repeat for a product page — find the price field path
5. Record findings and update the `api/` functions accordingly

See `NOTES.md` for full Phase 3 action items.

---

## Tech Stack

- **React + Vite** — frontend framework
- **Tailwind CSS** — styling
- **Supabase** — database + real-time sync
- **Vercel** — hosting + serverless functions
- **@dnd-kit** — drag-to-reorder store layout
- **react-router-dom** — client-side routing
