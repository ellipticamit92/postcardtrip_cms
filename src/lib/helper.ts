import { Destination } from "@prisma/client";

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

export const numberOptions = (max: number = 20, labelPrefix = "") =>
  Array.from({ length: max }, (_, i) => ({
    label: labelPrefix ? `${labelPrefix} ${i + 1}` : `${i + 1}`,
    value: String(i + 1),
  }));

/**
 * Truncate text to a max length and add "..." if needed
 * @param text - The string to truncate
 * @param maxLength - Max characters before truncation (default 25)
 * @returns Truncated string with "..." if longer
 */
export function truncateText(text: string, maxLength: number = 20): string {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export function getInitials(name: string): string {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/) // split by spaces
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
