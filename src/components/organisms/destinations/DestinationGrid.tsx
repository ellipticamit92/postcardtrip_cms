"use client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toIndianCurrency } from "@/lib/helper";
import { Star, Edit } from "lucide-react";
import { DestinationsProps } from "@/types/form/type";
import Pagination from "@/components/molecules/Pagination";
import DeleteData from "../DeleteData";

const DestinationGrid: FC<DestinationsProps> = ({ data, pagination }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map((destination) => (
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
                  {/* Gradient Overlay */}
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
              {destination?.featured && (
                <div className="absolute bottom-8 right-4 z-10">
                  <Badge className="bg-cyan-500 text-white">Featured</Badge>
                </div>
              )}

              {destination?.status && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-cyan-500 text-white">Active</Badge>
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
                  <DeleteData
                    id={String(destination.did)}
                    model="destinations"
                    isIcon
                  />
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <Dialog>
                  {/* <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View Description
                  </Button>
                </DialogTrigger> */}
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {destination?.name} - Description
                      </DialogTitle>
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
    </>
  );
};

export default DestinationGrid;
