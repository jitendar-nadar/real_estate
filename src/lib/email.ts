import type { Inquiry } from "./types";

interface InquiryEmailInput {
  inquiry: Inquiry;
  siteName: string;
  notifyEmail: string;
}

function isEmailConfigured(): boolean {
  return Boolean(
    process.env.NOTIFY_EMAIL?.trim() &&
      process.env.RESEND_API_KEY?.trim() &&
      process.env.EMAIL_FROM?.trim()
  );
}

/** Sends inquiry notification via Resend API (optional — skips if not configured). */
export async function sendInquiryNotification({
  inquiry,
  siteName,
  notifyEmail,
}: InquiryEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  const to = notifyEmail.trim();

  if (!apiKey || !from || !to) {
    console.log("[email] Inquiry received (email not configured):", inquiry.id, inquiry.email);
    return;
  }

  const propertyLine = inquiry.propertyTitle
    ? `<p><strong>Property:</strong> ${escapeHtml(inquiry.propertyTitle)}</p>`
    : "";

  const html = `
    <h2>New property inquiry — ${escapeHtml(siteName)}</h2>
    <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
    ${inquiry.phone ? `<p><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>` : ""}
    ${propertyLine}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(inquiry.message).replace(/\n/g, "<br>")}</p>
    <hr>
    <p style="color:#666;font-size:12px">View in admin: ${escapeHtml(process.env.NEXT_PUBLIC_SITE_URL ?? "")}/admin/inquiries</p>
  `.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[${siteName}] New inquiry from ${inquiry.name}`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Resend API error:", res.status, body);
    }
  } catch (error) {
    console.error("[email] Failed to send inquiry notification:", error);
  }
}

export function getNotifyEmail(): string | null {
  return process.env.NOTIFY_EMAIL?.trim() || process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;
}

export { isEmailConfigured };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
