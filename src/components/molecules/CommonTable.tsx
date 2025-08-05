import { flexRender } from "@tanstack/react-table";
import { CommonTableSearch } from "./CommonTableSerach";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { CommonTableHeader } from "./CommonTableHeader";
import { CommonTableFooter } from "./CommontTableFooter";
import { PaginationProps } from "@/types/type";

interface CommonTableProps {
  columns: any;
  columnName: string;
  placeholder: string;
  table: any;
  pagination?: PaginationProps;
}

const CommonTable = ({
  columns,
  columnName,
  placeholder,
  table,
  pagination,
}: CommonTableProps) => {
  return (
    <div className="w-full">
      <CommonTableSearch
        table={table}
        columnName={columnName}
        placeholder={placeholder}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <CommonTableHeader table={table} />
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CommonTableFooter
        table={table}
        page={pagination?.page}
        limit={pagination?.limit}
        total={pagination?.total}
        totalPages={pagination?.totalPages}
        hasNext={pagination?.hasNext}
        hasPrev={pagination?.hasPrev}
      />
    </div>
  );
};

export default CommonTable;
