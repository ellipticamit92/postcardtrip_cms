"use client";

import { format } from "date-fns";
import { Package, PaginationProps } from "@/types/type";
import { ColumnDef } from "@tanstack/react-table";
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
import { FC } from "react";
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
import { toIndianCurrency } from "@/lib/helper";

export const columns: ColumnDef<Package>[] = [
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
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="w32 overflow-hidden">{row.original?.name}</div>;
    },
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => {
      return <div>{row.original?.destination?.name}</div>;
    },
  },
  {
    accessorKey: "day",
    header: "Duration",
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("day")}D - {row.original.night}N
        </div>
      );
    },
  },
  {
    accessorKey: "basePrice",
    header: "S Price",
    cell: ({ row }) => <div>{toIndianCurrency(row.getValue("basePrice"))}</div>,
  },
  {
    accessorKey: "originalPrice",
    header: "O Price",
    cell: ({ row }) => (
      <div>{toIndianCurrency(row.getValue("originalPrice") ?? "0")}</div>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div>{toIndianCurrency(row.getValue("rating") ?? "1.0")}</div>
    ),
  },
  {
    accessorKey: "popular",
    header: "Popular",
    cell: ({ row }) => <div>{String(row.getValue("popular"))}</div>,
  },

  {
    accessorKey: "imageUrl",
    header: "imageUrl",
    cell: ({ row }) => (
      <div>
        <a
          className="text-blue-700 hover:underline"
          href={row.getValue("imageUrl")}
          target="_blank"
        >
          See image
        </a>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const overview = row.getValue("description") as string;
      const name = row.getValue("name") as string;

      return (
        <div className="space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View
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
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const value = row.getValue("createdAt");
      return value ? format(new Date(value as any), "dd/MM/yyyy") : null;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const destination = row.original;
      const pid = String(destination.pid);
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
              onClick={() => navigator.clipboard.writeText(pid)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className="hover:text-blue-400 font-semibold"
                href={`/package/${pid}`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteData id={pid} model="package" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface PackageTableProps {
  data: Package[];
  pagination: PaginationProps;
}

const PackageTable: FC<PackageTableProps> = ({ data, pagination }) => {
  return (
    <div className="w-full">
      <CommonTable
        data={data}
        placeholder="Filter by Package Name"
        columnName="name"
        columns={columns}
        pagination={pagination}
      />
    </div>
  );
};

export default PackageTable;
