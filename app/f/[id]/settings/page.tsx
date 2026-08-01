'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { cn } from '../../../../lib/utils';
import {
  Settings, Globe, Lock, MessageSquare, Palette, Shield,
  AlertTriangle, Save, Eye, EyeOff, ToggleLeft, Mail,
  Clock, Link, Upload, ChevronDown, Image,
} from 'lucide-react';

interface FormSettings {
  title: string;
  description: string;
  slug: string;
  customDomain?: string;
  coverImage?: string;
  visibility: 'public' | 'restricted' | 'private';
  loginRequired: boolean;
  captcha: boolean;
  rateLimit?: number;
  responseLimit?: number;
  confirmBeforeSubmit: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  collectEmail: boolean;
  thankYouMessage: string;
  redirectUrl?: string;
  notificationChannels: { email: boolean; slack?: boolean; webhook?: boolean };
  additionalEmails: string[];
  color: string;
  fontSize: 'small' | 'medium' | 'large';
  layout: 'default' | 'centered' | 'wide';
  showProgressBar: boolean;
  shuffleFields: boolean;
  limitPerUser?: number;
  closeDate?: string;
  closeMessage: string;
}

const DEFAULT_SETTINGS: FormSettings = {
  title: 'Customer Feedback Survey',
  description: 'Help us improve our service',
  slug: 'customer-feedback',
  customDomain: '',
  coverImage: '',
  visibility: 'public',
  loginRequired: false,
  captcha: true,
  rateLimit: undefined,
  responseLimit: 1000,
  confirmBeforeSubmit: false,
  allowEdit: true,
  allowDelete: false,
  collectEmail: true,
  thankYouMessage: 'Thank you for your feedback!',
  redirectUrl: '',
  notificationChannels: { email: true, slack: false, webhook: false },
  additionalEmails: [],
  color: '#2563EB',
  fontSize: 'medium',
  layout: 'default',
  showProgressBar: true,
  shuffleFields: false,
  limitPerUser: undefined,
  closeDate: '',
  closeMessage: 'This form is no longer accepting responses.',
};

function Section({ title, description, icon: Icon, children }: { title: string; description?: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden mb-6">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border)]">
        <Icon className="w-5 h-5 text-[var(--color-primary)]" />
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text)]">{title}</h2>
          {description && <p className="text-xs text-[var(--color-text-tertiary)]">{description}</p>}
        </div>
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <label className="text-sm font-medium text-[var(--color-text)]">{label}</label>
        {description && <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">
        {children}
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={cn(
        'relative w-10 h-6 rounded-full transition-colors',
        checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-muted)]'
      )}>
      <div className={cn(
        'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
        checked && 'translate-x-4'
      )} />
    </button>
  );
}

