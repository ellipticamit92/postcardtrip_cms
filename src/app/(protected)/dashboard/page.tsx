import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Package,
  Compass,
  Building2,
  Plus,
  TrendingUp,
  Star,
} from "lucide-react";
import React from "react";
//import { getTodayDetails } from "@/lib/helper";

const stats = [
  { title: "Destinations", count: 24, icon: MapPin, change: "+12%" },
  { title: "Packages", count: 156, icon: Package, change: "+8%" },
  { title: "Itineraries", count: 89, icon: Map, change: "+15%" },
  { title: "Tours", count: 67, icon: Compass, change: "+5%" },
  { title: "Hotels", count: 203, icon: Building2, change: "+18%" },
];

const recentActivity = [
  { action: "New destination", item: "Santorini, Greece", time: "2 hours ago" },
  {
    action: "Updated package",
    item: "Mediterranean Explorer",
    time: "4 hours ago",
  },
  { action: "Added hotel", item: "Ocean View Resort", time: "6 hours ago" },
  { action: "Created itinerary", item: "Athens City Break", time: "1 day ago" },
];

export default function DashboardPage() {
  // const { day, date, year, month } = getTodayDetails();
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Postcardtrip Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your travel content and bookings
            </p>
          </div>
          <Button variant="gradient" className="shadow-glow">
            <Plus className="h-4 w-4" />
            Add Content
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="relative overflow-hidden group hover:shadow-elegant transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Star className="h-4 w-4 text-primary group-hover:text-primary-glow transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.count}
                </div>
                <div className="flex items-center text-xs text-accent">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </div>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-sm text-primary">{activity.item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a href="/destinations">
                  <MapPin className="h-4 w-4" />
                  Add Destination
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a href="/packages">
                  <Package className="h-4 w-4" />
                  Create Package
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a href="/itineraries">
                  <MapPin className="h-4 w-4" />
                  Build Itinerary
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a href="/tours">
                  <Compass className="h-4 w-4" />
                  Setup Tour
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a href="/hotels">
                  <Building2 className="h-4 w-4" />
                  Add Hotel
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
