'use client';

import { ReactNode } from 'react';

export interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  height?: number;
  action?: ReactNode;
}

export function ChartCard({ title, description, children, height = 300, action }: ChartCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-admin-text-secondary)] uppercase tracking-wider">{title}</h3>
          {description && <p className="text-xs text-[var(--color-admin-text-muted)] mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}
