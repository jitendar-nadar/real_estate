"use client";

import { useRef, useState } from "react";

interface ImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function ImageUploadField({
  value,
  onChange,
  label = "Property images",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const urls = value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploadError("");
    setUploading(true);

    const uploaded: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }
        if (data.url) uploaded.push(data.url);
      }

      const merged = [...urls, ...uploaded];
      onChange(merged.join("\n"));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeUrl = (index: number) => {
    const next = urls.filter((_, i) => i !== index);
    onChange(next.join("\n"));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>

      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload images"}
        </button>
        <span className="text-xs text-slate-500 dark:text-slate-400 self-center">
          JPG, PNG, WebP · max 5 MB each
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {uploadError && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-2">{uploadError}</p>
      )}

      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {urls.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute top-1 right-1 rounded bg-black/60 text-white text-xs px-2 py-0.5 hover:bg-black/80"
                aria-label="Remove image"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder="Or paste image URLs (one per line)"
        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white text-sm"
      />
    </div>
  );
}
