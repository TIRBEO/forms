"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  children: ReactNode;
  className?: string;
  collapsed?: boolean;
}

export function Sidebar({ children, className, collapsed }: SidebarProps) {
  return (
    <aside className={cn("flex flex-col border-r border-[var(--color-admin-border)] bg-[var(--color-admin-surface)]", collapsed && "w-16", className)}>
      {children}
    </aside>
  );
}
