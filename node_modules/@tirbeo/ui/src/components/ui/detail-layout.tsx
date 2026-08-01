"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface DetailLayoutProps {
  children: ReactNode;
  className?: string;
  detail?: ReactNode;
}

export function DetailLayout({ children, className, detail }: DetailLayoutProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex-1 min-w-0">{children}</div>
      {detail && <aside className="w-80 flex-shrink-0">{detail}</aside>}
    </div>
  );
}
