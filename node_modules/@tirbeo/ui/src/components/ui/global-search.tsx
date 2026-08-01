"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface GlobalSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function GlobalSearch({ placeholder = "Search...", onSearch, className }: GlobalSearchProps) {
  return (
    <div className={cn("relative", className)}>
      <input
        type="search"
        placeholder={placeholder}
        onChange={e => onSearch?.(e.target.value)}
        className="w-full px-4 py-2 pl-10 text-sm border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[var(--color-primary)]"
      />
    </div>
  );
}
