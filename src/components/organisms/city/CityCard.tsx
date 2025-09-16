"use client";
import Pagination from "@/components/molecules/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { City, PaginationProps } from "@/types/type";
import { Edit, Trash2 } from "lucide-react";
import { FC } from "react";

interface CityCardProps {
  data: City[];
  pagination: PaginationProps;
}

const CityCard: FC<CityCardProps> = ({ data, pagination }) => {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.map((city) => (
          <Card
            key={city.cid}
            className="group hover:shadow-elegant transition-all duration-300 py-4 gap-2"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{city.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className={getStatusColor("active")}>"active"</Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <span className="text-muted-foreground text-sm">
                  <p
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: city.description }}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="text-sm text-muted-foreground">
                  Updated today
                </div>
                <div className="flex gap-2">
                  <Button variant="default" size="sm">
                    Edit City
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
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

export default CityCard;