export default function SettingsPage() {
  const params = useParams();
  const id = params.id as string;
  const [settings, setSettings] = useState<FormSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<FormSettings>(`/api/forms/${id}/settings`)
      .then(setSettings)
      .catch(() => { setSettings(DEFAULT_SETTINGS); setLoading(false); })
      .finally(() => setLoading(false));
  }, [id]);

  const update = <K extends keyof FormSettings>(key: K, value: FormSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try { await api.put(`/api/forms/${id}/settings`, settings); } catch {}
    setTimeout(() => setSaving(false), 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text)]">Settings</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Configure your form behaviour and appearance</p>
        </div>
        <button onClick={save}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <Section title="General" description="Basic form information" icon={Settings}>
        <Field label="Title">
          <input type="text" value={settings.title} onChange={e => update('title', e.target.value)}
            className="w-64 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]" />
        </Field>
        <Field label="Description">
          <textarea value={settings.description} onChange={e => update('description', e.target.value)}
            className="w-64 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] resize-none" rows={2} />
        </Field>
        <Field label="Slug" description="URL-friendly identifier">
          <input type="text" value={settings.slug} onChange={e => update('slug', e.target.value)}
            className="w-64 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]" />
        </Field>
        <Field label="Custom domain" description="Use your own domain (requires DNS setup)">
          <input type="text" value={settings.customDomain || ''} onChange={e => update('customDomain', e.target.value)} placeholder="forms.yourdomain.com"
            className="w-64 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] placeholder:text-[var(--color-text-tertiary)]" />
        </Field>
      </Section>

      <Section title="Access" description="Control who can access your form" icon={Lock}>
        <Field label="Visibility">
          <select value={settings.visibility} onChange={e => update('visibility', e.target.value as any)}
            className="w-40 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]">
            <option value="public">Public</option>
            <option value="restricted">Restricted</option>
            <option value="private">Private</option>
          </select>
        </Field>
        <Field label="Require login" description="Respondents must log in to submit">
          <Toggle checked={settings.loginRequired} onChange={v => update('loginRequired', v)} />
        </Field>
        <Field label="CAPTCHA" description="Protect against spam submissions">
          <Toggle checked={settings.captcha} onChange={v => update('captcha', v)} />
        </Field>
        <Field label="Rate limit" description="Max submissions per hour">
          <input type="number" value={settings.rateLimit || ''} onChange={e => update('rateLimit', e.target.value ? Number(e.target.value) : undefined)} placeholder="No limit"
            className="w-40 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] placeholder:text-[var(--color-text-tertiary)]" />
        </Field>
        <Field label="Response limit" description="Max total submissions">
          <input type="number" value={settings.responseLimit || ''} onChange={e => update('responseLimit', e.target.value ? Number(e.target.value) : undefined)} placeholder="No limit"
            className="w-40 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] placeholder:text-[var(--color-text-tertiary)]" />
        </Field>
      </Section>

      <Section title="Responses" description="Response collection behaviour" icon={MessageSquare}>
        <Field label="Confirm before submit" description="Show a confirmation dialog">
          <Toggle checked={settings.confirmBeforeSubmit} onChange={v => update('confirmBeforeSubmit', v)} />
        </Field>
        <Field label="Allow editing" description="Respondents can edit after submission">
          <Toggle checked={settings.allowEdit} onChange={v => update('allowEdit', v)} />
        </Field>
        <Field label="Allow deletion" description="Respondents can delete their submission">
          <Toggle checked={settings.allowDelete} onChange={v => update('allowDelete', v)} />
        </Field>
        <Field label="Collect email" description="Automatically collect respondent email">
          <Toggle checked={settings.collectEmail} onChange={v => update('collectEmail', v)} />
        </Field>
        <Field label="Thank you message">
          <input type="text" value={settings.thankYouMessage} onChange={e => update('thankYouMessage', e.target.value)}
            className="w-64 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]" />
        </Field>
        <Field label="Redirect URL" description="Redirect after submission (optional)">
          <input type="text" value={settings.redirectUrl || ''} onChange={e => update('redirectUrl', e.target.value)} placeholder="https://"
            className="w-64 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] placeholder:text-[var(--color-text-tertiary)]" />
        </Field>
      </Section>

      <Section title="Notifications" description="Get notified of new responses" icon={Mail}>
        <Field label="Email notifications">
          <Toggle checked={settings.notificationChannels.email} onChange={v => update('notificationChannels', { ...settings.notificationChannels, email: v })} />
        </Field>
        <Field label="Slack notifications">
          <Toggle checked={settings.notificationChannels.slack || false} onChange={v => update('notificationChannels', { ...settings.notificationChannels, slack: v })} />
        </Field>
        <Field label="Webhook URL">
          <input type="text" placeholder="https://hooks.example.com/notify"
            className="w-64 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] placeholder:text-[var(--color-text-tertiary)]" />
        </Field>
      </Section>

      <Section title="Presentation" description="Customize the look and feel" icon={Palette}>
        <Field label="Accent color">
          <input type="color" value={settings.color} onChange={e => update('color', e.target.value)}
            className="w-10 h-10 rounded-lg border border-[var(--color-border)] cursor-pointer" />
        </Field>
        <Field label="Font size">
          <select value={settings.fontSize} onChange={e => update('fontSize', e.target.value as any)}
            className="w-40 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </Field>
        <Field label="Layout">
          <select value={settings.layout} onChange={e => update('layout', e.target.value as any)}
            className="w-40 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]">
            <option value="default">Default</option>
            <option value="centered">Centered</option>
            <option value="wide">Wide</option>
          </select>
        </Field>
        <Field label="Show progress bar">
          <Toggle checked={settings.showProgressBar} onChange={v => update('showProgressBar', v)} />
        </Field>
        <Field label="Shuffle fields" description="Randomize field order per respondent">
          <Toggle checked={settings.shuffleFields} onChange={v => update('shuffleFields', v)} />
        </Field>
      </Section>

      <Section title="Security" description="Additional security measures" icon={Shield}>
        <Field label="Limit per user" description="Max submissions from one user">
          <input type="number" value={settings.limitPerUser || ''} onChange={e => update('limitPerUser', e.target.value ? Number(e.target.value) : undefined)} placeholder="No limit"
            className="w-40 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] placeholder:text-[var(--color-text-tertiary)]" />
        </Field>
        <Field label="Close date" description="Automatically stop accepting responses">
          <input type="date" value={settings.closeDate || ''} onChange={e => update('closeDate', e.target.value)}
            className="w-40 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]" />
        </Field>
        <Field label="Close message" description="Message shown after form is closed">
          <input type="text" value={settings.closeMessage} onChange={e => update('closeMessage', e.target.value)}
            className="w-64 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]" />
        </Field>
      </Section>

      <div className="rounded-xl border border-[var(--color-error)] bg-[var(--color-surface)] overflow-hidden mb-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-error)]">
          <AlertTriangle className="w-5 h-5 text-[var(--color-error)]" />
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Danger zone</h2>
            <p className="text-xs text-[var(--color-text-tertiary)]">Irreversible actions</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Archive this form</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Hide from active forms list</p>
            </div>
            <button className="px-4 py-2 rounded-lg border border-[var(--color-error)] text-sm font-medium text-[var(--color-error)] hover:bg-[var(--color-error-surface)] transition-colors">
              Archive
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Delete this form</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">Permanently remove all data</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-[var(--color-error)] text-sm font-medium text-white hover:opacity-90 transition-colors">
              Delete form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
