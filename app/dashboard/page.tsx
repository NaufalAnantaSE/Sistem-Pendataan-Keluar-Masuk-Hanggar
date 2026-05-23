import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { MovementForm } from "@/components/dashboard/movement-form";
import { MovementTable } from "@/components/dashboard/movement-table";
import { SearchFilters } from "@/components/dashboard/search-filters";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Pagination } from "@/components/dashboard/pagination";
import { ExportButton } from "@/components/dashboard/export-button";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatCard } from "@/components/dashboard/stat-card";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

type DashboardSearchParams = {
  registration?: string;
  type?: string;
  officer?: string;
  month?: string;
  page?: string;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: DashboardSearchParams | Promise<DashboardSearchParams>;
}) {
  const params = (await searchParams) as DashboardSearchParams;
  const page = Number(params.page ?? 1);
  const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;

  const registration = params.registration?.trim();
  const aircraftType = params.type?.trim();
  const amcOfficer = params.officer?.trim();
  const month = params.month?.trim();

  const where: Prisma.AircraftMovementWhereInput = {};

  if (registration) {
    where.registration = { contains: registration, mode: "insensitive" };
  }

  if (aircraftType) {
    where.aircraftType = { contains: aircraftType, mode: "insensitive" };
  }

  if (amcOfficer) {
    where.amcOfficer = { contains: amcOfficer, mode: "insensitive" };
  }

  if (month) {
    const monthNumber = Number(month);
    if (!Number.isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
      const year = new Date().getFullYear();
      const monthIndex = monthNumber - 1;
      const start = new Date(year, monthIndex, 1);
      const end = new Date(year, monthIndex + 1, 1);
      where.logDate = { gte: start, lt: end };
    }
  }

  const [movements, totalCount, totalAll, totalMonth] = await Promise.all([
    prisma.aircraftMovement.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.aircraftMovement.count({ where }),
    prisma.aircraftMovement.count(),
    prisma.aircraftMovement.count({
      where: {
        logDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="space-y-10">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Movement"
          value={totalAll.toLocaleString("id-ID")}
          description="Seluruh data movement di database"
        />
        <StatCard
          label="Bulan Ini"
          value={totalMonth.toLocaleString("id-ID")}
          description="Jumlah movement bulan berjalan"
        />
        <StatCard
          label="Hasil Filter"
          value={totalCount.toLocaleString("id-ID")}
          description="Data sesuai filter aktif"
        />
      </section>

      <MovementForm />

      <section className="space-y-6">
        <SectionHeader
          title="Data Movement"
          description="Pantau data keluar masuk pesawat hanggar secara realtime."
          action={<ExportButton />}
        />
        <SearchFilters />
        {movements.length === 0 ? (
          <EmptyState />
        ) : (
          <MovementTable movements={movements} />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          searchParams={{
            registration: registration ?? undefined,
            type: aircraftType ?? undefined,
            officer: amcOfficer ?? undefined,
            month: month ?? undefined,
          }}
        />
      </section>
    </div>
  );
}
