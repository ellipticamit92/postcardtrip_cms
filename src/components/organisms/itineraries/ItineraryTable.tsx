"use client";

import { PaginationProps } from "@/types/type";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CommonTable from "@/components/molecules/CommonTable";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import DeleteData from "../DeleteData";
import { ItineraryWithPackage } from "@/types/form/type";
import { format } from "date-fns";

export const columns: ColumnDef<ItineraryWithPackage>[] = [
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
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="overflow-hidden">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "packageId",
    header: "Package Id",
    cell: ({ row }) => <div>{row.getValue("packageId")}</div>,
  },
  {
    accessorKey: "day",
    header: "Details",
    cell: ({ row }) => {
      const day = row.getValue("day");
      return (
        <div className="space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs">
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Day Wise Itinerary</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                {Array.isArray(day) &&
                  day.map((d, index) => (
                    <div className="flex flex-col gap-2" key={index}>
                      <h3 className="border-b font-bold text-sm">
                        Day {index + 1}
                      </h3>
                      <div>
                        <h3 className="text-xs">Title: {d.title}</h3>
                        {d.subTitle && (
                          <h3 className="text-xs">Sub Title: {d.subTitle}</h3>
                        )}
                        <div
                          className="prose prose-sm max-w-none text-xs"
                          dangerouslySetInnerHTML={{ __html: d.details ?? "" }}
                        />
                        {/* <p>{d.highlights}</p> */}
                        {/* <p>{d.citites}</p> */}
                      </div>
                    </div>
                  ))}
                {/* <ShowData
                  title="Highlights"
                  data={(row?.original?.highlights as string[]) ?? []}
                  id="hlid"
                /> */}
              </div>
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
  data: ItineraryWithPackage[];
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
