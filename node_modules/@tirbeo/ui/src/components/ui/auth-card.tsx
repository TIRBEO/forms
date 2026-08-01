"use client";

import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[450px] sm:max-w-[500px] lg:max-w-[650px] bg-[var(--color-surface,white)] rounded-2xl border border-[var(--color-border,#e8eaed)] p-6 md:p-8 shadow-lg",
        "hover:shadow-xl transition-all",
        className
      )}
    >
      {children}
    </div>
  );
}