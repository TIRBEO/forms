"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, description, error, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-[var(--color-admin-text)]">
          {label}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-[var(--color-admin-text-secondary)]">{description}</p>
      )}
      {error && (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
