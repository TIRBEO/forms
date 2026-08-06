'use client';

import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Star, Upload, ChevronDown } from 'lucide-react';
import { DateField } from '@tirbeo/ui';

export interface FormFieldOption {
  id?: string;
  label: string;
  value: string;
}

export interface FormFieldData {
  id: string;
  type: string;
  label: string;
  required: boolean;
  order: number;
  placeholder?: string;
  description?: string;
  options?: FormFieldOption[];
}

interface FieldInputProps {
  field: FormFieldData;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

/** Marker value for the "Other" option so responses stay clean server-side. */
export const OTHER_SENTINEL = '__other__';

export function isOtherOption(o: FormFieldOption) {
  return o.value === OTHER_SENTINEL || /^other$/i.test(o.label.trim());
}

export function FieldInput({ field, value, onChange, error, disabled }: FieldInputProps) {
  const [ratingHover, setRatingHover] = useState(0);
  const [otherText, setOtherText] = useState('');

  const baseInput = cn(
    'w-full px-4 py-2.5 rounded-lg border text-sm transition-colors bg-[var(--color-surface)]',
    error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)] focus:border-[var(--color-primary)]',
    'outline-none text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] disabled:opacity-60'
  );

  const baseSelect = cn(baseInput, 'appearance-none cursor-pointer');

  /** Renders the free-text input revealed when the "Other" option is picked. */
  const renderOtherInput = (options: FormFieldOption[] | undefined, current: any, onValue: (v: any) => void) => {
    if (!options) return null;
    const other = options.find(isOtherOption);
    if (!other) return null;
    const isArray = Array.isArray(current);
    const arr = isArray ? current : [];
    const selectedOther = !isArray && current === other.value;
    const typedOther = !isArray && typeof current === 'string' && current !== '' && !options.some(o => o.value === current);
    const hasOtherInArr = isArray && arr.includes(other.value);
    const typedInArr = isArray ? arr.filter(v => v !== other.value && !options.some(o => o.value === v)) : [];
    const show = selectedOther || typedOther || hasOtherInArr || typedInArr.length > 0;
    if (!show) return null;

    const display = hasOtherInArr || selectedOther ? (otherText || '') : isArray ? String(typedInArr[0] ?? '') : current;

    return (
      <div className="mt-2">
        <input
          type="text"
          value={display}
          placeholder="Type your answer..."
          autoFocus
          disabled={disabled}
          onChange={e => {
            const t = e.target.value;
            setOtherText(t);
            if (isArray) {
              const others = arr.filter(v => v !== other.value && options.some(o => o.value === v));
              onValue(t === '' ? [...others, other.value] : [...others, t]);
            } else {
              onValue(t === '' ? other.value : t);
            }
          }}
          className={baseInput}
        />
      </div>
    );
  };

  switch (field.type) {
    case 'textarea':
      return (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} disabled={disabled}
          placeholder={field.placeholder} rows={4}
          className={cn(baseInput, 'resize-vertical')} />
      );
    case 'email':
      return (
        <input type="email" value={value || ''} onChange={e => onChange(e.target.value)} disabled={disabled}
          placeholder={field.placeholder || 'you@example.com'}
          className={baseInput} autoComplete="email" />
      );
    case 'phone':
      return (
        <input type="tel" value={value || ''} onChange={e => onChange(e.target.value)} disabled={disabled}
          placeholder={field.placeholder || '+1 (555) 000-0000'}
          className={baseInput} autoComplete="tel" />
      );
    case 'number':
      return (
        <input type="number" value={value || ''} onChange={e => onChange(e.target.value)} disabled={disabled}
          placeholder={field.placeholder || '0'}
          className={baseInput} />
      );
    case 'date':
      return (
        <div className={cn(disabled && 'pointer-events-none opacity-60')}>
          <DateField value={value || ''} onChange={v => onChange(v)} selectClassName={baseSelect} />
        </div>
      );
    case 'select':
      return (
        <div>
          <div className="relative">
            <select value={value || ''} onChange={e => { setOtherText(''); onChange(e.target.value); }} disabled={disabled} className={baseSelect}>
              <option value="">Select an option...</option>
              {field.options?.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)] pointer-events-none" />
          </div>
          {renderOtherInput(field.options, value, onChange)}
        </div>
      );
    case 'radio':
      return (
        <div>
          <div className="space-y-2">
            {field.options?.map(o => (
              <label key={o.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-muted)] transition-colors">
                <input type="radio" name={field.id} value={o.value} checked={value === o.value} disabled={disabled}
                  onChange={e => { setOtherText(''); onChange(e.target.value); }}
                  className="w-4 h-4 text-[var(--color-primary)] accent-[var(--color-primary)]" />
                <span className="text-sm text-[var(--color-text)]">{o.label}</span>
              </label>
            ))}
          </div>
          {renderOtherInput(field.options, value, onChange)}
        </div>
      );
    case 'checkbox': {
      const arr = Array.isArray(value) ? value : [];
      return (
        <div>
          <div className="space-y-2">
            {field.options?.map(o => {
              const checked = arr.includes(o.value);
              return (
                <label key={o.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-muted)] transition-colors">
                  <input type="checkbox" value={o.value} checked={checked} disabled={disabled}
                    onChange={e => {
                      let next = [...arr];
                      if (e.target.checked) next.push(o.value);
                      else {
                        next = next.filter(v => v !== o.value);
                        // Unchecking "Other" also clears any typed free-text value.
                        if (isOtherOption(o)) next = next.filter(v => field.options?.some(opt => opt.value === v));
                      }
                      onChange(next);
                    }}
                    className="w-4 h-4 text-[var(--color-primary)] accent-[var(--color-primary)] rounded" />
                  <span className="text-sm text-[var(--color-text)]">{o.label}</span>
                </label>
              );
            })}
          </div>
          {renderOtherInput(field.options, value, onChange)}
        </div>
      );
    }
    case 'rating':
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button" disabled={disabled}
              onMouseEnter={() => setRatingHover(n)}
              onMouseLeave={() => setRatingHover(0)}
              onClick={() => onChange(n)}
              className="p-1 transition-colors disabled:opacity-60">
              <Star className={cn(
                'w-8 h-8 transition-colors',
                ratingHover >= n || (value ?? 0) >= n
                  ? 'text-[var(--color-warning)] fill-[var(--color-warning)]'
                  : 'text-[var(--color-border)]'
              )} />
            </button>
          ))}
        </div>
      );
    case 'file':
      return (
        <label className={cn(
          'flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors',
          value ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)]'
        )}>
          <Upload className="w-8 h-8 mb-2 text-[var(--color-text-tertiary)]" />
          <span className="text-sm text-[var(--color-text-secondary)]">{value || 'Click to upload'}</span>
          <span className="text-xs text-[var(--color-text-tertiary)] mt-1">Max 10MB</span>
          <input type="file" className="hidden" disabled={disabled} onChange={e => {
            const file = e.target.files?.[0];
            if (file) onChange(file.name);
          }} />
        </label>
      );
    default:
      return (
        <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} disabled={disabled}
          placeholder={field.placeholder || 'Your answer'}
          className={baseInput} />
      );
  }
}
