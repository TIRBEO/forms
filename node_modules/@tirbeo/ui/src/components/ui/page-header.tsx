'use client';

import { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, description, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 mb-3 text-xs text-[var(--color-admin-text-muted)]">
          {breadcrumbs.map((bc, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {bc.href ? (
                <span className="text-[var(--color-primary)]">{bc.label}</span>
              ) : (
                <span className="text-[var(--color-admin-text-secondary)]">{bc.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[var(--color-admin-text)]">{title}</h1>
          {description && <p className="mt-1 text-sm text-[var(--color-admin-text-secondary)]">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
