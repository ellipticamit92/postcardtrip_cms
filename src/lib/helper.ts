import { City, Destination } from "@/types/type";

export const getFieldOptions = (data: any, id: string) => {
  return data?.map((item: any) => {
    return {
      label: item.name,
      value: String(item[id]),
    };
  });
};

export const getTourOptions = (tours: any) => {
  return tours?.map((item: any) => {
    return {
      label: item.text, // Assuming 'text' is the field to display
      value: item.tid, // Assuming 'tid' is the unique identifier
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

export function toIndianCurrency(amount: number): string {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
}

export const unslugifyPackageName = (id: string): string =>
  id.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
