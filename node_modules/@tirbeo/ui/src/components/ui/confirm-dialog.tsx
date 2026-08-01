"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel?: () => void;
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  return (
    <div className={cn("relative", open !== false && "block")}>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => onOpenChange?.(false)}>
        <div className="bg-[var(--color-admin-surface)] rounded-xl shadow-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
          <h3 className="text-base font-semibold text-[var(--color-admin-text)]">{title}</h3>
          {description && <p className="text-sm text-[var(--color-admin-text-secondary)] mt-2">{description}</p>}
          {children}
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => onCancel?.()} className="px-4 py-2 text-sm font-medium text-[var(--color-admin-text)] bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-lg hover:bg-[var(--color-admin-surface-hover)]">
              {cancelLabel}
            </button>
            <button onClick={onConfirm} className={cn(
              "px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-hover)]",
              variant === "danger" && "bg-[var(--color-error)] hover:opacity-90"
            )}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
