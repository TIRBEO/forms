"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface LiveRegionProps {
  children: ReactNode;
  className?: string;
  ariaLive?: "polite" | "assertive" | "off";
  ariaAtomic?: boolean;
}

export function LiveRegion({ children, className, ariaLive = "polite", ariaAtomic = true }: LiveRegionProps) {
  return (
    <div
      className={cn("sr-only", className)}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      role="status"
    >
      {children}
    </div>
  );
}
