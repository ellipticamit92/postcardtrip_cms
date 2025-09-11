"use client";

import { Package, PaginationProps } from "@/types/type";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { FC } from "react";
import Link from "next/link";
import { toIndianCurrency } from "@/lib/helper";
import CommonTable from "@/components/molecules/CommonTable";
import ShowData from "@/components/molecules/ShowData";
import ShowPrice from "@/components/molecules/ShowPrices";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { format } from "date-fns";

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
    accessorKey: "inclusions",
    header: "INC/EXC/HLG/Cities",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;

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
                <DialogTitle>
                  {name} - Inclusions/Exclusion/Highlights{" "}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <ShowData
                  title="Inclusions"
                  data={(row.original?.inclusions as string[]) ?? []}
                  id="lid"
                />
                <ShowData
                  title="Exclusions"
                  data={(row.original?.exclusions as string[]) ?? []}
                  id="eid"
                />
                <ShowData
                  title="Highlights"
                  data={(row.original?.highlights as string[]) ?? []}
                  id="hlid"
                />
                <ShowData
                  title="Cities"
                  data={(row.original?.cities as string[]) ?? []}
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
    accessorKey: "basePrice",
    header: "All Prices",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;

      return (
        <div className="space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View Prices
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{name} - All Prices</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <ShowPrice
                  title="Base price"
                  price={row.original?.basePrice ?? 0}
                />
                <ShowPrice
                  title="Original price"
                  price={row.original?.originalPrice ?? 0}
                />
                <ShowPrice
                  title="3 Star price"
                  price={row.original?.threePrice ?? 0}
                />
                <ShowPrice
                  title="4 Star price"
                  price={row.original?.fourPrice ?? 0}
                />
                <ShowPrice
                  title="Base price"
                  price={row.original?.fivePrice ?? 0}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
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
        placeholder="Filter by Package Price"
        columnName="name"
        columns={columns}
        pagination={pagination}
      />
    </div>
  );
};

export default PackageTable;
