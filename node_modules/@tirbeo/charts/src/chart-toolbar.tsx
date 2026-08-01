"use client";

import { ReactNode } from "react";

export interface ChartToolbarProps {
  children: ReactNode;
  className?: string;
}

export function ChartToolbar({ children, className }: ChartToolbarProps) {
  return (
    <div className={className}>{children}</div>
  );
}
