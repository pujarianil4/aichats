import { Address } from "viem";

export function shortenAddress(
  address: Address,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!address || address.length <= startLength + endLength) {
    return address; // Return the full address if it's already short
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export function timeAgo(timestamp: string | number) {
  const now = Date.now(); // Current time in milliseconds
  let timeInMs: number;

  if (typeof timestamp === "string") {
    timeInMs = new Date(timestamp).getTime(); // Convert ISO string to milliseconds
  } else {
    timeInMs = timestamp * 1000; // Convert seconds to milliseconds if it's a number
  }

  const secondsAgo = Math.floor((now - timeInMs) / 1000); // Convert difference to seconds

  const units = [
    { label: "year", seconds: 365 * 24 * 60 * 60 },
    { label: "month", seconds: 30 * 24 * 60 * 60 },
    { label: "week", seconds: 7 * 24 * 60 * 60 },
    { label: "day", seconds: 24 * 60 * 60 },
    { label: "hour", seconds: 60 * 60 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}


export const toFixedNumber = (value: number, precision: number = 3) => {
  return Number(value).toFixed(precision);
};

export function getCurrentDomain() {
  return typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5173";
}

export function formatTimeDifference(dateString: string): string {
  const currentTime = new Date();
  const inputTime = new Date(dateString);
  const timeDifference = currentTime.getTime() - inputTime.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (days < 7) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  if (weeks < 4) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  // For dates beyond a month, return formatted date and time
  return inputTime.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
