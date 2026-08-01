"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CommandMenuProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function CommandMenu({ children, open, onOpenChange, className }: CommandMenuProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  );
}
