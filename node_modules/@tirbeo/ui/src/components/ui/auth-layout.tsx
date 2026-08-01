"use client";

import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthLayout({ children, footer, className }: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-[var(--color-bg,#f1f3f4)] flex flex-col",
        className
      )}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {children}
      </div>
      <AuthFooterLegal />
      {footer && (
        <div className="w-full px-6 pb-4">
          {footer}
        </div>
      )}
    </div>
  );
}

export function AuthFooterLegal({ language = "English (United States)" }: { language?: string }) {
  return (
    <div className="w-full px-6 pb-4 flex items-center justify-between text-[13px] text-[var(--color-text-secondary,#5f6368)]">
      <button className="flex items-center gap-1 hover:text-[var(--color-text,#202124)] transition-colors">
        {language}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
      <div className="flex items-center gap-6">
        <a href="https://docs.tirbeo.app" className="hover:text-[var(--color-text,#202124)] transition-colors" target="_blank" rel="noopener noreferrer">Help</a>
        <a href="/privacy" className="hover:text-[var(--color-text,#202124)] transition-colors">Privacy</a>
        <a href="/terms" className="hover:text-[var(--color-text,#202124)] transition-colors">Terms</a>
      </div>
    </div>
  );
}
