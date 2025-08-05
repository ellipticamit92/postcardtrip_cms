import React from "react";
import { Button } from "../ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  limit?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        variant="outline"
      >
        Previous
      </Button>

      <div>
        Page {currentPage} of {totalPages}
      </div>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
