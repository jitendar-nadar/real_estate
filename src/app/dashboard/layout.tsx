import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AppShell from "@/components/AppShell";
import CompanyLogo from "@/components/CompanyLogo";
import { getSiteConfig } from "@/lib/site-config";

const nav = [
  { href: "/dashboard", label: "My listings" },
  { href: "/dashboard/properties/new", label: "Add property" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const { companyName } = getSiteConfig();

  return (
    <AppShell
      brand={
        <CompanyLogo
          imageClassName="h-7 w-auto"
          textClassName="text-base font-bold text-primary-600 dark:text-primary-400"
        />
      }
      nav={nav}
      title="My listings"
      subtitle={`Manage your property portfolio on ${companyName}`}
      sidebarLabel="Account"
    >
      <div className="mb-4 text-xs text-slate-500 dark:text-slate-400 truncate" title={session.user.email ?? undefined}>
        Signed in as {session.user.email}
      </div>
      {children}
    </AppShell>
  );
}
