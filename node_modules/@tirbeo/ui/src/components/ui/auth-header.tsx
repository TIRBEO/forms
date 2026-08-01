"use client";

import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AuthHeaderProps {
  children?: ReactNode;
  title: string;
  description?: string;
  className?: string;
  icon?: ReactNode;
}

export function AuthHeader({ children, title, description, className, icon }: AuthHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {icon && (
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#022B22]/5 border border-[#022B22]/10">
          {icon}
        </div>
      )}
      <h1 className={cn(
        "text-3xl md:text-4xl font-bold leading-[1.3] text-[var(--color-text,#202124)] tracking-tight mb-4",
        children || icon ? "mt-5" : ""
      )}>
        {title}
      </h1>
      {description && (
        <p className={cn(
          "text-lg text-[#5f6368] leading-[1.5] mt-2 max-w-[360px]",
          children ? "mt-4" : ""
        )}>
          {description}
        </p>
      )}
    </div>
  );
}