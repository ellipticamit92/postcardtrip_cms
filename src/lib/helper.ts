import { Destination } from "@/types/type";

export const getDestinationDropdown = (destination: Destination[]) => {
  return destination?.map((item) => {
    return {
      label: item.name,
      value: String(item.did),
    };
  });
};
