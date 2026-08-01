"use client";

import { useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Card } from "./card";

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabbedCardProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  header?: ReactNode;
}

export function TabbedCard({ tabs, defaultTab, className, header }: TabbedCardProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);
  const active = tabs.find((t) => t.id === activeTab);

  return (
    <Card className={cn("overflow-hidden", className)}>
      {header && <div className="px-6 pt-6">{header}</div>}
      <div className="flex items-center gap-6 px-6 pt-4 border-b border-[var(--color-admin-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3 text-[13px] border-b-2 transition-colors",
              tab.id === activeTab
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-admin-text-secondary)] hover:text-[var(--color-admin-text)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6">{active?.content}</div>
    </Card>
  );
}
