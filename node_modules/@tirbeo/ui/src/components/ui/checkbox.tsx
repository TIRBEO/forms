'use client';

import { useId } from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export function Checkbox({ checked, onChange, label, disabled, id }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <label htmlFor={checkboxId} className={cn(
      'inline-flex items-center gap-2 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <div className={cn(
        'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-primary)] peer-focus-visible:ring-offset-2',
        'w-4 h-4 rounded border flex items-center justify-center transition-colors',
        checked
          ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
          : 'border-[var(--color-admin-border)] bg-transparent',
        !disabled && 'hover:border-[var(--color-primary)]'
      )}>
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        {checked && <Check className="w-3 h-3 text-white stroke-[3]" />}
      </div>
      {label && <span className="text-sm text-[var(--color-admin-text)]">{label}</span>}
    </label>
  );
}
