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

export function getColorForValue(value: number): string {
  return value < 0 ? "#D40000" : "#00e832";
}

export const setFallbackURL = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  e.currentTarget.src =
    "https://img.freepik.com/free-photo/3d-rendering-animal-illustration_23-2151888074.jpg";
};

export function formatToMillions(number: number) {
  // Convert the number to millions
  const inMillions = number / 1000000;

  // Round to 1 decimal place and add 'M' for millions
  return `${Math.round(inMillions * 10) / 10}M`;
}