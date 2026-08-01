"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SplitLayoutProps {
  children: ReactNode;
  className?: string;
  sidebar?: ReactNode;
  sidebarWidth?: string;
}

export function SplitLayout({ children, className, sidebar, sidebarWidth = "w-64" }: SplitLayoutProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      {sidebar && <aside className={cn(sidebarWidth, "flex-shrink-0")}>{sidebar}</aside>}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
