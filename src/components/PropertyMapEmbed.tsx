interface PropertyMapEmbedProps {
  address: string;
  city: string;
  state: string;
  zip: string;
}

export default function PropertyMapEmbed({
  address,
  city,
  state,
  zip,
}: PropertyMapEmbedProps) {
  const query = encodeURIComponent(`${address}, ${city}, ${state} ${zip}`);
  const embedSrc = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="mt-8">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
        Location
      </h3>
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
        <iframe
          title="Property location map"
          src={embedSrc}
          className="w-full h-64 sm:h-72 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
      >
        Open in Google Maps →
      </a>
    </div>
  );
}
