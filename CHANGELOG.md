# Changelog

All notable changes to this project are documented here.

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
