"use client";

import { cn } from "../../lib/utils";

interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function Divider({ className, orientation = "horizontal" }: DividerProps) {
  return (
    <div
      className={cn(
        "bg-[var(--color-admin-border)]",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
    />
  );
}
