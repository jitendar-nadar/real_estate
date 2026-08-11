# White-Label Real Estate Platform

A production-ready, white-label real estate listing platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **MongoDB**. Configure branding and contact details via environment variables — no code changes needed per client.

## Features

- **White-label branding** — Company name, logo, primary color, tagline, hero copy, contact info, social links (env-driven)
- **Property listings** — Search, filter, sort, pagination (state, city, type, price, beds/baths)
- **Property detail** — Gallery, embedded Google Maps, inquiry form, share actions
- **Image upload** — Upload property photos to `/public/uploads` from admin/dashboard forms
- **Inquiry / leads** — Contact form + property inquiries with admin management
- **Email alerts** — Optional Resend integration for new inquiry notifications
- **Role-based access** — Super Admin, Admin, and User roles
- **Admin panel** — Dashboard, properties, users, inquiries
- **User dashboard** — Users manage their own listings
- **SEO ready** — Sitemap, robots.txt, Open Graph metadata, dynamic favicon
- **Legal pages** — Privacy, Terms, Contact
- **Responsive** — Mobile-first public site and admin/dashboard shells
- **Dark mode** — Follows system preference

## Requirements

- **Node.js** 18 or later
- **npm** 9 or later
- **MongoDB** 6+ (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Quick start

```bash
npm install
cp .env.example .env.local
# Edit .env.local — see documentation/index.html for full guide
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo data

**Development** — add to `.env.local`:

```env
SEED_DEMO_DATA=true
```

Or run once:

```bash
npm run seed:demo
```

**Live preview (Vercel)** — set `SEED_DEMO_DATA=true`, deploy, visit the site once, then remove and redeploy.

| Role        | Email                     | Password       |
|-------------|---------------------------|----------------|
| Super Admin | superadmin@primenest.com  | superadmin123  |
| Admin       | admin@primenest.com       | admin123       |
| User        | user@primenest.com        | user123        |

## Environment variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NEXTAUTH_SECRET` | Yes | Session secret (32+ chars in production) |
| `NEXTAUTH_URL` | Yes | App URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Public URL for SEO and share links |
| `SEED_DEMO_DATA` | No | `true` to seed demo users/properties when DB is empty |
| `NOTIFY_EMAIL` | No | Email address for inquiry notifications |
| `RESEND_API_KEY` | No | Resend.com API key for email alerts |
| `EMAIL_FROM` | No | Sender address for Resend (e.g. `Site <onboarding@resend.dev>`) |

See `.env.example` for branding and social link variables.

## Production build

```bash
npm run build
npm start
```

Set a strong `NEXTAUTH_SECRET` and correct `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` before deploying.

## CodeCanyon packaging

```bash
npm run package:themeforest
```

Output: `dist/real-estate-app-main-v1.2.0.zip` and documentation ZIP.

Reviewer notes template: `CODECANYON_REVIEWER_NOTES.txt`

Full buyer documentation: **[documentation/index.html](./documentation/index.html)**

## Project structure

```
src/
├── app/
│   ├── (public)/          # Public website (home, listings, contact, legal)
│   ├── admin/             # Admin panel
│   ├── dashboard/         # User dashboard
│   └── api/               # REST + NextAuth routes
├── components/            # UI components
└── lib/                   # Config, auth, database, utilities
documentation/             # Buyer install guide (HTML)
scripts/seed-demo.ts       # One-time demo bootstrap
```

## Deployment

Works on **Vercel**, **Railway**, **Render**, **DigitalOcean**, or any Node.js host with MongoDB access. See `documentation/index.html` for step-by-step deployment notes.

Verify deployment: `GET /api/health` should return `"status":"ok"`.

## License

See `LICENSE.txt` and CodeCanyon license terms included with your purchase.

## Support

Refer to `documentation/index.html` for installation help. Contact the author via your CodeCanyon purchase page.
