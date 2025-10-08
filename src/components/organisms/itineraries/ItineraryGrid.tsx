"use client";

import { PaginationProps } from "@/types/type";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2, Calendar } from "lucide-react";
import Link from "next/link";
import { ItineraryWithPackage } from "@/types/form/type";

interface ItineraryGridProps {
  data: ItineraryWithPackage[];
  pagination: PaginationProps;
}

const ItineraryGrid: FC<ItineraryGridProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
      {data.map((iti: ItineraryWithPackage) => (
        <Card
          key={iti.itid}
          className="py-0 group hover:shadow-lg hover:border-primary/20 transition-all duration-300 rounded-xl overflow-hidden gap-3"
        >
          <CardHeader className="!px-4 !pt-3 !pb-0 border-b bg-muted/40">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-foreground mb-1">
                  <span className="text-xs font-bold">
                    {iti?.package?.name}
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {iti?.package?.destination.name}
                </p>
              </div>
              <div className="flex gap-1">
                <Link href={`/itineraries/${iti?.itid}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
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

          <CardContent className="!px-4 !py-0 !pb-2 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {iti.day && Array.isArray(iti.day) ? iti.day.length : 0} Days
              </span>
            </div>

            <div className="flex flex-col gap-3 mt-3">
              {Array.isArray(iti.day) &&
                iti.day.slice(0, 3).map((item: any, index: number) => (
                  <div
                    key={index}
                    className="p-2 rounded-lg border hover:shadow-sm transition-all"
                  >
                    <h4 className="font-medium text-sm text-foreground mb-2">
                      Day {item.day}: {item.title}
                    </h4>

                    {/* View Details Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="xs"
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
          {Array.isArray(iti.day) && iti.day.length > 3 && (
            <CardFooter className="text-center flex items-center justify-center !pb-3">
              <p className="text-sm text-black text-center">
                +{iti.day.length - 3} more days
              </p>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ItineraryGrid;
