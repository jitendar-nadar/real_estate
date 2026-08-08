# White-Label Real Estate Platform

A production-ready, white-label real estate listing platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **MongoDB**. Configure branding and contact details via environment variables — no code changes needed per client.

## Features

- **White-label branding** — Company name, logo, primary color, tagline, hero copy, contact info, social links (env-driven)
- **Property listings** — Search and filter by state, city, type, and price (India-focused defaults)
- **Property detail pages** — Gallery, specs, share actions, contact CTAs
- **Role-based access** — Super Admin, Admin, and User roles
- **Admin panel** — Manage all properties and users
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

### Development demo data

To seed sample properties and users on first run (development only):

```env
SEED_DEMO_DATA=true
```

Demo accounts (shown on login page in development only):

| Role        | Email                     | Password       |
|-------------|---------------------------|----------------|
| Super Admin | superadmin@estatehub.com  | superadmin123  |
| Admin       | admin@estatehub.com       | admin123       |
| User        | user@estatehub.com        | user123        |

## Environment variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NEXTAUTH_SECRET` | Yes | Session secret (32+ chars in production) |
| `NEXTAUTH_URL` | Yes | App URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Public URL for SEO and share links |
| `NEXT_PUBLIC_COMPANY_NAME` | No | Brand name |
| `NEXT_PUBLIC_COMPANY_LOGO` | No | Logo path or URL |
| `NEXT_PUBLIC_PRIMARY_COLOR` | No | Brand hex color |
| `NEXT_PUBLIC_CONTACT_PHONE` | No | Contact phone |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Contact email |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | No | Office address |

See `.env.example` for the full list including hero text and social links.

## Production build

```bash
npm run build
npm start
```

**Important:** Set a strong `NEXTAUTH_SECRET` and correct `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` before deploying. Do not enable `SEED_DEMO_DATA` in production.

## ThemeForest packaging

To verify the build and create an upload-ready ZIP:

```bash
npm run package:themeforest
```

Output: `dist/real-estate-app-main-v1.0.0.zip` (main file) and `dist/real-estate-app-documentation-v1.0.0.zip` (documentation)

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
documentation/             # ThemeForest install guide (HTML)
```

## Deployment

Works on **Vercel**, **Railway**, **Render**, **DigitalOcean**, or any Node.js host with MongoDB access. See `documentation/index.html` for step-by-step deployment notes.

## Credits

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Inter](https://fonts.google.com/specimen/Inter) via `next/font/google`
- Demo property images may use [Unsplash](https://unsplash.com) (replace with client-owned assets in production)

## License

See `LICENSE.txt` and ThemeForest license terms included with your purchase.

## Support

Refer to `documentation/index.html` for installation help. For item support, contact the author via your ThemeForest purchase page.
