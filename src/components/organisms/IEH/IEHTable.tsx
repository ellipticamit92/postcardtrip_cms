"use client";

import { format } from "date-fns";
import { IEH, PaginationProps } from "@/types/type";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import CommonTable from "@/components/molecules/CommonTable";
import DeleteData from "../DeleteData";
import IEHModal from "./IEFModal";

export const columns: ColumnDef<IEH>[] = [
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
    accessorKey: "text",
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
    accessorKey: "type",
    cell: ({ row }) => {
      const title = row.original?.type ?? "";
      const updateData = {
        text: row.original?.text ?? "",
      };
      const ieh = row.original;
      const deleteId = `${ieh.id}_${ieh?.type}`;
      return (
        <div className="flex gap-2">
          <IEHModal
            isEdit={true}
            title={title}
            isTable={true}
            data={updateData}
            id={row.original.id ?? 0}
          />
          {ieh?.type && (
            <DeleteData id={deleteId} model={ieh.type} ieh={true} isButton />
          )}
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
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const ieh = row.original;
  //     const id = String(ieh.id).trim();
  //     const deleteId = `${ieh.id}_${ieh?.type}`;
  //     const url = `/${ieh?.type}/${id}`;
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>
  //             {ieh?.type && (
  //               <DeleteData id={deleteId} model={ieh.type} ieh={true} />
  //             )}
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

interface IEHTableProps {
  data: IEH[];
  pagination: PaginationProps;
}

const IEHTable: FC<IEHTableProps> = ({ data, pagination }) => {
  return (
    <div className="w-full">
      <CommonTable
        data={data}
        placeholder="Filter by Text"
        columnName="text"
        columns={columns}
        pagination={pagination}
      />
    </div>
  );
};

export default IEHTable;
