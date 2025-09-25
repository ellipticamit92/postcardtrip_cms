import DashboardHeading from "@/components/atoms/DashboardHeading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toIndianCurrency } from "@/lib/helper";
import PackageService from "@/services/package.service";
import { Calendar, Package, Star, TrendingUp } from "lucide-react";

const FeaturedPackage = async () => {
  const packages = await PackageService.getDashboardPopular();
  return (
    <>
      <DashboardHeading
        icon={Package}
        title="Popular Travel Packages"
        description="Handpicked premium experiences with exclusive deals"
        badgeClass="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
        badgeText="Best Value 💎"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages
          .filter((pkg) => pkg.popular)
          .slice(0, 3)
          .map((pkg, index) => (
            <Card
              key={pkg.pid}
              className="py-0 group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden gap-1"
            >
              <div className="relative">
                {pkg.imageUrl && (
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-md">
                    #{index + 1} Popular
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl mb-2">
                    {pkg.name}
                  </h3>
                  <div className="flex items-center gap-4 text-white/90 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{pkg.day} days</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-5 pt-4">
                <div className="mb-3">
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 mb-2"
                  >
                    {/* {pkg.category} */}
                  </Badge>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {pkg.overview}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    {pkg.threePrice &&
                      pkg.threePrice > (pkg.threePrice ?? 0) && (
                        <p className="text-sm text-gray-400 line-through">
                          {toIndianCurrency(pkg.threePrice)}
                        </p>
                      )}
                    <p className="text-2xl font-bold text-gray-900">
                      {toIndianCurrency(pkg.threePrice ?? 0)}
                    </p>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-yellow-600 mb-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{pkg.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {/* {pkg.reviewCount} reviews */}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );
};

export default FeaturedPackage;
