import { flexRender } from "@tanstack/react-table";
import { CommonTableSearch } from "./CommonTableSerach";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { CommonTableHeader } from "./CommonTableHeader";

interface CommonTableProps {
  data: any;
  columns: any;
  columnName: string;
  placeholder: string;
  table: any;
}

const CommonTable = ({
  columns,
  columnName,
  placeholder,
  table,
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
    </div>
  );
};

export default CommonTable;
