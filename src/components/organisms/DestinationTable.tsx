"use client";

import { Destination, PaginationProps } from "@/types/type";
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

export const columns: ColumnDef<Destination>[] = [
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
  },
  {
    accessorKey: "heading",
    header: "Heading",
    cell: ({ row }) => (
      <div className="w-24 overflow-hidden">{row.getValue("heading")}</div>
    ),
    size: 50,
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <div className="w-16 overflow-hidden">{row.getValue("country")}</div>
    ),
    size: 20,
  },
  {
    accessorKey: "basePrice",
    header: "B Price",
    cell: ({ row }) => <div>{row.getValue("basePrice")}</div>,
  },
  {
    accessorKey: "originalPrice",
    header: "O Price",
    cell: ({ row }) => <div>{row.getValue("originalPrice")}</div>,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => <div>{row.getValue("rating")}</div>,
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
          See Image
        </a>
      </div>
    ),
  },
  {
    accessorKey: "trending",
    header: "Trending",
    cell: ({ row }) => <div>{row.getValue("trending")?.toString()}</div>,
  },
  {
    accessorKey: "overview",
    header: "Overview",
    cell: ({ row }) => {
      const overview = row.getValue("overview") as string;
      const name = row.getValue("name") as string;
      return (
        <div className="space-y-2 w-6">
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const overview = row.getValue("description") as string;
      const name = row.getValue("name") as string;

      return (
        <div className="space-y-2 w-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{name} - Description</DialogTitle>
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
  // {
  //   accessorKey: "createdAt",
  //   header: "Created",
  //   cell: ({ row }) => {
  //     const value = row.getValue("createdAt");
  //     return value ? format(new Date(value as any), "dd/MM/yyyy") : null;
  //   },
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const destination = row.original;
      const did = String(destination.did);
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
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className="hover:text-blue-400 font-semibold"
                href={`/destination/${did}`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteData id={did} model="destinations" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface DestinationTableProps {
  data: Destination[];
  pagination: PaginationProps;
}

const DestinationTable: FC<DestinationTableProps> = ({ data, pagination }) => {
  return (
    <div className="w-full">
      <CommonTable
        data={data}
        placeholder="Filter by Destination Name"
        columnName="name"
        columns={columns}
        pagination={pagination}
      />
    </div>
  );
};

export default DestinationTable;
