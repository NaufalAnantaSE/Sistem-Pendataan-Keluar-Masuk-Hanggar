import { Button } from "@/components/ui/button";
import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  searchParams: Record<string, string | undefined>;
};

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createLink = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set("page", String(page));
    return `/dashboard?${params.toString()}`;
  };

  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const getPageNumbers = () => {
    const pages = new Set<number>([1, totalPages]);
    for (let i = currentPage - 1; i <= currentPage + 1; i += 1) {
      if (i > 1 && i < totalPages) {
        pages.add(i);
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-3">
      <div className="text-sm text-slate-400">
        Menampilkan {startItem}-{endItem} dari {totalCount} data
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {prevDisabled ? (
          <Button variant="secondary" disabled>
            Sebelumnya
          </Button>
        ) : (
          <Button asChild variant="secondary">
            <Link href={createLink(Math.max(1, currentPage - 1))}>Sebelumnya</Link>
          </Button>
        )}

        {pageNumbers.map((page, index) => {
          const previousPage = pageNumbers[index - 1];
          const showEllipsis = previousPage && page - previousPage > 1;

          return (
            <div key={page} className="flex items-center gap-2">
              {showEllipsis ? <span className="px-1 text-slate-500">...</span> : null}
              {page === currentPage ? (
                <Button variant="default" disabled>
                  {page}
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link href={createLink(page)}>{page}</Link>
                </Button>
              )}
            </div>
          );
        })}

        {nextDisabled ? (
          <Button variant="secondary" disabled>
            Berikutnya
          </Button>
        ) : (
          <Button asChild variant="secondary">
            <Link href={createLink(Math.min(totalPages, currentPage + 1))}>
              Berikutnya
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
