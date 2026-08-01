'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'end' | 'center';
  side?: 'bottom' | 'top' | 'left' | 'right';
  className?: string;
}

export function Popover({ trigger, children, align = 'start', side = 'bottom', className }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const sideStyles: Record<string, string> = {
    bottom: 'mt-1 top-full',
    top: 'mb-1 bottom-full',
    left: 'mr-1 right-full',
    right: 'ml-1 left-full',
  };

  const alignStyles: Record<string, string> = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className={cn(
          'absolute z-50 min-w-[200px] rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] shadow-lg p-3',
          sideStyles[side],
          alignStyles[align],
          className
        )}>
          {children}
        </div>
      )}
    </div>
  );
}
