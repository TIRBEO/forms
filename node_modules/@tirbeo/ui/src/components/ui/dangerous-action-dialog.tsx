"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { ConfirmDialog } from "./confirm-dialog";

interface DangerousActionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function DangerousActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: DangerousActionDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      variant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
