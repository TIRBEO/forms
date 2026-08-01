"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AppLauncherProps {
  apps: Array<{ id: string; name: string; icon: ReactNode; href: string }>;
  className?: string;
}

export function AppLauncher({ apps, className }: AppLauncherProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {apps.map(app => (
        <a key={app.id} href={app.href} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-[var(--color-admin-surface-hover)] transition-colors">
          {app.icon}
          <span className="text-xs text-[var(--color-admin-text-secondary)]">{app.name}</span>
        </a>
      ))}
    </div>
  );
}
