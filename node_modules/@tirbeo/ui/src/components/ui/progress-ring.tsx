"use client";

import { cn } from "../../lib/utils";

export interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subtitle?: string;
  className?: string;
}

function getColor(value: number): string {
  if (value >= 95) return "var(--color-success)";
  if (value >= 50) return "var(--color-warning)";
  return "var(--color-error)";
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  subtitle,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {label && (
        <p className="text-[13px] text-[var(--color-admin-text-secondary)] mb-2">{label}</p>
      )}
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-admin-border)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(value)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-[28px] font-medium text-[var(--color-admin-text)] leading-none">
            {Math.round(value)}%
          </span>
          {subtitle && (
            <span className="text-[13px] text-[var(--color-admin-text-secondary)] mt-1">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
