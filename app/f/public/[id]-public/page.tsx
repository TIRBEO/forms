'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { cn } from '../../../../lib/utils';
import { Send, CheckCircle2, Upload, Star, AlertCircle, ChevronDown } from 'lucide-react';
import { CaptchaWidget } from '../../../components/captcha/captcha-widget';

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  order: number;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[];
}

interface FormData {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  status: string;
  thankYouMessage?: string;
  confirmBeforeSubmit: boolean;
  showProgressBar: boolean;
  captchaEnabled: boolean;
  color?: string;
  pages?: { id: string; title?: string; fields: FormField[] }[];
}

export default function PublicFormRenderer() {
  const params = useParams();
  const publicId = params.publicId as string;
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [files, setFiles] = useState<Record<string, File>>({});
  const [ratingHover, setRatingHover] = useState<Record<string, number>>({});
  const [captchaRayId, setCaptchaRayId] = useState<string>('');

  useEffect(() => {
    api.get<FormData>(`/api/forms/public/${publicId}`)
      .then(d => { setForm(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [publicId]);

  const pages = form?.pages?.length ? form.pages : form?.fields ? [{ id: 'single', fields: form.fields }] : [];
  const currentFields = pages[currentPage]?.fields || [];

  const validatePage = useCallback(() => {
    const newErrors: Record<string, string> = {};
    currentFields.forEach(f => {
      if (f.required) {
        const val = answers[f.id];
        if (!val || (typeof val === 'string' && !val.trim()) || (Array.isArray(val) && val.length === 0)) {
          newErrors[f.id] = `${f.label} is required`;
        }
      }
      if (f.type === 'email' && answers[f.id] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers[f.id])) {
        newErrors[f.id] = 'Invalid email address';
      }
      if (f.type === 'phone' && answers[f.id] && !/^[\d\s\-\+\(\)]{7,}$/.test(answers[f.id])) {
        newErrors[f.id] = 'Invalid phone number';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentFields, answers]);

  const handleSubmit = async () => {
    if (!validatePage()) return;
    if (form?.confirmBeforeSubmit && !showConfirm) {
      setShowConfirm(true);
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/api/forms/public/${publicId}/submit`, { answers, captchaRayId });
      setSubmitted(true);
    } catch { setSubmitting(false); }
  };

  const renderField = (field: FormField) => {
    const value = answers[field.id];
    const error = errors[field.id];
    const setValue = (v: any) => {
      setAnswers(prev => ({ ...prev, [field.id]: v }));
      if (error) setErrors(prev => { const n = { ...prev }; delete n[field.id]; return n; });
    };

    const baseInput = cn(
      'w-full px-4 py-2.5 rounded-lg border text-sm transition-colors bg-[var(--color-surface)]',
      error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)] focus:border-[var(--color-primary)]',
      'outline-none text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]'
    );

    const baseSelect = cn(
      baseInput, 'appearance-none cursor-pointer'
    );

    switch (field.type) {
      case 'textarea':
        return (
          <textarea value={value || ''} onChange={e => setValue(e.target.value)}
            placeholder={field.placeholder} rows={4}
            className={cn(baseInput, 'resize-vertical')} />
        );
      case 'email':
        return (
          <input type="email" value={value || ''} onChange={e => setValue(e.target.value)}
            placeholder={field.placeholder || 'you@example.com'}
            className={baseInput} autoComplete="email" />
        );
      case 'phone':
        return (
          <input type="tel" value={value || ''} onChange={e => setValue(e.target.value)}
            placeholder={field.placeholder || '+1 (555) 000-0000'}
            className={baseInput} autoComplete="tel" />
        );
      case 'number':
        return (
          <input type="number" value={value || ''} onChange={e => setValue(e.target.value)}
            placeholder={field.placeholder || '0'}
            className={baseInput} />
        );
      case 'date':
        return (
          <input type="date" value={value || ''} onChange={e => setValue(e.target.value)}
            className={baseInput} />
        );
      case 'select':
        return (
          <div className="relative">
            <select value={value || ''} onChange={e => setValue(e.target.value)} className={baseSelect}>
              <option value="">Select an option...</option>
              {field.options?.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)] pointer-events-none" />
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(o => (
              <label key={o.value} className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-muted)] transition-colors">
                <input type="radio" name={field.id} value={o.value} checked={value === o.value}
                  onChange={e => setValue(e.target.value)}
                  className="w-4 h-4 text-[var(--color-primary)] accent-[var(--color-primary)]" />
                <span className="text-sm text-[var(--color-text)]">{o.label}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map(o => {
              const checked = Array.isArray(value) && value.includes(o.value);
              return (
                <label key={o.value} className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-muted)] transition-colors">
                  <input type="checkbox" value={o.value} checked={checked}
                    onChange={e => {
                      const arr = Array.isArray(value) ? [...value] : [];
                      e.target.checked ? arr.push(o.value) : arr.splice(arr.indexOf(o.value), 1);
                      setValue(arr);
                    }}
                    className="w-4 h-4 text-[var(--color-primary)] accent-[var(--color-primary)] rounded" />
                  <span className="text-sm text-[var(--color-text)]">{o.label}</span>
                </label>
              );
            })}
          </div>
        );
      case 'rating':
        return (
          <div className="flex gap-1">
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button"
                onMouseEnter={() => setRatingHover(prev => ({ ...prev, [field.id]: n }))}
                onMouseLeave={() => setRatingHover(prev => ({ ...prev, [field.id]: 0 }))}
                onClick={() => setValue(n)}
                className="p-1 transition-colors">
                <Star className={cn(
                  'w-8 h-8 transition-colors',
                  (ratingHover[field.id] || 0) >= n || value >= n
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
            <span className="text-sm text-[var(--color-text-secondary)]">Click to upload</span>
            <span className="text-xs text-[var(--color-text-tertiary)] mt-1">Max 10MB</span>
            <input type="file" className="hidden" onChange={e => {
              const file = e.target.files?.[0];
              if (file) setValue(file.name);
            }} />
          </label>
        );
      default:
        return (
          <input type="text" value={value || ''} onChange={e => setValue(e.target.value)}
            placeholder={field.placeholder || 'Your answer'}
            className={baseInput} />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Form not found</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">This form may have been removed or is no longer available.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-[var(--color-success)]" />
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-2">{form.thankYouMessage || 'Thank you!'}</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Your response has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4">
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="bg-[var(--color-surface)] rounded-xl shadow-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Confirm submission</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">Please review your answers before submitting. You won't be able to edit them after.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">Review</button>
              <button onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">Submit</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {form.showProgressBar && pages.length > 1 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-[var(--color-text-tertiary)] mb-1.5">
              <span>Page {currentPage + 1} of {pages.length}</span>
              <span>{Math.round(((currentPage + 1) / pages.length) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
                style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }} />
            </div>
          </div>
        )}

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8" style={{ borderTop: `4px solid ${form.color || 'var(--color-primary)'}` }}>
            <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-2">{form.title}</h1>
            {form.description && <p className="text-sm text-[var(--color-text-secondary)] mb-8">{form.description}</p>}

            <div className="space-y-6">
              {currentFields.map(field => (
                <div key={field.id}>
                  <label className="flex items-start gap-1 mb-1.5">
                    <span className="text-sm font-medium text-[var(--color-text)]">{field.label}</span>
                    {field.required && <span className="text-[var(--color-error)] text-sm">*</span>}
                  </label>
                  {field.description && <p className="text-xs text-[var(--color-text-tertiary)] mb-2">{field.description}</p>}
                  {renderField(field)}
                  {errors[field.id] && (
                    <p className="flex items-center gap-1 mt-1 text-xs text-[var(--color-error)]">
                      <AlertCircle className="w-3 h-3" />{errors[field.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {form.captchaEnabled && (
              <div className="mt-4">
                <CaptchaWidget
                  apiBase="/api/captcha"
                  autoShow={true}
                  forceShow={false}
                  onSuccess={(rayId) => setCaptchaRayId(rayId)}
                />
              </div>
            )}
          </div>

          <div className="px-6 lg:px-8 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)] flex items-center justify-between">
            <div className="flex gap-2">
              {pages.length > 1 && currentPage > 0 && (
                <button onClick={() => { if (validatePage()) setCurrentPage(p => p - 1); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors">Previous</button>
              )}
            </div>
            {currentPage < pages.length - 1 ? (
              <button onClick={() => { if (validatePage()) setCurrentPage(p => p + 1); }}
                className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">Next</button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50">
                {submitting ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
