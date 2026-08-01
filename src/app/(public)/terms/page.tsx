import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteConfig } from "@/lib/site-config";

const config = getSiteConfig();

export const metadata: Metadata = buildPageMetadata(
  config,
  "Terms of Service",
  `Terms of service for ${config.companyName}.`
);

export default function TermsPage() {
  const { companyName, contactEmail } = getSiteConfig();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-8 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
        <p>
          By accessing {companyName}&apos;s property platform, you agree to these
          terms. Please read them carefully before using our services.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Use of the platform</h2>
          <p className="mt-2">
            Listings are provided for informational purposes. Property details,
            availability, and pricing may change without notice. We recommend
            verifying all information before making decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Accounts</h2>
          <p className="mt-2">
            You are responsible for maintaining the confidentiality of your account
            credentials and for all activity under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Limitation of liability</h2>
          <p className="mt-2">
            {companyName} is not liable for indirect, incidental, or consequential
            damages arising from use of the platform or reliance on listing
            information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Contact</h2>
          <p className="mt-2">
            Questions about these terms may be directed
            {contactEmail ? (
              <>
                {" "}
                to{" "}
                <a href={`mailto:${contactEmail}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                  {contactEmail}
                </a>
              </>
            ) : (
              " through our contact page"
            )}
            .
          </p>
        </section>
      </div>
    </div>
  );
}
