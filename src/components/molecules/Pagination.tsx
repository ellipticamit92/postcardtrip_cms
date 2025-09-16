import React from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  limit?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        onClick={() => goToPage(currentPage - 1)}
        disabled={!hasPrev}
        variant="outline"
        size="sm"
      >
        Previous
      </Button>

      <div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => goToPage(page)}
            className={`${page === currentPage ? "underline font-bold" : ""}`}
            variant="link"
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        onClick={() => goToPage(currentPage + 1)}
        disabled={!hasNext}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
