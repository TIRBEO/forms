import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; positive: boolean };
  icon?: ReactNode;
  className?: string;
}

export function KpiCard({ label, value, trend, icon, className }: KpiCardProps) {
  return (
    <div className={cn("rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-[var(--color-admin-text-secondary)] font-medium">{label}</p>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary-surface)] text-[var(--color-primary)]">
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold text-[var(--color-admin-text)]">{value}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend.positive ? (
            <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
          ) : (
            <TrendingDown className="w-4 h-4 text-[var(--color-error)]" />
          )}
          <span className={cn(
            "text-sm font-medium",
            trend.positive ? "text-[var(--color-success)]" : "text-[var(--color-error)]",
          )}>
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-sm text-[var(--color-admin-text-muted)] ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
}
