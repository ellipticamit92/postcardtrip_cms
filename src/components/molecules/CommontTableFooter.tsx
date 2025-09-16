import { FC } from "react";
import { Button } from "../ui/button";
import Pagination from "./Pagination";

interface CommonTableFooterProps {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  table: any;
}

export const CommonTableFooter: FC<CommonTableFooterProps> = ({
  table,
  page,
  totalPages,
  limit,
  hasNext,
  hasPrev,
}) => {
  const handlePageChange = (page: number) => {
    console.log("page number");
  };

  return (
    <div className="flex items-center justify-between space-x-2 py-4 w-full">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={page ?? 1}
        onPageChange={handlePageChange}
        hasNext={hasNext}
        hasPrev={hasPrev}
        limit={limit}
      />
      {/* <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={hasPrev}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={hasNext}
        >
          Next
        </Button>
      </div> */}
    </div>
  );
};
