"use client";

import { cn } from "../../lib/utils";

interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export function Progress({ value = 0, max = 100, className, showLabel }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={cn("w-full", className)}>
      <div className="w-full h-2 bg-[var(--color-admin-border)] rounded-full overflow-hidden">
        <div className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && <p className="text-xs text-[var(--color-admin-text-secondary)] mt-1">{percentage}%</p>}
    </div>
  );
}
