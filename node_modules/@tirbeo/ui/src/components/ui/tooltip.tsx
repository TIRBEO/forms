"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
}

export function Tooltip({ content, children, side = "top", align = "center", className }: TooltipProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      {children}
      <div
        className={cn(
          "absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-[var(--color-admin-text)] rounded-lg shadow-lg whitespace-nowrap",
          side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
          side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
          side === "left" && "right-full top-1/2 -translate-y-1/2 mr-2",
          side === "right" && "left-full top-1/2 -translate-y-1/2 ml-2"
        )}
      >
        {content}
      </div>
    </div>
  );
}
