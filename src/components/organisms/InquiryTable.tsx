"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { InquiryTableProps } from "@/types/form/type";
import CommonTable from "../molecules/CommonTable";
import { Inquiry } from "@prisma/client";

export const columns: ColumnDef<Inquiry>[] = [
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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="w-24 overflow-hidden">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "mobile",
    header: "Mobile No.",
    cell: ({ row }) => (
      <div className="w-16 overflow-hidden">{row.getValue("mobile")}</div>
    ),
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => <div>{row.getValue("destination")}</div>,
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => <div>{row.getValue("budget") ?? null}</div>,
  },
  {
    accessorKey: "travellers",
    header: "Travellers",
    cell: ({ row }) => (
      <div>{row.getValue("travellers") ?? "Not mentioned"}</div>
    ),
  },
  {
    accessorKey: "message",
    header: "message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string;
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
              <DialogTitle>{name} - Message</DialogTitle>
            </DialogHeader>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Inquiry Date",
    cell: ({ row }) => {
      const dateValue = row.getValue("createdAt");
      const date = new Date(dateValue as string);
      return (
        <div>
          {date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
  },
];

const InquiryTable: FC<InquiryTableProps> = ({ data, pagination }) => {
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

export default InquiryTable;
