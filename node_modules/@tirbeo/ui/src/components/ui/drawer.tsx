'use client';

import { useEffect, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'left' | 'right';
  width?: string;
}

export function Drawer({ open, onClose, title, children, side = 'right', width = '480px' }: DrawerProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const sideClasses = side === 'right'
    ? 'right-0 border-l translate-x-0'
    : 'left-0 border-r translate-x-0';

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`absolute top-0 bottom-0 ${sideClasses} bg-[var(--color-admin-surface)] shadow-xl flex flex-col w-full transition-transform`}
        style={{ maxWidth: width }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-admin-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-admin-text)]">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-surface-hover)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
