"use client";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { CommonTableSearch } from "./CommonTableSerach";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { CommonTableHeader } from "./CommonTableHeader";
import { CommonTableFooter } from "./CommontTableFooter";
import { PaginationProps } from "@/types/type";
import { useState } from "react";

interface CommonTableProps {
  columns: any;
  columnName: string;
  placeholder: string;
  pagination?: PaginationProps;
  data: any;
}

const CommonTable = ({
  columns,
  columnName,
  placeholder,
  pagination,
  data,
}: CommonTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full bg-white p-4 py-0">
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
