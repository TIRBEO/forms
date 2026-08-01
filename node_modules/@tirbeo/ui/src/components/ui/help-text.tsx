"use client";

import { cn } from "../../lib/utils";

interface HelpTextProps {
  children: React.ReactNode;
  className?: string;
}

export function HelpText({ children, className }: HelpTextProps) {
  return (
    <p className={cn("text-xs text-[var(--color-admin-text-secondary)] mt-1", className)}>
      {children}
    </p>
  );
}
