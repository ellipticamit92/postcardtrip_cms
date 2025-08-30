"use client";

import { Itinerary, PaginationProps } from "@/types/type";
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
import ShowData from "../molecules/ShowData";

export const columns: ColumnDef<Itinerary>[] = [
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
    accessorKey: "day",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="!p-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Day <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="w-24 overflow-hidden">{row.getValue("title")}</div>
    ),
    size: 50,
  },
  {
    accessorKey: "packageId",
    header: "Package Name",
    cell: ({ row }) => (
      <div className="overflow-hidden">{row?.original?.package?.name}</div>
    ),
  },
  {
    accessorKey: "highlights",
    header: "Highlights / Cities",
    cell: ({ row }) => {
      const day = row.getValue("day") as string;

      return (
        <div className="space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Day {day} - Highligts / Cities</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <ShowData
                  title="Highlights"
                  data={(row?.original?.highlights as string[]) ?? []}
                  id="hlid"
                />
                <ShowData
                  title="Cities"
                  data={(row?.original?.cities as string[]) ?? []}
                  id="cid"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      const details = row.getValue("details") as string;
      const name = row.getValue("day") as string;
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
                <DialogTitle>Day {name} - Overview</DialogTitle>
              </DialogHeader>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: details }}
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
      const itineraries = row.original;
      const itid = String(itineraries.itid);
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
                href={`/itineraries/${itid}`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteData id={itid} model="itineraries" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface DestinationTableProps {
  data: Itinerary[];
  pagination: PaginationProps;
}

const ItineraryTable: FC<DestinationTableProps> = ({ data, pagination }) => {
  return (
    <div className="w-full">
      <CommonTable
        data={data}
        placeholder="Filter by Destination Name"
        columnName="day"
        columns={columns}
        pagination={pagination}
      />
    </div>
  );
};

export default ItineraryTable;
