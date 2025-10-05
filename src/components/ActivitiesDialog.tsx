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
import { getActivitiesArray } from "./organisms/city/helper";

interface ActivitiesDialogProps {
  data: unknown; // can be string, JsonValue, or null
  title?: string; // optional dialog title
}

const ActivitiesDialog: FC<ActivitiesDialogProps> = ({
  data,
  title = "Activities",
}) => {
  const activities = getActivitiesArray(data as string);

  if (!activities?.length)
    return <span className="text-gray-400 italic">No activities</span>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="xs">
          View Activites
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          {activities.map((activity, i) => (
            <li key={i}>{activity}</li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default ActivitiesDialog;
