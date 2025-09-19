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
          className="group hover:shadow-elegant transition-all duration-300 overflow-hidden p-1 py-3"
        >
          <CardHeader className="!px-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-md mb-2 !px-0">
                  {iti.package.name}
                </CardTitle>
                <p className="text-sm italic">{iti.package.destination.name}</p>
                {/* <div className="flex items-center gap-2 mt-3">
                  <Badge>"active"</Badge>
                </div> */}
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
          <CardContent className="space-y-4 !px-2">
            <div className="flex gap-2 items-center">
              <Calendar className="h-4 w-4" />{" "}
              <span className="text-sm">{iti.itineraries.length} Days</span>
            </div>
            <div className=" mt-2 flex flex-col gap-2">
              {iti.itineraries.map((item: Itinerary) => (
                <div key={item.itid} className="p-2 border-1 rounded-sm">
                  <h4 className="font-medium text-sm mb-2">
                    Day {item.day}: {item.title}
                  </h4>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="xs">
                        View Itinerary Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          Day {item.day}: {item.title}{" "}
                        </DialogTitle>
                      </DialogHeader>
                      <div
                        className="prose prose-sm max-w-none"
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
      {/* {data.map((destination) => (
        <Card
          key={destination.did}
          className="group hover:shadow-elegant transition-all duration-300 overflow-hidden py-0 gap-3 pb-4"
        >
          <div className="relative overflow-hidden group">
            {destination?.imageUrl && (
              <div className="w-full h-64 group-hover:scale-110 transition-transform duration-500">
                <Image
                  src={destination?.imageUrl ?? ""}
                  alt={destination.name}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            )}

            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-pink-500 text-white">
                {destination?.packages?.length} Pacakges
              </Badge>
            </div>

            {destination?.trending && (
              <div className="absolute bottom-4 right-4 z-10">
                <Badge className="bg-cyan-500 text-white">Trending</Badge>
              </div>
            )}

            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-white font-medium">
                  {destination?.rating}
                </span>
              </div>
            </div>
          </div>

          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-lg">
                  {destination.name}
                  <span className="text-sm font-light italic">
                    , {destination?.country}
                  </span>
                </span>
                <span className="text-sm font-light italic">
                  {destination.heading}
                </span>
              </div>

              <div className="flex gap-1 ">
                <Link href={`/destination/${destination.did}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View Description
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{destination?.name} - Description</DialogTitle>
                  </DialogHeader>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: destination?.overview ?? "",
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View Overview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle> Overview</DialogTitle>
                  </DialogHeader>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: destination?.overview ?? "",
                    }}
                  />
                </DialogContent>
              </Dialog>
              <div className="flex items-center gap-2">
                {destination?.basePrice && (
                  <span className="text-2xl font-bold text-ocean">
                    {toIndianCurrency(destination.basePrice)}
                  </span>
                )}
                {destination?.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {toIndianCurrency(destination.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))} */}
    </div>
  );
};

export default ItineraryGrid;
