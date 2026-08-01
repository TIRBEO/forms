"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div>
          {title && <h3 className="text-base font-semibold text-[var(--color-admin-text)]">{title}</h3>}
          {description && <p className="text-sm text-[var(--color-admin-text-secondary)] mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
