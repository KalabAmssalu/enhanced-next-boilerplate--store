import {
  format,
  parseISO,
  isValid,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

// Date formatting utilities
export function formatDate(
  date: Date | string,
  formatString: string = "yyyy-MM-dd"
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    throw new Error("Invalid date");
  }

  return format(dateObj, formatString);
}

export function formatDateTime(
  date: Date | string,
  formatString: string = "yyyy-MM-dd HH:mm:ss"
): string {
  return formatDate(date, formatString);
}

export function formatTime(
  date: Date | string,
  formatString: string = "HH:mm"
): string {
  return formatDate(date, formatString);
}

// Relative time utilities
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const now = new Date();

  const days = differenceInDays(now, dateObj);
  const hours = differenceInHours(now, dateObj);
  const minutes = differenceInMinutes(now, dateObj);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

// Date validation
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && isValid(date);
}

export function isValidDateString(dateString: string): boolean {
  const date = parseISO(dateString);
  return isValid(date);
}


