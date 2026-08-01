"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface TabsProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface TabListProps {
  children: ReactNode;
  className?: string;
}

interface TabProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, onValueChange, children, className }: TabsProps) {
  return <div className={cn("w-full", className)}>{children}</div>;
}

export function TabList({ children, className }: TabListProps) {
  return <div className={cn("flex border-b border-[var(--color-admin-border)]", className)}>{children}</div>;
}

export function Tab({ value, children, className }: TabProps) {
  return (
    <button className={cn("px-4 py-2 text-sm font-medium text-[var(--color-admin-text-secondary)] border-b-2 border-transparent hover:text-[var(--color-admin-text)] transition-colors", className)}>
      {children}
    </button>
  );
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  return <div className={cn(className)}>{children}</div>;
}
