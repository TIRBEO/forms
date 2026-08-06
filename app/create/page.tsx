'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api-client';
import { cn } from '../../lib/utils';
import { usePersistentState, clearPersistentState } from '../../lib/use-persistent-state';
import {
  MessageSquare, Star, UserPlus, ShoppingCart, ArrowLeft,
  FileText, Sparkles, Loader2, FileJson,
} from 'lucide-react';

const FIELD_TYPES = ['text', 'textarea', 'email', 'phone', 'number', 'date', 'time', 'select', 'radio', 'checkbox', 'rating', 'file', 'toggle'];

const TEMPLATES = [
  { id: 'contact', name: 'Contact Form', icon: MessageSquare, description: 'Standard contact form with name, email, and message fields.' },
  { id: 'feedback', name: 'Feedback Survey', icon: Star, description: 'Collect feedback with ratings and open-ended questions.' },
  { id: 'registration', name: 'Registration', icon: UserPlus, description: 'User registration with name, email, and password fields.' },
  { id: 'order', name: 'Order Form', icon: ShoppingCart, description: 'Product order form with item selection and quantities.' },
];

const JSON_PLACEHOLDER =
  '{\n  "title": "Event Registration",\n  "description": "Register for the event",\n  "fields": [\n    { "label": "Full name", "type": "text", "required": true },\n    { "label": "Email", "type": "email", "required": true },\n    { "label": "Tickets", "type": "select", "options": [\n      { "label": "Standard", "value": "standard" },\n      { "label": "VIP", "value": "vip" }\n    ] }\n  ]\n}';

export default function CreateFormPage() {
  const router = useRouter();
  // Draft fields persist to localStorage so a refresh never loses the draft.
  const [title, setTitle] = usePersistentState('create:title', '');
  const [description, setDescription] = usePersistentState('create:description', '');
  const [selectedTemplate, setSelectedTemplate] = usePersistentState<string | null>('create:template', null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [jsonText, setJsonText] = usePersistentState('create:json', '');
  const [jsonError, setJsonError] = useState('');
  const [jsonBuilding, setJsonBuilding] = useState(false);

  const handleJsonBuild = async () => {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setJsonError('Invalid JSON — please check the syntax');
      return;
    }
    if (typeof parsed !== 'object' || parsed === null || !Array.isArray(parsed.fields)) {
      setJsonError('JSON must be an object with a "fields" array');
      return;
    }
    const fields = parsed.fields.map((f: any, i: number) => ({
      id: typeof f?.id === 'string' && f.id ? f.id : `jf-${i}-${Date.now().toString(36)}`,
      type: FIELD_TYPES.includes(f?.type) ? f.type : 'text',
      label: String(f?.label || 'Untitled question'),
      required: Boolean(f?.required),
      order: i,
      placeholder: typeof f?.placeholder === 'string' ? f.placeholder : undefined,
      description: typeof f?.description === 'string' ? f.description : undefined,
      options: Array.isArray(f?.options)
        ? f.options.map((o: any) => ({
            value: typeof o?.value === 'string' && o.value ? o.value : `opt-${i}-${Math.random().toString(36).slice(2, 8)}`,
            label: String(o?.label || 'Option'),
          }))
        : undefined,
    }));
    setJsonBuilding(true);
    setJsonError('');
    try {
      const form = await api.post<{ id: string }>('/api/forms', {
        title: (typeof parsed.title === 'string' && parsed.title.trim() ? parsed.title.trim() : title.trim()) || 'Imported form',
        description: typeof parsed.description === 'string' ? parsed.description : description,
        fields,
        template: selectedTemplate || undefined,
      });
      clearPersistentState('create:title', 'create:description', 'create:template', 'create:json');
      router.push(`/f/${form.id}/edit`);
    } catch (e: any) {
      setJsonError(e?.message || 'Failed to create form');
      setJsonBuilding(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) { setError('Please enter a form title'); return; }
    setCreating(true);
    setError('');
    try {
      const form = await api.post<{ id: string }>('/api/forms', {
        title: title.trim(),
        description: description.trim(),
        template: selectedTemplate || undefined,
      });
      clearPersistentState('create:title', 'create:description', 'create:template');
      router.push(`/f/${form.id}/edit`);
    } catch (e: any) {
      setError(e?.message || 'Failed to create form');
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-10">
          <div className="w-12 h-12  bg-[var(--color-primary-surface)] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-[28px] font-semibold text-[var(--color-text)] leading-tight">Create a new form</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Give your form a title and choose a starting point</p>
        </div>

        <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] p-6 lg:p-8 mb-6">
          <div className="mb-6">
            <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Form title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Form title"
              className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-lg font-medium text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-primary)] transition-colors" />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe what this form is about..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-primary)] transition-colors resize-none" />
          </div>
        </div>

        <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] p-6 lg:p-8 mb-8">
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">Start from a template</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-5">Choose a pre-built template to save time</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onClick={() => setSelectedTemplate(null)}
              className={cn(
                'flex items-center gap-4 p-4  border-2 transition-all text-left',
                !selectedTemplate
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)]'
              )}>
              <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </div>
              <div>
                <span className="text-sm font-medium text-[var(--color-text)]">Start from scratch</span>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Blank form, no pre-filled fields</p>
              </div>
            </button>

            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                className={cn(
                  'flex items-center gap-4 p-4  border-2 transition-all text-left',
                  selectedTemplate === t.id
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)]'
                )}>
                <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0">
                  <t.icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <span className="text-sm font-medium text-[var(--color-text)]">{t.name}</span>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{t.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] p-6 lg:p-8 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <FileJson className="w-4 h-4 text-[var(--color-primary)]" />
            <h2 className="text-base font-semibold text-[var(--color-text)]">Build from JSON</h2>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">Paste a form structure and the fields are auto-built for you</p>
          <textarea
            value={jsonText}
            onChange={e => { setJsonText(e.target.value); setJsonError(''); }}
            placeholder={JSON_PLACEHOLDER}
            rows={9}
            className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-mono text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-primary)] transition-colors resize-y"
          />
          {jsonError && <p className="mt-2 text-sm text-[var(--color-error)]">{jsonError}</p>}
          <div className="flex justify-end mt-4">
            <button onClick={handleJsonBuild} disabled={jsonBuilding || !jsonText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-primary)] transition-colors disabled:opacity-50">
              {jsonBuilding ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileJson className="w-4 h-4" />}
              {jsonBuilding ? 'Building...' : 'Build form from JSON'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-[var(--color-error-surface)] border border-[var(--color-error)]">
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={handleCreate} disabled={creating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 shadow-[var(--shadow-card)]">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {creating ? 'Creating...' : 'Create Form'}
          </button>
        </div>
      </div>
    </div>
  );
}
