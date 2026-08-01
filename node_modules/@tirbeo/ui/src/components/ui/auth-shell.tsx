"use client";

import { type ReactNode } from "react";
import { AuthLayout } from "./auth-layout";
import { AuthCard } from "./auth-card";
import { AuthHeader } from "./auth-header";
import { AuthSplitLayout } from "./auth-split-layout";

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  variant?: "default" | "compact" | "split";
  leftContent?: ReactNode;
  footer?: ReactNode;
  image?: {
    src: string;
    alt: string;
  };
}

export function AuthShell({ children, title, subtitle, variant = "default", leftContent, footer, image }: AuthShellProps) {
  if (variant === "split") {
    return (
      <AuthSplitLayout left={leftContent} heroImage={image}>
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-[24px] font-semibold text-[#202124] tracking-tight">{title}</h1>
            {subtitle && <p className="text-[15px] text-[#5f6368] mt-1.5 leading-relaxed">{subtitle}</p>}
          </div>
          {children}
        </div>
      </AuthSplitLayout>
    );
  }

  const cardClassName = variant === "compact" ? "w-full max-w-[380px]" : undefined;

  return (
    <AuthLayout footer={footer}>
      <AuthCard className={cardClassName}>
        <AuthHeader title={title} description={subtitle}>
          <div className="mb-6 flex items-center justify-center">
            {leftContent}
          </div>
        </AuthHeader>
        {children}
      </AuthCard>
    </AuthLayout>
  );
}
