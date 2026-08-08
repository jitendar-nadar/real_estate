import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompanyLogo from "@/components/CompanyLogo";
import { getServerSessionSafe } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSessionSafe();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header logo={<CompanyLogo />} initialSession={session} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
