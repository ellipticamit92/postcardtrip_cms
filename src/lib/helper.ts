export const checkEmpty = (value?: string) => {
  if (value) return value.toString();
  return "";
};

export const safeNumber = (value: unknown): number => {
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? 0 : parsed;
};

export const firstLetter = (name: string) => {
  return name ? name[0] : "";
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function formatSnakeCaseToSentence(input: string): string {
  if (!input) return "";
  return input
    .replace(/_/g, " ") // Replace underscores with spaces
    .toLowerCase() // Convert entire string to lowercase
    .replace(/^./, (s) => s.toUpperCase()); // Capitalize first letter
}

export function formatGlobalPhoneNumber(rawPhone: string): string {
  let cleaned = rawPhone.replace(/[^\d+]/g, "");
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }
  cleaned = "+" + cleaned.slice(1).replace(/\+/g, "");
  const match = cleaned.match(/^\+(\d{1,4})(\d{6,12})$/);
  if (!match) return rawPhone;
  const [, countryCode, number] = match;
  const formattedRest = number.replace(/(\d{3,4})(?=\d)/g, "$1 ").trim();
  return `+${countryCode} ${formattedRest}`;
}

export const getPlatform = (value: string) => {
  if (value === "ig") return "Instagram";
  if (value === "fb") return "Facebook";
  return "None";
};

export function formatDateToDayMonthYear(dateString: Date): string {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function excelSerialDateToDMY(serial: string): string {
  const utcDays = Math.floor(parseInt(serial));
  const utcValue = utcDays * 86400; // seconds
  const dateInfo = new Date(utcValue * 1000 + Date.UTC(1899, 11, 31)); // Jan 0 = Dec

  const dd = String(dateInfo.getUTCDate()).padStart(2, "0");
  const mm = String(dateInfo.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = dateInfo.getUTCFullYear();

  return `${dd}-${mm}-${yyyy}`;
}

export function getDateDetails(date: Date) {
  const customDate = new Date(date);
  return {
    day: customDate.toLocaleString("default", { weekday: "short" }),
    date: customDate.getDate(),
    month: customDate.toLocaleString("default", { month: "long" }),
    year: customDate.getFullYear(),
  };
}

export function getTodayDetails() {
  const today = new Date();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    day: dayNames[today.getDay()], // e.g. "Monday"
    date: today.getDate(), // e.g. 22
    month: monthNames[today.getMonth()], // e.g. "July"
    year: today.getFullYear(), // e.g. 2025
  };
}

export function formatDateTime(dateString: Date | string): string {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const formattedTime = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  return `${day}/${month}/${year} - ${formattedTime}`;
}

export function formatTimelineDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
