import Image from "next/image";
import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";

interface CompanyLogoProps {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
}

export default function CompanyLogo({
  className = "",
  imageClassName = "h-8 w-auto",
  textClassName = "text-xl font-bold text-primary-600 dark:text-primary-400 tracking-tight",
}: CompanyLogoProps) {
  const { companyName, companyLogo } = getSiteConfig();

  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      {companyLogo ? (
        <Image
          src={companyLogo}
          alt={companyName}
          width={160}
          height={40}
          className={imageClassName}
          unoptimized
          priority
        />
      ) : (
        <span className={textClassName}>{companyName}</span>
      )}
    </Link>
  );
}
