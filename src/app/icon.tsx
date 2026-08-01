import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/site-config";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const { primaryColor, companyName } = getSiteConfig();
  const initial = companyName.charAt(0).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: primaryColor,
          borderRadius: 8,
          color: "white",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        {initial}
      </div>
    ),
    { ...size }
  );
}
