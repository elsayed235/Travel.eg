import React from 'react';
import { Clock } from 'lucide-react';

interface FreshnessBadgeProps {
  lastUpdated: Date | null;
  className?: string;
}

/**
 * Shows data freshness: Live / Updated X ago / Stale / Unknown.
 * Colors: green for fresh (<60s), amber for aging (<10m), red for stale (>10m).
 */
export function FreshnessBadge({ lastUpdated, className = '' }: FreshnessBadgeProps) {
  if (!lastUpdated) {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] text-white/30 font-mono ${className}`}>
        <Clock className="w-3 h-3" /> Unknown
      </span>
    );
  }

  const secondsAgo = Math.round((Date.now() - lastUpdated.getTime()) / 1000);

  if (secondsAgo < 10) {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-mono ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-emerald-400">Live</span>
      </span>
    );
  }

  if (secondsAgo < 60) {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] text-emerald-400/80 font-mono ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Updated {secondsAgo}s ago
      </span>
    );
  }

  if (secondsAgo < 600) {
    const minutes = Math.round(secondsAgo / 60);
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] text-amber-400/80 font-mono ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Updated {minutes}m ago
      </span>
    );
  }

  const minutes = Math.round(secondsAgo / 60);
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] text-red-400/80 font-mono ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
      Stale ({minutes}m)
    </span>
  );
}

/**
 * Hook that tracks last-updated time and provides a freshness string.
 */
export function useFreshness(lastUpdated: Date | null) {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!lastUpdated) return;
    const interval = setInterval(() => setTick(t => t + 1), 10_000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  if (!lastUpdated) return 'Unknown';
  const secondsAgo = Math.round((Date.now() - lastUpdated.getTime()) / 1000);
  if (secondsAgo < 10) return 'Live';
  if (secondsAgo < 60) return `Updated ${secondsAgo}s ago`;
  if (secondsAgo < 600) return `Updated ${Math.round(secondsAgo / 60)}m ago`;
  return `Stale (${Math.round(secondsAgo / 60)}m)`;
}
