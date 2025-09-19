"use client";

import { Hotel } from "@/types/type";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { FC } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommonTable from "@/components/molecules/CommonTable";
import DeleteData from "../DeleteData";

export const columns: ColumnDef<Hotel>[] = [
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
        Hotel Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "city",
    header: "City Name",
    cell: ({ row }) => {
      const hotel = row.original;
      return <span>{hotel?.city?.name}</span>;
    },
  },
  {
    accessorKey: "starRating",
    header: "Star Rating",
    cell: ({ row }) => {
      return <span>{row.getValue("starRating")}</span>;
    },
  },
  {
    accessorKey: "description",
    header: "Hotel Description",
    cell: ({ row }) => {
      const overview = row.getValue("description") as string;
      const name = row.getValue("name") as string;

      // Preview (first 100 chars without HTML)
      const previewText = overview.replace(/<[^>]*>/g, "").substring(0, 15);

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
  // {
  //   id: "iamges",
  //   header: "Hotel Images",
  //   cell: ({ row }) => {
  //     const hotel = row.original;
  //     const data = hotel?.images;
  //     return (
  //       <div className="flex flex-col">
  //         {data?.map((item, index) => {
  //           const fileName = getFIleName(item.url);
  //           return (
  //             <a
  //               key={item.hiid}
  //               href={item.url}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="text-blue-700 hover:underline"
  //             >
  //               {fileName}
  //               {index < data.length - 1 && ", "}
  //             </a>
  //           );
  //         })}
  //       </div>
  //     );
  //   },
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const hotel = row.original;
      const hid = String(hotel.hid);
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
                href={`/hotel/${hid}`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteData id={hid} model="Hotel" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface HotelTableProps {
  data: Hotel[];
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}

const HotelTable: FC<HotelTableProps> = ({ data }) => {
  return (
    <div className="w-full">
      <CommonTable
        data={data}
        placeholder="Filter by City Name"
        columnName="name"
        columns={columns}
      />
    </div>
  );
};

export default HotelTable;
