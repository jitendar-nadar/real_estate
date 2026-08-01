export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3 max-w-md mb-6" />
      <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-slate-200 dark:bg-slate-700 aspect-[4/3]" />
        ))}
      </div>
    </div>
  );
}
