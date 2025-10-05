"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAttractionArray } from "./organisms/city/helper";

interface AttractionsDialogProps {
  data: unknown; // can be string, JsonValue, or null
  title?: string;
}

const AttractionsDialog: FC<AttractionsDialogProps> = ({
  data,
  title = "Must-See Attractions",
}) => {
  const attractions = getAttractionArray(data as string);

  if (!attractions?.length)
    return <span className="text-gray-400 italic">No attractions</span>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="xs">
          View Attractions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          {attractions.map((attraction, i) => (
            <li key={i}>{attraction}</li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default AttractionsDialog;
