"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface TimelineProps {
  children: ReactNode;
  className?: string;
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--color-admin-border)]" />
      <div className="space-y-4">{children}</div>
    </div>
  );
}
