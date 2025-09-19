import DashboardHeading from "@/components/atoms/DashboardHeading";
import TrendingDestination from "@/components/organisms/destinations/TrendingDestination";
import FeaturedPackage from "@/components/organisms/packages/FeaturedPaclage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quickLinks } from "@/consttants/constant";
import { GenericService } from "@/services/generic.service";
import {
  MapPin,
  Package,
  Compass,
  Building,
  PencilIcon,
  Zap,
  Plus,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const destinationCount = await GenericService.getCount("Destination");
  const reviewsCount = await GenericService.getCount("Reviews");
  const toursCount = await GenericService.getCount("Tours");
  const pkgCount = await GenericService.getCount("Package");
  const hotelCount = await GenericService.getCount("Hotel");

  const stats1 = [
    {
      title: "Destinations",
      value: destinationCount,
      icon: MapPin,
      color: "text-blue-600",
    },
    {
      title: "Packages",
      value: pkgCount,
      icon: Package,
      color: "text-green-600",
    },
    {
      title: "Tours",
      value: toursCount,
      icon: Compass,
      color: "text-teal-600",
    },
    {
      title: "Hotels",
      value: hotelCount,
      icon: Building,
      color: "text-purple-600",
    },
    {
      title: "Reviews",
      value: reviewsCount,
      icon: PencilIcon,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground mt-1">
            {
              "Welcome back! Here's what's happening with your travel agency today."
            }
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 ">
        {stats1.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-0 px-0 py-3 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center ${
                    stat.title === "Destinations"
                      ? "from-blue-500 to-blue-600"
                      : stat.title === "Packages"
                      ? "from-green-500 to-green-600"
                      : stat.title === "Tours"
                      ? "from-teal-500 to-teal-600"
                      : stat.title === "Hotels"
                      ? "from-purple-500 to-purple-600"
                      : "from-orange-500 to-orange-600"
                  }`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="px-3">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-500">
                  {stat.title === "Destinations"
                    ? "Active destinations"
                    : stat.title === "Packages"
                    ? "Travel packages"
                    : stat.title === "Tours"
                    ? "Guided tours"
                    : stat.title === "Hotels"
                    ? "Partner hotels"
                    : "All Reviews"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mb-8">
        <DashboardHeading
          icon={Zap}
          title="Quick Actions"
          description=" Create new content with just one click"
          badgeClass="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700"
          badgeText="Fast Track ⚡"
          iconClass="bg-gradient-to-br from-indigo-500 to-purple-600"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {quickLinks.map((action) => {
            const IconComponent = action.icon;
            return (
              <Card
                key={action.section}
                className={`py-0 group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${action.bgGradient} ${action.hoverBg} overflow-hidden`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3
                          className={`font-semibold mb-1 ${action.textColor} group-hover:scale-105 transition-transform`}
                        >
                          {action.title}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed mb-3">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <Link href={action.href} className="w-full">
                      <Button
                        size="sm"
                        className={`w-full bg-gradient-to-r ${action.gradient} hover:shadow-md transition-all duration-200 border-0 group-hover:scale-105`}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Create
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Trending Destinations Section */}
      <TrendingDestination />

      {/* Featured Packages Section */}
      <FeaturedPackage />
    </div>
  );
}
