"use client";

import { useState } from "react";

interface InquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
  submitLabel?: string;
}

export default function InquiryForm({
  propertyId,
  propertyTitle,
  submitLabel = "Send message",
}: InquiryFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          propertyId,
          propertyTitle,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to send message");
        setStatus("error");
        return;
      }
      setForm({ name: "", email: "", phone: "", message: "" });
      setStatus("success");
    } catch {
      setError("Failed to send message. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-6">
        <p className="font-medium text-emerald-800 dark:text-emerald-300">
          Thank you! Your inquiry has been sent.
        </p>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
          Our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {propertyTitle && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Inquiring about: <span className="font-medium text-slate-900 dark:text-white">{propertyTitle}</span>
        </p>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 text-sm" role="alert">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inquiry-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Name *
          </label>
          <input
            id="inquiry-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="inquiry-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email *
          </label>
          <input
            id="inquiry-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
          />
        </div>
      </div>
      <div>
        <label htmlFor="inquiry-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Phone
        </label>
        <input
          id="inquiry-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="inquiry-message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Message *
        </label>
        <textarea
          id="inquiry-message"
          required
          rows={4}
          minLength={10}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tell us about your requirements..."
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="touch-target rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-medium px-6 py-2.5"
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
