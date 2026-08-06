'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api-client';
import { Send, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { CaptchaWidget } from './captcha/captcha-widget';
import { FieldInput, isOtherOption, type FormFieldData } from './field-input';
import { type ThemeConfig, themeFromStorage, themePageStyle, themeCardStyle, themeButtonStyle } from '../../lib/templates/themes';
import { usePersistentState, clearPersistentState } from '../../lib/use-persistent-state';

interface FormData {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldData[];
  status: string;
  thankYouMessage?: string;
  confirmBeforeSubmit: boolean;
  showProgressBar: boolean;
  captchaEnabled: boolean;
  color?: string;
  bannerImage?: string;
  logoImage?: string;
  theme?: unknown;
  source?: 'user' | 'admin';
  pages?: { id: string; title?: string; fields: FormFieldData[] }[];
}

export function PublicFormFill({ publicId }: { publicId: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // Draft answers + page are autosaved so a refresh never loses progress.
  const [answers, setAnswers] = usePersistentState<Record<string, any>>(`fill:${publicId}:answers`, {});
  const [currentPage, setCurrentPage] = usePersistentState<number>(`fill:${publicId}:page`, 0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaRayId, setCaptchaRayId] = useState<string>('');

  useEffect(() => {
    api.get<FormData>(`/api/forms/public/${publicId}`)
      .then(d => { setForm(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [publicId]);

  // Canonicalize the fill URL: admin-created forms live at /a/, user forms at /f/.
  useEffect(() => {
    if (!form?.source || typeof window === 'undefined') return;
    const path = window.location.pathname;
    const want = form.source === 'admin' ? '/a/' : '/f/';
    const have = path.startsWith('/a/') ? '/a/' : path.startsWith('/f/') ? '/f/' : '';
    if (have && have !== want) {
      router.replace(`${want}${publicId}`);
    }
  }, [form?.source, publicId, router]);

  const pages = form?.pages?.length ? form.pages : form?.fields ? [{ id: 'single', fields: form.fields }] : [];
  const currentFields = pages[Math.min(currentPage, Math.max(0, pages.length - 1))]?.fields || [];

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
      if (f.type === 'phone' && answers[f.id] && !/^[\d\s\-+()]{7,}$/.test(answers[f.id])) {
        newErrors[f.id] = 'Invalid phone number';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentFields, answers]);

  // Replace "Other" sentinels (empty custom answers) with '' before submitting
  // so required/response data stays clean.
  const cleanAnswers = useMemo(() => {
    const out: Record<string, any> = {};
    const allFields = form?.pages?.length ? form.pages.flatMap(p => p.fields) : (form?.fields || []);
    for (const f of allFields) {
      const v = answers[f.id];
      const other = f.options?.find(isOtherOption);
      if (other && v !== undefined) {
        if (Array.isArray(v)) out[f.id] = v.map(x => (x === other.value ? '' : x));
        else out[f.id] = v === other.value ? '' : v;
      } else if (v !== undefined) {
        out[f.id] = v;
      }
    }
    return out;
  }, [form, answers]);

  const handleSubmit = async () => {
    if (!validatePage()) return;
    if (form?.confirmBeforeSubmit && !showConfirm) {
      setShowConfirm(true);
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/api/forms/public/${publicId}/submit`, { answers: cleanAnswers, captchaRayId });
      clearPersistentState(`fill:${publicId}:answers`, `fill:${publicId}:page`);
      setSubmitted(true);
    } catch { setSubmitting(false); }
  };

  const renderField = (field: FormFieldData) => {
    return (
      <FieldInput
        field={field}
        value={answers[field.id]}
        onChange={v => {
          setAnswers(prev => ({ ...prev, [field.id]: v }));
          if (errors[field.id]) setErrors(prev => { const n = { ...prev }; delete n[field.id]; return n; });
        }}
        error={errors[field.id]}
      />
    );
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
    const allFields = form?.pages?.length ? form.pages.flatMap(p => p.fields) : (form?.fields || []);
    const summary = allFields
      .map(f => {
        const v = answers[f.id];
        const other = f.options?.find(isOtherOption);
        let text: string | null = null;
        if (v === undefined || v === null || v === '') text = null;
        else if (Array.isArray(v)) {
          const items = v.filter(x => x !== '' && !(other && x === other.value));
          text = items.length ? items.join(', ') : null;
        } else if (typeof v === 'string') {
          text = v === other?.value ? '' : v;
        } else {
          text = String(v);
        }
        return text ? { label: f.label, text } : null;
      })
      .filter((x): x is { label: string; text: string } => x !== null);

    const restart = () => {
      setAnswers({});
      setCurrentPage(0);
      setSubmitted(false);
    };

    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-[var(--color-success)]" />
            <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-2">{form.thankYouMessage || 'Thank you!'}</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Your response has been submitted successfully.</p>
          </div>

          {summary.length > 0 && (
            <div className="mt-8  border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden">
              <div className="px-5 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">Your answers</h3>
                <span className="text-xs text-[var(--color-text-tertiary)]">{summary.length} {summary.length === 1 ? 'question' : 'questions'}</span>
              </div>
              <div className="divide-y divide-[var(--color-border)]">
                {summary.map(item => (
                  <div key={item.label} className="px-5 py-3">
                    <p className="text-xs font-medium text-[var(--color-text-tertiary)] mb-1">{item.label}</p>
                    <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap break-words">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { setSubmitted(false); }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
              Edit &amp; resubmit
            </button>
            <button onClick={restart}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
              Submit another response
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-[var(--color-text-tertiary)]">Editing your answers records a new response.</p>
          <p className="mt-6 text-center text-xs text-[var(--color-text-tertiary)]">Powered by Tirbeo Forms</p>
        </div>
      </div>
    );
  }

  const themed = Boolean(form.theme && typeof form.theme === 'object' && Object.keys(form.theme as object).length > 0);
  const t: ThemeConfig = themeFromStorage(form.theme);
  const accent = themed ? t.primaryColor : (form.color || 'var(--color-primary)');
  const pageStyle = themed ? themePageStyle(t) : undefined;
  const cardStyle = themed ? themeCardStyle(t) : undefined;
  const headerUrl = themed && t.headerImageUrl ? t.headerImageUrl : (form.bannerImage || '');

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-12" style={pageStyle}>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="bg-[var(--color-surface)]shadow-[var(--shadow-card)] max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Confirm submission</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">Please review your answers before submitting. You won't be able to edit them after.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">Review</button>
              <button onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">Submit</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 pt-10">
        {/* Header image (theme header or per-form banner) */}
        {headerUrl && (
          <div className="relative rounded-t-xl overflow-hidden border border-b-0 border-[var(--color-border)]" style={{ height: themed ? t.headerHeight : undefined }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={headerUrl} alt="" className={themed ? 'w-full h-full object-cover' : 'w-full h-40 sm:h-52 object-cover'} />
            {themed && <div className="absolute inset-0" style={{ background: t.headerOverlay }} />}
          </div>
        )}

        <div className={` border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden ${headerUrl ? 'rounded-t-none' : ''}`} style={cardStyle}>
          <div className="p-6 lg:p-8" style={{ borderTop: `4px solid ${accent}`, ...(themed ? { padding: t.padding, fontFamily: t.bodyFont } : {}) }}>
            <div className="flex items-start gap-4 mb-6">
              {form.logoImage && (
                <img src={form.logoImage} alt="" className="w-14 h-14 rounded-lg object-cover border-2 border-[var(--color-border)] shrink-0" style={themed ? { borderColor: t.borderColor, borderRadius: t.borderRadius } : undefined} />
              )}
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-[var(--color-text)] leading-tight" style={themed ? { color: t.textColor, fontFamily: t.headingFont } : undefined}>{form.title}</h1>
                {form.description && <p className="text-sm text-[var(--color-text-secondary)] mt-1.5" style={themed ? { color: t.textMutedColor } : undefined}>{form.description}</p>}
              </div>
            </div>

            {form.showProgressBar && pages.length > 1 && (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-[var(--color-text-tertiary)] mb-1.5">
                  <span>Page {currentPage + 1} of {pages.length}</span>
                  <span>{Math.round(((currentPage + 1) / pages.length) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--color-surface-muted)] rounded-full overflow-hidden" style={themed ? { background: t.borderColor } : undefined}>
                  <div className="h-full rounded-full transition-all duration-300" style={{ background: accent, width: `${((currentPage + 1) / pages.length) * 100}%` }} />
                </div>
              </div>
            )}

            <div className="space-y-6">
              {currentFields.map(field => (
                <div key={field.id}>
                  <label className="flex items-start gap-1 mb-1.5">
                    <span className="text-sm font-medium text-[var(--color-text)]" style={themed ? { color: t.textColor } : undefined}>{field.label}</span>
                    {field.required && <span style={{ color: accent }} className="text-sm">*</span>}
                  </label>
                  {field.description && <p className="text-xs text-[var(--color-text-tertiary)] mb-2" style={themed ? { color: t.textMutedColor } : undefined}>{field.description}</p>}
                  {renderField(field)}
                  {errors[field.id] && (
                    <p className="flex items-center gap-1 mt-1 text-xs text-[var(--color-error)]" style={themed ? { color: t.errorColor } : undefined}>
                      <AlertCircle className="w-3 h-3" />{errors[field.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {form.captchaEnabled && (
              <div className="mt-4">
                <CaptchaWidget
                  autoShow={true}
                  forceShow={false}
                  requiredDifficulty="medium"
                  onSuccess={(rayId) => setCaptchaRayId(rayId)}
                />
              </div>
            )}
          </div>

          <div className="px-6 lg:px-8 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)] flex items-center justify-between">
            <div className="flex gap-2">
              {pages.length > 1 && currentPage > 0 && (
                <button onClick={() => { if (validatePage()) setCurrentPage(p => Math.max(0, p - 1)); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors">Previous</button>
              )}
            </div>
            {currentPage < pages.length - 1 ? (
              <button onClick={() => { if (validatePage()) setCurrentPage(p => Math.min(pages.length - 1, p + 1)); }}
                className="px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                style={themed ? themeButtonStyle(t) : { background: accent, color: 'var(--color-bg)' }}>Next</button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                style={themed ? themeButtonStyle(t) : { background: accent, color: 'var(--color-bg)' }}>
                {submitting ? (
                  <div className="animate-spin w-4 h-4 border-2 border-[var(--color-bg)] border-t-transparent rounded-full" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Submit
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-text-tertiary)] flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" />
          No sign-in needed — this form is open to everyone.
          <span className="mx-1">·</span>
          Powered by Tirbeo Forms
        </p>
      </div>
    </div>
  );
}
