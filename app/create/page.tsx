'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api-client';
import { cn } from '../../lib/utils';
import {
  MessageSquare, Star, UserPlus, ShoppingCart, ArrowLeft,
  FileText, Sparkles, Loader2,
} from 'lucide-react';

const TEMPLATES = [
  { id: 'contact', name: 'Contact Form', icon: MessageSquare, description: 'Standard contact form with name, email, and message fields.' },
  { id: 'feedback', name: 'Feedback Survey', icon: Star, description: 'Collect feedback with ratings and open-ended questions.' },
  { id: 'registration', name: 'Registration', icon: UserPlus, description: 'User registration with name, email, and password fields.' },
  { id: 'order', name: 'Order Form', icon: ShoppingCart, description: 'Product order form with item selection and quantities.' },
];

export default function CreateFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

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
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-surface)] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-[28px] font-semibold text-[var(--color-text)] leading-tight">Create a new form</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Give your form a title and choose a starting point</p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm p-6 lg:p-8 mb-6">
          <div className="mb-6">
            <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Form title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Form title"
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-lg font-medium text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-primary)] transition-colors" />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe what this form is about..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-primary)] transition-colors resize-none" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm p-6 lg:p-8 mb-8">
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">Start from a template</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-5">Choose a pre-built template to save time</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onClick={() => setSelectedTemplate(null)}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
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
                  'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
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

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-[var(--color-error-surface)] border border-[var(--color-error)]">
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={handleCreate} disabled={creating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 shadow-sm">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {creating ? 'Creating...' : 'Create Form'}
          </button>
        </div>
      </div>
    </div>
  );
}
