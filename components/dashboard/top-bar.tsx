import { SignOutButton } from "@/components/dashboard/sign-out-button";

type TopBarProps = {
  userName?: string | null;
};

export function TopBar({ userName }: TopBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/70">
          Operations Dashboard
        </p>
        <h1 className="text-2xl font-semibold text-slate-100">
          Hanggar Movement Management System
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cyan-200">
          {userName ?? "ADMIN"}
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
