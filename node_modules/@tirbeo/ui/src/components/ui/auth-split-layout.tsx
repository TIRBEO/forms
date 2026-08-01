"use client";

import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AuthSplitLayoutProps {
  left?: ReactNode;
  children: ReactNode;
  className?: string;
  heroImage?: {
    src: string;
    alt: string;
  };
}

export function AuthSplitLayout({ left, children, className, heroImage }: AuthSplitLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen flex flex-col md:flex-row",
      className
    )}>
      {/* Left side */}
      <div className={cn(
        "w-full md:w-1/2 bg-[#022B22] flex flex-col justify-between p-8 md:p-12 text-white relative overflow-hidden",
        className
      )}>
        {heroImage ? (
          <>
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#022B22] via-[#022B22]/70 to-[#022B22]/40" />
          </>
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-white/10 blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-white/5 blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-white/10 to-transparent blur-[80px]" />
          </div>
        )}
        <div className="relative flex-1 flex flex-col justify-center">
          {left || (
            <div className="flex flex-col justify-center h-full max-w-lg">
              <div className="mb-10">
                <h1 className="text-[32px] leading-tight font-semibold text-white mb-4">Tirbeo</h1>
                <p className="text-white/80 text-base leading-relaxed">
                  The modern workspace platform for teams. Manage projects, collaborate in real-time, and scale your business with powerful tools.
                </p>
              </div>
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <span className="font-medium">Enterprise-grade security</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className={cn(
        "w-full md:w-1/2 bg-[var(--color-surface,white)] flex flex-col items-center justify-center px-4 py-8 md:px-8 lg:px-12 relative",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] to-white md:hidden" />
        <div className="relative w-full max-w-[420px]">
          {children}
        </div>
      </div>
    </div>
  );
}