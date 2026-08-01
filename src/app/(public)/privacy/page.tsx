import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteConfig } from "@/lib/site-config";

const config = getSiteConfig();

export const metadata: Metadata = buildPageMetadata(
  config,
  "Privacy Policy",
  `Privacy policy for ${config.companyName}.`
);

export default function PrivacyPage() {
  const { companyName, contactEmail } = getSiteConfig();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-8 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
        <p>
          {companyName} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy.
          This policy describes how we collect, use, and protect information when you
          use our real estate platform.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Information we collect</h2>
          <p className="mt-2">
            We may collect account information (name, email), property inquiry details,
            and usage data necessary to operate the service and respond to your requests.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">How we use information</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>To provide property listings and account services</li>
            <li>To respond to inquiries and support requests</li>
            <li>To improve our platform and user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Data sharing</h2>
          <p className="mt-2">
            We do not sell your personal information. Data may be shared with service
            providers who assist in operating the platform, subject to confidentiality
            obligations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Contact</h2>
          <p className="mt-2">
            For privacy-related questions, contact us
            {contactEmail ? (
              <>
                {" "}
                at{" "}
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
