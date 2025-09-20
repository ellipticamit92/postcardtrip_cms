"use client";

import { Itinerary, ItineraryPackageItem, PaginationProps } from "@/types/type";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2, Calendar } from "lucide-react";

interface ItineraryGridProps {
  data: ItineraryPackageItem[];
  pagination: PaginationProps;
}

const ItineraryGrid: FC<ItineraryGridProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
      {data.map((iti: ItineraryPackageItem) => (
        <Card
          key={iti.package.pid}
          className="py-0 group hover:shadow-lg hover:border-primary/20 transition-all duration-300 rounded-xl overflow-hidden"
        >
          {/* Header */}
          <CardHeader className="!px-4 !py-3 border-b bg-muted/40">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-foreground mb-1">
                  {iti.package.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {iti.package.destination.name}
                </p>
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
          <CardContent className="!px-4 !py-3 space-y-4">
            {/* Days */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{iti.itineraries.length} Days</span>
            </div>

            {/* Itineraries */}
            <div className="flex flex-col gap-3 mt-3">
              {iti.itineraries.map((item: Itinerary) => (
                <div
                  key={item.itid}
                  className="p-3 rounded-lg border hover:shadow-sm transition-all"
                >
                  <h4 className="font-medium text-sm text-foreground mb-2">
                    Day {item.day}: {item.title}
                  </h4>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-medium hover:bg-primary hover:text-white transition-colors"
                      >
                        View Itinerary Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                          Day {item.day}: {item.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div
                        className="prose prose-sm max-w-none mt-4"
                        dangerouslySetInnerHTML={{
                          __html: item?.details ?? "",
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItineraryGrid;
