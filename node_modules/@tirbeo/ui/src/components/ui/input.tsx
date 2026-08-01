"use client";

import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, label, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[var(--color-admin-text)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "flex h-11 w-full rounded-lg border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] px-3.5 py-2 text-sm outline-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-admin-text-muted)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]",
            className
          )}
          aria-invalid={error}
          aria-describedby={helperText ? `${id}-helper` : undefined}
          {...props}
        />
        {helperText && (
          <span
            id={`${id}-helper`}
            className={cn(
              "text-xs",
              error ? "text-[var(--color-error)]" : "text-[var(--color-admin-text-secondary)]"
            )}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
