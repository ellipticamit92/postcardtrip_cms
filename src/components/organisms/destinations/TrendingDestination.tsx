import DashboardHeading from "@/components/atoms/DashboardHeading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { truncateText } from "@/lib/helper";
import DestinationService from "@/services/destination.service";
import { Calendar, Star, TrendingUp } from "lucide-react";

const TrendingDestination = async () => {
  const destinations = await DestinationService.getDashboardTrending();
  return (
    <>
      <DashboardHeading
        icon={TrendingUp}
        title="Trending Destinations"
        description="Most popular destinations right now"
        badgeClass="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700"
        badgeText="Hot Picks 🔥"
        iconClass="bg-gradient-to-br from-pink-500 to-orange-500"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.slice(0, 4).map((destination) => (
          <Card
            key={destination.did}
            className="py-0 group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden gap-1"
          >
            <div className="relative">
              {destination.imageUrl && (
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0 shadow-md">
                  #Trending
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">
                      {destination?.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg mb-1">
                  {destination.name}
                </h3>
                <p className="text-white/80 text-sm">{destination.country}</p>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {truncateText(destination?.overview ?? "", 60)}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Best:{" "}
                    {/* {destination.bestTimeToVisit?.split(",")[0] || "Year-round"} */}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-pink-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>12% popular</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default TrendingDestination;
