"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface InlineMessageProps {
  children: ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  className?: string;
}

export function InlineMessage({ children, variant = "info", className }: InlineMessageProps) {
  const colors = {
    info: "text-[var(--color-primary)] bg-[var(--color-primary-surface)]",
    success: "text-[var(--color-success)] bg-[var(--color-success-surface)]",
    warning: "text-[var(--color-warning)] bg-[var(--color-warning-surface)]",
    error: "text-[var(--color-error)] bg-[var(--color-error-surface)]",
  };
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm", colors[variant], className)}>
      {children}
    </div>
  );
}
