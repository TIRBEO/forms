'use client';

import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, text, action, className }: EmptyStateProps) {
  const resolvedTitle = title ?? text ?? description;
  const resolvedDescription = title ? (text ?? description) : undefined;
  return (
    <div className={cn('rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] p-12 text-center', className)}>
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-lg font-medium text-[var(--color-admin-text)] mb-1">{resolvedTitle}</h3>
      {resolvedDescription && <p className="text-sm text-[var(--color-admin-text-secondary)] mb-4">{resolvedDescription}</p>}
      {action}
    </div>
  );
}
