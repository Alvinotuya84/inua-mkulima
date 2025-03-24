/**
 * Formats a number of bytes into a human readable string
 * @param bytes Number of bytes to format
 * @param decimals Number of decimal places to show (default: 2)
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Formats a date string or timestamp into a human-readable format
 * @param date Date string, timestamp, or Date object
 * @param options Optional Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
): string {
  try {
    const dateObject =
      typeof date === "string" ? new Date(date) : new Date(date);

    // Check if the date is valid
    if (isNaN(dateObject.getTime())) {
      throw new Error("Invalid date");
    }

    // Format the date using Intl.DateTimeFormat for localization
    return new Intl.DateTimeFormat("en-US", options).format(dateObject);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

/**
 * Returns a relative time string (e.g., "2 hours ago")
 * @param date Date string, timestamp, or Date object
 * @returns Relative time string
 */
export function getRelativeTimeString(date: string | number | Date): string {
  try {
    const dateObject =
      typeof date === "string" ? new Date(date) : new Date(date);

    // Check if the date is valid
    if (isNaN(dateObject.getTime())) {
      throw new Error("Invalid date");
    }

    const now = new Date();
    const diff = now.getTime() - dateObject.getTime();

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return rtf.format(-years, "year");
    if (months > 0) return rtf.format(-months, "month");
    if (days > 0) return rtf.format(-days, "day");
    if (hours > 0) return rtf.format(-hours, "hour");
    if (minutes > 0) return rtf.format(-minutes, "minute");
    return rtf.format(-seconds, "second");
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Invalid date";
  }
}
