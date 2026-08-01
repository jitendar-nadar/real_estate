import Link from "next/link";
import CompanyLogo from "@/components/CompanyLogo";
import {
  getSiteConfig,
  SOCIAL_LABELS,
  type SocialLinks,
} from "@/lib/site-config";

function SocialLinksList({ links }: { links: SocialLinks }) {
  const entries = (
    Object.entries(links) as Array<[keyof SocialLinks, string]>
  ).filter(([, url]) => url);

  if (entries.length === 0) return null;

  return (
    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
      {entries.map(([key, url]) => (
        <li key={key}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {SOCIAL_LABELS[key]}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const {
    companyName,
    tagline,
    contactPhone,
    contactEmail,
    address,
    socialLinks,
  } = getSiteConfig();

  const hasContactInfo = contactPhone || contactEmail || address;
  const hasSocialLinks = Object.values(socialLinks).some(Boolean);

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <CompanyLogo
              textClassName="text-lg font-bold text-white tracking-tight"
            />
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              {tagline}
            </p>
            {hasSocialLinks && <SocialLinksList links={socialLinks} />}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/listings"
                  className="text-sm hover:text-white transition-colors"
                >
                  All listings
                </Link>
              </li>
              <li>
                <Link
                  href="/listings?featured=1"
                  className="text-sm hover:text-white transition-colors"
                >
                  Featured properties
                </Link>
              </li>
              {hasContactInfo && (
                <li>
                  <Link
                    href="/contact"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Contact us
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {hasContactInfo && (
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Get in touch
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {contactPhone && (
                  <li>
                    <a
                      href={`tel:${contactPhone.replace(/\s/g, "")}`}
                      className="hover:text-white transition-colors"
                    >
                      {contactPhone}
                    </a>
                  </li>
                )}
                {contactEmail && (
                  <li>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="hover:text-white transition-colors"
                    >
                      {contactEmail}
                    </a>
                  </li>
                )}
                {address && (
                  <li className="text-slate-400 leading-relaxed">{address}</li>
                )}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm hover:text-white transition-colors"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm hover:text-white transition-colors"
                >
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <p className="text-slate-600">
            Powered by professional real estate technology
          </p>
        </div>
      </div>
    </footer>
  );
}
