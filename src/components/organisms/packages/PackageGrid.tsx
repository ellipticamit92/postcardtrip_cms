"use client";
import Image from "next/image";
import Link from "next/link";
import { Package, PaginationProps } from "@/types/type";
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

interface PackageGridProps {
  data: Package[];
  pagination: PaginationProps;
}

const PackageGrid: FC<PackageGridProps> = ({ data, pagination }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((pkg: Package) => (
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

            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-white font-medium">
                  {/* {pkg?.rating} */}
                </span>
              </div>
            </div>
          </div>

          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-lg">
                  {pkg.name}
                  <span className="text-sm font-light italic">
                    , {pkg?.destination?.country}
                  </span>
                </span>
                <span className="text-sm font-light italic">{pkg.name}</span>
              </div>

              <div className="flex gap-1 ">
                <Link href={`/destination/${pkg.pid}`}>
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
                    <DialogTitle>{pkg?.name} - Description</DialogTitle>
                  </DialogHeader>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: pkg?.overview ?? "",
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
                      __html: pkg?.overview ?? "",
                    }}
                  />
                </DialogContent>
              </Dialog>
              <div className="flex items-center gap-2">
                {pkg?.basePrice && (
                  <span className="text-2xl font-bold text-ocean">
                    {toIndianCurrency(pkg.basePrice)}
                  </span>
                )}
                {pkg?.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {toIndianCurrency(pkg.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PackageGrid;
