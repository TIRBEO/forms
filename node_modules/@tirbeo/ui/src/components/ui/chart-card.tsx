"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ChartCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function ChartCard({ title, subtitle, children, className, action }: ChartCardProps) {
  return (
    <div className={cn("rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] p-5 shadow-card", className)}>
      {(title || subtitle) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-base font-semibold text-[var(--color-admin-text)]">{title}</h3>}
            {subtitle && <p className="text-sm text-[var(--color-admin-text-secondary)] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
