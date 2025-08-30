import { Destination } from "@/types/type";

export const getFieldOptions = (data: any, id: string) => {
  return data?.map((item: any) => {
    return {
      label: item.name,
      value: String(item[id]),
    };
  });
};

export const getFieldOptionsNum = (data: any, id: string, label?: string) => {
  return data?.map((item: any) => {
    return {
      label: item[label ?? "name"],
      value: item[id],
    };
  });
};

export const getTourOptions = (tours: any) => {
  return tours?.map((item: any) => {
    return {
      label: item.text,
      value: item.tid,
    };
  });
};

export const getHotelOptions = (hotels: any) => {
  return hotels?.map((item: any) => {
    return {
      label: `${item.name} (${item.starRating} star) - ${item.city.name}`,
      value: String(item.hid),
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

export function toIndianCurrency(amount: number): string {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });
}

export const unslugifyPackageName = (id: string): string =>
  id.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
