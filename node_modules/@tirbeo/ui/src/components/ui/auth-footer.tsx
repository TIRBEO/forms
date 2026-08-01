"use client";

import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AuthFooterProps {
  children?: ReactNode;
  className?: string;
}

export function AuthFooter({ children, className }: AuthFooterProps) {
  return (
    <div className={cn("max-w-[440px] mx-auto flex items-end justify-between px-4", className)}>
      {children}
    </div>
  );
}

export function AuthFooterLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn("text-[13px] text-[#3c4043] hover:text-[#1a73e8] transition-colors", className)}
    >
      {children}
    </a>
  );
}
