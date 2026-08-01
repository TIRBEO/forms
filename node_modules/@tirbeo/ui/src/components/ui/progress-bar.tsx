"use client";

import { cn } from "../../lib/utils";

export interface ProgressBarProps {
  value: number;
  label?: string;
  showPercent?: boolean;
  className?: string;
  barClassName?: string;
}

function getColor(value: number): string {
  if (value >= 95) return "var(--color-success)";
  if (value >= 50) return "var(--color-warning)";
  return "var(--color-error)";
}

export function ProgressBar({
  value,
  label,
  showPercent = true,
  className,
  barClassName,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("flex items-center gap-3 h-7", className)}>
      {label && (
        <span className="text-sm text-[var(--color-admin-text)] min-w-[120px]">{label}</span>
      )}
      <div className="flex-1 h-2 rounded-full bg-[var(--color-admin-border)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${clamped}%`,
            background: getColor(value),
          }}
        />
      </div>
      {showPercent && (
        <span className="text-sm text-[var(--color-admin-text-secondary)] min-w-[40px] text-right">
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}
