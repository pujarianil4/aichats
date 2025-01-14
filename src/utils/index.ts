export function shortenAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (!address || address.length <= startLength + endLength) {
    return address; // Return the full address if it's already short
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export function timeAgo(timestamp: number) {
  const now = Date.now();
  const secondsAgo = Math.floor((now - timestamp * 1000) / 1000);

  const units = [
      { label: 'year', seconds: 365 * 24 * 60 * 60 },
      { label: 'month', seconds: 30 * 24 * 60 * 60 },
      { label: 'week', seconds: 7 * 24 * 60 * 60 },
      { label: 'day', seconds: 24 * 60 * 60 },
      { label: 'hour', seconds: 60 * 60 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
  ];

  for (const unit of units) {
      const interval = Math.floor(secondsAgo / unit.seconds);
      if (interval >= 1) {
          return `${interval} ${unit.label}${interval > 1 ? 's' : ''} ago`;
      }
  }

  return 'just now';
}


export const toFixedNumber = (value: number, precision: number = 3)=> {
  return Number(value).toFixed(precision)
}