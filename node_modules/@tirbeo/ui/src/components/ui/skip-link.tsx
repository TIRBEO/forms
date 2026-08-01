"use client";

import { cn } from "../../lib/utils";

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "absolute left-0 top-0 z-50 -translate-y-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0",
        className
      )}
    >
      {children}
    </a>
  );
}
