"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SettingsLayoutProps {
  children: ReactNode;
  className?: string;
}

export function SettingsLayout({ children, className }: SettingsLayoutProps) {
  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      {children}
    </div>
  );
}
