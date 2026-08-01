'use client';

import { useId } from 'react';
import { cn } from '../../lib/utils';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export function Switch({ checked, onChange, label, disabled, id }: SwitchProps) {
  const generatedId = useId();
  const switchId = id || generatedId;

  return (
    <label htmlFor={switchId} className={cn(
      'inline-flex items-center gap-2 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <div className="relative">
        <input
          id={switchId}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <span className={cn(
          'block w-10 h-6 rounded-full transition-colors',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-primary)] peer-focus-visible:ring-offset-2',
          checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-admin-border)]'
        )}>
          <span className={cn(
            'block w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          )} />
        </span>
      </div>
      {label && <span className="text-sm text-[var(--color-admin-text)]">{label}</span>}
    </label>
  );
}
