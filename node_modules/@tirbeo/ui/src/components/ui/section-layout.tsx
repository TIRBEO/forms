"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SectionLayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function SectionLayout({ title, description, children, className }: SectionLayoutProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div>
          {title && <h2 className="text-lg font-semibold text-[var(--color-admin-text)]">{title}</h2>}
          {description && <p className="text-sm text-[var(--color-admin-text-secondary)] mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
