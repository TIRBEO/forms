"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface BulkActionBarProps {
  selectedCount: number;
  children: ReactNode;
  className?: string;
}

export function BulkActionBar({ selectedCount, children, className }: BulkActionBarProps) {
  return (
    <div className={cn("flex items-center gap-3 px-4 py-2 bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/30 rounded-lg", className)}>
      <span className="text-sm font-medium text-[var(--color-primary)]">{selectedCount} selected</span>
      {children}
    </div>
  );
}
