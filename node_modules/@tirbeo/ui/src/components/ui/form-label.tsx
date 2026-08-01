"use client";

import { cn } from "../../lib/utils";

interface FormLabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
  required?: boolean;
}

export function FormLabel({ children, className, htmlFor, required }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-[var(--color-admin-text)]", className)}
    >
      {children}
      {required && <span className="text-[var(--color-error)] ml-1">*</span>}
    </label>
  );
}
