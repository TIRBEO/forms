"use client";

import { cn } from "../../lib/utils";

export interface PasswordStrengthProps {
  password: string;
  className?: string;
}

function getStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-[var(--color-error)]" };
  if (score <= 2) return { score, label: "Fair", color: "bg-[var(--color-warning)]" };
  if (score <= 3) return { score, label: "Good", color: "bg-[var(--color-warning)]" };
  return { score, label: "Strong", color: "bg-[var(--color-success)]" };
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  if (!password) return null;
  const { score, label, color } = getStrength(password);
  const pct = (score / 5) * 100;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= score ? color : "bg-[var(--color-admin-border)]"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-[var(--color-admin-text-secondary)]">{label}</span>
    </div>
  );
}
