'use client';

import { ReactNode } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface AdminSectionProps {
  title: string;
  description?: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminSection({ title, description, tabs, activeTab, onTabChange, actions, children }: AdminSectionProps) {
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[var(--color-admin-text)] leading-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-[var(--color-admin-text-secondary)]">{description}</p>}
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
