"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface TopbarProps {
  children: ReactNode;
  className?: string;
}

export function Topbar({ children, className }: TopbarProps) {
  return (
    <header className={cn("flex items-center justify-between border-b border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] px-4 py-2", className)}>
      {children}
    </header>
  );
}
