'use client';

import { useState, useRef, useEffect, useId, ReactNode, KeyboardEvent } from 'react';
import { cn } from '../../lib/utils';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'end';
}

export function Dropdown({ trigger, items, align = 'start' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (open && activeIndex >= 0) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  const closeAndReturnFocus = () => {
    setOpen(false);
    setActiveIndex(-1);
    (ref.current?.querySelector('[aria-haspopup]') as HTMLElement | null)?.focus();
  };

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex(0);
    }
  };

  const handleMenuKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeAndReturnFocus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + items.length) % items.length);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative inline-block">
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => { setOpen(o => !o); setActiveIndex(0); }}
        onKeyDown={handleTriggerKeyDown}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 rounded-lg"
      >
        {trigger}
      </div>
      {open && (
        <div
          id={menuId}
          role="menu"
          onKeyDown={handleMenuKeyDown}
          className={cn(
            'absolute z-50 mt-1 min-w-[180px] rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] shadow-lg py-1',
            align === 'end' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, i) => (
            <div key={i}>
              {item.divider && <div className="my-1 border-t border-[var(--color-admin-border)]" role="separator" />}
              <button
                ref={el => { itemRefs.current[i] = el; }}
                role="menuitem"
                tabIndex={-1}
                onClick={() => { item.onClick(); closeAndReturnFocus(); }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:bg-[var(--color-admin-surface-hover)]',
                  item.danger
                    ? 'text-[var(--color-error)] hover:bg-[var(--color-error-surface)]'
                    : 'text-[var(--color-admin-text)] hover:bg-[var(--color-admin-surface-hover)]'
                )}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
