import { City, Destination } from "@/types/type";

export const getFieldOptions = (data: any, id: string) => {
  return data?.map((item: any) => {
    return {
      label: item.name,
      value: String(item[id]),
    };
  });
};

export const getTourOptions = (tours?: any[]) => {
  return tours
    ?.map((item) => {
      return {
        label: item.text, // Assuming 'text' is the field to display
        value: item.text, // Assuming 'tid' is the unique identifier
      };
    })
    .filter(Boolean);
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
