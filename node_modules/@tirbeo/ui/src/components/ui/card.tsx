"use client";

import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] shadow-sm",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
