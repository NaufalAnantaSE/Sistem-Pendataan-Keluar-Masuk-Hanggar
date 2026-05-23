export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-slate-900/50 px-6 py-12 text-center">
      <p className="text-lg font-semibold text-slate-100">Belum ada data</p>
      <p className="text-sm text-slate-400">
        Tambahkan data movement pertama untuk mulai memonitor hanggar.
      </p>
    </div>
  );
}
