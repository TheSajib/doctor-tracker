import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  from,
  to,
  total,
  page,
  pages,
  onPage,
}: {
  from: number;
  to: number;
  total: number;
  page: number;
  pages: number;
  onPage: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-5">
      <p className="text-sm text-muted">
        {total === 0 ? "0 results" : `${from}–${to} of ${total}`}
      </p>
      <div className="flex items-center rounded-xl border border-line bg-white p-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-[#f4faf8] disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="min-w-14 text-center text-sm text-ink tabular-nums">
          {page} / {pages}
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-[#f4faf8] disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
