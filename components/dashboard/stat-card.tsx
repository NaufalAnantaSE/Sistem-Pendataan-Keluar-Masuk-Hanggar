import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  description?: string;
};

export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <Card className="bg-slate-900/60">
      <CardContent className="space-y-2 p-6">
        <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-3xl font-semibold text-white">{value}</p>
        {description ? (
          <p className="text-sm text-slate-400">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
