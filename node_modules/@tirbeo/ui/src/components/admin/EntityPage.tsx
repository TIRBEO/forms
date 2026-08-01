'use client';

import { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface EntityPageProps {
  title: string;
  subtitle?: string;
  status?: { label: string; color: string };
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  actions?: ReactNode;
  children: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  onNavigate?: (href: string) => void;
}

export function EntityPage({ title, subtitle, status, tabs, activeTab, onTabChange, actions, children, breadcrumbs, onNavigate }: EntityPageProps) {
  return (
    <div>
      {breadcrumbs && onNavigate && (
        <div className="flex items-center gap-2 mb-4 text-xs text-[var(--color-admin-text-muted)]">
          {breadcrumbs.map((bc, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {bc.href ? (
                <button onClick={() => bc.href && onNavigate(bc.href)} className="hover:text-[var(--color-admin-text)] transition-colors">{bc.label}</button>
              ) : (
                <span className="text-[var(--color-admin-text-secondary)]">{bc.label}</span>
              )}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-semibold text-[var(--color-admin-text)]">{title}</h1>
              {status && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: status.color + '18', color: status.color }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.color }} />
                  {status.label}
                </span>
              )}
            </div>
            {subtitle && <p className="mt-0.5 text-sm text-[var(--color-admin-text-secondary)]">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0 ml-4">{actions}</div>}
      </div>

      <div className="flex items-center gap-1 mb-6 border-b border-[var(--color-admin-border)]">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                : 'text-[var(--color-admin-text-secondary)] border-transparent hover:text-[var(--color-admin-text)] hover:border-[var(--color-admin-border)]'
            }`}>
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
          </button>
        ))}
      </div>

      <div>{children}</div>
    </div>
  );
}
