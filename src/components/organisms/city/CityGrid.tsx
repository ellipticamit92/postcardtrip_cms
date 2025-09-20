"use client";
import Pagination from "@/components/molecules/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { City, PaginationProps } from "@/types/type";
import { Edit, Trash2 } from "lucide-react";
import { FC } from "react";

interface CityGridProps {
  data: City[];
  pagination: PaginationProps;
}

const CityGrid: FC<CityGridProps> = ({ data, pagination }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {data.map((city) => (
          <Card
            key={city.cid}
            className="group hover:shadow-lg hover:border-primary/20 transition-all duration-300 rounded-xl p-3 gap-1"
          >
            {/* Header */}
            <CardHeader className="p-0 mb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {city.name}
                  </CardTitle>
                  <Badge
                    className={`${getStatusColor(
                      "active"
                    )} mt-2 px-2 py-0.5 text-xs rounded-full`}
                  >
                    Active
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-0 space-y-4">
              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                <span>
                  Added:{" "}
                  {city.createdAt
                    ? new Intl.DateTimeFormat("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(city.createdAt))
                    : "-"}
                </span>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="xs"
                      className="text-xs font-medium hover:bg-primary hover:text-white"
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">
                        City Overview
                      </DialogTitle>
                    </DialogHeader>
                    <div
                      className="prose prose-sm max-w-none mt-3"
                      dangerouslySetInnerHTML={{ __html: city.description }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="sticky bottom-0 w-full flex items-end justify-end mt-4 p-2 bg-white shadow-lg">
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
        />
      </div>
    </div>
  );
};

export default CityGrid;
