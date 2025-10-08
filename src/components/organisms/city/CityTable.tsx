"use client";

import { PaginationProps } from "@/types/type";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CommonTable from "@/components/molecules/CommonTable";

import DeleteData from "../DeleteData";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { City } from "@prisma/client";
import AttractionsDialog from "@/components/AttractionsDialog";
import ActivitiesDialog from "@/components/ActivitiesDialog";

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
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
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
  {
    accessorKey: "activities",
    header: "Activities",
    cell: ({ row }) => {
      const activitiesData = row.getValue("activities");
      return <ActivitiesDialog data={activitiesData} />;
    },
  },
  {
    accessorKey: "mustSeeAttractions",
    header: "Attractions",
    cell: ({ row }) => {
      const attractionData = row.getValue("mustSeeAttractions");
      return <AttractionsDialog data={attractionData} />;
    },
  },
  {
    accessorKey: "imageUrl",
    header: "imageUrl",
    cell: ({ row }) => (
      <div>
        <a
          className="text-blue-700 hover:underline font-bold"
          href={row.getValue("imageUrl")}
          target="_blank"
        >
          View
        </a>
      </div>
    ),
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
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className="hover:text-blue-400 font-semibold"
                href={`/city/${cid}`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteData id={cid} model="cities" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface CityTableProps {
  data: City[];
  pagination?: PaginationProps;
}

const CityTable: FC<CityTableProps> = ({ data, pagination }) => {
  return (
    <div className="w-full">
      <CommonTable
        data={data}
        placeholder="Filter by City Name"
        columnName="name"
        columns={columns}
        pagination={pagination}
      />
    </div>
  );
};

export default CityTable;
