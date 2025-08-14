"use client";

import { HotelImage } from "@/types/type";
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
import { getFIleName } from "@/lib/utils";

export const columns: ColumnDef<HotelImage>[] = [
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
    accessorKey: "caption",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="!p-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Hotel Caption <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "hotel",
    header: "Hotel Name",
    cell: ({ row }) => {
      const hotelImage = row.original;
      return <span>{hotelImage.hotel?.name}</span>;
    },
  },
  {
    accessorKey: "city",
    header: "City Name",
    cell: ({ row }) => {
      const hotelImage = row.original;
      return <span>{hotelImage.hotel?.city?.name}</span>;
    },
  },
  {
    accessorKey: "url",
    header: "Hotel Image",
    cell: ({ row }) => (
      <div>
        <a
          className="text-blue-700 hover:underline"
          href={row.getValue("url")}
          target="_blank"
        >
          {getFIleName(row.getValue("url"))}
        </a>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const hotelImage = row.original;
      const hiid = String(hotelImage.hiid);
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
              onClick={() => navigator.clipboard.writeText(hiid)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className="hover:text-blue-400 font-semibold"
                href={`/hotel-images/${hiid}`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteData id={hiid} model="Hotel" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface HotelImageTableProps {
  data: HotelImage[];
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}

const HotelImageTable: FC<HotelImageTableProps> = ({ data }) => {
  return (
    <div className="w-full">
      <CommonTable
        data={data}
        placeholder="Filter by Hotel Image Caption"
        columnName="caption"
        columns={columns}
      />
    </div>
  );
};

export default HotelImageTable;
