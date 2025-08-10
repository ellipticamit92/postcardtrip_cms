import { City, Destination } from "@/types/type";

export const getFieldOptions = (data: any, id: string) => {
  return data?.map((item: any) => {
    return {
      label: item.name,
      value: String(item[id]),
    };
  });
};

export const getDestinationOptions = (destination: Destination[]) => {
  return destination?.map((item) => {
    return {
      label: item.name,
      value: String(item.did),
    };
  });
};

export const getCityOptions = (cities: City[]) => {
  return cities?.map((item) => {
    return {
      label: item.name,
      value: String(item.cid),
    };
  });
};
