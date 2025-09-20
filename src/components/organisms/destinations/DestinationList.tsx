"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DestinationsProps } from "@/types/form/type";
import { Star, MapPin, Edit } from "lucide-react";
import { FC } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Pagination from "@/components/molecules/Pagination";
import DeleteData from "../DeleteData";
import Link from "next/link";

const DestinationList: FC<DestinationsProps> = ({ data, pagination }) => {
  return (
    <>
      <div className="space-y-4">
        {data.map((destination) => (
          <Card
            key={destination.did}
            className="group hover:shadow-elegant transition-all duration-300 py-0"
          >
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative overflow-hidden group">
                    {destination?.imageUrl && (
                      <div className="w-14 h-14 group-hover:scale-110 transition-transform duration-500">
                        <Image
                          src={destination?.imageUrl ?? ""}
                          alt={destination.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-end gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {destination.name},{" "}
                        <span className="!text-xs font-light">
                          {destination.country}
                        </span>
                      </h3>
                      {destination?.trending && (
                        <Badge variant="outline">Trending</Badge>
                      )}
                      {destination?.featured && (
                        <Badge variant="outline">Feratured</Badge>
                      )}
                      {destination?.trending && (
                        <Badge variant="outline">status</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{destination.rating} rating</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>
                          {destination?.packages?.length} packages available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mr-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>View Details</DialogTitle>
                      </DialogHeader>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: destination?.overview ?? "",
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Link
                    className="hover:text-blue-400 font-semibold w-full block"
                    href={`/destination/${destination.did}`}
                  >
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
export default DestinationList;
