"use client";

import { cn } from "../../lib/utils";

interface LabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function Label({ children, className, htmlFor }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-[var(--color-admin-text)]", className)}
    >
      {children}
    </label>
  );
}
