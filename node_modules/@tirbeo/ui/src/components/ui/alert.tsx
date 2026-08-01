'use client';

import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AlertProps {
  variant: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const icons: Record<string, ReactNode> = {
  info: <Info className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
};

const colorStyles: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  info: { border: 'var(--color-info)', bg: 'var(--color-info-surface)', text: 'var(--color-info)', icon: 'var(--color-info)' },
  success: { border: 'var(--color-success)', bg: 'var(--color-success-surface)', text: 'var(--color-success)', icon: 'var(--color-success)' },
  warning: { border: 'var(--color-warning)', bg: 'var(--color-warning-surface)', text: 'var(--color-warning)', icon: 'var(--color-warning)' },
  error: { border: 'var(--color-error)', bg: 'var(--color-error-surface)', text: 'var(--color-error)', icon: 'var(--color-error)' },
};

export function Alert({ variant, title, children, onClose, className }: AlertProps) {
  const colors = colorStyles[variant];

  return (
    <div className={cn('rounded-xl border p-4 flex gap-3', className)}
      style={{ borderColor: colors.border, background: colors.bg }}>
      <div className="flex-shrink-0 mt-0.5" style={{ color: colors.icon }}>{icons[variant]}</div>
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-medium mb-0.5" style={{ color: colors.text }}>{title}</p>}
        <div className="text-sm" style={{ color: colors.text }}>{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 p-0.5 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: colors.text }}>
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
