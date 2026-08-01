'use client';

import { ReactNode } from 'react';

export interface KpiCardProps {
  label: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  icon?: ReactNode;
  subtitle?: string;
}

export function KpiCard({ label, value, change, icon, subtitle }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-[var(--color-admin-text-secondary)]">{label}</span>
        {icon && <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-surface)] flex items-center justify-center">{icon}</div>}
      </div>
      <p className="text-2xl font-semibold text-[var(--color-admin-text)]">{value}</p>
      {change && (
        <div className="flex items-center gap-1 mt-2">
          <span className={`text-xs ${change.positive ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]]'}`}>
            {change.value}
          </span>
          {subtitle && <span className="text-xs text-[var(--color-admin-text-muted)]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
