import { COUNTRIES } from "@/consttants/constant";
import PackageService from "@/services/package.service";
import { Destination } from "@prisma/client";

export const getFieldOptions = (data: any, id: string) => {
  return data?.map((item: any) => {
    return {
      label: item.name,
      value: String(item[id]),
    };
  });
};

export const getNameValueOptions = (data: any, label?: string) => {
  return data?.map((item: any) => {
    return {
      label: item[label ?? "name"],
      value: item[label ?? "name"],
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

export const cleanAIResponse = (text: string): string => {
  if (!text) return "{}";
  // Remove markdown code blocks
  let cleaned = text.replace(/``````\s*/g, "");

  // Remove extra whitespace
  cleaned = cleaned.trim();

  // ES5-compatible regex (without 's' flag)
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  return cleaned;
};

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

export const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
};

export function unslugify(slug: string) {
  return slug
    .replace(/-/g, " ") // dashes -> spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize words
}

export function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD") // remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "") // remove apostrophes
    .replace(/[^a-zA-Z0-9]+/g, "-") // non-alphanumeric → dash
    .replace(/^-+|-+$/g, "") // trim dashes
    .toLowerCase();
}

export async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (await PackageService.slugExists(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

export const filterCountry = (country: string): string => {
  return country
    ? COUNTRIES.filter((item) => item.label.includes(country))?.[0]?.value
    : "";
};
