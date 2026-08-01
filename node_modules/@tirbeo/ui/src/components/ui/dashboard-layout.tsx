"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
  sidebar?: ReactNode;
}

export function DashboardLayout({ children, className, sidebar }: DashboardLayoutProps) {
  return (
    <div className={cn("flex min-h-screen", className)}>
      {sidebar && <aside className="w-64 flex-shrink-0 border-r border-[var(--color-admin-border)] bg-[var(--color-admin-surface)]">{sidebar}</aside>}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
