"use client";

import { format } from "date-fns";
import { City } from "@/types/type";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FC, useState } from "react";
import CommonTable from "../molecules/CommonTable";
import Link from "next/link";
import DeleteData from "./DeleteData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export const columns: ColumnDef<City>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="!p-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        City Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: "City Description",
    cell: ({ row }) => {
      const overview = row.getValue("description") as string;
      const name = row.getValue("name") as string;

      // Preview (first 100 chars without HTML)
      const previewText = overview.replace(/<[^>]*>/g, "").substring(0, 15);

      return (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 line-clamp-2">{previewText}...</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View Full Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{name} - Overview</DialogTitle>
              </DialogHeader>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: overview }}
              />
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
  {
    accessorKey: "destination",
    header: "Destination Name",
    cell: ({ row }) => {
      const city = row.original;
      return <span>{city?.destination?.name}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const city = row.original;
      const cid = String(city.cid);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(cid)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className="hover:text-blue-400 font-semibold"
                href={`/City/${cid}`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteData id={cid} model="city" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface CityTableProps {
  data: City[];
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}

const CityTable: FC<CityTableProps> = ({ data }) => {
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
    <div className="w-full">
      <CommonTable
        table={table}
        placeholder="Filter by City Name"
        columnName="name"
        columns={columns}
      />
    </div>
  );
};

export default CityTable;
