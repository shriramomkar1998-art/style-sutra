# StyleSutra Finds

An affiliate product showcase (not a store): Next.js 14 (App Router) + TypeScript + Tailwind + Supabase (Postgres, Auth, Storage). Deploys to Vercel.

**Why this stack:** Supabase gives a real Postgres database, file storage and login in one free-tier service. Row Level Security (RLS) enforces "only the admin can write" at the database itself, so no secret/service key is needed anywhere in the app. Only the public anon key is used.

## 1. Create the Supabase project
1. Sign up at https://supabase.com, click **New project**, choose a region and a strong database password.
2. Open **SQL Editor → New query**, paste the contents of `supabase/migrations/001_init.sql`, click **Run**. This creates the tables, security policies and the public `product-images` storage bucket (5 MB limit, JPG/PNG/WebP only).
3. **Project Settings → API**: copy the **Project URL** and the **anon public** key (you need them below). Never use or share the `service_role` key; this app doesn't need it.

## 2. Create the first admin (no public signup exists)
1. **Authentication → Providers → Email**: turn **off** "Allow new users to sign up" (and keep "Confirm email" as you like).
2. **Authentication → Users → Add user → Create new user**: enter your email and a strong password, tick **Auto Confirm User**.
3. **SQL Editor**: run `supabase/create_first_admin.sql` after replacing `you@example.com` with your email. Only users listed in the `admins` table can access `/admin`.

## 3. Run locally (optional)
```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev                  # http://localhost:3000, admin at /admin/login
```

## 4. Deploy (Vercel)
1. Push this folder to a GitHub repository (`.env.local` is git-ignored).
2. https://vercel.com → **Add New → Project** → import the repo (framework: Next.js, defaults are fine).
3. Add environment variables (from `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (your final https URL), `NEXT_PUBLIC_CONTACT_EMAIL`.
4. Click **Deploy**. Then in Supabase → **Authentication → URL Configuration**, set **Site URL** to your live URL.
5. Optional: add your own domain in Vercel → Settings → Domains.

Products and images live in Supabase, so they persist across refreshes and redeploys.

## 5. Operating the site
- Go to `/admin/login` and sign in. **Log out** is at the top right.
- **Add product**: fill in name, short and full description, optional price (type it as you want it shown, e.g. `₹499`), category, platform, affiliate URL (must start with `https://`) and button text. Upload images from your computer (the first image is the main one; use *Make main* to reorder). Tick **Published** and **Save product**; it appears on the website immediately.
- **Edit / change images / URL / button text**: click *Edit*. **Hide/Publish** toggles visibility without deleting. **Delete** removes the product and its images.
- Categories are listed in `lib/constants.ts` (`CATEGORIES`); edit that list to add or rename categories, then redeploy.
- The purchase button opens exactly the saved affiliate URL in a new tab (`rel="sponsored nofollow noopener noreferrer"`).

## Security summary
- `/admin/*` is guarded by middleware, by a server-side admin check on every admin page and every server action, and by database RLS policies (insert/update/delete on products and storage require `is_admin()`).
- All form input is validated on the server with zod (lengths, https-only URL, allowed image paths). Uploads are restricted by the bucket to JPG/PNG/WebP, max 5 MB.
- No service key in code. Security headers set in `next.config.mjs`. Supabase Auth rate-limits login attempts.

## Legal
The Affiliate Disclosure page and the sentence "As an Amazon Associate I earn from qualifying purchases." are included; a disclosure appears next to every purchase button, and the footer states the site is not owned or endorsed by Amazon or Meesho. You must still join the Amazon Associates / Meesho affiliate programs yourself and follow their rules (e.g. Amazon requires that you don't show stale prices as live; this site shows the price only as you typed it).

## Smoke-test checklist (run after deploying)
Log in/out · add product with 2 images · see it on `/` · open its detail page · click the button (opens new tab with your URL) · search and category filter · edit title/URL/button text · Hide (disappears from `/`) and Publish · refresh/redeploy (still there) · Delete · check on a phone.
