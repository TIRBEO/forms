"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface OrganizationSwitcherProps {
  organizations: Array<{ id: string; name: string; logo?: string }>;
  currentId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function OrganizationSwitcher({ organizations, currentId, onSelect, className }: OrganizationSwitcherProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <select
        value={currentId}
        onChange={e => onSelect(e.target.value)}
        className="appearance-none bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {organizations.map(org => (
          <option key={org.id} value={org.id}>{org.name}</option>
        ))}
      </select>
    </div>
  );
}
