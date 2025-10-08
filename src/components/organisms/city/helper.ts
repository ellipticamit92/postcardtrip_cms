import { JsonValue } from "@prisma/client/runtime/library";

export const getActivitiesArray = (
  activities: JsonValue | string | null
): string[] => {
  if (!activities) return [];

  if (typeof activities === "string") {
    try {
      return JSON.parse(activities);
    } catch {
      return [];
    }
  }

  if (Array.isArray(activities)) {
    return activities.filter(
      (item): item is string => typeof item === "string"
    );
  }

  return [];
};

export const getAttractionArray = (
  mustSeeAttractions: JsonValue | string | null
): string[] => {
  let attractions: string[] = [];
  if (typeof mustSeeAttractions === "string") {
    try {
      attractions = JSON.parse(mustSeeAttractions);
    } catch {
      attractions = [];
    }
  } else if (Array.isArray(mustSeeAttractions)) {
    attractions = mustSeeAttractions.filter(
      (item): item is string => typeof item === "string"
    );
  }
  return attractions;
};
