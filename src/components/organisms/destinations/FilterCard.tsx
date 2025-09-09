"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FC } from "react";

interface FilterCardProps {
  searchTerm: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterCard: FC<FilterCardProps> = ({ searchTerm, handleChange }) => {
  return (
    <Card className="py-0">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterCard;
