"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface UserMenuProps {
  user: { name?: string; email?: string; avatar?: string };
  children?: ReactNode;
  className?: string;
}

export function UserMenu({ user, children, className }: UserMenuProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {user.avatar && (
        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
      )}
      <div className="flex flex-col">
        {user.name && <span className="text-sm font-medium text-[var(--color-admin-text)]">{user.name}</span>}
        {user.email && <span className="text-xs text-[var(--color-admin-text-secondary)]">{user.email}</span>}
      </div>
      {children && <div className="ml-auto">{children}</div>}
    </div>
  );
}
