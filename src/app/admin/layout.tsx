import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/auth-types";
import AppShell from "@/components/AppShell";
import CompanyLogo from "@/components/CompanyLogo";
import { getSiteConfig } from "@/lib/site-config";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/users", label: "Users" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (!canAccessAdmin(session.user.role)) redirect("/dashboard");

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
      title="Property management"
      subtitle={`Manage listings and team members for ${companyName}`}
      sidebarLabel="Administration"
    >
      {children}
    </AppShell>
  );
}
