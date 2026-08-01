"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Fully rounded shape used by Google's auth flows (Sign in / Next buttons). */
  pill?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      pill = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          pill ? "rounded-full" : "rounded-md",
          {
            "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-primary)]":
              variant === "primary",
            "bg-[var(--color-admin-surface-hover)] text-[var(--color-admin-text)] hover:bg-[var(--color-admin-border)] focus-visible:ring-[var(--color-admin-text-muted)]":
              variant === "secondary",
            "border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-surface-hover)] focus-visible:ring-[var(--color-primary)]":
              variant === "outline",
            "text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-surface-hover)] focus-visible:ring-[var(--color-admin-text-muted)]":
              variant === "ghost",
            "bg-[var(--color-error)] text-white hover:opacity-90 focus-visible:ring-[var(--color-error)]":
              variant === "danger",
          },
          {
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {leftIcon && !loading && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
