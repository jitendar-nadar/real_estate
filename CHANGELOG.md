# Changelog

All notable changes to this project are documented here.

### [1.1.1] – 2026-08-08

### Changed
- Health endpoint now returns app name and version for deployment verification

## [1.1.0] – 2026-08-08

### Added
- Property inquiry form on contact and property detail pages
- Admin inquiries management (`/admin/inquiries`)
- Admin dashboard with stats and recent leads
- Listings pagination, sort, and bedroom/bathroom filters
- Related properties on property detail pages
- Homepage stats bar, property type categories, and CTA section
- Google Maps link on property detail pages

### Security
- Demo seed disabled entirely in production
- Featured listings restricted to admin roles server-side
- Super admin role assignment restricted to super admins

## [1.0.0] – 2026-07-27

### Added
- White-label branding via environment variables (company name, logo, colors, contact, social links)
- Public pages: home, listings, property detail, contact, privacy, terms
- Role-based authentication (Super Admin, Admin, User)
- Admin panel for properties and user management
- User dashboard for managing own listings
- MongoDB-backed data storage
- Dynamic primary color palette from a single hex value
- SEO: sitemap, robots.txt, Open Graph metadata, dynamic favicon
- Responsive admin shell with mobile sidebar
- Property search and filters (state, city, type, price)
- WhatsApp share and copy-link on property pages

### Security
- Demo seed data disabled in production by default
- Demo login credentials shown only in development
- Production requires `NEXTAUTH_SECRET`
