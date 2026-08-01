import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteConfig } from "@/lib/site-config";

const config = getSiteConfig();

export const metadata: Metadata = buildPageMetadata(
  config,
  "Contact Us",
  `Get in touch with ${config.companyName} for property inquiries and support.`
);

export default function ContactPage() {
  const { companyName, contactPhone, contactEmail, address, socialLinks } =
    getSiteConfig();

  const hasContact = contactPhone || contactEmail || address;
  const socialEntries = Object.entries(socialLinks).filter(([, url]) => url);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
        Contact {companyName}
      </h1>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
        We&apos;re here to help you find the right property. Reach out by phone,
        email, or visit our office.
      </p>

      {hasContact ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {contactPhone && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Phone
              </h2>
              <a
                href={`tel:${contactPhone.replace(/\s/g, "")}`}
                className="mt-2 block text-xl font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                {contactPhone}
              </a>
            </div>
          )}
          {contactEmail && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email
              </h2>
              <a
                href={`mailto:${contactEmail}`}
                className="mt-2 block text-xl font-semibold text-primary-600 dark:text-primary-400 hover:underline break-all"
              >
                {contactEmail}
              </a>
            </div>
          )}
          {address && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:col-span-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Office
              </h2>
              <p className="mt-2 text-lg text-slate-900 dark:text-white leading-relaxed">
                {address}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-10 text-slate-600 dark:text-slate-400">
          Contact information is being updated. Please check back soon.
        </p>
      )}

      {socialEntries.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Follow us
          </h2>
          <ul className="mt-4 flex flex-wrap gap-4">
            {socialEntries.map(([key, url]) => (
              <li key={key}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline capitalize"
                >
                  {key}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href="/listings"
        className="mt-10 inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:underline"
      >
        ← Browse property listings
      </Link>
    </div>
  );
}
