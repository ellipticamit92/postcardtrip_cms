"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import DeleteData from "../DeleteData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ReviewsTableProps,
  ReviewsWithPackageDestination,
} from "@/types/form/type";

export const columns: ColumnDef<ReviewsWithPackageDestination>[] = [
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
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="!p-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Username <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "places",
    header: "Places Visited",
    cell: ({ row }) => <div>{row.getValue("places")}</div>,
  },
  {
    accessorKey: "review",
    header: "Review",
    cell: ({ row }) => {
      const reviewText = row.getValue("review") as string;
      const username = row.getValue("username") as string;
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
                <DialogTitle>{username} - Review</DialogTitle>
              </DialogHeader>
              <div className="prose prose-sm max-w-none">{reviewText}</div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => <div>{row.getValue("rating")}</div>,
  },
  {
    accessorKey: "package",
    header: "Package",
    cell: ({ row }) => <div>{row.original.package?.name}</div>,
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => <div>{row.original.destination?.name}</div>,
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
      const review = row.original;
      const rid = String(review.id);

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
                className="hover:text-blue-400 font-semibold w-full block"
                href={`/review/${rid}`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteData id={rid} model="reviews" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const ReviewsTable: FC<ReviewsTableProps> = ({ data, pagination }) => {
  return (
    <div className="w-full">
      <CommonTable
        data={data}
        placeholder="Filter by Username"
        columnName="username"
        columns={columns}
        pagination={pagination}
      />
    </div>
  );
};

export default ReviewsTable;
