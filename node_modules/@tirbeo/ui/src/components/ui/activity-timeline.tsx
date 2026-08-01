"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ActivityTimelineProps {
  items: Array<{
    id: string;
    title: string;
    description?: string;
    timestamp: Date;
    icon?: ReactNode;
  }>;
  className?: string;
}

export function ActivityTimeline({ items, className }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, i) => (
        <div key={item.id} className="flex gap-3 relative">
          {i < items.length - 1 && <div className="absolute left-4 top-8 bottom-0 w-px bg-[var(--color-admin-border)]" />}
          <div className="w-8 h-8 rounded-full bg-[var(--color-admin-surface-hover)] flex items-center justify-center flex-shrink-0 z-10">
            {item.icon || <div className="w-2 h-2 rounded-full bg-[var(--color-admin-text-muted)]" />}
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm font-medium text-[var(--color-admin-text)]">{item.title}</p>
            {item.description && <p className="text-xs text-[var(--color-admin-text-secondary)] mt-0.5">{item.description}</p>}
            <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{item.timestamp.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
