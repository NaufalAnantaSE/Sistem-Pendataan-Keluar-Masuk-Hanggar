import { TopBar } from "@/components/dashboard/top-bar";

type DashboardShellProps = {
  children: React.ReactNode;
  userName?: string | null;
};

export function DashboardShell({ children, userName }: DashboardShellProps) {
  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_40%)]" />
      <TopBar userName={userName} />
      <main className="px-6 pb-16 pt-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          {children}
        </div>
      </main>
    </div>
  );
}
