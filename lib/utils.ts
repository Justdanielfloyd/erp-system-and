import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDate(dateString: string): Date {
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1; // Months are 0-indexed
  const day = parseInt(dateString.substring(6, 8), 10);

  return new Date(year, month, day);
}

export function parseArray<T>(data: string | undefined): T[] {
  return data ? (JSON.parse(data) as T[]) : [];
}
