"use client";
import Image from "next/image";
import Link from "next/link";
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
import { toIndianCurrency } from "@/lib/helper";
import { Star, Edit, Trash2 } from "lucide-react";
import Pagination from "@/components/molecules/Pagination";
import { Badge } from "@/components/ui/badge";
import { PackageGridProps, PackageWithDestiantion } from "@/types/form/type";

const PackageGrid: FC<PackageGridProps> = ({ data, pagination }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map((pkg: PackageWithDestiantion) => (
          <Card
            key={pkg.pid}
            className="group hover:shadow-elegant transition-all duration-300 overflow-hidden py-0 gap-3 pb-4"
          >
            <div className="relative overflow-hidden group">
              {pkg?.imageUrl && (
                <div className="w-full h-64 group-hover:scale-110 transition-transform duration-500">
                  <Image
                    src={pkg?.imageUrl ?? ""}
                    alt={pkg.name}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              )}
              {!pkg?.imageUrl && (
                <div className="w-full h-64 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              )}

              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-pink-500 text-white font-bold">
                  {pkg.day}D / {pkg.night}N
                </Badge>
              </div>
              {pkg?.status && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-destructive text-white">Active</Badge>
                </div>
              )}
              {pkg?.featured && (
                <div className="absolute bottom-4 right-4 z-10">
                  <Badge className="bg-green-600 text-white">Featured</Badge>
                </div>
              )}
              {pkg?.popular && (
                <div
                  className={`absolute right-4 z-10 ${
                    pkg.featured ? "bottom-12" : "bottom-4"
                  }`}
                >
                  <Badge className="bg-secondary text-white">Popular</Badge>
                </div>
              )}

              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-white font-medium">
                    {pkg?.rating}
                  </span>
                </div>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-md leading-5">{pkg.name}</span>
                  <span className="text-sm font-light italic">
                    {pkg?.destination?.country}
                  </span>
                </div>

                <div className="flex gap-1 ">
                  <Link href={`/package/${pkg.pid}`}>
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
              <div className="pb-3 flex gap-2 flex-wrap">
                {pkg?.category?.split(",")?.map((item, index) => (
                  <Badge
                    key={index}
                    className="bg-yellow-200 text-black text-[10px]"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {pkg.text}
              </p>
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
                        __html: pkg?.overview ?? "",
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <div className="flex items-center gap-2">
                  {pkg?.threePrice && (
                    <span className="text-2xl font-bold text-ocean">
                      {toIndianCurrency(pkg.threePrice)}
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

export default PackageGrid;
