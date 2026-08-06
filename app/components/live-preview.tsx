'use client';

import { useCallback, useState } from 'react';
import { cn } from '../../lib/utils';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { FieldInput, type FormFieldData } from './field-input';
import {
  type ThemeConfig, themeFromStorage, themePageStyle, themeCardStyle, themeButtonStyle,
} from '../../lib/templates/themes';

interface LivePreviewProps {
  title: string;
  description?: string;
  fields: FormFieldData[];
  color?: string;
  theme?: ThemeConfig;
  showProgressBar?: boolean;
  thankYouMessage?: string;
  bannerImage?: string;
  logoImage?: string;
  device?: 'desktop' | 'mobile';
}

export function LivePreview({ title, description, fields, color, theme, showProgressBar, thankYouMessage, bannerImage, logoImage, device = 'desktop' }: LivePreviewProps) {
  const t = themeFromStorage(theme);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    fields.forEach(f => {
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
  }, [fields, answers]);

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitted(true);
  };

  const pageStyle = themePageStyle(t);
  const headerUrl = t.headerImageUrl || bannerImage || '';

  if (submitted) {
    return (
      <div className={cn('flex items-center justify-center', device === 'mobile' ? 'h-full' : 'h-full min-h-[320px]')} style={pageStyle}>
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle2 className="w-14 h-14 mx-auto mb-4" style={{ color: t.primaryColor }} />
          <h2 className="text-xl font-semibold mb-2" style={{ color: t.textColor, fontFamily: t.headingFont }}>{thankYouMessage || 'Thank you!'}</h2>
          <p className="text-sm" style={{ color: t.textMutedColor }}>Your response has been submitted successfully.</p>
          <button onClick={() => { setSubmitted(false); setAnswers({}); }}
            className="mt-6 px-4 py-2 rounded-lg border text-sm font-medium"
            style={{ borderColor: t.borderColor, color: t.textMutedColor }}>
            Fill out again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-6" style={pageStyle}>
      <div className={cn('mx-auto', device === 'mobile' ? 'max-w-[380px]' : '')} style={{ maxWidth: device === 'mobile' ? undefined : t.maxWidth }}>
        {showProgressBar && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: t.textMutedColor }}>
              <span>1 of 1</span>
              <span>100%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: t.borderColor }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ background: t.primaryColor, width: '100%' }} />
            </div>
          </div>
        )}

        <div className="shadow-[var(--shadow-card)] overflow-hidden" style={themeCardStyle(t)}>
          {headerUrl && (
            <div className="relative" style={{ height: t.headerHeight }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={headerUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: t.headerOverlay }} />
            </div>
          )}
          <div className="p-6" style={{ padding: t.padding, borderTop: `4px solid ${t.primaryColor}` }}>
            <div className="flex items-start gap-3 mb-2">
              {logoImage && <img src={logoImage} alt="" className="w-11 h-11 rounded-lg object-cover border shrink-0" style={{ borderColor: t.borderColor }} />}
              <h1 className="text-xl font-semibold leading-tight" style={{ color: t.textColor, fontFamily: t.headingFont }}>{title || 'Untitled Form'}</h1>
            </div>
            {description && <p className="text-sm mb-6" style={{ color: t.textMutedColor }}>{description}</p>}
            {!description && <div className="mb-6" />}

            <div className="space-y-6">
              {fields.map(field => (
                <div key={field.id}>
                  <label className="flex items-start gap-1 mb-1.5">
                    <span className="text-sm font-medium" style={{ color: t.textColor }}>{field.label}</span>
                    {field.required && <span className="text-sm" style={{ color: t.errorColor }}>*</span>}
                  </label>
                  {field.description && <p className="text-xs mb-2" style={{ color: t.textMutedColor }}>{field.description}</p>}
                  <FieldInput
                    field={field}
                    value={answers[field.id]}
                    error={errors[field.id]}
                    onChange={v => {
                      setAnswers(prev => ({ ...prev, [field.id]: v }));
                      setErrors(prev => { const n = { ...prev }; delete n[field.id]; return n; });
                    }}
                  />
                  {errors[field.id] && (
                    <p className="flex items-center gap-1 mt-1 text-xs" style={{ color: t.errorColor }}>
                      <AlertCircle className="w-3 h-3" />{errors[field.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: `1px solid ${t.borderColor}`, background: t.surfaceColor }}>
            <span className="text-xs" style={{ color: t.textMutedColor }}>{fields.length} {fields.length === 1 ? 'question' : 'questions'}</span>
            <button onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium transition-opacity hover:opacity-90"
              style={themeButtonStyle(t)}>
              <Send className="w-4 h-4" />
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
