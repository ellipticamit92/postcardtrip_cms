"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useFilter } from "@/hooks/use-filter";
import { Grid3X3, List, Search, TableIcon } from "lucide-react";
import { FC } from "react";

interface FilterCardProps {
  searchTerm: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewMode: string;
  handleModeChange: (value: string) => void;
}

const FilterCard: FC<FilterCardProps> = ({
  searchTerm,
  handleChange,
  viewMode,
  handleModeChange,
}) => {
  return (
    <Card className="py-0">
      <CardContent className="px-2 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-4 flex-1">
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
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={handleModeChange}
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <TableIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterCard;
