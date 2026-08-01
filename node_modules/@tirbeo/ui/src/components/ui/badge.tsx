"use client";

import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
          {
            "bg-[var(--color-admin-surface-hover)] text-[var(--color-admin-text)]": variant === "default",
            "bg-[var(--color-success-surface)] text-[var(--color-success)]": variant === "success",
            "bg-[var(--color-warning-surface)] text-[var(--color-warning)]": variant === "warning",
            "bg-[var(--color-error-surface)] text-[var(--color-error)]": variant === "error",
            "bg-[var(--color-primary-surface)] text-[var(--color-primary)]": variant === "info",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
