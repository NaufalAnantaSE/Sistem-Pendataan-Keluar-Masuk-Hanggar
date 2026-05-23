export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border border-white/10 bg-slate-900/60"
          />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl border border-white/10 bg-slate-900/60" />
      <div className="h-96 animate-pulse rounded-2xl border border-white/10 bg-slate-900/60" />
    </div>
  );
}
