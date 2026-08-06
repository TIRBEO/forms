import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  hint?: string;
}

export function StatCard({ label, value, icon, hint }: StatCardProps) {
  return (
    <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-surface)] flex items-center justify-center">
          {icon}
        </div>
        {hint && <span className="text-xs text-[var(--color-text-tertiary)]">{hint}</span>}
      </div>
      <div className="text-2xl font-semibold text-[var(--color-text)]">{value}</div>
      <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">{label}</div>
    </div>
  );
}
