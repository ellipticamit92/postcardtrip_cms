"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { FC } from "react";
import CommonTable from "../../molecules/CommonTable";
import Link from "next/link";
import DeleteData from "../DeleteData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Destination } from "@prisma/client";
import { DestinationsProps } from "@/types/form/type";

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
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <div className="w-16 overflow-hidden">{row.getValue("country")}</div>
    ),
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
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
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.getValue("description") as string;
      const name = row.getValue("name") as string;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{name} - Description</DialogTitle>
            </DialogHeader>
            <div className="prose prose-sm max-w-none">{desc}</div>
          </DialogContent>
        </Dialog>
      );
    },
  },
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className="hover:text-blue-400 font-semibold w-full block"
                href={`/destination/${did}`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="hover:text-blue-400 font-semibold w-full block"
                href={`/destination/ai/${did}`}
              >
                AI Edit
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

const DestinationTable: FC<DestinationsProps> = ({ data, pagination }) => {
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
