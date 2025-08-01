"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationShadcnProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationShadcn({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationShadcnProps) {
  const maxVisiblePages = 6;
  const startPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(maxVisiblePages / 2),
      totalPages - maxVisiblePages + 1
    )
  );
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  return (
    <Pagination className="mx-0 justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={`${
              currentPage <= 1 && "opacity-50 !cursor-none !cursor-not-allowed"
            }`}
          />
        </PaginationItem>

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const page = startPage + i;
          const isActive = page === currentPage;
          console.log("DEBUG page  = ", page);
          return page === -1 || page === -2 ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={isActive}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={`${
              currentPage >= totalPages &&
              "opacity-50 !cursor-none !cursor-not-allowed"
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
