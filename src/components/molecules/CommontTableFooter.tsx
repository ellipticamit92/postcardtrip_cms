import { FC } from "react";
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
  return (
    <div className="flex items-center justify-between space-x-2 py-4 w-full">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <Pagination
        totalPages={totalPages ?? 0}
        currentPage={page ?? 1}
        hasNext={hasNext}
        hasPrev={hasPrev}
        limit={limit}
      />
    </div>
  );
};
