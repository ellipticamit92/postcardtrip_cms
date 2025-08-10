import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFIleName = (url: string) => {
  if (!url) return "";
  const urlArray = url?.split("/");
  return urlArray[urlArray.length - 1];
};
